"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, LucideIcon } from "lucide-react";

interface Stat {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: string;
}

interface StatsGridProps {
  stats: Stat[];
  loading: boolean;
}

export const StatsGrid = ({ stats, loading }: StatsGridProps) => {
  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-16 md:w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 md:h-8 w-12 md:w-16 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 w-16 md:w-20 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium truncate">{stat.title}</CardTitle>
            <stat.icon className={`h-3 w-3 md:h-4 md:w-4 ${stat.color} flex-shrink-0`} />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-2 w-2 md:h-3 md:w-3" />
              <span className="text-green-600 truncate">{stat.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
