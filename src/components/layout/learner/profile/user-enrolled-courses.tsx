"use client";

import { useCourse } from "@/hooks/useCourse";
import { Course } from "@/types/course";
import { useState, useEffect } from "react";
import ProfileCourseCard from "./profile-course-card";
import Link from "next/link";
import { useUser } from "@/context/user-context";

const UserEnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const { user } = useUser();

  const { getCourses } = useCourse();

  const fetchEnrolledCourses = async () => {
    try {
      const courses = await getCourses();
      
      // Ensure courses is an array and contains valid course objects
      if (Array.isArray(courses)) {
        const validCourses = courses
          .filter(course => course && typeof course === 'object' && course.id && course.title)
          .slice(0, 3);
        setEnrolledCourses(validCourses);
      } else {
        console.warn('UserEnrolledCourses - Courses is not an array:', courses);
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error('UserEnrolledCourses - Error fetching courses:', error);
      setEnrolledCourses([]);
    }
  }

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);
  
  return (
    <div>
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">
          {user?.fname ? `${user.fname}'s Enrolled Courses` : "Enrolled Courses"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledCourses.map((course) => (
            <Link
              href={`/courses/${course.id}`}
              key={course.id}
            >
              <ProfileCourseCard course={course} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserEnrolledCourses;