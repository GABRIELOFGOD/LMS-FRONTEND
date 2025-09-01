"use client";

import { useEffect, useState } from "react";
import CourseCard from "../home/course-card";
import Link from "next/link";
import { Course } from "@/types/course";
import { useCourse } from "@/hooks/useCourse";
import { isError } from "@/services/helper";
import { toast } from "sonner";
import { TbHourglassEmpty } from "react-icons/tb";
import { Loader2 } from "lucide-react";

const CourseMapper = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { getAvailableCourses } = useCourse();

  const gettingCourse = async () => {
    try {
      const courses = await getAvailableCourses();
      setAllCourses(courses);
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Login failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    gettingCourse();
  }, []);
  
  return (
    <div>
        {isLoading ? (
          <div className="w-full h-[250px] flex justify-center items-center gap-2">
            <Loader2 size={15} />
            <p className="text-sm font-bold my-auto text-gray-500">Please wait...</p>
          </div>
        ) : allCourses.length < 1 ? (
          <div className="w-full h-[250px] flex justify-center items-center gap-2">
            <TbHourglassEmpty size={25} className="text-gray-500 my-auto" />
            <p className="text-sm font-bold my-auto text-gray-500">No courses here yet, Sorry!</p>
          </div>
        ) : (
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
        )}
    </div>
  )
}

export default CourseMapper;