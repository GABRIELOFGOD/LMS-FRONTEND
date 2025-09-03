"use client";

import { useEffect, useState } from "react";
import CourseCard from "../home/course-card";
import EnhancedCourseCard from "./enhanced-course-card";
import Link from "next/link";
import { Course } from "@/types/course";
import { useCourse } from "@/hooks/useCourse";
import { useUser } from "@/context/user-context";
import { isError } from "@/services/helper";
import { toast } from "sonner";
import { TbHourglassEmpty } from "react-icons/tb";
import { Loader2 } from "lucide-react";

interface EnrollmentData {
  courseId: string;
  progress: number;
}

const CourseMapper = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isLoggedIn, isLoaded } = useUser();

  const { getAvailableCourses, getUserEnrollments, getCourseProgress } = useCourse();

  const gettingCourse = async () => {
    try {
      const courses = await getAvailableCourses();
      setAllCourses(courses);
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Failed to fetch courses", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  const getEnrollmentData = async () => {
    if (!isLoggedIn) return;
    
    try {
      const userEnrollments = await getUserEnrollments();
      const enrollmentData: EnrollmentData[] = [];
      
      // Get progress for each enrolled course
      for (const enrollment of userEnrollments) {
        const progress = await getCourseProgress(enrollment.courseId);
        enrollmentData.push({
          courseId: enrollment.courseId,
          progress: progress?.completionPercentage || 0
        });
      }
      
      setEnrollments(enrollmentData);
    } catch (error: unknown) {
      if (isError(error)) {
        console.error("Failed to fetch enrollment data", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    await gettingCourse();
    if (isLoggedIn) {
      await getEnrollmentData();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('CourseMapper - isLoaded:', isLoaded, 'isLoggedIn:', isLoggedIn);
    if (isLoaded) {
      loadData();
    }
  }, [isLoggedIn, isLoaded]);

  const isEnrolled = (courseId: string) => {
    return enrollments.some(enrollment => enrollment.courseId === courseId);
  };

  const getCourseProgressData = (courseId: string) => {
    const enrollment = enrollments.find(enrollment => enrollment.courseId === courseId);
    return enrollment?.progress || 0;
  };

  const handleEnrollmentUpdate = () => {
    // Refresh enrollment data when a user enrolls in a new course
    getEnrollmentData();
  };

  return (
    <div>
      {isLoading ? (
        <div className="w-full h-[250px] flex justify-center items-center gap-2">
          <Loader2 size={15} className="animate-spin" />
          <p className="text-sm font-bold my-auto text-gray-500">Loading courses...</p>
        </div>
      ) : allCourses.length < 1 ? (
        <div className="w-full h-[250px] flex justify-center items-center gap-2">
          <TbHourglassEmpty size={25} className="text-gray-500 my-auto" />
          <p className="text-sm font-bold my-auto text-gray-500">No courses available yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
          {allCourses.map((course, i) => (
            <div key={i}>
              {isLoggedIn ? (
                <EnhancedCourseCard
                  course={course}
                  isEnrolled={isEnrolled(course.id)}
                  progress={getCourseProgressData(course.id)}
                  onEnrollmentUpdate={handleEnrollmentUpdate}
                />
              ) : (
                <Link href={`/course/${course.id}`}>
                  <CourseCard course={course} />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseMapper;