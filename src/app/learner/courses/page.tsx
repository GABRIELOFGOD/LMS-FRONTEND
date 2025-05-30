import LearnerCourseMapper from "@/components/layout/learner/learner-course-mapper";
import InProgressCourses from "@/components/layout/learner/in-progress-courses";
const LearnerCourses = () => {
  
  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-2xl md:text-[32px]">My Courses</p>
      <div className="mt-5">
        <InProgressCourses />
        <LearnerCourseMapper />
      </div>
    </div>
  )
}
export default LearnerCourses;