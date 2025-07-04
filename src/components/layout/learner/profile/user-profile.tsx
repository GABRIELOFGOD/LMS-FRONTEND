"use client";

import Image from "next/image";
import { useGlobalContext } from "@/context/GlobalContext";
import User from "@/assets/hero-fc.png";
import { yearJoined } from "@/services/helper";

const UserProfile = () => {
  const { user } = useGlobalContext();

  return (
    <div className="flex flex-col gap-5">
      <p className="text-2xl md:text-3xl font-bold">My Profile</p>
      <div className="flex gap-5">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-accent">
          <Image src={User} alt="profile" width={100} height={100} />
        </div>
        <div className="my-auto">
          <p className="text-lg md:text-xl font-bold">{user?.fname} {user?.lname}</p>
          <p className="text-sm text-gray-500">Joined {yearJoined(user?.createdAt || "")}</p>
        </div>
      </div>
    </div>
  )
}
export default UserProfile;