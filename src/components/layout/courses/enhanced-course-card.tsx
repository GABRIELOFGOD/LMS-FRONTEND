"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/types/course";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useCourse } from "@/hooks/useCourse";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CheckCircle, Play, Lock, Video, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface EnhancedCourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  progress?: number;
  onEnrollmentUpdate?: () => void;
}

const EnhancedCourseCard = ({ 
  course, 
  isEnrolled = false, 
  progress = 0,
  onEnrollmentUpdate 
}: EnhancedCourseCardProps) => {
  const { isLoggedIn } = useUser();
  const { enrollCourse } = useCourse();
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [courseProgress, setCourseProgress] = useState(progress);

  const actualChapters = course.chapters.filter((cht) => cht.isPublished);

  // Helper function to detect media types in course chapters
  const getMediaTypes = () => {
    const mediaTypes = new Set();
    actualChapters.forEach(chapter => {
      if (chapter.video) {
        const lower = chapter.video.toLowerCase();
        if (lower.includes('.pdf') || lower.includes('application/pdf')) {
          mediaTypes.add('pdf');
        } else {
          mediaTypes.add('video');
        }
      }
    });
    return Array.from(mediaTypes) as string[];
  };

  const mediaTypes = getMediaTypes();

  // Sync local state with props when they change
  useEffect(() => {
    setEnrolled(isEnrolled);
  }, [isEnrolled]);

  useEffect(() => {
    setCourseProgress(progress);
  }, [progress]);

  const handleEnrollment = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error("Please log in to enroll in courses");
      return;
    }

    setIsEnrolling(true);
    try {
      console.log('EnhancedCourseCard - Starting enrollment for course:', course.id);
      await enrollCourse(course.id);
      
      console.log('EnhancedCourseCard - Enrollment successful, updating state');
      setEnrolled(true);
      setCourseProgress(0);
      
      // Notify parent component to refresh data
      if (onEnrollmentUpdate) {
        console.log('EnhancedCourseCard - Calling onEnrollmentUpdate');
        onEnrollmentUpdate();
      }
      
      // Show success message and redirect to course content
      toast.success("Successfully enrolled! Opening course...");
      
      // Small delay then redirect to course content
      setTimeout(() => {
        router.push(`/learner/courses/${course.id}`);
      }, 1000);
      
    } catch (error) {
      console.error('EnhancedCourseCard - Enrollment failed:', error);
      // Error is already handled in the enrollCourse function with toast
      // Don't show additional toast here to avoid duplication
    } finally {
      setIsEnrolling(false);
    }
  };

  const getActionButton = () => {
    if (!isLoggedIn) {
      return (
        <Link href="/login" className="w-full">
          <Button className="w-full" variant="outline">
            Login to Enroll
          </Button>
        </Link>
      );
    }

    if (enrolled) {
      if (courseProgress === 100) {
        return (
          <Link href={`/learner/courses/${course.id}`} className="w-full">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <div className="w-full flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                Completed
              </div>
            </Button>
          </Link>
        );
      } else {
        return (
          <Link href={`/learner/courses/${course.id}`} className="w-full">
            <Button className="w-full">
              <div className="w-full flex items-center justify-center gap-2">
                <Play size={16} />
                Continue Learning
              </div>
            </Button>
          </Link>
        );
      }
    }

    return (
      <Button 
        className="w-full" 
        onClick={handleEnrollment}
        disabled={isEnrolling}
      >
        {isEnrolling ? "Enrolling..." : "Enroll Now"}
      </Button>
    );
  };

  return (
    <div className="rounded border-border border bg-muted overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-[150px] shadow-sm">
        <Image
          src={course.imageUrl || "/placeholder-course.jpg"}
          alt="course image"
          fill
          className="object-cover h-full w-full"
        />
        {enrolled && (
          <div className="absolute top-2 right-2">
            <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Enrolled
            </div>
          </div>
        )}
        {!isLoggedIn && (
          <div className="absolute top-2 right-2">
            <Lock className="text-white bg-black/50 p-1 rounded" size={24} />
          </div>
        )}
      </div>
      <div className="flex flex-col p-3">
        <p className="font-extrabold text-xl truncate line-clamp-2">
          {course.title}
        </p>
        <p className="text-foreground/80 text-sm line-clamp-2 my-2">
          {course.description}
        </p>
        
        {/* Progress bar for enrolled users */}
        {enrolled && isLoggedIn && (
          <div className="my-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(courseProgress)}%</span>
            </div>
            <Progress value={courseProgress} className="h-2" />
          </div>
        )}

        <div className="mt-2 flex justify-between">
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-600 font-bold">
              {actualChapters.length} Chapter{actualChapters.length !== 1 ? 's' : ''}
            </p>
            {mediaTypes.length > 0 && (
              <div className="flex items-center gap-1">
                {mediaTypes.includes('video') && (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Video className="h-3 w-3" />
                    <span>Video</span>
                  </div>
                )}
                {mediaTypes.includes('pdf') && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <FileText className="h-3 w-3" />
                    <span>PDF</span>
                  </div>
                )}
              </div>
            )}
            {enrolled && (
              <p className="text-xs text-green-600 font-bold">
                Enrolled
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-5 w-full">
          {getActionButton()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCourseCard;
