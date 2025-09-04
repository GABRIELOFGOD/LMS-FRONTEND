"use client";

import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { getUserCoursesFromStats } from "@/services/common";
import MyCourseCard from "./my-course-card";
import { Skeleton } from "@/components/ui/skeleton";

const InProgressCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInProgressCourses = async () => {
    try {
      setLoading(true);
      const courseData = await getUserCoursesFromStats();
      console.log('InProgressCourses - Raw course data:', courseData);
      
      if (courseData && courseData.inProgressCourses) {
        // Ensure inProgressCourses is an array and contains valid course objects
        if (Array.isArray(courseData.inProgressCourses)) {
          const validCourses = courseData.inProgressCourses
            .filter(course => {
              // More robust validation
              const isValid = course && 
                typeof course === 'object' && 
                course.id && 
                course.title &&
                typeof course.title === 'string';
              
              if (!isValid) {
                console.warn('InProgressCourses - Invalid course object:', course);
              }
              return isValid;
            })
            .map(course => ({
              // Ensure all required fields are present
              id: course.id,
              title: course.title,
              description: course.description || '',
              imageUrl: course.imageUrl || '',
              chapters: course.chapters || [],
              createdAt: course.createdAt || '',
              updatedAt: course.updatedAt || '',
              publish: course.publish || false
            }));
          setCourses(validCourses);
          console.log('InProgressCourses - Valid courses:', validCourses);
        } else {
          console.warn('InProgressCourses - In progress courses is not an array:', courseData.inProgressCourses);
          setCourses([]);
        }
      } else {
        console.log('InProgressCourses - No in-progress courses found');
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching in-progress courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInProgressCourses();
  }, []);

  if (loading) {
    return (
      <div>
        <p className="font-bold text-xl mt-5">In Progress Courses</p>
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
      <p className="font-bold text-xl mt-5">In Progress Courses ({courses.length})</p>
      <div className="mt-5 flex flex-col gap-5">
        {courses.length > 0 ? (
          courses.map((course) => (
            <MyCourseCard
              key={course.id}
              course={course}
              isCompleted={false}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No courses in progress</p>
            <p className="text-sm">Start a new course to see your progress here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InProgressCourses