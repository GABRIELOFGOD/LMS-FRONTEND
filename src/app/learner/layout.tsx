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
  const { user, isLoggedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!isLoggedIn) {
        console.log('LearnerLayout - User not logged in, redirecting to login');
        router.push("/login");
        return;
      }
      
      if (user && user.role !== UserRole.STUDENT) {
        console.log('LearnerLayout - User role mismatch, redirecting to appropriate dashboard');
        // Redirect based on actual role
        switch (user.role) {
          case UserRole.ADMIN:
            router.push("/admin");
            break;
          case UserRole.TEACHER:
            router.push("/dashboard");
            break;
          default:
            router.push("/");
        }
      }
    }
  }, [isLoaded, isLoggedIn, user, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated or wrong role
  if (!isLoggedIn || (user && user.role !== UserRole.STUDENT)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }
  
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