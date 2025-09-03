"use client";

import Link from "next/link";
import Logo from "../../ui/Logo";
import { Button } from "../../ui/button";
import { UserIcon, LogOutIcon } from "lucide-react";
import { useUser } from "@/context/user-context";
import ThemeToggle from "../../ui/ToggleTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const LearnerNavbar = () => {
  const { user, refreshUser } = useUser();

  console.log('LearnerNavbar rendering - user:', user);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Refresh user context to update state
    refreshUser();
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <div className="shadow-sm bg-background border-b">
      <div className="w-full px-3 py-4 flex justify-between container md:px-0 mx-auto">
        <Logo />
        <div className="flex gap-10 my-auto">
          <div className="flex gap-5 my-auto">
            <div className="my-auto">
              <ThemeToggle />
            </div>
            
            {/* Learner-specific navigation items */}
            <Link href="/learner" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/learner/courses" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
              My Courses
            </Link>
            <Link href="/courses" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
              All Courses
            </Link>
          </div>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="w-8 h-8 rounded-full flex justify-center items-center my-auto"
                variant={"ghost"}
              >
                <UserIcon className="text-muted-foreground" size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/learner/profile" className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/learner/notification" className="flex items-center">
                  <span className="mr-2 h-4 w-4">🔔</span>
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center text-red-600 focus:text-red-600"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default LearnerNavbar;