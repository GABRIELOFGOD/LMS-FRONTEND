import { Badge, Certification } from "@/types/attachment";
import { BASEURL } from "@/lib/utils";

/**
 * Fetch total number of published courses from admin
 * This is used to determine if learner has enrolled in all available courses
 */
export const getTotalPublishedCourses = async (): Promise<number> => {
  try {
    // Use the public /courses/published endpoint (doesn't require auth)
    const response = await fetch(`${BASEURL}/courses/published`, {
      method: "GET",
    });

    if (!response.ok) return 0;
    
    const data = await response.json();
    // Handle different response structures (value, data, or direct array)
    const courses = data.value || data.data || data || [];
    
    // Count only published, non-deleted courses
    if (Array.isArray(courses)) {
      return courses.filter((course: { publish?: boolean; isDeleted?: boolean }) => 
        course.publish && !course.isDeleted
      ).length;
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching total published courses:', error);
    return 0;
  }
};

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
 * Generate master certification when user completes ALL active courses from a specific admin
 * Only awarded when all active (non-deleted, published) courses from an admin are completed
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
 * A course is considered completed if ALL published chapters are done
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
  return completedCount > 0;
};

/**
 * Filter only active courses (non-deleted, published)
 */
export const filterActiveCourses = <T extends { course: { isDeleted?: boolean; publish?: boolean } }>(
  courses: T[]
): T[] => {
  return courses.filter(enrollment => 
    !enrollment.course.isDeleted && enrollment.course.publish
  );
};

/**
 * Get all user badges and certifications
 * Badges: One for each completed course (regardless of course status)
 * Certification: Only if learner has enrolled in AND completed ALL active (non-deleted, published) courses from admin
 */
export const getUserAchievements = (
  userStats: {
    coursesEnrolled: Array<{ 
      course: { 
        id: string; 
        title: string;
        isDeleted?: boolean;
        publish?: boolean;
      };
      comppletedChapters: Array<{ chapter: { id: string } }>;
    }>;
  },
  coursesWithChapterCounts?: Map<string, number>,
  totalPublishedCourses?: number  // Total number of published courses from admin
) => {
  // Calculate completed courses (using backend's comppletedChapters typo)
  const completedCourses = userStats.coursesEnrolled.filter(enrollment => {
    const totalChapters = coursesWithChapterCounts?.get(enrollment.course.id);
    return isCourseFullyCompleted(enrollment, totalChapters);
  });

  // Filter only active courses
  const activeCourses = filterActiveCourses(userStats.coursesEnrolled);
  const activeCompletedCourses = filterActiveCourses(completedCourses);

  const totalActiveEnrolled = activeCourses.length;
  const totalActiveCompleted = activeCompletedCourses.length;
  
  // Certificate is awarded ONLY when:
  // 1. Learner has enrolled in ALL published courses from admin
  // 2. Learner has completed ALL those courses
  const hasEnrolledInAllCourses = totalPublishedCourses 
    ? totalActiveEnrolled >= totalPublishedCourses 
    : totalActiveEnrolled > 0;
  
  const hasCompletedAllPublished = hasEnrolledInAllCourses && 
    totalActiveCompleted === totalActiveEnrolled &&
    (totalPublishedCourses ? totalActiveCompleted >= totalPublishedCourses : true);

  // Generate badges for each completed course (including deleted/unpublished ones)
  const badges = generateCourseBadges(completedCourses);

  // Generate master certification only if ALL published courses are enrolled and completed
  const masterCertification = generateMasterCertification(hasCompletedAllPublished, totalActiveCompleted);

  return {
    badges,
    certification: masterCertification,
    stats: {
      totalCourses: userStats.coursesEnrolled.length,
      activeCourses: totalActiveEnrolled,
      completedCourses: completedCourses.length,
      activeCompletedCourses: totalActiveCompleted,
      totalPublishedCourses: totalPublishedCourses || totalActiveEnrolled,
      hasCompletedAll: hasCompletedAllPublished,
    }
  };
};
