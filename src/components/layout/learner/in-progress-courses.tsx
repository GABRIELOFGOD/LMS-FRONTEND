"use client";

import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { getUserCoursesFromStats } from "@/services/common";
import MyCourseCard from "./my-course-card";
import { Skeleton } from "@/components/ui/skeleton";

const InProgressCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInProgressCourses = async () => {
    try {
      setLoading(true);
      const courseData = await getUserCoursesFromStats();
      if (courseData) {
        setCourses(courseData.inProgressCourses);
      }
    } catch (error) {
      console.error("Error fetching in-progress courses:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInProgressCourses();
  }, []);

  if (loading) {
    return (
      <div>
        <p className="font-bold text-xl mt-5">In Progress Courses</p>
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
      <p className="font-bold text-xl mt-5">In Progress Courses ({courses.length})</p>
      <div className="mt-5 flex flex-col gap-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <MyCourseCard
              key={course.id}
              course={course}
              isCompleted={false}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No courses in progress</p>
            <p className="text-sm">Start a new course to see your progress here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InProgressCourses