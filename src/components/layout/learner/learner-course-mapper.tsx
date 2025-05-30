"use client";

import { Course } from "@/types/course";
import MyCourseCard from "./my-course-card";
import { useEffect, useState } from "react";
import { useCourse } from "@/hooks/useCourse";

const LearnerCourseMapper = () => {
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
      <p className="font-bold text-xl mt-5">Completed Courses</p>
      <div className="mt-5 flex flex-col gap-5">
        {courses.slice(0, 2).map((course) => (
          <MyCourseCard
            key={course.id}
            course={course}
            isCompleted={true}
          />
        ))}
      </div>
    </div>
  )
}
export default LearnerCourseMapper;