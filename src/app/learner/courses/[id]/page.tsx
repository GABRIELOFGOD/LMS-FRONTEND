"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourse } from "@/hooks/useCourse";
import { useUser } from "@/context/user-context";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Crumb from "@/components/Crumb";
import CourseMedia from "@/components/layout/learner/course-media";
import ChapterList from "@/components/layout/learner/chapter-list";
import ChapterNavigation from "@/components/layout/learner/chapter-navigation";
import { 
  Play, 
  Clock
} from "lucide-react";
import { toast } from "sonner";



const LearnerCourseDetails = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Force re-render trigger

  const { getACourse, getCourseProgress } = useCourse();
  const { isLoggedIn, updateChapterProgress, getCourseProgress: getContextProgress } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!courseId) {
      toast.error("Invalid course ID");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load course data first (this is critical)
        const courseData = await getACourse(courseId);
        
        if (courseData) {
          setCourse(courseData);
        } else {
          throw new Error("No course data received");
        }
        
        // Load progress data separately (this is optional)
        try {
          // Check for local progress first, then fallback to API
          const localProgress = getContextProgress(courseId);
          if (localProgress && localProgress.progress !== undefined) {
            setProgress(localProgress.progress);
          } else {
            // Try to get progress from the existing API
            const progressData = await getCourseProgress(courseId);
            setProgress(progressData?.completionPercentage || 0);
          }
        } catch {
          setProgress(0); // Default progress if API fails
        }
        
      } catch (error) {
        console.error("Failed to load course data:", error);
        toast.error("Failed to load course details");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, isLoggedIn]); // Minimal dependencies

  const handleChapterComplete = async () => {
    if (!course || !currentChapterData) return;

    try {
      const publishedChapters = course.chapters.filter(ch => ch.isPublished);
      
      // Show loading state
      toast.loading("Marking chapter as complete...", { id: 'chapter-complete' });
      
      await updateChapterProgress(courseId, currentChapterData.id, publishedChapters.length);
      
      // Force re-render to update UI
      setRefreshTrigger(prev => prev + 1);
      
      // Update local progress immediately after API success
      const updatedProgress = getContextProgress(courseId);
      if (updatedProgress) {
        setProgress(updatedProgress.progress);
        
        if (updatedProgress.isCompleted) {
          toast.success("🎉 Congratulations! You've completed this course!", { id: 'chapter-complete' });
        } else {
          toast.success("Chapter marked as complete!", { id: 'chapter-complete' });
        }
      } else {
        toast.success("Chapter marked as complete!", { id: 'chapter-complete' });
      }
      
    } catch (error) {
      console.error('Failed to mark chapter as complete:', error);
      toast.error(
        error instanceof Error ? error.message : "Failed to mark chapter as complete. Please try again.",
        { id: 'chapter-complete' }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <p className="text-muted-foreground mb-8">
          You may not be enrolled in this course or it may have been removed.
        </p>
        <div className="space-x-4">
          <Button onClick={() => router.push('/learner/courses')}>
            My Courses
          </Button>
          <Button variant="outline" onClick={() => router.push('/courses')}>
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  const publishedChapters = course.chapters.filter(ch => ch.isPublished);
  const currentChapterData = publishedChapters[currentChapter];
  
  // Helper functions for progress tracking
  const isChapterCompleted = (chapterId: string): boolean => {
    // Include refreshTrigger to ensure this function re-evaluates when progress changes
    const courseProgressData = getContextProgress(courseId);
    const isCompleted = courseProgressData?.completedChapters.includes(chapterId) || false;
    // The refreshTrigger dependency ensures this updates when chapter completion changes
    return refreshTrigger >= 0 ? isCompleted : isCompleted;
  };

  const isLastChapter = currentChapter === publishedChapters.length - 1;
  const isCourseCompleted = () => {
    const courseProgressData = getContextProgress(courseId);
    return courseProgressData?.isCompleted || false;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Crumb
        current={{
          title: course.title,
          link: `/learner/courses/${course.id}`
        }}
        previous={[
          { link: "/learner", title: "Dashboard" },
          { link: "/learner/courses", title: "My Courses" },
        ]}
      />

      <div className="mt-6 space-y-6">
        {/* Course Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl mb-2 line-clamp-2">{course.title}</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base line-clamp-3">{course.description}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 self-start shrink-0">
                Enrolled
              </Badge>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Mobile-First Layout */}
        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
          {/* Chapter List - Mobile: Top, Desktop: Left */}
          <ChapterList
            chapters={publishedChapters}
            currentChapter={currentChapter}
            onChapterSelect={setCurrentChapter}
            isChapterCompleted={isChapterCompleted}
          />

          {/* Main Content - Mobile: Bottom, Desktop: Right */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Play className="h-5 w-5 shrink-0" />
                  <span className="line-clamp-2">{currentChapterData?.name}</span>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                  <Clock className="h-4 w-4" />
                  <span>Chapter {currentChapter + 1} of {publishedChapters.length}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Media Player */}
              {currentChapterData?.video ? (
                <div className="space-y-2">
                  <CourseMedia 
                    mediaUrl={currentChapterData.video} 
                    title={currentChapterData.name}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-4">
                    <Play className="h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-base sm:text-lg font-medium">No Media Available</p>
                    <p className="text-sm opacity-70 mt-2">
                      This chapter doesn&apos;t have any video or document content yet
                    </p>
                  </div>
                </div>
              )}

              {/* Chapter Description */}
              <div>
                <h3 className="font-semibold mb-2">About This Chapter</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Learn about {currentChapterData?.name.toLowerCase()} and its practical applications.
                  This chapter covers essential concepts that will help you understand the fundamentals.
                </p>
              </div>

              {/* Navigation - Mobile Optimized */}
              {currentChapterData && (
                <ChapterNavigation
                  currentChapter={currentChapter}
                  totalChapters={publishedChapters.length}
                  isLastChapter={isLastChapter}
                  isCourseCompleted={isCourseCompleted()}
                  isChapterCompleted={isChapterCompleted(currentChapterData.id)}
                  onPreviousChapter={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                  onNextChapter={() => setCurrentChapter(Math.min(publishedChapters.length - 1, currentChapter + 1))}
                  onCompleteChapter={handleChapterComplete}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearnerCourseDetails;
