"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BookOpen, Award, Target, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { useCourse } from "@/hooks/useCourse";
import { getUserStats, UserStats } from "@/services/common";
import Image from "next/image";
import ImagePlaceholder from "@/assets/hero-fc.png";

// Enhanced Circular Progress Component with Animation
const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  color = "hsl(var(--primary))",
  completedLessons,
  totalLessons
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  completedLessons?: number;
  totalLessons?: number;
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 4px ${color}30)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-foreground">{animatedPercentage}%</span>
        {completedLessons !== undefined && totalLessons !== undefined && (
          <span className="text-xs text-muted-foreground">{completedLessons}/{totalLessons}</span>
        )}
      </div>
    </div>
  );
};

const LearnerHome = () => {
  const { user, isLoggedIn, isLoaded } = useUser();
  const { getAvailableCourses } = useCourse();
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
      console.log('LearnerHome - Fetching available courses...');
      const courses = await getAvailableCourses();
      console.log('LearnerHome - Courses fetched:', courses);
      
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
      console.log('LearnerHome - Processing enrolled courses for display...');
      
      // Since progress API is not available yet, create course entries with 0% progress
      // This will be updated when backend implements progress tracking
      const progressData = userStats.coursesEnrolled.map((course) => ({
        name: course.title,
        progress: 0, // No progress API available yet
        id: course.id,
        lessons: 1, // Default until lessons API is available
        completedLessons: 0 // Default until progress API is available
      }));

      setProgressData(progressData);
      console.log('LearnerHome - Course data prepared for display:', progressData);
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
      console.log('LearnerHome - Fetching user stats...');
      const stats = await getUserStats();
      if (stats) {
        console.log('LearnerHome - Raw stats response:', stats);
        console.log('LearnerHome - coursesEnrolled length:', stats.coursesEnrolled?.length);
        console.log('LearnerHome - coursesCompleted length:', stats.coursesCompleted?.length);
        console.log('LearnerHome - currentStraek:', stats.currentStraek);
        console.log('LearnerHome - longestStreak:', stats.longestStreak);
        
        setUserStats(stats);
        console.log('LearnerHome - Stats loaded successfully');
        
        // Process course data for display (no API call needed)
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
      console.log('LearnerHome - User context loaded, isLoggedIn:', isLoggedIn);
      // Always fetch courses (public endpoint)
      gettingCourse();
      
      // Only fetch user-specific data if logged in
      if (isLoggedIn) {
        fetchUserStats();
      } else {
        console.log('LearnerHome - User not logged in, skipping stats fetch');
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
        value: userStats.coursesCompleted?.length?.toString() || "0", 
        icon: Award, 
        trend: userStats.trends?.completedThisMonth || "+0 this month", 
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
        value: userStats.certificates?.length?.toString() || "0", 
        icon: Target, 
        trend: userStats.trends?.progressEncouragement || "Keep learning!", 
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please log in to access your learner dashboard.</p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6 p-3 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {user?.fname || 'Learner'}!</h1>
          <p className="text-muted-foreground text-sm md:text-base">Continue your learning journey and achieve your goals.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <Button 
            variant="outline" 
            onClick={fetchUserStats} 
            disabled={loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            {loading ? "Loading..." : "Refresh Stats"}
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/learner/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>

      {/* User Profile Section */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-12 w-12 md:h-16 md:w-16">
              <AvatarImage src="" alt={user?.fname || 'User'} />
              <AvatarFallback className="text-sm md:text-lg">{user?.fname?.[0] || 'L'}{user?.lname?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg md:text-xl font-semibold">{user?.fname} {user?.lname}</h2>
              <p className="text-muted-foreground text-sm md:text-base">
                {user?.fname ? `${user.fname} - Aspiring Developer & Lifelong Learner` : "Aspiring Developer & Lifelong Learner"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <CalendarDays className="h-3 w-3 md:h-4 md:w-4" />
              <span>Learning since March 2024</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Loading skeleton for stats
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-16 md:w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 md:h-8 w-12 md:w-16 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-16 md:w-20 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium truncate">{stat.title}</CardTitle>
                <stat.icon className={`h-3 w-3 md:h-4 md:w-4 ${stat.color} flex-shrink-0`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-2 w-2 md:h-3 md:w-3" />
                  <span className="text-green-600 truncate">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-4">
        {/* Overall Progress Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <CircularProgress 
              percentage={userStats ? Math.round((userStats.coursesCompleted.length / Math.max(userStats.coursesEnrolled.length, 1)) * 100) : 0} 
              size={100} 
              strokeWidth={6}
              color="hsl(var(--primary))"
              completedLessons={userStats?.coursesCompleted?.length || 0}
              totalLessons={userStats?.coursesEnrolled?.length || 1}
            />
            <div className="text-center space-y-1">
              <p className="text-xs md:text-sm font-medium">
                {userStats?.coursesCompleted?.length || 0} of {userStats?.coursesEnrolled?.length || 0} courses completed
              </p>
              <p className="text-xs text-muted-foreground">
                {userStats?.trends?.progressEncouragement || "Keep going!"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Course Progress Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {progressData.length > 0 ? (
              progressData.map((course, index) => (
                <div key={course.id || index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <CircularProgress 
                      percentage={course.progress} 
                      size={60} 
                      strokeWidth={4}
                      color={index === 0 ? "hsl(var(--primary))" : `hsl(${200 + index * 40}, 70%, 50%)`}
                      completedLessons={course.completedLessons}
                      totalLessons={course.lessons}
                    />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-medium flex items-center justify-center sm:justify-start gap-2">
                        {course.name}
                        {course.progress === 100 && (
                          <Badge variant="default" className="text-xs bg-green-500">
                            ✓ Complete
                          </Badge>
                        )}
                      </h3>
                      <span className="text-sm text-muted-foreground">{course.progress}% Complete</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs md:text-sm text-muted-foreground">
                      <span>📚 {course.completedLessons}/{course.lessons} Lessons Completed</span>
                      <span>🎯 {course.lessons - course.completedLessons} Remaining</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="w-full bg-muted rounded-full h-2 sm:mr-4">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${course.progress}%`,
                            backgroundColor: index === 0 ? "hsl(var(--primary))" : `hsl(${200 + index * 40}, 70%, 50%)`
                          }}
                        />
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        asChild
                        className="w-full sm:w-auto"
                      >
                        <Link href={`/learner/courses/${course.id}`}>
                          Continue
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty state for new users with no enrolled courses
              <div className="text-center py-8 md:py-12">
                <div className="mx-auto w-16 h-16 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground" />
                </div>
                <h3 className="text-base md:text-lg font-medium mb-2">No Courses Enrolled Yet</h3>
                <p className="text-muted-foreground text-sm md:text-base mb-4 md:mb-6">
                  Start your learning journey by enrolling in a course
                </p>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/learner/courses">
                    Browse Courses
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-4 md:space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start text-sm" variant="outline">
                <Link href="/learner/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Courses
                </Link>
              </Button>
              <Button asChild className="w-full justify-start text-sm" variant="outline">
                <Link href="/learner/profile">
                  <Target className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </Button>
              <Button asChild className="w-full justify-start text-sm" variant="outline">
                <Link href="/learner/notification">
                  <Clock className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Empty state for recent activity - will be connected to real API later */}
              <div className="text-center py-6 md:py-8">
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium mb-2">No Recent Activity</h3>
                <p className="text-xs text-muted-foreground">
                  Your learning activity will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Courses Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm md:text-base">Recommended for You</CardTitle>
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
              <Link href="/learner/courses">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-6 w-16 bg-muted rounded"></div>
                      <div className="h-8 w-20 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses
                .slice(0, 3)
                .filter(course => course && course.id && course.title) // Filter out invalid courses
                .map((course) => (
                <Link key={course.id} href={`/learner/courses/${course.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 overflow-hidden">
                        <Image
                          src={course.imageUrl || ImagePlaceholder}
                          alt={course.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2 text-sm md:text-base">{course.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{course.isFree ? 'Free' : 'Premium'}</Badge>
                        <Button size="sm" variant="ghost" className="text-xs">
                          Start Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="mx-auto h-8 w-8 md:h-12 md:w-12 mb-4 opacity-50" />
              <p className="text-base md:text-lg font-medium mb-2">No courses available</p>
              <p className="text-sm">Check back later for new learning opportunities.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LearnerHome;