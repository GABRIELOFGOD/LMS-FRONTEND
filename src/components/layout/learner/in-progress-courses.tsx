"use client";

import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { useCourse } from "@/hooks/useCourse";
import MyCourseCard from "./my-course-card";

const InProgressCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  const { getCourses } = useCourse();

  const gettingCourse = async () => {
    const courses = await getCourses();
    setCourses(courses);
  }

  useEffect(() => {
    gettingCourse();
  }, []);

  return (
    <div>
      <p className="font-bold text-xl mt-5">In Progress Courses</p>
      <div className="mt-5 flex flex-col gap-5">
        {courses.slice(2, 4).map((course) => (
          <MyCourseCard
            key={course.id}
            course={course}
            isCompleted={false}
          />
        ))}
      </div>
    </div>
  )
}

export default InProgressCourses