"use client";

import CourseMapper from "@/components/layout/courses/course-mapper";
import Crumb from "@/components/Crumb";
import InProgressCourses from "@/components/layout/learner/in-progress-courses";
import { useUser } from "@/context/user-context";
import { useStats } from "@/context/stats-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Clock, Target } from "lucide-react";

const LearnerCourses = () => {
  const { user } = useUser();
  const { stats, isLoading: loading, refreshStats } = useStats();

  const statsCards = stats ? [
    {
      title: "Enrolled Courses",
      value: stats.coursesEnrolled?.length?.toString() || "0",
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      title: "Completed",
      value: stats.coursesCompleted?.length?.toString() || "0",
      icon: Award,
      color: "text-green-600"
    },
    {
      title: "Current Streak",
      value: "0", // Real streak calculation requires activity tracking API
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Certificates",
      value: stats.certificates?.length?.toString() || "0",
      icon: Target,
      color: "text-orange-600"
    }
  ] : [];
  
  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Crumb 
          current={{ title: "My Courses", link: "/learner/courses" }}
          previous={[{ title: "Dashboard", link: "/learner" }]}
        />
      </div>

      <div>
        <p className="font-bold text-2xl md:text-[32px]">My Courses</p>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.fname || 'Learner'}! Track your learning progress and discover new courses.
        </p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Click &quot;Enroll Now&quot; to add new courses to your learning dashboard. 
            Track your progress and access course materials anytime.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {!loading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {statsCards.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="h-12 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-5">
        <InProgressCourses />
        
        {/* All Available Courses with Enrollment */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Browse All Courses</h2>
          <CourseMapper onStatsUpdate={refreshStats} />
        </div>
      </div>
    </div>
  )
}
export default LearnerCourses;