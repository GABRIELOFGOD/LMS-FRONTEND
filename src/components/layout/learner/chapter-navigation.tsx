"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface ChapterNavigationProps {
  currentChapter: number;
  totalChapters: number;
  isLastChapter: boolean;
  isCourseCompleted: boolean;
  isChapterCompleted: boolean;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
  onCompleteChapter: () => void;
}

const ChapterNavigation = ({
  currentChapter,
  totalChapters,
  isLastChapter,
  isCourseCompleted,
  isChapterCompleted,
  onPreviousChapter,
  onNextChapter,
  onCompleteChapter
}: ChapterNavigationProps) => {
  return (
    <div className="space-y-4 pt-4 border-t">
      {/* Progress Tracking */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          {isLastChapter ? (
            // Last chapter - Complete Course button
            <Button
              onClick={onCompleteChapter}
              disabled={isCourseCompleted}
              className={`flex items-center gap-2 ${
                isCourseCompleted 
                  ? 'bg-green-600 hover:bg-green-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {isCourseCompleted ? 'Course Completed' : 'Complete Course'}
            </Button>
          ) : (
            // Regular chapter - Mark as Complete toggle
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id={`chapter-completion`}
                checked={isChapterCompleted}
                onChange={onCompleteChapter}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <label
                htmlFor={`chapter-completion`}
                className={`text-sm font-medium cursor-pointer ${
                  isChapterCompleted
                    ? 'text-green-600'
                    : 'text-gray-700'
                }`}
              >
                {isChapterCompleted 
                  ? '✓ Completed' 
                  : 'Mark as Complete'
                }
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Chapter Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          variant="outline"
          onClick={onPreviousChapter}
          disabled={currentChapter === 0}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous Chapter
        </Button>

        <div className="text-sm text-muted-foreground text-center sm:order-none order-first">
          Chapter {currentChapter + 1} of {totalChapters}
        </div>

        <Button
          onClick={onNextChapter}
          disabled={currentChapter === totalChapters - 1}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          Next Chapter
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterNavigation;
