"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Video, FileText, X, Plus, GripVertical, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ChapterData } from './types';

interface ChapterManagementSectionProps {
  chapters: ChapterData[];
  setChapters: (chapters: ChapterData[]) => void;
  isLoading: boolean;
}

export const ChapterManagementSection = ({ 
  chapters, 
  setChapters, 
  isLoading 
}: ChapterManagementSectionProps) => {
  
  const addChapter = () => {
    const newChapter: ChapterData = {
      id: Date.now().toString(),
      name: `Chapter ${chapters.length + 1}`,
    };
    setChapters([...chapters, newChapter]);
  };

  const removeChapter = (chapterId: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== chapterId));
  };

  const updateChapterName = (chapterId: string, name: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId ? { ...chapter, name } : chapter
    ));
  };

  const updateChapterFile = (chapterId: string, file: File) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId ? { ...chapter, file, url: undefined } : chapter
    ));
  };

  const updateChapterUrl = (chapterId: string, url: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId ? { ...chapter, url, file: undefined } : chapter
    ));
  };

  const moveChapter = (chapterId: string, direction: 'up' | 'down') => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= chapters.length) return;

    const newChapters = [...chapters];
    [newChapters[currentIndex], newChapters[newIndex]] = [newChapters[newIndex], newChapters[currentIndex]];
    setChapters(newChapters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Course Chapters</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addChapter}
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
                    onClick={() => moveChapter(chapter.id, 'up')}
                    disabled={index === 0 || isLoading}
                    className="h-6 w-6 p-0"
                  >
                    <GripVertical className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost" 
                    size="sm"
                    onClick={() => moveChapter(chapter.id, 'down')}
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
                    onChange={(e) => updateChapterName(chapter.id, e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeChapter(chapter.id)}
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
                      onClick={() => {
                        setChapters(chapters.map(ch => 
                          ch.id === chapter.id ? { ...ch, file: undefined } : ch
                        ));
                      }}
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
                      onClick={() => {
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
                            updateChapterFile(chapter.id, file);
                          }
                        };
                        input.click();
                      }}
                      disabled={isLoading}
                    >
                      <Upload className="h-6 w-6" />
                      <span className="text-xs">Upload File</span>
                    </Button>
                    
                    <div>
                      <Input
                        placeholder="Or paste media URL..."
                        value={chapter.url || ''}
                        onChange={(e) => updateChapterUrl(chapter.id, e.target.value)}
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
            onClick={addChapter}
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
