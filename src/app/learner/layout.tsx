"use client";

import LearnerHeader from "@/components/layout/learner/learner-header";
import LearnerSidebar from "@/components/layout/learner/learner-sidebar";
import LearnerNavbar from "@/components/layout/learner/learner-navbar";
import { ReactNode, useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const LearnerLayout = ({
  children
}: {
  children: ReactNode
}) => {
  const { user, isLoggedIn, isLoaded } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            router.push("/dashboard");
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
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <LearnerSidebar />
        </div>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sidebar */}
            <div className="relative w-72 h-full">
              <LearnerSidebar />
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Sidebar Toggle + Header */}
          <div className="md:hidden flex items-center gap-2 p-3 border-b bg-background">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2"
            >
              <Menu size={20} />
            </Button>
            <div className="flex-1">
              <LearnerHeader />
            </div>
          </div>

          {/* Desktop Header + Content */}
          <div className="hidden md:block px-3 md:px-5">
            <LearnerHeader />
          </div>
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto px-3 md:px-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
export default LearnerLayout;