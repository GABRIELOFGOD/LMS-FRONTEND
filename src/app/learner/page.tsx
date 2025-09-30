"use client";

import { BookOpen, Award, Target, Clock } from "lucide-react";
import { useUser } from "@/context/user-context";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { useCourse } from "@/hooks/useCourse";
import { getUserStats, UserStats } from "@/services/common";
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [progressData, setProgressData] = useState<Array<{
    name: string;
    progress: number;
    id: string;
    lessons: number;
    completedLessons: number;
  }>>([]);

  const gettingCourse = async () => {
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
  }

  const fetchRealProgressData = async () => {
    if (!userStats?.coursesEnrolled?.length) {
      setProgressData([]);
      return;
    }

    try {
      // Fetch detailed course data to get actual chapter counts
      const progressDataPromises = userStats.coursesEnrolled.map(async (course) => {
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
  };

  const fetchUserStats = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const stats = await getUserStats();
      if (stats) {
        setUserStats(stats);
        
        // Process course data for display 
        fetchRealProgressData();
      } else {
        console.warn("No user stats received");
        setUserStats(null);
        setProgressData([]);
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      setUserStats(null);
      setProgressData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data when user context is loaded
    if (isLoaded) {
      // Always fetch courses (public endpoint)
      gettingCourse();
      
      // Only fetch user-specific data if logged in
      if (isLoggedIn) {
        fetchUserStats();
      } else {
        setLoading(false);
        setProgressData([]); // Clear progress data when not logged in
      }
    }
  }, [isLoaded, isLoggedIn]);

  // Separate effect to fetch progress data when userStats changes
  useEffect(() => {
    if (userStats?.coursesEnrolled?.length) {
      fetchRealProgressData();
    }
  }, [userStats]);

  // Function to fetch real progress data (moved up and now called from fetchUserStats)
  // This function is kept for future use when backend provides lesson completion API

  // Use real progress data from API - progressData state contains the real course progress

  // Dynamic learner stats - use API data where available and accurate
  const stats = userStats ? (() => {
    // Use static streak values until backend provides real activity tracking API
    // This avoids confusing users with random mock data
    const currentStreak = 0;
    const longestStreak = 0;
    
    // Calculate real-time completed courses from context
    const completedFromContext = Array.from(courseProgress.values()).filter(course => course.isCompleted).length;
    const totalCompleted = completedFromContext || userStats.coursesCompleted?.length || 0;
    
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
        trend: completedFromContext > 0 ? `+${completedFromContext} this session` : userStats.trends?.completedThisMonth || "+0 this month", 
        color: "text-green-600" 
      },
      { 
        title: "Current Streak", 
        value: currentStreak.toString(),
        icon: Clock, 
        trend: `Longest: ${longestStreak} days`, 
        color: "text-purple-600" 
      },
      { 
        title: "Certificates", 
        value: totalCompleted.toString(), // Certificates = completed courses for now
        icon: Target, 
        trend: completedFromContext > 0 ? "Great progress!" : userStats.trends?.progressEncouragement || "Keep learning!", 
        color: "text-orange-600" 
      },
    ];
  })() : [
    // Show zeros for new users - no dummy data
    { title: "Courses Enrolled", value: "0", icon: BookOpen, trend: "Start your learning journey", color: "text-blue-600" },
    { title: "Courses Completed", value: "0", icon: Award, trend: "Complete your first course", color: "text-green-600" },
    { title: "Current Streak", value: "0", icon: Clock, trend: "Start learning today", color: "text-purple-600" },
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
        onRefreshStats={fetchUserStats}
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