"use client";

import Image from "next/image";
import Instructor from "@/assets/hero-fc.png";
import { Bell, Home, LogOut, User2, Videotape } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user-context";

const LearnerSidebar = () => {
  const currentPath = usePathname();
  const { user } = useUser();
  
  const learnerNavigation = [
    {
      id: 1,
      label: "Dashboard",
      path: "/learner",
      icon: Home
    },
    {
      id: 2,
      label: "My Courses",
      path: "/learner/courses",
      icon: Videotape
    },
    {
      id: 3,
      label: "Profile",
      path: "/learner/profile",
      icon: User2
    },
    {
      id: 4,
      label: "Notification",
      path: "/learner/notification",
      icon: Bell
    },
  ]
  
  return (
    <div className="md:bg-accent bg-background text-accent-foreground h-full w-72 absolute md:relative md:l-0 transition-all duration-300 md:pt-10 md:pl-10 flex flex-col gap-10">
      <div className="flex gap-3">
        <div className="h-10 w-10 bg-border rounded-full overflow-hidden relative my-auto">
          <Image
            src={Instructor}
            alt="Instructor Image"
            fill
            className="object-bottom rounded-full w-full h-full relative"
          />
        </div>
        <div className="my-auto">
          <p className="font-bold">{user?.fname || "Learner"}</p>
          <p className="text-foreground/50 text-sm font-semibold">
            {user?.fname ? `${user.fname}'s Dashboard` : "Level 1 learner"}
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {
          learnerNavigation.map(({
            icon: Icon,
            id, path, label
          }) => (
            <Link
              key={id}
              href={path}
              className={cn("flex gap-3 w-full px-3 py-2 rounded-l-md",
                currentPath === path && "bg-border text-primary font-bold"
              )}
            >
              <Icon size={currentPath === path ? 18 : 15} className={cn("my-auto transition-all duration-200",)} />
              <p className="my-auto">{label}</p>
            </Link>
          ))
        }
      </div>

      <Button
        className="mt-auto flex gap-3 mb-10 bg-transparent hover:bg-destructive/50"
        variant={"outline"}
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        <LogOut className="my-auto" />
        Logout
      </Button>

    </div>
  )
}
export default LearnerSidebar;