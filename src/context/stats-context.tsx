"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useUser } from "./user-context";

// Import getUserStats dynamically to avoid module loading issues
const getUserStatsAsync = async () => {
  try {
    const { getUserStats } = await import("@/services/common");
    return getUserStats;
  } catch (error) {
    console.error("Failed to import getUserStats:", error);
    return null;
  }
};

// Temporary inline UserStats interface to avoid import issues
interface UserStats {
  progress: unknown[]; // Progress tracking array
  certificates: unknown[]; // User certificates
  coursesCompleted: unknown[]; // Completed courses array
  coursesEnrolled: {
    id: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    isFree: boolean;
    publish: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }[]; // Enrolled courses array
  currentStraek: number; // Current streak (note: API has typo "Straek")
  longestStreak: number; // Longest streak
  trends?: {
    coursesThisMonth: string;
    completedThisMonth: string;
    remainingLessons: string;
    progressEncouragement: string;
  };
}

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

  const refreshStats = useCallback(async () => {
    if (!isLoggedIn) {
      setStats(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('StatsContext - Refreshing user stats...');
      
      // Use dynamic import to avoid module loading issues
      const getUserStats = await getUserStatsAsync();
      if (!getUserStats) {
        throw new Error("Failed to load getUserStats function");
      }
      
      const userStats = await getUserStats();
      if (userStats) {
        setStats(userStats);
        console.log('StatsContext - Stats updated:', userStats);
      } else {
        console.warn('StatsContext - No stats returned, setting to null');
        setStats(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error("StatsContext - Error fetching user stats:", error);
      
      // Don't clear stats on network errors, keep previous data
      if (!errorMessage.includes('network') && !errorMessage.includes('timeout')) {
        setStats(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  // Initial load when user context is ready
  useEffect(() => {
    if (isLoaded) {
      refreshStats();
    }
  }, [isLoaded, refreshStats]);

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
