"use client";

import LearnerProgress from "@/components/layout/learner/progress";
import RecommendedCourses from "@/components/layout/learner/recommended-courses";
import { useUser } from "@/context/user-context";

const LearnerHome = () => {
  const { user } = useUser();

  return (
    <div>
      <div className="flex flex-col gap-5">
        <p className="font-bold text-2xl md:text-[32px]">Welcome back, {user?.fname}</p>

        <div className="mt-3 flex gap-5 flex-col">
          <p className="font-bold text-lg">Your Progress</p>
          <LearnerProgress
            progress={33}
            label="Overall Progress"
          />
        </div>

        <div>
          <p className="text-lg font-bold">Recommended for you</p>
          <RecommendedCourses />
        </div>
      </div>
    </div>
  )
}
export default LearnerHome;