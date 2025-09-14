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
      
      // Check if the response is an error object with a message
      if (gottenCourse && typeof gottenCourse === 'object' && 'message' in gottenCourse && !Array.isArray(gottenCourse)) {
        throw new Error((gottenCourse as { message: string }).message);
      }
      
      console.log('CoursesTable - Raw courses from getCourses:', gottenCourse);
      
      // Ensure gottenCourse is an array and contains valid course objects
      if (Array.isArray(gottenCourse)) {
        const validCourses = gottenCourse
          .filter(course => course && typeof course === 'object' && course.id && course.title)
          // Double-check: filter out any courses with isDeleted = true (safety net)
          .filter(course => !course.isDeleted);
        
        console.log('CoursesTable - Final active courses:', validCourses.length, validCourses);
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

  // Optimistic update: remove course from local state immediately
  // This provides faster UI feedback without waiting for server response
  const handleCourseDelete = (courseId: string) => {
    try {
      setCourses(prevCourses => {
        const filtered = prevCourses.filter(course => course.id !== courseId);
        console.log(`Course ${courseId} removed from local state. Remaining courses:`, filtered.length);
        return filtered;
      });
    } catch (error) {
      console.error('Error during optimistic course removal:', error);
      // If optimistic update fails, refresh the whole list
      gettingAllCourses();
    }
  };

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
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {courses.map((course) => (
            <AdminCourseCard
              key={course.id} // Use course.id instead of index for better React key
              course={course}
              onCourseUpdate={gettingAllCourses} // Refresh the course list when a course is updated
              onCourseDelete={handleCourseDelete} // Optimistic delete from local state
            />
          ))}
        </div>
      )}
    </div>
  )
}
export default CoursesTable;