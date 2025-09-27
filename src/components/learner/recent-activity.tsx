"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm md:text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Empty state for recent activity - will be connected to real API later */}
        <div className="text-center py-6 md:py-8">
          <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium mb-2">No Recent Activity</h3>
          <p className="text-xs text-muted-foreground">
            Your learning activity will appear here
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
