import { useState, useEffect, useCallback, useRef } from "react";
import { useCourse } from "./useCourse";
import { useUser } from "@/context/user-context";

interface Enrollment {
  courseId: string;
  userId: string;
  enrolledAt: string;
  progress?: number;
}

interface EnrollmentState {
  isEnrolled: boolean;
  isLoading: boolean;
  progress: number;
  enrollments: Enrollment[];
}

interface UseEnrollmentStatusOptions {
  onStatsUpdate?: () => void; // Callback to refresh stats after enrollment
}

export const useEnrollmentStatus = (courseId?: string, options?: UseEnrollmentStatusOptions) => {
  const { isLoggedIn, isLoaded } = useUser();
  const { getUserEnrollments, getCourseProgress, enrollCourse } = useCourse();
  const optionsRef = useRef(options);
  
  // Update the ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  
  const [state, setState] = useState<EnrollmentState>({
    isEnrolled: false,
    isLoading: false,
    progress: 0,
    enrollments: []
  });

  const checkEnrollmentStatus = useCallback(async () => {
    if (!isLoggedIn || !courseId) {
      setState(prev => ({ 
        ...prev, 
        isEnrolled: false, 
        progress: 0, 
        enrollments: [],
        isLoading: false 
      }));
      return;
    }

    setState(prev => {
      // Only set loading if not already loading
      if (prev.isLoading) return prev;
      return { ...prev, isLoading: true };
    });
    
    try {
      console.log('useEnrollmentStatus - Checking enrollment for course:', courseId);
      const enrollments = await getUserEnrollments() as Enrollment[];
      const isEnrolled = enrollments?.some((e: Enrollment) => e.courseId === courseId) || false;
      
      let progress = 0;
      if (isEnrolled) {
        try {
          const progressData = await getCourseProgress(courseId);
          progress = progressData?.completionPercentage || 0;
        } catch (error) {
          console.error('useEnrollmentStatus - Failed to get progress:', error);
        }
      }

      setState(prev => {
        // Only update if values actually changed
        if (prev.isEnrolled === isEnrolled && 
            prev.progress === progress && 
            prev.isLoading === false &&
            prev.enrollments.length === (enrollments?.length || 0)) {
          return prev;
        }
        
        return {
          isEnrolled,
          isLoading: false,
          progress,
          enrollments: enrollments || []
        };
      });
      
      console.log('useEnrollmentStatus - Status updated:', { isEnrolled, progress });
    } catch (error) {
      console.error('useEnrollmentStatus - Failed to check enrollment:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [isLoggedIn, courseId]); // Removed getUserEnrollments and getCourseProgress from dependencies

  const enroll = useCallback(async () => {
    if (!courseId || !isLoggedIn) {
      throw new Error("Cannot enroll: missing course ID or not logged in");
    }

    setState(prev => {
      // Only set loading if not already loading
      if (prev.isLoading) return prev;
      return { ...prev, isLoading: true };
    });
    
    try {
      console.log('useEnrollmentStatus - Starting enrollment for:', courseId);
      await enrollCourse(courseId);
      
      // Update state immediately
      setState(prev => ({ ...prev, isEnrolled: true, progress: 0, isLoading: false }));
      
      // Trigger stats refresh if callback provided
      if (optionsRef.current?.onStatsUpdate) {
        console.log('useEnrollmentStatus - Triggering stats update...');
        optionsRef.current.onStatsUpdate();
      }
      
      // Then refresh from server to ensure consistency (with delay to prevent rapid calls)
      setTimeout(() => {
        checkEnrollmentStatus();
      }, 1000);
      
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [courseId, isLoggedIn]); // Removed enrollCourse and checkEnrollmentStatus from dependencies

  const refresh = useCallback(() => {
    if (isLoaded && courseId) {
      checkEnrollmentStatus();
    }
  }, [isLoaded, courseId]); // Removed checkEnrollmentStatus from dependencies

  // Initial load and when dependencies change
  useEffect(() => {
    if (isLoaded && courseId) {
      checkEnrollmentStatus();
    }
  }, [isLoaded, isLoggedIn, courseId]); // Removed checkEnrollmentStatus from dependencies

  return {
    ...state,
    enroll,
    refresh,
    checkEnrollmentStatus
  };
};
