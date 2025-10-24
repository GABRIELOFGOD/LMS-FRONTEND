"use client";

import { Progress } from "@/components/ui/progress";
import { useStats } from "@/context/stats-context";

const LearnerProgress = () => {
  const { stats: userStats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">Progress</p>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">Progress</p>
        <div className="text-center py-8 text-gray-500">
          <p>Unable to load progress data</p>
        </div>
      </div>
    );
  }

  // Filter active courses (non-deleted, published)
  const activeCourses = userStats.coursesEnrolled?.filter(
    enrollment => !enrollment.course.isDeleted && enrollment.course.publish
  ) || [];
  
  // Calculate completed courses from active courses (using backend's comppletedChapters typo)
  const completedCourses = activeCourses.filter(enrollment => {
    const completedChapters = enrollment.comppletedChapters?.length || 0;
    return completedChapters > 0;
  });
  
  const enrolledCount = activeCourses.length;
  const completedCount = completedCourses.length;
  const overallProgress = enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-lg md:text-xl font-bold">Progress</p>
      
      {/* Overall Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p>Overall Progress</p>
          <p>{overallProgress}%</p>
        </div>
        <Progress value={overallProgress} />
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600">{enrolledCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Active Enrolled</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
        </div>
      </div>

      {/* Trends (if available) */}
      {userStats.trends && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2">Monthly Trends</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p>📚 Courses: {userStats.trends.coursesThisMonth}</p>
            <p>✅ Completed: {userStats.trends.completedThisMonth}</p>
            <p>📝 Remaining: {userStats.trends.remainingLessons}</p>
            <p>🎯 Status: {userStats.trends.progressEncouragement}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerProgress;
