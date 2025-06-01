"use client";

import { GlobalContextProvider, useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { User, UserRole } from "@/types/user";
import { useRouter } from "next/navigation";
const WaitingForProfile = () => {
  return (
    <div className="flex items-center justify-center h-screen gap-3">
      <Loader2 className="animate-spin text-primary" size={20}/>
      <p className="text-sm font-bold text-muted-foreground">Loading...</p>
    </div>
  )
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasDecided, setHasDecided] = useState(false);
  const { getProfile } = useAuth();

  const router = useRouter();

  const gettingProfile = async () => {
    try {
      const data = await getProfile();
      console.log("Data: ", data);
      setHasDecided(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      gettingProfile();
    } else {
      setHasDecided(true);
      router.push("/login");
    }
  }, []);
  
  return (
    <GlobalContextProvider>
      {hasDecided ? children : <WaitingForProfile />}
    </GlobalContextProvider>
  );
};
