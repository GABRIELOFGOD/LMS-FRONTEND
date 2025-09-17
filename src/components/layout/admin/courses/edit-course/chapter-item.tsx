"use client";

import { Button } from "@/components/ui/button";
import { Chapter } from "@/types/course";
import { cn } from "@/lib/utils";
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Video,
  Play,
  FileText,
  Pencil
} from "lucide-react";

interface ChapterItemProps {
  chapter: Chapter;
  index: number;
  editingId: string | null;
  onToggleEdit: (chapterId: string) => void;
  onPublishToggle: (chapter: Chapter) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  children?: React.ReactNode; // For edit form
}

// Helper function to determine media type from URL
const getChapterMediaType = (url: string): 'video' | 'pdf' | 'video-url' | null => {
  if (!url) return null;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('application/pdf') || lowerUrl.endsWith('.pdf')) {
    return 'pdf';
  } else if (lowerUrl.includes('video/') || /\.(mp4|webm|ogg|mov|avi)$/i.test(lowerUrl)) {
    return 'video';
  } else if (lowerUrl.includes('http') || lowerUrl.includes('youtube.com') || lowerUrl.includes('vimeo.com')) {
    return 'video-url';
  }
  return 'video-url'; // Default to video URL for backward compatibility
};

const ChapterItem = ({
  chapter,
  index,
  editingId,
  onToggleEdit,
  onPublishToggle,
  onDragStart,
  onDragOver,
  onDrop,
  children
}: ChapterItemProps) => {
  const isEditing = editingId === chapter.id;

  return (
    <div
      key={chapter.id}
      className={cn(
        "bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 sm:p-4 transition-all hover:shadow-md",
        isEditing && "ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-900/20"
      )}
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
    >
      {isEditing ? (
        children
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
          {/* Mobile: Stack content vertically */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <GripVertical className="h-4 w-4 text-slate-400 cursor-grab flex-shrink-0" />
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {chapter.video ? (
                getChapterMediaType(chapter.video) === 'pdf' ? (
                  <FileText className="h-4 w-4 text-red-600 flex-shrink-0" />
                ) : (
                  <Play className="h-4 w-4 text-green-600 flex-shrink-0" />
                )
              ) : (
                <Video className="h-4 w-4 text-slate-400 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <span className="font-medium text-sm sm:text-base block truncate">{chapter.name}</span>
                {chapter.video && (
                  <span className="text-xs text-slate-500 block sm:inline">
                    ({getChapterMediaType(chapter.video) === 'pdf' ? 'PDF' : 
                      getChapterMediaType(chapter.video) === 'video-url' ? 'Video URL' : 'Video'})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 sm:ml-4">
            {/* Status Badge */}
            <div className="flex items-center">
              {chapter.isPublished ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full whitespace-nowrap">
                  Published
                </span>
              ) : (
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full whitespace-nowrap">
                  Draft
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleEdit(chapter.id)}
                className="px-2"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit chapter</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPublishToggle(chapter)}
                disabled={!chapter.video && !chapter.isPublished}
                title={!chapter.video && !chapter.isPublished ? "Add video or PDF content before publishing" : ""}
                className="px-2"
              >
                {chapter.isPublished ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="sr-only">Unpublish chapter</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Publish chapter</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterItem;
