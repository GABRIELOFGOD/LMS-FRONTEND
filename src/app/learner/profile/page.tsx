import UserProfile from "@/components/layout/learner/profile/user-profile";
import LearnerProgress from "@/components/layout/learner/profile/learner-progress";
import UserBadges from "@/components/layout/learner/profile/user-badges";
import UserCertification from "@/components/layout/learner/profile/user-certification";

const LearnerProfile = () => {
  return (
    <div>
      <div className="flex flex-col gap-5 py-10">
        <UserProfile />
        <LearnerProgress />
        <UserBadges />
        <UserCertification />
      </div>
    </div>
  )
}
export default LearnerProfile;