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
      <LearnerSidebar />
      <div className="px-3 h-full overflow-auto">
        <LearnerHeader />
        {children}
      </div>
    </div>
  )
}
export default LearnerLayout;