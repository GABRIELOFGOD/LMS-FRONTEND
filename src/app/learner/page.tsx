import LearnerProgress from "@/components/layout/learner/progress";
import RecommendedCourses from "@/components/layout/learner/recommended-courses";

const LearnerHome = () => {

  return (
    <div>
      <div className="flex flex-col gap-5">
        <p className="font-bold text-2xl md:text-[32px]">Welcome back, Sarah</p>

        <div className="mt-3 flex gap-5 flex-col">
          <p className="font-bold text-lg">Your Progress</p>
          <LearnerProgress />
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