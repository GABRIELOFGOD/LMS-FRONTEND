"use client";

import CourseMapper from "@/components/layout/courses/course-mapper";
import { useUser } from "@/context/user-context";

const Courses = () => {
  const { isLoggedIn } = useUser();

  return (
    <div>
      <div className="container mx-auto px-3 py-10">
        <div className="mb-8">
          <p className='text-2xl md:text-4xl font-bold'>
            {isLoggedIn ? `Browse All Courses` : 'Courses'}
          </p>
          <p className='text-foreground/50 text-sm mt-2'>
            {isLoggedIn 
              ? 'Discover new courses and continue your learning journey.'
              : 'Explore our courses and learn how to identify misinformation and disinformation.'
            }
          </p>
          {isLoggedIn && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Tip:</strong> For a better learning experience, visit your 
                <a href="/learner/courses" className="ml-1 underline font-semibold">personal dashboard</a> 
                to track progress and access enrolled courses.
              </p>
            </div>
          )}
        </div>
        <div className="mt-10">
          <CourseMapper />
        </div>
      </div>
    </div>
  )
}

export default Courses