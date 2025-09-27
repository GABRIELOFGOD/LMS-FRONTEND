"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Clock } from "lucide-react";
import Link from "next/link";

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm md:text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full justify-start text-sm" variant="outline">
          <Link href="/learner/courses">
            <BookOpen className="mr-2 h-4 w-4" />
            My Courses
          </Link>
        </Button>
        <Button asChild className="w-full justify-start text-sm" variant="outline">
          <Link href="/learner/profile">
            <Target className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </Button>
        <Button asChild className="w-full justify-start text-sm" variant="outline">
          <Link href="/learner/notification">
            <Clock className="mr-2 h-4 w-4" />
            Notifications
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
