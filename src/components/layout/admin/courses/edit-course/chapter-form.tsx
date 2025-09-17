"use client";

import { AddChapterResponse, Chapter } from "@/types/course";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/hooks/useCourse";
import { isError } from "@/services/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";

// Import the new components
import AddChapterForm from "./add-chapter-form";
import EditChapterForm from "./edit-chapter-form";
import ChapterItem from "./chapter-item";
import EmptyChaptersState from "./empty-chapters-state";

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
  video: z.union([z.instanceof(File), z.string()]).optional()
});

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
        response = await addChapter(courseId, {
          name: values.name,
          video: values.video || undefined
        });
        
        if (response.chapter) {
          setChapters(prev => [...prev, response.chapter]);
        }
        if (response?.message) toast.success(response.message);
        
      } else if (editingId) {
        // Handle update - separate media upload if needed
        if (values.video instanceof File) {
          try {
            // Use uploadVideo for PDF files since backend only accepts /chapters/{id}/video
            const mediaResponse = await uploadVideo(editingId, values.video);
            
            if (mediaResponse?.message) {
              toast.success("PDF uploaded successfully");
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
          // Handle both video URL update and name-only update
          response = await updateChapter(editingId, {
            name: values.name,
            video: typeof values.video === 'string' ? values.video : undefined
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
        
        // Refresh the page data to ensure latest state
        router.refresh();
      }
      
      setEditingId(null);
      setIsAddingNew(false);
      form.reset({ name: "", video: undefined });
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
      } else {
        console.error("Unknown error", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handlePublishToggle = async (chapter: Chapter) => {
    try {
      if (!chapter.video && !chapter.isPublished) {
        toast.error("Cannot publish chapter without media content (video URL, video file, or PDF)");
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
      
      // Use router.refresh() instead of location.reload() for better UX
      router.refresh();
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 font-medium">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Course Chapters</h3>
        <Button
          variant="ghost"
          onClick={toggleAddNew}
          className="font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700 w-full sm:w-auto"
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
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
          <AddChapterForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isValid={isValid}
          />
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-3 max-h-[70vh] sm:max-h-[600px] overflow-y-auto">
        {chapters.length === 0 ? (
          <EmptyChaptersState />
        ) : (
          chapters.map((chapter, index) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              index={index}
              editingId={editingId}
              onToggleEdit={toggleEdit}
              onPublishToggle={handlePublishToggle}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {editingId === chapter.id && (
                <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <EditChapterForm
                    form={form}
                    onSubmit={onSubmit}
                    onCancel={() => toggleEdit(chapter.id)}
                    chapter={chapter}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                  />
                </div>
              )}
            </ChapterItem>
          ))
        )}
      </div>

      {chapters.length > 0 && (
        <p className="text-xs sm:text-sm text-slate-500 mt-4 text-center">
          <span className="hidden sm:inline">Drag and drop to reorder chapters</span>
          <span className="sm:hidden">Tap and hold to reorder chapters</span>
        </p>
      )}
    </div>
  );
};

export default ChapterForm;