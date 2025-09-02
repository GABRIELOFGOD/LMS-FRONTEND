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
import Image from "next/image";
import ImagePlaceholder from "@/assets/hero-fc.png";

// Circular Progress Component 
const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  color = "hsl(var(--primary))"
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
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
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
};

const LearnerHome = () => {
  const { user } = useUser();
  const { getCourses } = useCourse();
  const [courses, setCourses] = useState<Course[]>([]);

  const gettingCourse = async () => {
    const courses = await getCourses();
    setCourses(courses);
  }

  useEffect(() => {
    gettingCourse();
  }, []);

  // Mock data for learner stats
  const stats = [
    { title: "Courses Enrolled", value: "12", icon: BookOpen, trend: "+3 this month", color: "text-blue-600" },
    { title: "Courses Completed", value: "8", icon: Award, trend: "+2 this month", color: "text-green-600" },
    { title: "Hours Learned", value: "47", icon: Clock, trend: "+12 this week", color: "text-purple-600" },
    { title: "Current Streak", value: "5 days", icon: Target, trend: "Keep it up!", color: "text-orange-600" },
  ];

  const courseProgress = [
    { name: "Web Development Fundamentals", progress: 85, lessons: 25, completedLessons: 21 },
    { name: "JavaScript Advanced Concepts", progress: 60, lessons: 30, completedLessons: 18 },
    { name: "React.js Mastery", progress: 40, lessons: 28, completedLessons: 11 },
    { name: "Node.js Backend Development", progress: 15, lessons: 35, completedLessons: 5 },
  ];

  const recentActivity = [
    { id: 1, action: "Completed lesson", title: "JavaScript Functions", course: "JS Advanced", time: "2 hours ago" },
    { id: 2, action: "Started course", title: "React Components", course: "React Mastery", time: "1 day ago" },
    { id: 3, action: "Earned certificate", title: "HTML/CSS Basics", course: "Web Fundamentals", time: "3 days ago" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.fname || 'Learner'}!</h1>
          <p className="text-muted-foreground">Continue your learning journey and achieve your goals.</p>
        </div>
        <div className="flex items-center gap-4">
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
              <p className="text-muted-foreground">Aspiring Developer & Lifelong Learner</p>
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
        {stats.map((stat, index) => (
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
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Progress Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {courseProgress.map((course, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <CircularProgress 
                    percentage={course.progress} 
                    size={80} 
                    strokeWidth={6}
                    color={index === 0 ? "hsl(var(--primary))" : `hsl(${200 + index * 40}, 70%, 50%)`}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{course.name}</h3>
                    <span className="text-sm text-muted-foreground">{course.progress}% Complete</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>📚 {course.completedLessons}/{course.lessons} Lessons</span>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 3).map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 overflow-hidden">
                        <Image
                          src={ImagePlaceholder}
                          alt={course.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Beginner</Badge>
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