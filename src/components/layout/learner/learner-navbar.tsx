"use client";

import Link from "next/link";
import Logo from "../../ui/Logo";
import { Button } from "../../ui/button";
import { UserIcon, LogOutIcon, Menu, X } from "lucide-react";
import { useUser } from "@/context/user-context";
import ThemeToggle from "../../ui/ToggleTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import Instructor from "@/assets/hero-fc.png";

const LearnerNavbar = () => {
  const { user, refreshUser } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Refresh user context to update state
    refreshUser();
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <div className="shadow-sm bg-background border-b relative">
      <div className="w-full px-3 py-4 flex justify-between items-center container md:px-0 mx-auto">
        <div className="bg-white rounded-lg p-1.5 shadow-lg">
          <Logo />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 my-auto">
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b shadow-lg z-50 md:hidden">
          <div className="container mx-auto px-3 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Profile Section */}
              <div className="flex gap-3 items-center p-3 bg-accent rounded-lg border">
                <div className="h-12 w-12 bg-border rounded-full overflow-hidden relative flex-shrink-0">
                  <Image
                    src={Instructor}
                    alt="Profile Image"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base truncate text-accent-foreground">
                    {user?.fname || "Learner"}
                  </p>
                  <p className="text-accent-foreground/70 text-sm font-medium truncate">
                    {user?.fname ? `${user.fname}'s Dashboard` : "Level 1 learner"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Navigation Links */}
              <Link 
                href="/learner" 
                className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/learner/courses" 
                className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Courses
              </Link>
              <Link 
                href="/courses" 
                className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Courses
              </Link>
              <Link 
                href="/learner/profile" 
                className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserIcon size={16} />
                Profile
              </Link>
              <Link 
                href="/learner/notification" 
                className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>🔔</span>
                Notifications
              </Link>
              <Button 
                variant="destructive" 
                className="w-full mt-2 flex items-center gap-2" 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOutIcon size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerNavbar;