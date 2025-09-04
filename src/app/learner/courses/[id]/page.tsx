"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourse } from "@/hooks/useCourse";
import { useUser } from "@/context/user-context";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Crumb from "@/components/Crumb";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  ArrowLeft,
  ArrowRight
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

  const { getACourse, getCourseProgress } = useCourse();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (courseId) {
      loadCourseData();
    }
  }, [courseId, isLoggedIn]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const [courseData, progressData] = await Promise.all([
        getACourse(courseId),
        getCourseProgress(courseId)
      ]);
      
      setCourse(courseData);
      setProgress(progressData?.completionPercentage || 0);
    } catch (error) {
      console.error("Failed to load course data:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-6xl mx-auto">
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
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chapter List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {publishedChapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => setCurrentChapter(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    currentChapter === index
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      currentChapter === index
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{chapter.name}</p>
                      <p className="text-xs opacity-70">Chapter {index + 1}</p>
                    </div>
                    {progress > (index / publishedChapters.length) * 100 && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  {currentChapterData?.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Chapter {currentChapter + 1} of {publishedChapters.length}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Player Placeholder */}
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Video Player</p>
                  <p className="text-sm opacity-70">
                    {currentChapterData?.video ? 'Video content will be loaded here' : 'No video available for this chapter'}
                  </p>
                </div>
              </div>

              {/* Chapter Description */}
              <div>
                <h3 className="font-semibold mb-2">About This Chapter</h3>
                <p className="text-muted-foreground">
                  Learn about {currentChapterData?.name.toLowerCase()} and its practical applications.
                  This chapter covers essential concepts that will help you understand the fundamentals.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                  disabled={currentChapter === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="text-sm text-muted-foreground">
                  {currentChapter + 1} of {publishedChapters.length} chapters
                </div>

                <Button
                  onClick={() => setCurrentChapter(Math.min(publishedChapters.length - 1, currentChapter + 1))}
                  disabled={currentChapter === publishedChapters.length - 1}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearnerCourseDetails;
