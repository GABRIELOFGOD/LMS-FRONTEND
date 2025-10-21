"use client";

import { Badge } from "@/types/attachment";
import { useEffect, useState } from "react";
import BadgeCard from "./badge-card";
import { useUser } from "@/context/user-context";
import { useStats } from "@/context/stats-context";
import { getUserAchievements } from "@/data/badges";

const UserBadges = () => {
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const { user } = useUser();
  const { stats, isLoading } = useStats();

  useEffect(() => {
    if (stats?.coursesEnrolled) {
      // Generate badges dynamically based on completed courses
      const achievements = getUserAchievements(stats);
      setUserBadges(achievements.badges);
    } else {
      setUserBadges([]);
    }
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">Badges</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-5">
      <p className="text-lg md:text-xl font-bold">
        {user?.fname ? `${user.fname}'s Badges` : "Badges"}
      </p>
      
      {userBadges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {userBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            🏆
          </div>
          <p>No badges earned yet</p>
          <p className="text-sm mt-1">Complete courses to earn your first badge!</p>
        </div>
      )}
    </div>
  );
};

export default UserBadges;