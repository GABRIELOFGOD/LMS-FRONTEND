"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserStats, UserStats } from "@/services/common";
import { useUser } from "./user-context";

interface StatsContextType {
  stats: UserStats | null;
  isLoading: boolean;
  refreshStats: () => Promise<void>;
  error: string | null;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, isLoaded } = useUser();

  const refreshStats = async () => {
    if (!isLoggedIn) {
      setStats(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('StatsContext - Refreshing user stats...');
      const userStats = await getUserStats();
      setStats(userStats);
      console.log('StatsContext - Stats updated:', userStats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error("StatsContext - Error fetching user stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load when user context is ready
  useEffect(() => {
    if (isLoaded) {
      refreshStats();
    }
  }, [isLoaded, isLoggedIn]);

  return (
    <StatsContext.Provider value={{
      stats,
      isLoading,
      refreshStats,
      error
    }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
