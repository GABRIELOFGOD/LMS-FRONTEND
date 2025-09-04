"use client";

import { Course } from "@/types/course";
import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "../home/course-card";
import { useCourse } from "@/hooks/useCourse";

const RecommendedCourses = () => {
  const [slicedCourses, setSlicedCourses] = useState<Course[]>([]);

  const { getCourses } = useCourse();
  
  const gettingCourse = async () => {
    try {
      const courses = await getCourses();
      console.log('RecommendedCourses - Courses received:', courses);
      
      // Ensure courses is an array before slicing
      if (Array.isArray(courses)) {
        setSlicedCourses(courses.slice(0, 3));
      } else {
        console.warn('RecommendedCourses - Courses is not an array:', courses);
        setSlicedCourses([]);
      }
    } catch (error) {
      console.error('RecommendedCourses - Error fetching courses:', error);
      setSlicedCourses([]);
    }
  }
  
    useEffect(() => {
      gettingCourse();
    }, []);
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2 mt-5">
        {slicedCourses
          .filter(course => course && course.id && course.title) // Filter out invalid courses
          .map((course) => (
            <Link
              key={course.id}
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
export default RecommendedCourses;