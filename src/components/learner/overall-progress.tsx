"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "./circular-progress";
import { UserStats } from "@/services/common";

interface OverallProgressProps {
  userStats: UserStats | null;
}

export const OverallProgress = ({ userStats }: OverallProgressProps) => {
  // Filter active courses (non-deleted, published)
  const activeCourses = userStats?.coursesEnrolled?.filter(
    enrollment => !enrollment.course.isDeleted && enrollment.course.publish
  ) || [];
  
  // Calculate completed courses from active courses (using backend's comppletedChapters typo)
  const enrolledCourses = activeCourses.length;
  const completedCourses = activeCourses.filter(enrollment => {
    const completedChapters = enrollment.comppletedChapters?.length || 0;
    return completedChapters > 0;
  }).length;
  
  const progressPercentage = enrolledCourses > 0 
    ? Math.round((completedCourses / enrolledCourses) * 100) 
    : 0;

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">Overall Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-3 md:space-y-4">
        <CircularProgress 
          percentage={progressPercentage} 
          size={80} 
          strokeWidth={5}
          color="hsl(var(--primary))"
          completedLessons={completedCourses}
          totalLessons={Math.max(enrolledCourses, 1)}
        />
        <div className="text-center space-y-1">
          <p className="text-xs md:text-sm font-medium">
            {completedCourses} of {enrolledCourses} active courses completed
          </p>
          <p className="text-xs text-muted-foreground">
            {userStats?.trends?.progressEncouragement || "Keep going!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
