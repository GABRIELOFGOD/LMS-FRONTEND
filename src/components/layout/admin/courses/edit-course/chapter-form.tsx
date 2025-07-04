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
  Play
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

// Video Upload Component
interface VideoUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const VideoUpload = ({ value, onChange, disabled }: VideoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial preview from existing video URL
  useEffect(() => {
    if (typeof value === 'string' && value) {
      setPreview(value);
    } else if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
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
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      handleFileSelect(videoFile);
    } else {
      toast.error("Please select a valid video file");
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      toast.error("File size must be less than 500MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFile(file);
    onChange(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeVideo = () => {
    setPreview(null);
    setSelectedFile(null);
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
            <video 
              src={preview} 
              className="w-full h-full object-cover"
              controls
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeVideo}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {selectedFile && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              New video selected
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
          <Video className="mx-auto h-12 w-12 text-slate-400 mb-2" />
          <p className="text-sm text-slate-600 mb-1">
            Drag and drop a video file here, or click to browse
          </p>
          <p className="text-xs text-slate-500">
            Supports MP4, MOV, AVI (Max 500MB)
          </p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
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
    uploadVideo 
  } = useCourse();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const router = useRouter();

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
        // Handle update - separate video upload if needed
        if (values.video instanceof File) {
          // If there's a new video file, upload it separately
          try {
            const videoResponse = await uploadVideo(editingId, values.video);
            if (videoResponse?.message) toast.success("Video uploaded successfully");
            
            // Then update the chapter name if it changed
            const currentChapter = chapters.find(c => c.id === editingId);
            if (currentChapter && currentChapter.name !== values.name) {
              response = await updateChapter(editingId, {
                name: values.name
              });
            } else {
              response = videoResponse;
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
        toast.error("Cannot publish chapter without a video");
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
    <div className="mt-6 border bg-slate-100 shadow-sm rounded-md p-4">
      <div className="flex items-center justify-between font-medium mb-4">
        Course Chapters
        <Button
          variant="ghost"
          onClick={toggleAddNew}
          className="font-medium text-sm"
        >
          {isAddingNew ? (
            <p>Cancel</p>
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
        <div className="mb-4 p-4 bg-white border rounded-lg">
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
                    <FormLabel>Chapter Video (Create chapter title first, then come back to add video)</FormLabel>
                    <FormControl>
                      <VideoUpload
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
                >
                  {isSubmitting ? (
                    <div className="flex gap-2">
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
      <div className="space-y-2  h-fit max-h-[400px] overflow-y-auto">
        {chapters.length === 0 ? (
          <p className="text-slate-500 text-sm italic text-center py-4">
            No chapters created yet
          </p>
        ) : (
          chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={cn(
                "bg-white border rounded-lg p-4 transition-all",
                editingId === chapter.id && "ring-2 ring-blue-500"
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
                          <FormLabel>Chapter Video</FormLabel>
                          <FormControl>
                            <VideoUpload
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
                        <Play className="h-4 w-4 text-green-600" />
                      ) : (
                        <Video className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="font-medium">{chapter.name}</span>
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