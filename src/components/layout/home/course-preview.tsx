"use client";
import { courses } from "@/data/courses";
import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "./course-card";

const CoursePreview = () => {
  const [slicedCourses, setSlicedCourses] = useState<typeof courses>([]);

  useEffect(() => {
    setSlicedCourses(courses.slice(0, 3))
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