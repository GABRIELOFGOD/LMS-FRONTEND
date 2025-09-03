"use client";

import LearnerHeader from "@/components/layout/learner/learner-header";
import LearnerSidebar from "@/components/layout/learner/learner-sidebar";
import LearnerNavbar from "@/components/layout/learner/learner-navbar";
import { ReactNode, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";

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
    <div className="h-screen flex flex-col">
      {/* Learner-specific Navbar at the top */}
      <LearnerNavbar />
      
      {/* Main content area with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <LearnerSidebar />
        </div>
        <div className="px-3 md:px-5 h-full overflow-auto w-full">
          <LearnerHeader />
          {children}
        </div>
      </div>
    </div>
  )
}
export default LearnerLayout;