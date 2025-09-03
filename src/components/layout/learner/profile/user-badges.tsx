"use client";

import { badges } from "@/data/badges";
import { Badge } from "@/types/attachment";
import { useEffect, useState } from "react";
import BadgeCard from "./badge-card";
import { useUser } from "@/context/user-context";

const UserBadges = () => {
  const [userBadges, setBadges] = useState<Badge[]>([]);
  const { user } = useUser();

  useEffect(() => {
    setBadges(badges);
  }, []);
  
  return (
    <div>
      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-xl font-bold">
          {user?.fname ? `${user.fname}'s Badges` : "Badges"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {userBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserBadges;