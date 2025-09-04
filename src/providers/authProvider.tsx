// authProvider.tsx
"use client";

import { UserProvider } from "@/context/user-context";
import { useEffect, useState } from "react";
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Validate token format and expiration if it's a JWT
      try {
        // Simple JWT validation - check if it has 3 parts
        const parts = token.split('.');
        if (parts.length === 3) {
          // Decode payload to check expiration
          const payload = JSON.parse(atob(parts[1]));
          const now = Date.now() / 1000;
          
          if (payload.exp && payload.exp < now) {
            // Token expired
            console.log('AuthProvider - Token expired, clearing storage');
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          } else {
            // Token is valid
            setHasDecided(true);
          }
        } else {
          // Invalid token format
          setHasDecided(true);
        }
      } catch (error) {
        // Not a valid JWT or parsing error, but let user context handle validation
        console.log('AuthProvider - Token validation error:', error);
        setHasDecided(true);
      }
    } else {
      setHasDecided(true);
      // Don't auto-redirect to login, let components handle this
    }
  }, [router]);
  
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