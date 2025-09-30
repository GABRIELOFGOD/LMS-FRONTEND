"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";

interface User {
  fname?: string;
  lname?: string;
  bio?: string;
  avatar?: string;
  profileImage?: string;
  createdAt?: string;
}

interface UserProfileProps {
  user: User | null;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-12 w-12 md:h-16 md:w-16">
            <AvatarImage src={user?.avatar || user?.profileImage || ""} alt={user?.fname || 'User'} />
            <AvatarFallback className="text-sm md:text-lg">{user?.fname?.[0] || 'L'}{user?.lname?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg md:text-xl font-semibold">{user?.fname} {user?.lname}</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {user?.bio || "Welcome to your learning dashboard!"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <CalendarDays className="h-3 w-3 md:h-4 md:w-4" />
            <span>
              Learning since {user?.createdAt 
                ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })
                : 'recently'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
