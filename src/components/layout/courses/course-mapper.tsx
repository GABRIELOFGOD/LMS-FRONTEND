"use client";

import { useEffect, useState } from "react";
import CourseCard from "../home/course-card";
import Link from "next/link";
import { Course } from "@/types/course";
import { useCourse } from "@/hooks/useCourse";

const CourseMapper = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  const { getCourses } = useCourse();

  const gettingCourse = async () => {
    const courses = await getCourses();
    setAllCourses(courses);
  }
  
  useEffect(() => {
    gettingCourse();
  }, []);
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
        {allCourses.map((course, i) => (
          <Link
            key={i}
            href={`/course/${course.id}`}
          >
            <CourseCard
              course={course}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CourseMapper;