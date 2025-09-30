"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/types/course";
import ImagePlaceholder from "@/assets/hero-fc.png";

interface RecommendedCoursesProps {
  courses: Course[];
  loading: boolean;
}

export const RecommendedCourses = ({ courses, loading }: RecommendedCoursesProps) => {
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-4">
            <div className="aspect-video bg-muted rounded-lg mb-3"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded mb-3"></div>
            <div className="flex justify-between">
              <div className="h-6 w-16 bg-muted rounded"></div>
              <div className="h-8 w-20 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-8 text-muted-foreground">
      <BookOpen className="mx-auto h-8 w-8 md:h-12 md:w-12 mb-4 opacity-50" />
      <p className="text-base md:text-lg font-medium mb-2">No courses available</p>
      <p className="text-sm">Check back later for new learning opportunities.</p>
    </div>
  );

  const CoursesGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses
        .slice(0, 3)
        .filter(course => course && course.id && course.title)
        .map((course) => (
        <Link key={course.id} href={`/learner/courses/${course.id}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="p-4">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 overflow-hidden">
                <Image
                  src={course.imageUrl || ImagePlaceholder}
                  alt={course.title}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2 text-sm md:text-base">{course.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">{course.isFree ? 'Free' : 'Premium'}</Badge>
                <Button size="sm" variant="ghost" className="text-xs">
                  Start Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-sm md:text-base">Recommended for You</CardTitle>
          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
            <Link href="/learner/courses">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSkeleton />
        ) : courses && courses.length > 0 ? (
          <CoursesGrid />
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
};
