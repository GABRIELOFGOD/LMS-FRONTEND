"use client";

import { useState, useEffect } from "react";
import { getUserCourses, UserCourseStats } from "@/services/common";
import ProfileCourseCard from "./profile-course-card";
import Link from "next/link";
import { useUser } from "@/context/user-context";

const UserEnrolledCourses = () => {
  const [userCourseData, setUserCourseData] = useState<UserCourseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const fetchEnrolledCourses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const courseData = await getUserCourses();
      setUserCourseData(courseData);
    } catch (error) {
      console.error('UserEnrolledCourses - Error fetching enrolled courses:', error);
      setUserCourseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">Enrolled Courses</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!userCourseData || !userCourseData.enrolledCourses) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">
          {user?.fname ? `${user.fname}'s Enrolled Courses` : "Enrolled Courses"}
        </p>
        <div className="text-center py-8 text-gray-500">
          <p>No enrolled courses found</p>
          <Link href="/courses" className="text-blue-600 hover:underline mt-2 inline-block">
            Browse available courses
          </Link>
        </div>
      </div>
    );
  }

  const enrolledCourses = userCourseData.enrolledCourses.slice(0, 6); // Show up to 6 courses

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-lg md:text-xl font-bold">
          {user?.fname ? `${user.fname}'s Enrolled Courses` : "Enrolled Courses"}
        </p>
        {userCourseData.enrolledCourses.length > 6 && (
          <Link href="/learner/courses" className="text-blue-600 hover:underline text-sm">
            View all ({userCourseData.enrolledCourses.length})
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrolledCourses.map((course) => (
          <Link
            href={`/learner/courses/${course.id}`}
            key={course.id}
          >
            <ProfileCourseCard course={course} />
          </Link>
        ))}
      </div>

      {enrolledCourses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You haven&apos;t enrolled in any courses yet</p>
          <Link href="/courses" className="text-blue-600 hover:underline mt-2 inline-block">
            Browse available courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserEnrolledCourses;