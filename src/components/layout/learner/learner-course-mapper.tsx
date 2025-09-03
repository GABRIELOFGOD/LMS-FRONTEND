"use client";

import { Course } from "@/types/course";
import MyCourseCard from "./my-course-card";
import { useEffect, useState } from "react";
import { getUserCoursesFromStats } from "@/services/common";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";

const LearnerCourseMapper = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedCourses = async () => {
    try {
      setLoading(true);
      const courseData = await getUserCoursesFromStats();
      if (courseData) {
        setCourses(courseData.completedCourses);
      }
    } catch (error) {
      console.error("Error fetching completed courses:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  if (loading) {
    return (
      <div>
        <p className="font-bold text-xl mt-5">Completed Courses</p>
        <div className="mt-5 flex flex-col gap-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mt-5">
        <Award className="h-5 w-5 text-green-600" />
        <p className="font-bold text-xl">Completed Courses ({courses.length})</p>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <MyCourseCard
              key={course.id}
              course={course}
              isCompleted={true}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No completed courses yet</p>
            <p className="text-sm">Complete your first course to see it here!</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default LearnerCourseMapper;