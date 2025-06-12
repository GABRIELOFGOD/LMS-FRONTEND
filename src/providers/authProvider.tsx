// authProvider.tsx
"use client";

import { GlobalContextProvider, useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const WaitingForProfile = () => {
  return (
    <div className="flex items-center justify-center h-screen gap-3">
      <Loader2 className="animate-spin text-primary" size={20}/>
      <p className="text-sm font-bold text-muted-foreground">Loading...</p>
    </div>
  )
}

// Separate the auth logic from the provider wrapper
const AuthLogic = ({ children }: { children: React.ReactNode }) => {
  const [hasDecided, setHasDecided] = useState(false);
  const { getProfile } = useAuth();
  const { setUser } = useGlobalContext(); // Now this will work
  const router = useRouter();

  const gettingProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data);
      setHasDecided(true);
    } catch (error) {
      console.log(error);
      setHasDecided(true); // Set to true even on error to prevent infinite loading
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
  
  return hasDecided ? <>{children}</> : <WaitingForProfile />;
};

// Main AuthProvider that wraps everything
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalContextProvider>
      <AuthLogic>
        {children}
      </AuthLogic>
    </GlobalContextProvider>
  );
};