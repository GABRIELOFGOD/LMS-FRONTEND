"use client";

import { ReactNode, useEffect } from "react";
import Crumb from "@/components/Crumb";
import { AuthProvider } from "@/providers/authProvider";
import { useUser } from "@/context/user-context";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const DashboardLayoutContent = ({ children }: { children: ReactNode }) => {
  const { user, isLoggedIn, isLoaded, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    // Use the proper logout function that clears all data
    logout();
    // Redirect to home page
    window.location.href = "/";
  };

  useEffect(() => {
    if (isLoaded) {
      if (!isLoggedIn) {
        console.log('DashboardLayout - User not logged in, redirecting to login');
        router.push("/login");
        return;
      }
      
      if (user && user.role !== UserRole.ADMIN && user.role !== UserRole.TEACHER) {
        console.log('DashboardLayout - User role mismatch, redirecting to appropriate dashboard');
        // Redirect students to learner dashboard
        if (user.role === UserRole.STUDENT) {
          router.push("/learner");
        } else {
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
  if (!isLoggedIn || (user && user.role !== UserRole.ADMIN && user.role !== UserRole.TEACHER)) {
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
    <div className="min-h-screen">
      <header className="flex h-12 md:h-14 shrink-0 items-center gap-2 border-b bg-background">
        <div className="flex flex-1 items-center gap-2 px-3 md:px-4">
          <Crumb
            current={{
              title: user?.role === UserRole.ADMIN ? "Admin Dashboard" : "Dashboard",
              link: "/dashboard",
            }}
          />
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 md:px-4">
          {/* User Profile and Logout */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {user?.fname?.[0]?.toUpperCase() || 'U'}{user?.lname?.[0]?.toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">
                    {user?.fname} {user?.lname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role === UserRole.ADMIN ? 'Administrator' : 'Teacher'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="p-3 md:p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
};

const DashboardLayout = ({ children }: {
  children: ReactNode
}) => {
  return (
    <AuthProvider>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </AuthProvider>
  )
}

export default DashboardLayout;