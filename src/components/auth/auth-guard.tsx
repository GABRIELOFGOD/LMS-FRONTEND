"use client";

import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requiredRole?: string;
}

const AuthGuard = ({ 
  children, 
  fallback, 
  redirectTo = "/login",
  requiredRole 
}: AuthGuardProps) => {
  const { user, isLoggedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      console.log('AuthGuard - User not authenticated, redirecting to:', redirectTo);
      router.push(redirectTo);
    }
  }, [isLoaded, isLoggedIn, router, redirectTo]);

  useEffect(() => {
    if (isLoaded && isLoggedIn && requiredRole && user?.role !== requiredRole) {
      console.log('AuthGuard - User role mismatch. Required:', requiredRole, 'Actual:', user?.role);
      router.push("/unauthorized");
    }
  }, [isLoaded, isLoggedIn, user, requiredRole, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading state if user is being redirected
  if (!isLoggedIn) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requiredRole && user?.role !== requiredRole) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Insufficient permissions</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
