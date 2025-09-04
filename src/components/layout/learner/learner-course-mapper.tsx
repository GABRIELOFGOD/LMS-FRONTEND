"use client";

import { Course } from "@/types/course";
import MyCourseCard from "./my-course-card";
import { useEffect, useState } from "react";
import { getUserCoursesFromStats } from "@/services/common";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";

const LearnerCourseMapper = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedCourses = async () => {
    try {
      setLoading(true);
      const courseData = await getUserCoursesFromStats();
      console.log('LearnerCourseMapper - Raw course data:', courseData);
      
      if (courseData && courseData.completedCourses) {
        // Ensure completedCourses is an array and contains valid course objects
        if (Array.isArray(courseData.completedCourses)) {
          const validCourses = courseData.completedCourses
            .filter(course => {
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
          console.log('LearnerCourseMapper - Valid courses:', validCourses);
        } else {
          console.warn('LearnerCourseMapper - Completed courses is not an array:', courseData.completedCourses);
          setCourses([]);
        }
      } else {
        console.log('LearnerCourseMapper - No completed courses found');
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching completed courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  if (loading) {
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