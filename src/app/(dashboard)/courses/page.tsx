"use client";

import CourseMapper from "@/components/layout/courses/course-mapper";
import Crumb from "@/components/Crumb";
import { useUser } from "@/context/user-context";

const Courses = () => {
  const { isLoggedIn, user } = useUser();

  return (
    <div>
      <div className="container mx-auto px-3 py-10">
        {/* Breadcrumb for logged-in users */}
        {isLoggedIn && (
          <div className="mb-6">
            <Crumb 
              current={{ title: "All Courses", link: "/courses" }}
              previous={[{ title: "Dashboard", link: "/learner" }]}
            />
          </div>
        )}
        
        <div className="mb-8">
          <p className='text-2xl md:text-4xl font-bold'>
            {isLoggedIn ? `Browse All Courses` : 'Courses'}
          </p>
          <p className='text-foreground/50 text-sm mt-2'>
            {isLoggedIn 
              ? `Welcome back, ${user?.fname || 'Learner'}! Discover new courses and continue your learning journey.`
              : 'Explore our courses and learn how to identify misinformation and disinformation.'
            }
          </p>
          {isLoggedIn && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Tip:</strong> Click "Enroll Now" to add courses to your learning dashboard. 
                Track your progress and access course materials anytime from your dashboard.
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