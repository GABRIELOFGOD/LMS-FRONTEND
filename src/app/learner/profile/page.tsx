import UserProfile from "@/components/layout/learner/profile/user-profile";
import LearnerProgress from "@/components/layout/learner/progress";
import UserEnrolledCourses from "@/components/layout/learner/profile/user-enrolled-courses";
import UserBadges from "@/components/layout/learner/profile/user-badges";
import UserCertification from "@/components/layout/learner/profile/user-certification";

const LearnerProfile = () => {
  return (
    <div>
      <div className="flex flex-col gap-5 py-10">
        <UserProfile />
        <div className="flex flex-col gap-5">
          <p className="text-lg md:text-xl font-bold">Progress</p>
          <LearnerProgress
            progress={33}
            label="Overall Progress"
          />
        </div>
        <UserEnrolledCourses />
        <UserBadges />
        <UserCertification />
      </div>
    </div>
  )
}
export default LearnerProfile;