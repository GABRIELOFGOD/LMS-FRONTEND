import { useState, useEffect, useCallback } from "react";
import { useCourse } from "./useCourse";
import { useUser } from "@/context/user-context";

interface EnrollmentState {
  isEnrolled: boolean;
  isLoading: boolean;
  progress: number;
  enrollments: any[];
}

export const useEnrollmentStatus = (courseId?: string) => {
  const { isLoggedIn, isLoaded } = useUser();
  const { getUserEnrollments, getCourseProgress, enrollCourse } = useCourse();
  
  const [state, setState] = useState<EnrollmentState>({
    isEnrolled: false,
    isLoading: false,
    progress: 0,
    enrollments: []
  });

  const checkEnrollmentStatus = useCallback(async () => {
    if (!isLoggedIn || !courseId) {
      setState(prev => ({ ...prev, isEnrolled: false, progress: 0, enrollments: [] }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('useEnrollmentStatus - Checking enrollment for course:', courseId);
      const enrollments = await getUserEnrollments();
      console.log("Enrol", enrollments);
      const isEnrolled = enrollments?.some((e: any) => e.courseId === courseId) || false;
      
      let progress = 0;
      if (isEnrolled) {
        try {
          const progressData = await getCourseProgress(courseId);
          progress = progressData?.completionPercentage || 0;
        } catch (error) {
          console.error('useEnrollmentStatus - Failed to get progress:', error);
        }
      }

      setState({
        isEnrolled,
        isLoading: false,
        progress,
        enrollments: enrollments || []
      });
      
      console.log('useEnrollmentStatus - Status updated:', { isEnrolled, progress });
    } catch (error) {
      console.error('useEnrollmentStatus - Failed to check enrollment:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [isLoggedIn, courseId, getUserEnrollments, getCourseProgress]);

  const enroll = useCallback(async () => {
    if (!courseId || !isLoggedIn) {
      throw new Error("Cannot enroll: missing course ID or not logged in");
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('useEnrollmentStatus - Starting enrollment for:', courseId);
      await enrollCourse(courseId);
      
      // Update state immediately
      setState(prev => ({ ...prev, isEnrolled: true, progress: 0 }));
      
      // Then refresh from server to ensure consistency
      setTimeout(checkEnrollmentStatus, 1000);
      
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [courseId, isLoggedIn, enrollCourse, checkEnrollmentStatus]);

  const refresh = useCallback(() => {
    checkEnrollmentStatus();
  }, [checkEnrollmentStatus]);

  // Initial load and when dependencies change
  useEffect(() => {
    if (isLoaded) {
      checkEnrollmentStatus();
    }
  }, [isLoaded, isLoggedIn, courseId, checkEnrollmentStatus]);

  return {
    ...state,
    enroll,
    refresh,
    checkEnrollmentStatus
  };
};
