"use client";

import Link from "next/link";
import Logo from "../ui/Logo";
import { Button } from "../ui/button";
import { UserIcon } from "lucide-react";
import { useUser } from "@/context/user-context";
import ThemeToggle from "../ui/ToggleTheme";

const Navbar = () => {
  const { user, isLoggedIn, isLoaded } = useUser();

  // Don't render until user context is loaded
  if (!isLoaded) {
    return (
      <div className="shadow-sm bg-background">
        <div className="w-full px-3 py-4 flex justify-between container md:px-0 mx-auto">
          <Logo />
          <div className="flex gap-10 my-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>
    );
  }

  // Explicitly check if user is logged in
  const userIsLoggedIn = isLoggedIn && user !== null;
  
  return (
    <div className="shadow-sm bg-background">
      <div className="w-full px-3 py-4 flex justify-between container md:px-0 mx-auto">
        <Logo />
        <div className="flex gap-10 my-auto">
          <div className="flex gap-5 my-auto">
            <div className="my-auto">
              <ThemeToggle />
            </div>
            
            {/* Render menu items based on login status */}
            {userIsLoggedIn ? (
              // Logged in user menu - only show essential items
              <>
                <Link href="/courses" className="capitalize text-sm my-auto font-semibold">
                  courses
                </Link>
                <Link href="/about" className="capitalize text-sm my-auto font-semibold">
                  About
                </Link>
                <Link href="/contact" className="capitalize text-sm my-auto font-semibold">
                  contact
                </Link>
              </>
            ) : (
              // Public menu - show all items
              <>
                <Link href="/" className="capitalize text-sm my-auto font-semibold">
                  Home
                </Link>
                <Link href="/courses" className="capitalize text-sm my-auto font-semibold">
                  courses
                </Link>
                <Link href="/about" className="capitalize text-sm my-auto font-semibold">
                  About
                </Link>
                <Link href="/contact" className="capitalize text-sm my-auto font-semibold">
                  contact
                </Link>
                <Link href="/login" className="capitalize text-sm my-auto font-semibold">
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
      </div>
    </div>
  )
}

export default Navbar