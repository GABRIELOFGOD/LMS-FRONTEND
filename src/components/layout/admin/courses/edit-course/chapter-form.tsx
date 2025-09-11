"use client";

import { AddChapterResponse, Chapter } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCourse } from "@/hooks/useCourse";
import { cn } from "@/lib/utils";
import { isError } from "@/services/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader, 
  Pencil, 
  Plus, 
  GripVertical, 
  Eye, 
  EyeOff, 
  // Upload,
  Video,
  X,
  Play,
  BookOpen,
  FileText
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";

export interface ChapterFormProps {
  initialData: {
    chapters: Chapter[];
  };
  courseId: string;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Chapter name is required"
  }),
  video: z.any().optional()
});

// Media Upload Component (supports both videos and PDFs)
interface MediaUploadProps {
  value?: string | File;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const MediaUpload = ({ value, onChange, disabled }: MediaUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'pdf' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine media type from file or URL
  const getMediaType = (source: string | File): 'video' | 'pdf' | null => {
    let fileType = '';
    if (typeof source === 'string') {
      fileType = source.toLowerCase();
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
    } else if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      setMediaType(getMediaType(value));
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
      file.type.startsWith('video/') || file.type === 'application/pdf'
    );
    
    if (mediaFile) {
      handleFileSelect(mediaFile);
    } else {
      toast.error("Please select a valid video or PDF file");
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      toast.error("File size must be less than 500MB");
      return;
    }

    const type = getMediaType(file);
    if (!type) {
      toast.error("Please select a valid video (MP4, MOV, AVI) or PDF file");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFile(file);
    setMediaType(type);
    onChange(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeMedia = () => {
    setPreview(null);
    setSelectedFile(null);
    setMediaType(null);
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
            ) : mediaType === 'pdf' ? (
              <div className="w-full h-full flex flex-col">
                <iframe
                  src={preview}
                  className="w-full flex-1 border-0"
                  title="PDF Preview"
                />
                <div className="p-2 bg-slate-200 text-center">
                  <a 
                    href={preview} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Open PDF in new tab
                  </a>
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
              ) : (
                <FileText className="h-3 w-3" />
              )}
              New {mediaType} selected
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragOver ? "border-blue-500 bg-blue-50" : "border-slate-300",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="flex items-center justify-center gap-4 mb-3">
            <Video className="h-8 w-8 text-slate-400" />
            <span className="text-slate-400">or</span>
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600 mb-1">
            Drag and drop a video or PDF file here, or click to browse
          </p>
          <p className="text-xs text-slate-500">
            Videos: MP4, MOV, AVI • PDFs: PDF files (Max 500MB each)
          </p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,application/pdf,.pdf"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      video: undefined
    },
  });

  const { 
    addChapter, 
    updateChapter, 
    // deleteChapter, 
    publishChapter, 
    unpublishChapter,
    reorderChapters,
    uploadVideo,
    uploadMedia
  } = useCourse();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const router = useRouter();

  // Helper function to determine media type from URL
  const getChapterMediaType = (url: string): 'video' | 'pdf' | null => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('application/pdf') || lowerUrl.endsWith('.pdf')) {
      return 'pdf';
    } else if (lowerUrl.includes('video/') || /\.(mp4|webm|ogg|mov|avi)$/i.test(lowerUrl)) {
      return 'video';
    }
    return 'video'; // Default to video for backward compatibility
  };

  const toggleAddNew = () => {
    setIsAddingNew(!isAddingNew);
    setEditingId(null);
    form.reset({ name: "", video: undefined });
  };

  const toggleEdit = (chapterId: string) => {
    if (editingId === chapterId) {
      setEditingId(null);
      form.reset({ name: "", video: undefined });
    } else {
      const chapter = chapters.find(c => c.id === chapterId);
      if (chapter) {
        setEditingId(chapterId);
        setIsAddingNew(false);
        form.reset({ 
          name: chapter.name, 
          video: chapter.video 
        });
      }
    }
  };

  useEffect(() => {
    setChapters(initialData.chapters);
  }, [initialData, courseId]);

  const { isSubmitting, isValid } = form.formState;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let response: AddChapterResponse;
      
      if (isAddingNew) {
        console.log("[VIDEO TYPE]", typeof values.video);
        console.log("[VIDEO]", values.video);
        response = await addChapter(courseId, {
          name: values.name,
          video: values.video instanceof File ? values.video : undefined
        });
        
        if (response.chapter) {
          setChapters(prev => [...prev, response.chapter]);
        }
        if (response?.message) toast.success(response.message);
        
      } else if (editingId) {
        // Handle update - separate media upload if needed
        if (values.video instanceof File) {
          // If there's a new media file, upload it separately
          // Note: Using uploadVideo for both videos and PDFs since backend only accepts /chapters/{id}/video endpoint
          try {
            // Use uploadVideo for both videos and PDFs since backend only accepts /chapters/{id}/video
            const mediaResponse = await uploadVideo(editingId, values.video);
            
            // Show appropriate success message
            const isVideo = values.video.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|avi)$/i.test(values.video.name);
            const isPDF = values.video.type === 'application/pdf' || values.video.name.toLowerCase().endsWith('.pdf');
            
            if (mediaResponse?.message) {
              if (isPDF) {
                toast.success("PDF uploaded successfully");
              } else if (isVideo) {
                toast.success("Video uploaded successfully");
              } else {
                toast.success("Media uploaded successfully");
              }
            }
            
            // Then update the chapter name if it changed
            const currentChapter = chapters.find(c => c.id === editingId);
            if (currentChapter && currentChapter.name !== values.name) {
              response = await updateChapter(editingId, {
                name: values.name
              });
            } else {
              response = mediaResponse;
            }
          } catch (error) {
            throw error;
          }
        } else {
          // Just update the chapter name
          response = await updateChapter(editingId, {
            name: values.name
          });
        }
        
        if (response.chapter) {
          setChapters(prev => 
            prev.map(chapter => 
              chapter.id === editingId ? response.chapter : chapter
            )
          );
        }
        if (response?.message) toast.success(response.message);
      }
      
      setEditingId(null);
      setIsAddingNew(false);
      form.reset({ name: "", video: undefined });
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  const handlePublishToggle = async (chapter: Chapter) => {
    try {
      if (!chapter.video && !chapter.isPublished) {
        toast.error("Cannot publish chapter without media content (video or PDF)");
        return;
      }

      const response = chapter.isPublished 
        ? await unpublishChapter(chapter.id)
        : await publishChapter(chapter.id);

      if (response?.chapter) {
        setChapters(prev => 
          prev.map(c => 
            c.id === chapter.id ? response.chapter : c
          )
        );
      }

      if (response?.message) toast.success(response.message);
      location.reload();
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newChapters = [...chapters];
    const draggedChapter = newChapters[draggedItem];
    
    newChapters.splice(draggedItem, 1);
    newChapters.splice(dropIndex, 0, draggedChapter);
    
    setChapters(newChapters);
    setDraggedItem(null);

    try {
      await reorderChapters(courseId, newChapters.map(c => c.id));
      toast.success("Chapters reordered successfully");
      router.refresh();
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        setChapters(chapters); // Revert on error
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between font-medium mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Course Chapters</h3>
        <Button
          variant="ghost"
          onClick={toggleAddNew}
          className="font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {isAddingNew ? (
            <span className="text-slate-600 dark:text-slate-300">Cancel</span>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add chapter
            </>
          )}
        </Button>
      </div>

      {/* Add New Chapter Form */}
      {isAddingNew && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Add New Chapter</h4>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">Chapter Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. Introduction to the course"
                        className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Chapter Media <span className="text-xs text-slate-500">(Video or PDF - Optional, can be added later)</span>
                    </FormLabel>
                    <FormControl>
                      <MediaUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  size="sm"
                >
                  {isSubmitting ? (
                    <div className="flex gap-2 items-center">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create Chapter"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {chapters.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">No chapters created yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">Click &quot;Add chapter&quot; to get started</p>
          </div>
        ) : (
          chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={cn(
                "bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-4 transition-all hover:shadow-md",
                editingId === chapter.id && "ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-900/20"
              )}
              draggable={editingId !== chapter.id}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {editingId === chapter.id ? (
                /* Edit Mode */
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chapter Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              placeholder="e.g. Introduction to the course"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="video"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chapter Media (Video or PDF)</FormLabel>
                          <FormControl>
                            <MediaUpload
                              value={field.value || chapter.video}
                              onChange={field.onChange}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center gap-x-2">
                      <Button
                        disabled={!isValid || isSubmitting}
                        type="submit"
                      >
                        {isSubmitting ? (
                          <div className="flex gap-2">
                            <Loader className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => toggleEdit(chapter.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                /* Display Mode */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
                    <div className="flex items-center gap-2">
                      {chapter.video ? (
                        getChapterMediaType(chapter.video) === 'pdf' ? (
                          <FileText className="h-4 w-4 text-red-600" />
                        ) : (
                          <Play className="h-4 w-4 text-green-600" />
                        )
                      ) : (
                        <Video className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="font-medium">{chapter.name}</span>
                      {chapter.video && (
                        <span className="text-xs text-slate-500">
                          ({getChapterMediaType(chapter.video) === 'pdf' ? 'PDF' : 'Video'})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {chapter.isPublished ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEdit(chapter.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePublishToggle(chapter)}
                      disabled={!chapter.video && !chapter.isPublished}
                      title={!chapter.video && !chapter.isPublished ? "Add video or PDF content before publishing" : ""}
                    >
                      {chapter.isPublished ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {chapters.length > 0 && (
        <p className="text-xs text-slate-500 mt-4 text-center">
          Drag and drop to reorder chapters
        </p>
      )}
    </div>
  );
};

export default ChapterForm;