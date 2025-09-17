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
  ArrowRight,
  FileText,
  Video,
  ExternalLink,
  Download
} from "lucide-react";
import { toast } from "sonner";

// Course Media Component for rendering videos and PDFs
interface CourseMediaProps {
  mediaUrl: string;
  title: string;
}

const CourseMedia = ({ mediaUrl, title }: CourseMediaProps) => {
  if (!mediaUrl) return null;

  // Convert URLs to embeddable format
  const convertToEmbeddableUrl = (url: string): string => {
    const trimmedUrl = url.trim();
    
    // If it's already an embed URL, return as-is
    if (trimmedUrl.includes('/embed/') || trimmedUrl.includes('/preview') || trimmedUrl.includes('player.vimeo.com')) {
      return trimmedUrl;
    }
    
    // YouTube URLs
    if (trimmedUrl.includes('youtube.com/watch')) {
      const videoId = trimmedUrl.split('v=')[1]?.split('&')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } else if (trimmedUrl.includes('youtu.be/')) {
      const videoId = trimmedUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo URLs
    else if (trimmedUrl.includes('vimeo.com/')) {
      const videoId = trimmedUrl.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // Google Drive URLs - Use direct download format
    else if (trimmedUrl.includes('drive.google.com')) {
      if (trimmedUrl.includes('/file/d/')) {
        const fileId = trimmedUrl.split('/file/d/')[1]?.split('/')[0];
        if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
      } else if (trimmedUrl.includes('id=')) {
        const fileId = trimmedUrl.split('id=')[1]?.split('&')[0];
        if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    
    // Dropbox URLs
    else if (trimmedUrl.includes('dropbox.com')) {
      // Convert dropbox share link to embed format
      if (trimmedUrl.includes('?dl=0')) {
        return trimmedUrl.replace('?dl=0', '?raw=1');
      } else if (!trimmedUrl.includes('raw=1')) {
        const separator = trimmedUrl.includes('?') ? '&' : '?';
        return `${trimmedUrl}${separator}raw=1`;
      }
    }
    
    // For direct video links or other URLs, return as-is
    return trimmedUrl;
  };

  // Check if URL can be embedded in iframe
  const canEmbedInIframe = (url: string): boolean => {
    // Google Drive cannot be embedded due to CSP restrictions
    if (url.includes('drive.google.com')) return false;
    // Most other services allow embedding
    return true;
  };

  const getMediaType = (url: string) => {
    const lower = url.split('?')[0].toLowerCase();
    
    if (lower.endsWith('.pdf') || url.includes('application/pdf')) {
      return 'pdf';
    }
    
    if (/\.(mp4|webm|ogg|mov|avi)$/i.test(lower) || url.includes('video/')) {
      return 'video-file';
    }
    
    // Check if it's a video URL (YouTube, Vimeo, etc.)
    if (url.includes('http') || url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('drive.google.com') || url.includes('dropbox.com')) {
      return 'video-url';
    }
    
    // Default to video URL for unknown types
    return 'video-url';
  };

  const embeddableUrl = convertToEmbeddableUrl(mediaUrl);
  const mediaType = getMediaType(mediaUrl);

  const getPlatformName = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    if (url.includes('drive.google.com')) return 'Google Drive';
    if (url.includes('dropbox.com')) return 'Dropbox';
    return 'Video Content';
  };

  if (mediaType === 'pdf') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4 text-red-600" />
          <span className="font-medium">PDF Document</span>
        </div>
        
        {/* Desktop PDF Viewer */}
        <div className="hidden md:block border rounded-lg overflow-hidden bg-white shadow-sm">
          <iframe
            src={`${mediaUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
            title={title}
            className="w-full h-[600px] border-0"
            loading="lazy"
          />
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-slate-700">{title}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={mediaUrl} download>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile PDF Viewer - Shows preview and actions */}
        <div className="md:hidden space-y-4">
          <div className="border rounded-lg p-6 bg-gradient-to-br from-red-50 to-orange-50 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-red-100 rounded-full">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  PDF documents work best on larger screens. Use the options below to access the content.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button className="flex-1" asChild>
                  <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Browser
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={mediaUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mobile iframe fallback - smaller height */}
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <iframe
              src={`${mediaUrl}#toolbar=0&navpanes=0&scrollbar=1&page=1&view=FitH&zoom=75`}
              title={title}
              className="w-full h-64 border-0"
              loading="lazy"
            />
            <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-600">
                For better viewing experience, use &quot;Open in Browser&quot; above
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle video files vs video URLs
  if (mediaType === 'video-file') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Video className="h-4 w-4" />
          <span>Video File</span>
        </div>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            controls
            playsInline
            preload="metadata"
            className="w-full h-full"
            src={mediaUrl}
          >
            <source src={mediaUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }

  // Handle video URLs (YouTube, Vimeo, Google Drive, Dropbox, etc.)
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Video className="h-4 w-4" />
        <span>{getPlatformName(mediaUrl)}</span>
      </div>
      
      {canEmbedInIframe(mediaUrl) ? (
        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
          <iframe
            src={embeddableUrl}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            loading="lazy"
          />
        </div>
      ) : (
        // Special handling for Google Drive and other non-embeddable content
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Video className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {getPlatformName(mediaUrl)} Content
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {mediaUrl.includes('drive.google.com') 
                ? 'This Google Drive content will open in a new tab for you to view.'
                : 'This content will open in a new tab for viewing.'
              }
            </p>
            <Button asChild className="inline-flex items-center gap-2">
              <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open Content
              </a>
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">{getPlatformName(mediaUrl)}</span>
          <span className="text-xs text-slate-500 max-w-xs truncate">
            {mediaUrl}
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1" />
            Open in new tab
          </a>
        </Button>
      </div>
    </div>
  );
};

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
          <Card className="lg:col-span-1 lg:h-fit lg:sticky lg:top-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                Course Content
                <span className="text-sm font-normal text-muted-foreground ml-auto">
                  {currentChapter + 1}/{publishedChapters.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 lg:max-h-[70vh] overflow-y-auto">
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
                      <p className="font-medium truncate text-sm">{chapter.name}</p>
                      <p className="text-xs opacity-70">Chapter {index + 1}</p>
                    </div>
                    {progress > (index / publishedChapters.length) * 100 && (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

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
                <CourseMedia 
                  mediaUrl={currentChapterData.video} 
                  title={currentChapterData.name}
                />
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                  disabled={currentChapter === 0}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous Chapter
                </Button>

                <div className="text-sm text-muted-foreground text-center sm:order-none order-first">
                  Chapter {currentChapter + 1} of {publishedChapters.length}
                </div>

                <Button
                  onClick={() => setCurrentChapter(Math.min(publishedChapters.length - 1, currentChapter + 1))}
                  disabled={currentChapter === publishedChapters.length - 1}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  Next Chapter
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
