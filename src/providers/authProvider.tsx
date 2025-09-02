// authProvider.tsx
"use client";

import { useUser } from "@/context/user-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SimpleLoader from "@/components/simple-loader";

const WaitingForProfile = () => {
  return (
    <div className="flex items-center justify-center h-screen gap-3">
      <SimpleLoader />
      <p className="text-sm font-bold text-muted-foreground">Loading...</p>
    </div>
  )
}

// Auth logic component
const AuthLogic = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      // If user is not authenticated, redirect to login
      router.push("/login");
    } else if (user && user.role !== "admin") {
      // If user is not admin, redirect back
      router.back();
    }
  }, [user, isLoaded, router]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return <WaitingForProfile />;
  }

  // If user is not authenticated, don't render children
  if (!user) {
    return null;
  }

  // If user is not admin, don't render children
  if (user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
};

// Main AuthProvider that wraps everything
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLogic>
      {children}
    </AuthLogic>
  );
};