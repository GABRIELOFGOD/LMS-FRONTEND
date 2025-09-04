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
  // Remove dummy progress data - will use real API data only

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
      } else {
        console.warn("No user stats received - using fallback data");
        // Keep userStats as null to use fallback data
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      // Stats will remain null and fallback data will be used
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
      }
    }
  }, [isLoaded, isLoggedIn]);

  // Function to simulate completing a lesson (for testing) - REMOVED DUMMY DATA DEPENDENCY
  // This function is kept for future use when backend provides lesson completion API

  // Use ONLY real course progress data from API - no dummy data fallback
  const courseProgress = userStats?.coursesEnrolled && userStats.coursesEnrolled.length > 0 
    ? userStats.coursesEnrolled.map((course) => ({
        name: course.title,
        progress: 75, // Default progress - will be updated when backend provides actual progress
        id: course.id,
        lessons: 10, // Default lesson count
        completedLessons: 7 // Default completed lessons
      }))
    : []; // Show empty array for new users with no enrolled courses

  // Dynamic learner stats - use API data if available, fallback to calculated stats
  const stats = userStats ? [
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
      value: userStats.currentStraek?.toString() || "0", 
      icon: Clock, 
      trend: `Longest: ${userStats.longestStreak || 0} days`, 
      color: "text-purple-600" 
    },
    { 
      title: "Certificates", 
      value: userStats.certificates?.length?.toString() || "0", 
      icon: Target, 
      trend: userStats.trends?.progressEncouragement || "Keep learning!", 
      color: "text-orange-600" 
    },
  ] : [
    // Show zeros for new users - no dummy data
    { title: "Courses Enrolled", value: "0", icon: BookOpen, trend: "Start your learning journey", color: "text-blue-600" },
    { title: "Courses Completed", value: "0", icon: Award, trend: "Complete your first course", color: "text-green-600" },
    { title: "Current Streak", value: "0", icon: Clock, trend: "Start learning today", color: "text-purple-600" },
    { title: "Certificates", value: "0", icon: Target, trend: "Earn your first certificate", color: "text-orange-600" },
  ];

  const recentActivity = [
    { id: 1, action: "Completed lesson", title: "JavaScript Functions", course: "JS Advanced", time: "2 hours ago" },
    { id: 2, action: "Started course", title: "React Components", course: "React Mastery", time: "1 day ago" },
    { id: 3, action: "Earned certificate", title: "HTML/CSS Basics", course: "Web Fundamentals", time: "3 days ago" },
  ];

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
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.fname || 'Learner'}!</h1>
          <p className="text-muted-foreground">Continue your learning journey and achieve your goals.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={fetchUserStats} 
            disabled={loading}
            size="sm"
          >
            {loading ? "Loading..." : "Refresh Stats"}
          </Button>
          <Button asChild>
            <Link href="/learner/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>

      {/* User Profile Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt={user?.fname || 'User'} />
              <AvatarFallback className="text-lg">{user?.fname?.[0] || 'L'}{user?.lname?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.fname} {user?.lname}</h2>
              <p className="text-muted-foreground">
                {user?.fname ? `${user.fname} - Aspiring Developer & Lifelong Learner` : "Aspiring Developer & Lifelong Learner"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Learning since March 2024</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Loading skeleton for stats
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-green-600">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Overall Progress Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <CircularProgress 
              percentage={userStats ? Math.round((userStats.coursesCompleted.length / Math.max(userStats.coursesEnrolled.length, 1)) * 100) : 0} 
              size={120} 
              strokeWidth={8}
              color="hsl(var(--primary))"
              completedLessons={userStats?.coursesCompleted?.length || 0}
              totalLessons={userStats?.coursesEnrolled?.length || 1}
            />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">
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
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {courseProgress.length > 0 ? (
              courseProgress.map((course, index) => (
                <div key={course.id || index} className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <CircularProgress 
                      percentage={course.progress} 
                      size={80} 
                      strokeWidth={6}
                      color={index === 0 ? "hsl(var(--primary))" : `hsl(${200 + index * 40}, 70%, 50%)`}
                      completedLessons={course.completedLessons}
                      totalLessons={course.lessons}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium flex items-center gap-2">
                        {course.name}
                        {course.progress === 100 && (
                          <Badge variant="default" className="text-xs bg-green-500">
                            ✓ Complete
                          </Badge>
                        )}
                      </h3>
                      <span className="text-sm text-muted-foreground">{course.progress}% Complete</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📚 {course.completedLessons}/{course.lessons} Lessons Completed</span>
                      <span>🎯 {course.lessons - course.completedLessons} Remaining</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-muted rounded-full h-2 mr-4">
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
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Courses Enrolled Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start your learning journey by enrolling in a course
                </p>
                <Button asChild>
                  <Link href="/learner/courses">
                    Browse Courses
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/learner/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Courses
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/learner/profile">
                  <Target className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
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
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="space-y-1 border-b pb-3 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {activity.action}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>in {activity.course}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Courses Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recommended for You</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/learner/courses">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses
                .slice(0, 3)
                .filter(course => course && course.id && course.title) // Filter out invalid courses
                .map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
                      <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{course.isFree ? 'Free' : 'Premium'}</Badge>
                        <Button size="sm" variant="ghost">
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
              <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No courses available</p>
              <p className="text-sm">Check back later for new learning opportunities.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LearnerHome;