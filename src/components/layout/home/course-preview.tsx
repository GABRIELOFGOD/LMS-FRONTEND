"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "./course-card";
import { Course } from "@/types/course";
import { useCourse } from "@/hooks/useCourse";

const CoursePreview = () => {
  const [slicedCourses, setSlicedCourses] = useState<Course[]>([]);

  const { getCourses } = useCourse();

  const gettingCourse = async () => {
    const courses = await getCourses();
    setSlicedCourses(courses.slice(0, 4));
  }

  useEffect(() => {
    gettingCourse();
  }, []);
  
  return (
    <div>
      <div className="container mx-auto py-10 md:py-20 px-3">
        <p className="font-bold text-2xl md:text-4xl">You can learn anything informative here</p>
        {/* <p className="text-foreground/60 text-lg mt-3">Information is life, learn everything about information and fact-checking here.</p> */}
        <p className="text-foreground/60 text-lg mt-3">From critical skills to technical topics, Udemy supports your professional development.</p>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
            {slicedCourses.map((course) => (
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
      </div>
    </div>
  )
}

export default CoursePreview;