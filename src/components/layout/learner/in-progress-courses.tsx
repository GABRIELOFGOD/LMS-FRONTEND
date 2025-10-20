"use client";

import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { useStats } from "@/context/stats-context";
import MyCourseCard from "./my-course-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/user-context";

const InProgressCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { courseProgress } = useUser();
  const { stats: userStats, isLoading: statsLoading } = useStats();

  const processInProgressCourses = () => {
    try {
      console.log('InProgressCourses - Processing enrolled courses from stats...');
      console.log('InProgressCourses - Raw stats data:', userStats);
      
      if (userStats && userStats.coursesEnrolled) {
        // Use the same logic as the main learner dashboard - enrolled courses are "in progress"
        if (Array.isArray(userStats.coursesEnrolled)) {
          const validCourses = userStats.coursesEnrolled
            .filter(course => {
              // More robust validation
              const isValid = course.course && 
                typeof course.course === 'object' && 
                course.course.id && 
                course.course.title &&
                typeof course.course.title === 'string';
              
              if (!isValid) {
                console.warn('InProgressCourses - Invalid course object:', course);
              }
              return isValid;
            })
            .map(course => ({
              // Map API course structure to Course type
              id: course.course.id,
              title: course.course.title,
              description: course.course.description || '',
              imageUrl: course.course.imageUrl || '',
              chapters: [], // Not available in API, default to empty array
              createdAt: course.course.createdAt || new Date().toISOString(),
              updatedAt: course.course.updatedAt || new Date().toISOString(),
              publish: course.course.publish !== undefined ? course.course.publish : true,
              isFree: course.course.isFree !== undefined ? course.course.isFree : false
            }));
          setCourses(validCourses);
          console.log('InProgressCourses - Valid enrolled courses:', validCourses);
        } else {
          console.warn('InProgressCourses - Enrolled courses is not an array:', userStats.coursesEnrolled);
          setCourses([]);
        }
      } else {
        console.log('InProgressCourses - No enrolled courses found');
        setCourses([]);
      }
    } catch (error) {
      console.error("Error processing enrolled courses:", error);
      setCourses([]);
    }
  }

  useEffect(() => {
    if (userStats) {
      processInProgressCourses();
    }
  }, [userStats]);

  if (statsLoading) {
    return (
      <div>
        <p className="font-bold text-xl mt-5">My Enrolled Courses</p>
        <div className="mt-5 flex flex-col gap-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Filter out completed courses - they should only show in the dedicated completed section
  const inProgressCourses = courses.filter(course => {
    const courseProgressData = courseProgress.get(course.id);
    return !courseProgressData?.isCompleted; // Only show non-completed courses
  });

  return (
    <div>
      <p className="font-bold text-xl mt-5">My Enrolled Courses ({inProgressCourses.length})</p>
      <div className="mt-5 flex flex-col gap-5">
        {inProgressCourses.length > 0 ? (
          inProgressCourses.map((course) => {
            // Check if course is completed from context
            const courseProgressData = courseProgress.get(course.id);
            const isCompleted = courseProgressData?.isCompleted || false;
            
            return (
              <MyCourseCard
                key={course.id}
                course={course}
                isCompleted={isCompleted}
              />
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium mb-2">
              {courses.length > 0 ? "All courses completed!" : "No enrolled courses yet"}
            </p>
            <p className="text-sm">
              {courses.length > 0 
                ? "Great job! Check your completed courses above." 
                : "Enroll in a course to start your learning journey."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InProgressCourses