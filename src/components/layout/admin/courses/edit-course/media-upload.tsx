"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Video, X, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface MediaUploadProps {
  value?: string | File;
  onChange: (value: File | string | null) => void;
  disabled?: boolean;
}

const MediaUpload = ({ value, onChange, disabled }: MediaUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'pdf' | 'video-url' | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine media type from file or URL
  const getMediaType = (source: string | File): 'video' | 'pdf' | 'video-url' | null => {
    let fileType = '';
    if (typeof source === 'string') {
      fileType = source.toLowerCase();
      // Check if it's a URL (contains http/https or common video hosting patterns)
      if (fileType.includes('http') || fileType.includes('youtube.com') || fileType.includes('vimeo.com') || fileType.includes('video')) {
        return 'video-url';
      }
    } else if (source instanceof File) {
      fileType = source.type.toLowerCase();
    }
    
    if (fileType.includes('video/') || /\.(mp4|webm|ogg|mov|avi)$/i.test(fileType)) {
      return 'video';
    } else if (fileType.includes('application/pdf') || fileType.endsWith('.pdf')) {
      return 'pdf';
    }
    return null;
  };

  // Set initial preview from existing media URL
  useEffect(() => {
    if (typeof value === 'string' && value) {
      setPreview(value);
      setMediaType(getMediaType(value));
      if (getMediaType(value) === 'video-url') {
        setVideoUrl(value);
      }
    } else if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      setMediaType(getMediaType(value));
      setSelectedFile(value);
      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const mediaFile = files.find(file => 
      file.type === 'application/pdf' // Only allow PDF files for drag & drop
    );
    
    if (mediaFile) {
      handleFileSelect(mediaFile);
    } else {
      toast.error("Please select a valid PDF file for drag & drop, or use URL input for videos");
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      toast.error("File size must be less than 500MB");
      return;
    }

    const type = getMediaType(file);
    if (type !== 'pdf') {
      toast.error("Please select a valid PDF file for upload, or use URL input for videos");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFile(file);
    setMediaType(type);
    setVideoUrl('');
    setShowUrlInput(false);
    onChange(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  // Convert URLs to embeddable format
  const convertToEmbeddableUrl = (url: string): string => {
    const trimmedUrl = url.trim();
    
    // YouTube URLs
    if (trimmedUrl.includes('youtube.com/watch')) {
      const videoId = trimmedUrl.split('v=')[1]?.split('&')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } else if (trimmedUrl.includes('youtu.be/')) {
      const videoId = trimmedUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo URLs
    else if (trimmedUrl.includes('vimeo.com/')) {
      const videoId = trimmedUrl.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // Google Drive URLs - Use direct download format
    else if (trimmedUrl.includes('drive.google.com')) {
      if (trimmedUrl.includes('/file/d/')) {
        const fileId = trimmedUrl.split('/file/d/')[1]?.split('/')[0];
        if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
      } else if (trimmedUrl.includes('id=')) {
        const fileId = trimmedUrl.split('id=')[1]?.split('&')[0];
        if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    
    // Dropbox URLs
    else if (trimmedUrl.includes('dropbox.com')) {
      // Convert dropbox share link to embed format
      if (trimmedUrl.includes('?dl=0')) {
        return trimmedUrl.replace('?dl=0', '?raw=1');
      } else if (!trimmedUrl.includes('raw=1')) {
        const separator = trimmedUrl.includes('?') ? '&' : '?';
        return `${trimmedUrl}${separator}raw=1`;
      }
    }
    
    // For direct video links or other URLs, return as-is
    return trimmedUrl;
  };

  // Check if URL can be embedded in iframe
  const canEmbedInIframe = (url: string): boolean => {
    // Google Drive cannot be embedded due to CSP restrictions
    if (url.includes('drive.google.com')) return false;
    // Most other services allow embedding
    return true;
  };

  const handleVideoUrlSubmit = () => {
    if (!videoUrl.trim()) {
      toast.error("Please enter a valid video URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(videoUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    const embeddableUrl = convertToEmbeddableUrl(videoUrl);
    setPreview(embeddableUrl);
    setSelectedFile(null);
    setMediaType('video-url');
    setShowUrlInput(false);
    onChange(embeddableUrl);
    
    // Show success message based on platform
    if (videoUrl.includes('drive.google.com')) {
      toast.success("Google Drive video added successfully!");
    } else if (videoUrl.includes('dropbox.com')) {
      toast.success("Dropbox video added successfully!");
    } else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      toast.success("YouTube video added successfully!");
    } else if (videoUrl.includes('vimeo.com')) {
      toast.success("Vimeo video added successfully!");
    } else {
      toast.success("Video URL added successfully!");
    }
  };

  const toggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
    if (!showUrlInput) {
      setVideoUrl('');
    }
  };

  const removeMedia = () => {
    setPreview(null);
    setSelectedFile(null);
    setMediaType(null);
    setVideoUrl('');
    setShowUrlInput(false);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative">
          <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
            {mediaType === 'video' ? (
              <video 
                src={preview} 
                className="w-full h-full object-cover"
                controls
              />
            ) : mediaType === 'video-url' ? (
              <div className="w-full h-full flex flex-col bg-white">
                {canEmbedInIframe(preview) ? (
                  <div className="flex-1 min-h-0">
                    <iframe
                      src={preview}
                      className="w-full h-full border-0"
                      title="Video Preview"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                    />
                  </div>
                ) : (
                  // Special handling for Google Drive and other non-embeddable content
                  <div className="flex-1 min-h-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div className="text-center p-6 max-w-md">
                      <div className="p-4 bg-blue-100 dark:bg-blue-800/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        External Video Content
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        {preview.includes('drive.google.com') 
                          ? 'Google Drive content cannot be previewed due to security restrictions. Students will be redirected to view the content directly.'
                          : 'This content will open in a new tab for students to view.'
                        }
                      </p>
                      <a 
                        href={typeof value === 'string' ? value : '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        <Video className="h-4 w-4" />
                        View Content
                      </a>
                    </div>
                  </div>
                )}
                <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {preview.includes('youtube.com') ? 'YouTube Video' :
                       preview.includes('vimeo.com') ? 'Vimeo Video' :
                       preview.includes('drive.google.com') ? 'Google Drive Video' :
                       preview.includes('dropbox.com') ? 'Dropbox Video' :
                       'Video URL'}
                    </span>
                    <span className="text-xs text-slate-500 max-w-md truncate">
                      {preview}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={typeof value === 'string' ? value : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              </div>
            ) : mediaType === 'pdf' ? (
              <div className="w-full h-full flex flex-col bg-white">
                <div className="flex-1 min-h-0">
                  <iframe
                    src={`${preview}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                    className="w-full h-full border-0"
                    title="PDF Preview"
                    style={{ minHeight: '400px' }}
                  />
                </div>
                <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-slate-700">PDF Document</span>
                    {selectedFile && (
                      <span className="text-xs text-slate-500">
                        ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={preview} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Open in new tab
                    </a>
                    <span className="text-slate-300">|</span>
                    <a 
                      href={preview} 
                      download
                      className="text-sm text-green-600 hover:text-green-800 font-medium hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeMedia}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {selectedFile && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              {mediaType === 'video' ? (
                <Video className="h-3 w-3" />
              ) : mediaType === 'pdf' ? (
                <FileText className="h-3 w-3" />
              ) : null}
              New {mediaType === 'pdf' ? 'PDF' : 'file'} selected
            </div>
          )}
          {mediaType === 'video-url' && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Video className="h-3 w-3" />
              Video URL
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Video URL Input Section */}
          <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-700" />
                <span className="font-semibold text-blue-800">Add Video URL</span>
              </div>
              <Button
                type="button"
                variant={showUrlInput ? "outline" : "default"}
                size="sm"
                onClick={toggleUrlInput}
                disabled={disabled}
                className={`${
                  showUrlInput 
                    ? "border-blue-600 text-blue-600 hover:bg-blue-50" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {showUrlInput ? 'Cancel' : 'Add URL'}
              </Button>
            </div>
            
            {showUrlInput && (
              <div className="space-y-3">
                <input
                  type="url"
                  placeholder="Enter video URL (YouTube, Vimeo, Google Drive, Dropbox, etc.)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className={`w-full px-3 py-2 bg-white border-2 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    disabled 
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={disabled}
                />
                <div className="bg-white/80 backdrop-blur-sm rounded-md p-3 border border-blue-200">
                  <div className="text-xs text-blue-800 space-y-1">
                    <p className="font-semibold text-blue-900">Supported platforms:</p>
                    <p>• <strong>YouTube:</strong> Regular video URLs or youtu.be links</p>
                    <p>• <strong>Vimeo:</strong> Direct video page URLs</p>
                    <p>• <strong>Google Drive:</strong> Share link with view permissions (opens in new tab)</p>
                    <p>• <strong>Dropbox:</strong> Public share links</p>
                    <p>• <strong>Direct video links:</strong> .mp4, .webm, etc.</p>
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
                      <p className="text-xs"><strong>Note:</strong> Google Drive content cannot be embedded due to security restrictions and will open in a new tab for students.</p>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleVideoUrlSubmit}
                  disabled={disabled || !videoUrl.trim()}
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Add Video URL
                </Button>
              </div>
            )}
            
            {!showUrlInput && (
              <p className="text-sm text-blue-700 font-medium">
                Click &quot;Add URL&quot; to add videos from YouTube, Vimeo, Google Drive, Dropbox, or direct video links
              </p>
            )}
          </div>

          {/* PDF Upload Section */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragOver ? "border-red-500 bg-red-50" : "border-red-300 bg-red-50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center">
              <FileText className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm text-red-700 mb-2 font-medium">
                Upload PDF Document
              </p>
              <p className="text-xs text-red-600 mb-1">
                Drag and drop a PDF file here, or click to browse
              </p>
              <p className="text-xs text-red-500">
                Maximum file size: 500MB
              </p>
            </div>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default MediaUpload;
