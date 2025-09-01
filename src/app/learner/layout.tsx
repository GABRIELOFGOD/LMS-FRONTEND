"use client";

import LearnerHeader from "@/components/layout/learner/learner-header";
import LearnerSidebar from "@/components/layout/learner/learner-sidebar";
import { ReactNode, useEffect } from "react";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";

const LearnerLayout = ({
  children
}: {
  children: ReactNode
}) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role !== UserRole.STUDENT) {
        router.push("/");
      }
    }
  }, []);
  
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