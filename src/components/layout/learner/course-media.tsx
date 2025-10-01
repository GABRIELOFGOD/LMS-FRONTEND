"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Video, 
  ExternalLink, 
  Download, 
  Play 
} from "lucide-react";
import { toast } from "sonner";

interface CourseMediaProps {
  mediaUrl: string;
  title: string;
}

const CourseMedia = ({ mediaUrl, title }: CourseMediaProps) => {
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [currentStrategy, setCurrentStrategy] = useState(0);
  
  if (!mediaUrl) return null;

  // Enhanced Google Drive handling with multiple strategies
  const getGoogleDriveEmbedUrl = (url: string): string => {
    if (url.includes('/file/d/')) {
      const fileId = url.split('/file/d/')[1]?.split('/')[0];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    } else if (url.includes('id=')) {
      const fileId = url.split('id=')[1]?.split('&')[0];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return url;
  };

  // Convert URLs to embeddable format
  const convertToEmbeddableUrl = (url: string): string => {
    const trimmedUrl = url.trim();
    
    if (trimmedUrl.includes('/embed/') || trimmedUrl.includes('/preview') || trimmedUrl.includes('player.vimeo.com')) {
      return trimmedUrl;
    }
    
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
    
    // Google Drive URLs
    else if (trimmedUrl.includes('drive.google.com')) {
      return getGoogleDriveEmbedUrl(trimmedUrl);
    }
    
    // Dropbox URLs
    else if (trimmedUrl.includes('dropbox.com')) {
      if (trimmedUrl.includes('?dl=0')) {
        return trimmedUrl.replace('?dl=0', '?raw=1');
      } else if (!trimmedUrl.includes('raw=1')) {
        const separator = trimmedUrl.includes('?') ? '&' : '?';
        return `${trimmedUrl}${separator}raw=1`;
      }
    }
    
    return trimmedUrl;
  };

  const getPlatformName = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    if (url.includes('drive.google.com')) return 'Google Drive';
    if (url.includes('dropbox.com')) return 'Dropbox';
    return 'Video Content';
  };

  // Multiple embedding strategies for different platforms
  const getEmbedStrategies = (url: string) => {
    const strategies = [];
    
    if (url.includes('drive.google.com')) {
      const fileId = url.includes('/file/d/') 
        ? url.split('/file/d/')[1]?.split('/')[0]
        : url.split('id=')[1]?.split('&')[0];
      
      if (fileId) {
        strategies.push({
          url: `https://drive.google.com/file/d/${fileId}/preview`,
          name: 'Google Drive Preview',
          allowControls: true
        });
        
        strategies.push({
          url: `https://drive.google.com/file/d/${fileId}/preview?usp=sharing&embedded=true`,
          name: 'Google Drive Embed',
          allowControls: true
        });
        
        strategies.push({
          url: `https://drive.google.com/uc?export=view&id=${fileId}`,
          name: 'Google Drive Stream',
          allowControls: true,
          isDirectVideo: true
        });
      }
    } else if (url.includes('dropbox.com')) {
      const rawUrl = url.includes('?dl=0') ? url.replace('?dl=0', '?raw=1') : url + '?raw=1';
      strategies.push({
        url: rawUrl,
        name: 'Dropbox Stream',
        allowControls: true,
        isDirectVideo: true
      });
      
      const previewUrl = url.includes('?dl=0') ? url.replace('?dl=0', '?preview=1') : url + '?preview=1';
      strategies.push({
        url: previewUrl,
        name: 'Dropbox Preview',
        allowControls: false
      });
    } else {
      const embeddableUrl = convertToEmbeddableUrl(url);
      strategies.push({
        url: embeddableUrl,
        name: getPlatformName(url),
        allowControls: true
      });
    }
    
    return strategies;
  };

  const strategies = getEmbedStrategies(mediaUrl);
  const currentStrategyData = strategies[currentStrategy] || strategies[0];

  const getMediaType = (url: string) => {
    const lower = url.split('?')[0].toLowerCase();
    
    if (lower.endsWith('.pdf') || url.includes('application/pdf')) {
      return 'pdf';
    }
    
    if (/\.(mp4|webm|ogg|mov|avi)$/i.test(lower) || url.includes('video/')) {
      return 'video-file';
    }
    
    if (url.includes('http') || url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('drive.google.com') || url.includes('dropbox.com')) {
      return 'video-url';
    }
    
    return 'video-url';
  };

  const mediaType = getMediaType(mediaUrl);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    
    if (currentStrategy < strategies.length - 1) {
      setCurrentStrategy(prev => prev + 1);
      setIsLoading(true);
      setIframeError(false);
      return;
    }
    
    setIframeError(true);
  };

  const retryCurrentStrategy = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setIframeError(false);
  };

  if (mediaType === 'pdf') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4 text-red-600" />
          <span className="font-medium">PDF Document</span>
        </div>
        
        {/* Desktop PDF Viewer */}
        <div className="hidden md:block border rounded-lg overflow-hidden bg-white shadow-sm">
          <iframe
            src={`${mediaUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
            title={title}
            className="w-full h-[600px] border-0"
            loading="lazy"
          />
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-slate-700">{title}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={mediaUrl} download>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile PDF Viewer */}
        <div className="md:hidden space-y-4">
          <div className="border rounded-lg p-6 bg-gradient-to-br from-red-50 to-orange-50 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-red-100 rounded-full">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  PDF documents work best on larger screens. Use the options below to access the content.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button className="flex-1" asChild>
                  <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Browser
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={mediaUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <iframe
              src={`${mediaUrl}#toolbar=0&navpanes=0&scrollbar=1&page=1&view=FitH&zoom=75`}
              title={title}
              className="w-full h-64 border-0"
              loading="lazy"
            />
            <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-600">
                For better viewing experience, use &quot;Open in Browser&quot; above
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mediaType === 'video-file') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Video className="h-4 w-4" />
          <span>Video File</span>
        </div>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            controls
            playsInline
            preload="metadata"
            className="w-full h-full"
            src={mediaUrl}
            onError={(e) => {
              console.error('Video load error:', e);
              toast.error('Unable to load video. Please try opening it directly.');
            }}
          >
            <source src={mediaUrl} />
            Your browser does not support the video tag.
            <p className="text-white p-4">
              If you are having trouble viewing this video, try{' '}
              <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                opening it directly
              </a>
            </p>
          </video>
        </div>
      </div>
    );
  }

  // Handle video URLs (YouTube, Vimeo, Google Drive, Dropbox, etc.)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Video className="h-4 w-4" />
          <span>{currentStrategyData?.name || getPlatformName(mediaUrl)}</span>
        </div>
        
        {iframeError && strategies.length > 1 && currentStrategy < strategies.length - 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentStrategy(prev => prev + 1);
              setIsLoading(true);
              setIframeError(false);
            }}
            className="text-xs"
          >
            Try Next Method
          </Button>
        )}
      </div>
      
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
        {/* Loading State */}
        {isLoading && !iframeError && (
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center z-10">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Loading {currentStrategyData?.name}...
              </span>
            </div>
          </div>
        )}

        {/* Enhanced Iframe with multiple strategies */}
        {!iframeError ? (
          currentStrategyData?.isDirectVideo ? (
            <video
              key={`${currentStrategy}-${retryCount}`}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full bg-black"
              src={currentStrategyData.url}
              onLoadStart={handleIframeLoad}
              onError={handleIframeError}
              onCanPlay={() => setIsLoading(false)}
            >
              <source src={currentStrategyData.url} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              key={`${currentStrategy}-${retryCount}`}
              src={currentStrategyData?.url}
              title={title}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <div className={`p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center ${
                mediaUrl.includes('drive.google.com') 
                  ? 'bg-blue-100 dark:bg-blue-900' 
                  : mediaUrl.includes('dropbox.com')
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {mediaUrl.includes('drive.google.com') ? (
                  <svg className="h-10 w-10 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.26 12H10l3-5.2L9.5 1H4L1.5 6.8L6.26 12zm11.48 0l-3-5.2H10l3 5.2h4.74zM15 13H9.74l-3 5.2L9.5 23H15l2.5-4.8L15 13z"/>
                  </svg>
                ) : mediaUrl.includes('dropbox.com') ? (
                  <svg className="h-10 w-10 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.32 5.65L12 8.96L7.68 5.65L4 8.5L12 14.5L20 8.5L16.32 5.65zm0 12.7L12 15.04L7.68 18.35L4 15.5L8 18.5H16L20 15.5L16.32 18.35z"/>
                  </svg>
                ) : (
                  <Video className="h-10 w-10 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title || 'Video Content'}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {currentStrategy >= strategies.length - 1 
                  ? 'All embedding methods have been tried. The content will open externally.'
                  : 'This embedding method failed. You can try another method or open externally.'
                }
              </p>
              
              <div className="space-y-3">
                {currentStrategy < strategies.length - 1 && (
                  <Button
                    onClick={() => {
                      setCurrentStrategy(prev => prev + 1);
                      setIsLoading(true);
                      setIframeError(false);
                    }}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Try Next Method
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={retryCurrentStrategy}
                  className="w-full"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry Current Method
                </Button>
                
                <Button
                  variant="outline"
                  asChild
                  className="w-full"
                >
                  <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in {getPlatformName(mediaUrl)}
                  </a>
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                Tried {currentStrategy + 1} of {strategies.length} embedding methods
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMedia;
