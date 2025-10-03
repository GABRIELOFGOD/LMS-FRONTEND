"use client";

import { Course } from "@/types/course";
import MyCourseCard from "./my-course-card";
import { useEffect, useState } from "react";
import { useStats } from "@/context/stats-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";

const LearnerCourseMapper = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { stats: userStats, isLoading: statsLoading } = useStats();

  const processCompletedCourses = () => {
    try {
      console.log('LearnerCourseMapper - Processing completed courses from stats...');
      console.log('LearnerCourseMapper - Raw stats data:', userStats);
      
      if (userStats && userStats.coursesCompleted) {
        // Use the same logic as other components - completed courses from stats
        if (Array.isArray(userStats.coursesCompleted)) {
          // For now, coursesCompleted returns an empty array from API
          // When backend implements this properly, this will work
          const completedCourses = userStats.coursesCompleted as Array<{
            id: string;
            title: string;
            description?: string;
            imageUrl?: string;
            createdAt?: string;
            updatedAt?: string;
            publish?: boolean;
            isFree?: boolean;
          }>;
          
          const validCourses = completedCourses
            .filter((course) => {
              // More robust validation
              const isValid = course && 
                typeof course === 'object' && 
                course.id && 
                course.title &&
                typeof course.title === 'string';
              
              if (!isValid) {
                console.warn('LearnerCourseMapper - Invalid course object:', course);
              }
              return isValid;
            })
            .map((course) => ({
              // Map API structure to Course type
              id: course.id,
              title: course.title,
              description: course.description || '',
              imageUrl: course.imageUrl || '',
              chapters: [], // Not available in API, default to empty array
              createdAt: course.createdAt || new Date().toISOString(),
              updatedAt: course.updatedAt || new Date().toISOString(),
              publish: course.publish !== undefined ? course.publish : true,
              isFree: course.isFree !== undefined ? course.isFree : false
            }));
          setCourses(validCourses);
          console.log('LearnerCourseMapper - Valid completed courses:', validCourses);
        } else {
          console.warn('LearnerCourseMapper - Completed courses is not an array:', userStats.coursesCompleted);
          setCourses([]);
        }
      } else {
        console.log('LearnerCourseMapper - No completed courses found');
        setCourses([]);
      }
    } catch (error) {
      console.error("Error processing completed courses:", error);
      setCourses([]);
    }
  }

  useEffect(() => {
    if (userStats) {
      processCompletedCourses();
    }
  }, [userStats]);

  if (statsLoading) {
    return (
      <div>
        <p className="font-bold text-xl mt-5">Completed Courses</p>
        <div className="mt-5 flex flex-col gap-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mt-5">
        <Award className="h-5 w-5 text-green-600" />
        <p className="font-bold text-xl">Completed Courses ({courses.length})</p>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <MyCourseCard
              key={course.id}
              course={course}
              isCompleted={true}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No completed courses yet</p>
            <p className="text-sm">Complete your first course to see it here!</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default LearnerCourseMapper;