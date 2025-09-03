// authProvider.tsx
"use client";

import { UserProvider, useUser } from "@/context/user-context";
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
  const { login } = useAuth();
  const { user } = useUser(); // Use the available user context
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If there's a token, we can assume user is logged in
      // The user context will handle fetching user data
      setHasDecided(true);
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
    <UserProvider>
      <AuthLogic>
        {children}
      </AuthLogic>
    </UserProvider>
  );
};