"use client";

import { useCourse } from "@/hooks/useCourse";
import { Course } from "@/types/course";
import { useState, useEffect } from "react";
import ProfileCourseCard from "./profile-course-card";
import Link from "next/link";
const UserEnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  const { getCourses } = useCourse();

  const fetchEnrolledCourses = async () => {
    const courses = await getCourses();
    setEnrolledCourses(courses.slice(0, 3));
  }

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);
  
  return (
    <div>
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">Enrolled Courses</p>
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