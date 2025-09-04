"use client";
import Crumb from "@/components/Crumb";
import { useCourse } from "@/hooks/useCourse";
import { useEnrollmentStatus } from "@/hooks/useEnrollmentStatus";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";

import { Check, BookOpen, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/user-context";
import { useStats } from "@/context/stats-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CourseView = ({id}: {id: string}) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const { getACourse } = useCourse();
  const { user, isLoggedIn } = useUser();
  const { refreshStats } = useStats();
  const router = useRouter();
  
  // Use the new enrollment hook with stats refresh callback
  const { 
    isEnrolled, 
    isLoading: isEnrolling, 
    enroll 
  } = useEnrollmentStatus(id, { onStatsUpdate: refreshStats });

  const gettingCourse = async () => {
    try {
      const course = await getACourse(id);
      setCourse(course);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  }

  const enrollForCurrentCourse = async () => {
    if (!course) return;
    
    if (!isLoggedIn || !user) {
      toast.error("You must be logged in to enroll in a course");
      router.push(`/login?to=/course/${course.id}`);
      return;
    }
    
    try {
      console.log('CourseView - Starting enrollment for course:', course.id);
      await enroll();
      console.log('CourseView - Enrollment completed successfully');
      
      // Show success message and redirect to course content
      toast.success("Successfully enrolled! Redirecting to course content...");
      
      // Wait a moment for the toast to show, then redirect
      setTimeout(() => {
        router.push(`/learner/courses/${course.id}`);
      }, 1500);
      
    } catch (error) {
      console.error('CourseView - Enrollment failed:', error);
      // Error handling is done in the hook
    }
  }

  useEffect(() => {
    if (id) {
      gettingCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <p className="text-muted-foreground mb-8">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => router.push('/courses')}>
          Browse All Courses
        </Button>
      </div>
    );
  }

  const actualChapters = course.chapters.filter(cht => cht.isPublished);

  return (
    <div>
      <Crumb
        current={{
          title: course?.title || "",
          link: `/course/${course?.id}`
        }}
        previous={[
          isLoggedIn ? {link: "/learner", title: "Dashboard"} : {link: "/", title: "Home"},
          {link: "/courses", title: "Courses"},
        ]}
      />

      <div className="mt-5">
        {/* Course Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-4xl font-bold capitalize">{course.title}</h1>
                {isEnrolled && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    ✓ Enrolled
                  </Badge>
                )}
              </div>
              <p className="text-lg text-foreground/70 font-light mb-4">{course.description}</p>
              
              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{actualChapters.length} Chapter{actualChapters.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Self-paced</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Free</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Button */}
          <div className="flex gap-4">
            {isLoggedIn ? (
              isEnrolled ? (
                <Button 
                  size="lg" 
                  onClick={() => router.push(`/learner/courses/${course.id}`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue Learning
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={enrollForCurrentCourse}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? "Enrolling..." : "Enroll Now (Free)"}
                </Button>
              )
            ) : (
              <Button 
                size="lg" 
                onClick={() => router.push(`/login?to=/course/${course.id}`)}
              >
                Login to Enroll
              </Button>
            )}
          </div>
        </div>

        {/* Course Info Divider */}
        <div className="mt-8 mb-8">
          <h2 className="font-bold text-lg mb-3">Course Information</h2>
          <div className="w-full h-[2px] bg-border" />
        </div>

        {/* Course Overview */}
        <div className="flex flex-col gap-2 mb-10">
          <h3 className="font-bold text-xl">Course Overview</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground/80">{course.description}</p>
          </div>
        </div>

        {/* Course Syllabus */}
        <div className="flex flex-col gap-2 mb-10">
          <h3 className="font-bold text-xl">Course Syllabus</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This course contains {actualChapters.length} chapter{actualChapters.length !== 1 ? 's' : ''} covering all essential topics.
          </p>
          <div className="space-y-3">
            {actualChapters.length > 0 ? (
              actualChapters.map((chapter, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-center items-center rounded-sm h-[48px] w-[48px] bg-accent text-accent-foreground flex-shrink-0">
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[16px] mb-1">
                      Chapter {i + 1}: {chapter.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Learn about {chapter.name.toLowerCase()} and its applications
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {isEnrolled ? (
                      <Badge variant="outline" className="text-xs">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Enroll to access
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No chapters available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        {!isEnrolled && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border">
            <h3 className="font-bold text-lg mb-2">Ready to Start Learning?</h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of learners and start your journey today. This course is completely free!
            </p>
            {isLoggedIn ? (
              <Button 
                onClick={enrollForCurrentCourse}
                disabled={isEnrolling}
                size="lg"
              >
                {isEnrolling ? "Enrolling..." : "Enroll Now - It's Free!"}
              </Button>
            ) : (
              <Button 
                onClick={() => router.push(`/login?to=/course/${course.id}`)}
                size="lg"
              >
                Login to Enroll
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseView;