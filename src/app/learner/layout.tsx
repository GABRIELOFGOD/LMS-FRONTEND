"use client";

import LearnerSidebar from "@/components/layout/learner/learner-sidebar";
import LearnerNavbar from "@/components/layout/learner/learner-navbar";
import Footer from "@/components/layout/footer";
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
        router.push("/login");
        return;
      }
      
      if (user && user.role !== UserRole.STUDENT) {
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <LearnerNavbar />
      
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(true)}
          className="bg-background shadow-lg border-2"
        >
          <Menu size={16} />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative w-72 h-full bg-background shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b bg-accent">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <LearnerSidebar />
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-72 flex-shrink-0 border-r">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <LearnerSidebar />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LearnerLayout;
