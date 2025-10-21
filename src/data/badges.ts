import { Badge, Certification } from "@/types/attachment";

/**
 * Generate badges for completed courses
 * Each completed course earns the user a badge
 */
export const generateCourseBadges = (completedCourses: Array<{ course: { id: string; title: string } }>): Badge[] => {
  return completedCourses.map((enrollment) => ({
    id: enrollment.course.id,
    name: `Completed: ${enrollment.course.title}`,
    description: `Successfully completed the ${enrollment.course.title} course`,
  }));
};

/**
 * Generate master certification when user completes ALL published courses
 * Only awarded when all enrolled courses are completed
 */
export const generateMasterCertification = (
  hasCompletedAll: boolean,
  totalCourses: number
): Certification | null => {
  if (!hasCompletedAll || totalCourses === 0) {
    return null;
  }

  return {
    id: "master-certification",
    name: "Master Certification",
    description: `Congratulations! You have successfully completed all ${totalCourses} available courses`,
  };
};

/**
 * Check if a course is fully completed
 * A course is considered completed if it has completed chapters
 * Note: Backend should ideally provide total chapters or completion status
 * For now, we check if there are completed chapters (user has made progress)
 */
export const isCourseFullyCompleted = (
  enrollment: { 
    comppletedChapters: Array<{ chapter: { id: string } }>;
  },
  totalChapters?: number
): boolean => {
  const completedCount = enrollment.comppletedChapters?.length || 0;
  
  // If we have total chapters info, check if all are completed
  if (totalChapters !== undefined && totalChapters > 0) {
    return completedCount >= totalChapters;
  }
  
  // Fallback: Consider course completed if it has completed chapters
  // This is not ideal but works when we don't have total chapter count
  // Backend should provide a isCompleted flag or totalChapters field
  return completedCount > 0;
};

/**
 * Get all user badges and certifications
 * Badges: One for each completed course
 * Certification: Only if ALL enrolled courses are completed
 */
export const getUserAchievements = (
  userStats: {
    coursesEnrolled: Array<{ 
      course: { id: string; title: string };
      comppletedChapters: Array<{ chapter: { id: string } }>;
    }>;
  },
  coursesWithChapterCounts?: Map<string, number>
) => {
  // Calculate completed courses (using backend's comppletedChapters typo)
  const completedCourses = userStats.coursesEnrolled.filter(enrollment => {
    const totalChapters = coursesWithChapterCounts?.get(enrollment.course.id);
    return isCourseFullyCompleted(enrollment, totalChapters);
  });

  const totalEnrolled = userStats.coursesEnrolled.length;
  const totalCompleted = completedCourses.length;
  const hasCompletedAll = totalEnrolled > 0 && totalCompleted === totalEnrolled;

  // Generate badges for each completed course
  const badges = generateCourseBadges(completedCourses);

  // Generate master certification only if ALL courses are completed
  const masterCertification = generateMasterCertification(hasCompletedAll, totalCompleted);

  return {
    badges,
    certification: masterCertification,
    stats: {
      totalCourses: totalEnrolled,
      completedCourses: totalCompleted,
      hasCompletedAll,
    }
  };
};
