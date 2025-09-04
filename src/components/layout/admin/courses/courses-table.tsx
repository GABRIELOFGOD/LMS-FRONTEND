"use client";

import { useCourse } from "@/hooks/useCourse";
import { isError } from "@/services/helper";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TableLoading from "../table-loading";
import { TbMoodEmpty } from "react-icons/tb";
import AdminCourseCard from "./admin-course-card";

const CoursesTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);

  const { getCourses } = useCourse();

  const gettingAllCourses = async () => {
    try {
      const gottenCourse = await getCourses();
      if (gottenCourse.message) throw new Error(gottenCourse.message);
      
      // Ensure gottenCourse is an array and contains valid course objects
      if (Array.isArray(gottenCourse)) {
        const validCourses = gottenCourse
          .filter(course => course && typeof course === 'object' && course.id && course.title);
        setCourses(validCourses);
      } else {
        console.warn('CoursesTable - Courses is not an array:', gottenCourse);
        setCourses([]);
      }
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Login failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    gettingAllCourses();
  }, []);

  if (isLoading) {
    return (
      <TableLoading
        title="courses"
      />
    )
  }
  
  return (
    <div>
      {courses.length < 1 ? 
      (<div className="w-full h-[200px] flex justify-center items-center gap-2">
          <TbMoodEmpty />
          <p>No course yet</p>
        </div>) :
      (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {courses.map((course, i) => (
            <AdminCourseCard
              key={i}
              course={course}
            />
          ))}
        </div>
      )}
    </div>
  )
}
export default CoursesTable;