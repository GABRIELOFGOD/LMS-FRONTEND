"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "./course-card";
import { Course } from "@/types/course";
import { useCourse } from "@/hooks/useCourse";
import { Loader } from "lucide-react";

const CoursePreview = () => {
  const [slicedCourses, setSlicedCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);

  const { getAvailableCourses } = useCourse();

  const gettingCourse = async () => {
    try {
      const courses = await getAvailableCourses();
      console.log("[COURSES]: ", courses);
      
      // Ensure courses is an array and contains valid course objects
      if (Array.isArray(courses)) {
        const validCourses = courses
          .filter(course => course && typeof course === 'object' && course.id && course.title)
          .slice(0, 4);
        setSlicedCourses(validCourses);
      } else {
        console.warn('CoursePreview - Courses is not an array:', courses);
        setSlicedCourses([]);
      }
    } catch (error) {
      console.error('CoursePreview - Error fetching courses:', error);
      setSlicedCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  }

  useEffect(() => {
    gettingCourse();
  }, []);

  if (loadingCourses) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center gap-2">
        <Loader size={15} className="my-auto animate-spin" />
        <p className="my-auto text-sm">Loading courses</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="container mx-auto py-10 md:py-20 px-3">
        <p className="font-bold text-2xl md:text-4xl">You can learn anything informative here</p>
        {/* <p className="text-foreground/60 text-lg mt-3">Information is life, learn everything about information and fact-checking here.</p> */}
        <p className="text-foreground/60 text-lg mt-3">From critical skills to technical topics, Udemy supports your professional development.</p>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
            {slicedCourses.map((course, i) => (
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
      </div>
    </div>
  )
}

export default CoursePreview;