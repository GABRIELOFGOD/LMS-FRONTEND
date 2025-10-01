"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle } from "lucide-react";

interface Chapter {
  id: string;
  name: string;
  isPublished: boolean;
}

interface ChapterListProps {
  chapters: Chapter[];
  currentChapter: number;
  onChapterSelect: (index: number) => void;
  isChapterCompleted: (chapterId: string) => boolean;
}

const ChapterList = ({ 
  chapters, 
  currentChapter, 
  onChapterSelect, 
  isChapterCompleted 
}: ChapterListProps) => {
  return (
    <Card className="lg:col-span-1 lg:h-fit lg:sticky lg:top-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5" />
          Course Content
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            {currentChapter + 1}/{chapters.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 lg:max-h-[70vh] overflow-y-auto">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect(index)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              currentChapter === index
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-muted border-border'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentChapter === index
                  ? 'bg-primary-foreground text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm">{chapter.name}</p>
                <p className="text-xs opacity-70">Chapter {index + 1}</p>
              </div>
              {isChapterCompleted(chapter.id) && (
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              )}
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default ChapterList;
