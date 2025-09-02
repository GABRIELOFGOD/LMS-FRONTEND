"use client";

import LearnerHeader from "@/components/layout/learner/learner-header";
import LearnerSidebar from "@/components/layout/learner/learner-sidebar";
import { ReactNode, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";

const LearnerLayout = ({
  children
}: {
  children: ReactNode
}) => {
  const { user } = useGlobalContext();
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
      <div className="h-full overflow-auto w-full">
        <LearnerHeader />
        <div className="px-3 md:px-5">
          {children}
        </div>
      </div>
    </div>
  )
}
export default LearnerLayout;