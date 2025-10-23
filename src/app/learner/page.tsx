"use client";

import { BookOpen, Award, Target } from "lucide-react";
import { useUser } from "@/context/user-context";
import { Course } from "@/types/course";
import { useCallback, useEffect, useState } from "react";
import { useCourse } from "@/hooks/useCourse";

import { useStats } from "@/context/stats-context";
import {
  LearnerHeader,
  UserProfile,
  StatsGrid,
  OverallProgress,
  LearningProgress,
  QuickActions,
  RecentActivity,
  RecommendedCourses,
  AuthenticationRequired
} from "@/components/learner";



const LearnerHome = () => {
  const { user, isLoggedIn, isLoaded, courseProgress } = useUser();
  const { getAvailableCourses, getACourse } = useCourse();
  const { stats: userStats, isLoading: statsLoading, refreshStats } = useStats();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [progressData, setProgressData] = useState<Array<{
    name: string;
    progress: number;
    id: string;
    lessons: number;
    completedLessons: number;
  }>>([]);

  const gettingCourse = useCallback(async () => {
    try {
      setCoursesLoading(true);
      const courses = await getAvailableCourses();
      
      // Ensure courses is an array and contains valid course objects
      if (Array.isArray(courses)) {
        const validCourses = courses.filter(course => 
          course && 
          typeof course === 'object' && 
          course.id && 
          course.title
        );
        setCourses(validCourses);
      } else {
        console.warn('LearnerHome - Courses is not an array:', courses);
        setCourses([]);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses([]);
      // Don't show error toast for course loading failure
    } finally {
      setCoursesLoading(false);
    }
  }, []) // Remove getAvailableCourses from dependencies to prevent infinite loop

  const fetchRealProgressData = useCallback(async () => {
    if (!userStats?.coursesEnrolled?.length) {
      setProgressData([]);
      return;
    }

    try {
      // Fetch detailed course data to get actual chapter counts
      const progressDataPromises = userStats.coursesEnrolled.map(async ({course}) => {
        try {
          // Fetch full course details to get chapters
          const fullCourseData = await getACourse(course.id);
          const totalChapters = fullCourseData?.chapters?.length || 1;
          
          // Get progress from context if available
          const courseProgressData = courseProgress.get(course.id);
          const completedChapters = courseProgressData?.completedChapters?.length || 0;
          const progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
          
          return {
            name: course.title,
            progress: progress,
            id: course.id,
            lessons: totalChapters, // Use actual chapter count from full course data
            completedLessons: completedChapters // Use actual completed chapters from context
          };
        } catch (error) {
          console.error(`Failed to fetch course details for ${course.id}:`, error);
          // Fallback to basic data if course fetch fails
          const courseProgressData = courseProgress.get(course.id);
          const completedChapters = courseProgressData?.completedChapters?.length || 0;
          
          return {
            name: course.title,
            progress: completedChapters > 0 ? 50 : 0, // Fallback progress
            id: course.id,
            lessons: 1, // Fallback chapter count
            completedLessons: completedChapters
          };
        }
      });

      const progressData = await Promise.all(progressDataPromises);
      setProgressData(progressData);
    } catch (error) {
      console.error('Failed to prepare course data:', error);
      setProgressData([]);
    }
  }, [userStats?.coursesEnrolled, getACourse, courseProgress]);

  useEffect(() => {
    // Only fetch data when user context is loaded
    if (isLoaded) {
      // Always fetch courses (public endpoint)
      gettingCourse();
      
      // Set loading state based on login status
      if (!isLoggedIn) {
        setLoading(false);
        setProgressData([]); // Clear progress data when not logged in
      }
    }
  }, [isLoaded, isLoggedIn, gettingCourse]);

  // Update loading state and progress data when stats are available
  useEffect(() => {
    if (isLoggedIn) {
      setLoading(statsLoading);
      
      // Process course data for display when stats are available
      if (userStats?.coursesEnrolled?.length) {
        fetchRealProgressData();
      } else if (userStats && !userStats.coursesEnrolled?.length) {
        setProgressData([]);
      }
    }
  }, [userStats, statsLoading, isLoggedIn, fetchRealProgressData]);

  // Function to fetch real progress data (moved up and now called from fetchUserStats)
  // This function is kept for future use when backend provides lesson completion API

  // Use real progress data from API - progressData state contains the real course progress

  // Dynamic learner stats - use API data where available and accurate
  const stats = userStats ? (() => {
    // Calculate completed courses from userStats (using backend's comppletedChapters typo)
    const completedCourses = userStats.coursesEnrolled?.filter(enrollment => {
      const completedChapters = enrollment.comppletedChapters?.length || 0;
      return completedChapters > 0;
    }) || [];
    const totalCompleted = completedCourses.length;
    
    // Certificate logic: Only 1 certificate when ALL enrolled courses are completed
    const totalEnrolled = userStats.coursesEnrolled?.length || 0;
    const hasMasterCertificate = totalCompleted > 0 && totalCompleted === totalEnrolled;
    const certificateCount = hasMasterCertificate ? 1 : 0;
    
    return [
      { 
        title: "Courses Enrolled", 
        value: userStats.coursesEnrolled?.length?.toString() || "0", 
        icon: BookOpen, 
        trend: userStats.trends?.coursesThisMonth || "+0 this month", 
        color: "text-blue-600" 
      },
      { 
        title: "Courses Completed", 
        value: totalCompleted.toString(), 
        icon: Award, 
        trend: totalCompleted > 0 ? `+${totalCompleted} completed` : userStats.trends?.completedThisMonth || "+0 this month", 
        color: "text-green-600" 
      },
      { 
        title: "Certificates", 
        value: certificateCount.toString(), // Only 1 certificate when ALL courses completed
        icon: Target, 
        trend: hasMasterCertificate ? "Master Certificate Earned! 🏆" : totalCompleted > 0 ? `${totalEnrolled - totalCompleted} more to go!` : "Complete all courses to earn", 
        color: "text-orange-600" 
      },
    ];
  })() : [
    // Show zeros for new users - no dummy data
    { title: "Courses Enrolled", value: "0", icon: BookOpen, trend: "Start your learning journey", color: "text-blue-600" },
    { title: "Courses Completed", value: "0", icon: Award, trend: "Complete your first course", color: "text-green-600" },
    { title: "Certificates", value: "0", icon: Target, trend: "Earn your first certificate", color: "text-orange-600" },
  ];

  // Recent activity will be fetched from API in future - for now show empty state

  // Don't render learner dashboard if not authenticated
  if (isLoaded && !isLoggedIn) {
    return <AuthenticationRequired />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <LearnerHeader 
        userName={user?.fname || 'Learner'}
        onRefreshStats={refreshStats}
        loading={loading}
      />

      {/* User Profile Section */}
      <UserProfile user={user} />

      {/* Stats Grid */}
      <StatsGrid stats={stats} loading={loading} />

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Overall Progress Summary */}
        <OverallProgress userStats={userStats} />

        {/* Course Progress Section */}
        <LearningProgress progressData={progressData} />

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-4 md:space-y-6 md:col-span-2 lg:col-span-1">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>

      {/* Recommended Courses Section */}
      <RecommendedCourses courses={courses} loading={coursesLoading} />
    </div>
  );
}

export default LearnerHome;