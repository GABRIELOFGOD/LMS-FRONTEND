"use client";

import Link from "next/link";
import Logo from "../ui/Logo";
import { Button } from "../ui/button";
import { UserIcon, Menu, X } from "lucide-react";
import { useUser } from "@/context/user-context";
import ThemeToggle from "../ui/ToggleTheme";
import { useState } from "react";

const Navbar = () => {
  const { user, isLoggedIn, isLoaded } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't render until user context is loaded
  if (!isLoaded) {
    return (
      <div className="shadow-sm bg-background">
        <div className="w-full px-3 py-4 flex justify-between container md:px-0 mx-auto">
          <div className="bg-white rounded-lg p-1.5 shadow-lg">
            <Logo />
          </div>
          <div className="flex gap-4 my-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>
    );
  }

  // Explicitly check if user is logged in
  const userIsLoggedIn = isLoggedIn && user !== null;
  
  return (
    <div className="shadow-sm bg-background relative w-full">
      <div className="w-full px-3 py-4 flex justify-between items-center">
        <div className="bg-white rounded-lg p-1.5 shadow-lg">
          <Logo />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 my-auto">
          <div className="flex gap-5 my-auto">
            <div className="my-auto">
              <ThemeToggle />
            </div>
            
            {/* Render menu items based on login status */}
            {userIsLoggedIn ? (
              // Logged in user menu - only show essential items
              <>
                <Link href="/courses" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
                  courses
                </Link>
                <Link href="/about" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
                  About
                </Link>
                <Link href="/contact" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
                  contact
                </Link>
              </>
            ) : (
              // Public menu - show all items
              <>
                <Link href="/" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/courses" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
                  courses
                </Link>
                <Link href="/about" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
                  About
                </Link>
                <Link href="/contact" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
                  contact
                </Link>
                <Link href="/login" className="capitalize text-sm my-auto font-semibold hover:text-primary transition-colors">
                  Login
                </Link>
              </>
            )}
          </div>
          
          {/* Show Get Started button or User Profile */}
          {userIsLoggedIn ? (
            <Button
              className="w-8 h-8 rounded-full flex justify-center items-center my-auto"
              variant={"ghost"}
            >
              <Link href={"/learner/profile"}>
                <UserIcon className="text-muted-foreground" size={20} />
              </Link>
            </Button>
          ) : (
            <Button className="my-auto">
              <Link href={"/register"}>Get Started</Link>
            </Button>
          )}
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
        <div className="absolute top-full left-0 right-0 bg-background border-b shadow-lg z-50 md:hidden w-full">
          <div className="w-full px-3 py-4">
            <div className="flex flex-col space-y-4">
              {/* Navigation Links */}
              {userIsLoggedIn ? (
                <>
                  <Link 
                    href="/courses" 
                    className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    courses
                  </Link>
                  <Link 
                    href="/about" 
                    className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    contact
                  </Link>
                  <Link 
                    href="/learner/profile" 
                    className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2 flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon size={16} />
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/" 
                    className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/courses" 
                    className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    courses
                  </Link>
                  <Link 
                    href="/about" 
                    className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    contact
                  </Link>
                  <Link 
                    href="/login" 
                    className="capitalize text-sm font-semibold hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Button className="w-full mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href={"/register"}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar