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
    <div className="bg-accent text-accent-foreground h-full w-full flex flex-col pt-6 px-4 gap-8">
      <div className="flex gap-3 items-center">
        <div className="h-10 w-10 bg-border rounded-full overflow-hidden relative flex-shrink-0">
          <Image
            src={Instructor}
            alt="Instructor Image"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-base truncate">{user?.fname || "Learner"}</p>
          <p className="text-foreground/70 text-sm font-medium truncate">
            {user?.fname ? `${user.fname}'s Dashboard` : "Level 1 learner"}
          </p>
        </div>
      </div>

      <nav className="flex flex-col space-y-2">
        {learnerNavigation.map(({ icon: Icon, id, path, label }) => (
          <Link
            key={id}
            href={path}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
              currentPath === path
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "hover:bg-border/50 text-foreground/80 hover:text-foreground"
            )}
          >
            <Icon 
              size={18} 
              className={cn(
                "transition-all duration-200",
                currentPath === path ? "text-primary-foreground" : "text-foreground/60 group-hover:text-foreground"
              )} 
            />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto mb-6">
        <Button
          className="w-full justify-start gap-3 bg-transparent hover:bg-destructive/10 hover:text-destructive border-destructive/20 text-foreground/80"
          variant="outline"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  )
}
export default LearnerSidebar;