"use client";

import { useCourse } from "@/hooks/useCourse";
import { isError } from "@/services/helper";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TableLoading from "../table-loading";
import { TbMoodEmpty } from "react-icons/tb";
import DeletedCourseCard from "@/components/layout/admin/courses/deleted-course-card";

const DeletedCoursesTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletedCourses, setDeletedCourses] = useState<Course[]>([]);

  const { getDeletedCourses } = useCourse();

  const fetchDeletedCourses = async () => {
    try {
      setIsLoading(true);
      const courses = await getDeletedCourses();
      
      // Ensure courses is an array and contains valid course objects
      if (Array.isArray(courses)) {
        const validCourses = courses
          .filter(course => course && typeof course === 'object' && course.id && course.title);
        setDeletedCourses(validCourses);
      } else {
        console.warn('DeletedCoursesTable - Courses is not an array:', courses);
        setDeletedCourses([]);
      }
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Failed to fetch deleted courses", error.message);
      } else {
        console.error("Unknown error", error);
        toast.error("Failed to fetch deleted courses");
      }
      setDeletedCourses([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Optimistic update: remove course from local state immediately when restored
  // This provides faster UI feedback without waiting for server response
  const handleCourseRestore = (courseId: string) => {
    try {
      setDeletedCourses(prevCourses => {
        const filtered = prevCourses.filter(course => course.id !== courseId);
        console.log(`Course ${courseId} restored and removed from deleted list. Remaining courses:`, filtered.length);
        return filtered;
      });
    } catch (error) {
      console.error('Error during optimistic course restoration:', error);
      // If optimistic update fails, refresh the whole list
      fetchDeletedCourses();
    }
  };

  useEffect(() => {
    fetchDeletedCourses();
  }, []);

  if (isLoading) {
    return (
      <TableLoading
        title="deleted courses"
      />
    )
  }
  
  return (
    <div>
      {deletedCourses.length < 1 ? 
      (<div className="w-full h-[200px] flex justify-center items-center gap-2">
          <TbMoodEmpty />
          <p>No deleted courses</p>
        </div>) :
      (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {deletedCourses.map((course) => (
            <DeletedCourseCard
              key={course.id}
              course={course}
              onCourseUpdate={fetchDeletedCourses} // Refresh the course list when needed
              onCourseRestore={handleCourseRestore} // Optimistic restore from local state
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DeletedCoursesTable;
