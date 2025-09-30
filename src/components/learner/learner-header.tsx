"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LearnerHeaderProps {
  userName: string;
  onRefreshStats: () => void;
  loading: boolean;
}

export const LearnerHeader = ({ userName, onRefreshStats, loading }: LearnerHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground text-sm md:text-base">Continue your learning journey and achieve your goals.</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        <Button 
          variant="outline" 
          onClick={onRefreshStats} 
          disabled={loading}
          size="sm"
          className="w-full sm:w-auto"
        >
          {loading ? "Loading..." : "Refresh Stats"}
        </Button>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/learner/courses">Browse Courses</Link>
        </Button>
      </div>
    </div>
  );
};
