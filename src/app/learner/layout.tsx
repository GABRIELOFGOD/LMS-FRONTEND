import LearnerHeader from "@/components/layout/learner/learner-header";
import LearnerSidebar from "@/components/layout/learner/learner-sidebar";
import { ReactNode } from "react";

const LearnerLayout = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <div className="h-screen flex">
      <div className="hidden md:flex">
        <LearnerSidebar />
      </div>
      <div className="px-3 md:px-5 h-full overflow-auto w-full">
        <LearnerHeader />
        {children}
      </div>
    </div>
  )
}
export default LearnerLayout;