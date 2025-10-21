"use client";

import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { useStats } from "@/context/stats-context";
import MyCourseCard from "./my-course-card";
import { Skeleton } from "@/components/ui/skeleton";

const InProgressCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { stats: userStats, isLoading: statsLoading } = useStats();

  const processInProgressCourses = () => {
    try {
      console.log('InProgressCourses - Processing enrolled courses from stats...');
      console.log('InProgressCourses - Raw stats data:', userStats);
      
      if (userStats && userStats.coursesEnrolled) {
        // Use the same logic as the main learner dashboard - enrolled courses are "in progress"
        if (Array.isArray(userStats.coursesEnrolled)) {
          const validCourses = userStats.coursesEnrolled
            .filter(enrollment => {
              // More robust validation
              const isValid = enrollment.course && 
                typeof enrollment.course === 'object' && 
                enrollment.course.id && 
                enrollment.course.title &&
                typeof enrollment.course.title === 'string';
              
              if (!isValid) {
                console.warn('InProgressCourses - Invalid course object:', enrollment);
                return false;
              }
              
              // Filter out completed courses (where all chapters are done)
              // Backend has typo: uses "comppletedChapters" instead of "completedChapters"
              const completedChapters = enrollment.comppletedChapters?.length || 0;
              const isCompleted = completedChapters > 0;
              
              return !isCompleted; // Only include in-progress courses
            })
            .map(enrollment => ({
              // Map API course structure to Course type
              id: enrollment.course.id,
              title: enrollment.course.title,
              description: enrollment.course.description || '',
              imageUrl: enrollment.course.imageUrl || '',
              chapters: [], // Not available in API, default to empty array
              createdAt: enrollment.course.createdAt || new Date().toISOString(),
              updatedAt: enrollment.course.updatedAt || new Date().toISOString(),
              publish: enrollment.course.publish !== undefined ? enrollment.course.publish : true,
              isFree: enrollment.course.isFree !== undefined ? enrollment.course.isFree : false
            }));
          setCourses(validCourses);
          console.log('InProgressCourses - Valid in-progress courses:', validCourses);
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

  // Courses are already filtered in processInProgressCourses
  const inProgressCourses = courses;

  return (
    <div>
      <p className="font-bold text-xl mt-5">My Enrolled Courses ({inProgressCourses.length})</p>
      <div className="mt-5 flex flex-col gap-5">
        {inProgressCourses.length > 0 ? (
          inProgressCourses.map((course) => {
            return (
              <MyCourseCard
                key={course.id}
                course={course}
                isCompleted={false}
              />
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium mb-2">
              No in-progress courses
            </p>
            <p className="text-sm">
              Enroll in a course to start your learning journey, or check your completed courses above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InProgressCourses