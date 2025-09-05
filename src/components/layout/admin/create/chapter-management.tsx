"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, GripVertical, Trash2, Video, FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export interface ChapterData {
  id: string;
  name: string;
  file?: File;
  url?: string;
}

interface ChapterManagementProps {
  chapters: ChapterData[];
  isLoading: boolean;
  onAddChapter: () => void;
  onRemoveChapter: (chapterId: string) => void;
  onUpdateChapterName: (chapterId: string, name: string) => void;
  onUpdateChapterFile: (chapterId: string, file: File | undefined) => void;
  onUpdateChapterUrl: (chapterId: string, url: string) => void;
  onMoveChapter: (chapterId: string, direction: 'up' | 'down') => void;
}

export const ChapterManagement = ({
  chapters,
  isLoading,
  onAddChapter,
  onRemoveChapter,
  onUpdateChapterName,
  onUpdateChapterFile,
  onUpdateChapterUrl,
  onMoveChapter,
}: ChapterManagementProps) => {
  const handleFileUpload = (chapterId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/webm,video/ogg,application/pdf';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        if (file.size > 500 * 1024 * 1024) {
          toast.error("File size must be less than 500MB");
          return;
        }
        onUpdateChapterFile(chapterId, file);
      }
    };
    input.click();
  };

  const removeChapterFile = (chapterId: string) => {
    onUpdateChapterFile(chapterId, undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Course Chapters</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddChapter}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Chapter
        </Button>
      </div>

      {chapters.length > 0 ? (
        <div className="space-y-3">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onMoveChapter(chapter.id, 'up')}
                    disabled={index === 0 || isLoading}
                    className="h-6 w-6 p-0"
                  >
                    <GripVertical className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost" 
                    size="sm"
                    onClick={() => onMoveChapter(chapter.id, 'down')}
                    disabled={index === chapters.length - 1 || isLoading}
                    className="h-6 w-6 p-0"
                  >
                    <GripVertical className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <Input
                    placeholder="Chapter name"
                    value={chapter.name}
                    onChange={(e) => onUpdateChapterName(chapter.id, e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveChapter(chapter.id)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Chapter Media</p>
                
                {chapter.file ? (
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {chapter.file.type === 'application/pdf' ? (
                        <FileText className="h-6 w-6 text-red-500" />
                      ) : (
                        <Video className="h-6 w-6 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{chapter.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(chapter.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChapterFile(chapter.id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2"
                      onClick={() => handleFileUpload(chapter.id)}
                      disabled={isLoading}
                    >
                      <Upload className="h-6 w-6" />
                      <span className="text-xs">Upload File</span>
                    </Button>
                    
                    <div>
                      <Input
                        placeholder="Or paste media URL..."
                        value={chapter.url || ''}
                        onChange={(e) => onUpdateChapterUrl(chapter.id, e.target.value)}
                        disabled={isLoading}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-border rounded-lg">
          <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-2">No chapters added yet</p>
          <p className="text-xs text-muted-foreground mb-4">
            Add chapters to organize your course content
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddChapter}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Chapter
          </Button>
        </div>
      )}
    </div>
  );
};
