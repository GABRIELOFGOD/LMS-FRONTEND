"use client";

import LearnerCourseMapper from "@/components/layout/learner/learner-course-mapper";
import InProgressCourses from "@/components/layout/learner/in-progress-courses";
import { getUserStats } from "@/services/common";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Clock, Target } from "lucide-react";

interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  totalLessons: number;
  overallProgress: number;
}

const LearnerCourses = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const userStats = await getUserStats();
      if (userStats) {
        setStats(userStats);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsCards = stats ? [
    {
      title: "Enrolled Courses",
      value: stats.coursesEnrolled,
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      title: "Completed",
      value: stats.coursesCompleted,
      icon: Award,
      color: "text-green-600"
    },
    {
      title: "Lessons Done",
      value: `${stats.lessonsCompleted}/${stats.totalLessons}`,
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Overall Progress",
      value: `${stats.overallProgress}%`,
      icon: Target,
      color: "text-orange-600"
    }
  ] : [];
  
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-bold text-2xl md:text-[32px]">My Courses</p>
        <p className="text-muted-foreground mt-2">Track your learning progress and achievements</p>
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
        <LearnerCourseMapper />
      </div>
    </div>
  )
}
export default LearnerCourses;