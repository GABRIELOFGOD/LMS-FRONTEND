"use client";

import Navbar from "@/components/layout/Navbar";
import LearnerSidebar from "@/components/layout/learner/learner-sidebar";
import { ReactNode, useEffect } from "react";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import SimpleLoader from "@/components/simple-loader";

const LearnerLayout = ({
  children
}: {
  children: ReactNode
}) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login");
    } else if (user && user.role !== UserRole.STUDENT) {
      router.push("/");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center gap-2">
        <SimpleLoader />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Using the original navbar */}
      <Navbar />
      
      {/* Main content area */}
      <div className="flex flex-1">
        <div className="hidden md:flex">
          <LearnerSidebar />
        </div>
        <div className="px-3 md:px-5 flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
export default LearnerLayout;