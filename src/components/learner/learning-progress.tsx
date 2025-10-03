"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { CircularProgress } from "./circular-progress";
import { useUser } from "@/context/user-context";

interface CourseProgress {
  name: string;
  progress: number;
  id: string;
  lessons: number;
  completedLessons: number;
}

interface LearningProgressProps {
  progressData: CourseProgress[];
}

export const LearningProgress = ({ progressData }: LearningProgressProps) => {
  const { getCourseProgress, courseProgress } = useUser();
  
  // Force re-render when courseProgress changes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const progressVersion = courseProgress.size;

  if (progressData.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 md:py-8">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mb-3 md:mb-4">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
            </div>
            <h3 className="text-sm md:text-base font-medium mb-1 md:mb-2">No Courses Enrolled Yet</h3>
            <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4">
              Start your learning journey by enrolling in a course
            </p>
            <Button asChild size="sm" className="w-full xs:w-auto">
              <Link href="/learner/courses">
                Browse Courses
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">Learning Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {progressData.map((course, index) => {
          // Get real-time progress from context (progressVersion ensures re-render)
          const realProgress = getCourseProgress(course.id);
          const displayProgress = realProgress?.progress || course.progress;
          const isCompleted = realProgress?.isCompleted || course.progress === 100;
          const completedChapters = realProgress?.completedChapters.length || course.completedLessons;
          
          return (
            <div key={course.id || index} className="p-3 md:p-4 rounded-lg border bg-card/50 space-y-3">
              {/* Mobile-first: Stack everything vertically, then responsive layout */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex-shrink-0">
                  <CircularProgress 
                    percentage={displayProgress} 
                    size={48} 
                    strokeWidth={3}
                    color={index === 0 ? "hsl(var(--primary))" : `hsl(${200 + index * 40}, 70%, 50%)`}
                    completedLessons={completedChapters}
                    totalLessons={course.lessons}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1">
                    <h3 className="font-medium text-sm md:text-base flex items-center gap-2 truncate">
                      {course.name}
                      {isCompleted && (
                        <Badge variant="default" className="text-xs bg-green-500 flex-shrink-0">
                          ✓ Complete
                        </Badge>
                      )}
                    </h3>
                    <span className="text-xs md:text-sm text-muted-foreground flex-shrink-0">
                      {Math.round(displayProgress)}% Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress info and stats */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    📚 {completedChapters}/{course.lessons} Lessons
                  </span>
                  <span className="hidden xs:inline">•</span>
                  <span className="flex items-center gap-1">
                    🎯 {course.lessons - completedChapters} Remaining
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-1.5 md:h-2">
                  <div 
                    className="h-1.5 md:h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${displayProgress}%`,
                      backgroundColor: index === 0 ? "hsl(var(--primary))" : `hsl(${200 + index * 40}, 70%, 50%)`
                    }}
                  />
                </div>

                {/* Continue button */}
                <div className="pt-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    asChild
                    className="w-full xs:w-auto text-xs"
                  >
                    <Link href={`/learner/courses/${course.id}`}>
                      {isCompleted ? 'Review Course' : 'Continue Learning'}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
