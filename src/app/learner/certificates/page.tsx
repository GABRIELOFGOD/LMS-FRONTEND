"use client";

import { useUser } from "@/context/user-context";
import { useStats } from "@/context/stats-context";
import { useEffect, useState } from "react";
import CompletionCertificate from "@/components/layout/learner/profile/completion-certificate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Crumb from "@/components/Crumb";
import { BASEURL } from "@/lib/utils";

const CertificatesPage = () => {
  const { user, isLoggedIn, isLoaded } = useUser();
  const { stats, isLoading: statsLoading } = useStats();
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);
  const [loadingCourseDetails, setLoadingCourseDetails] = useState(false);

  useEffect(() => {
    if (!stats?.coursesEnrolled) return;

    const validateCompletedCourses = async () => {
      setLoadingCourseDetails(true);
      
      try {
        // Fetch full course details for each enrolled course to get chapter counts
        const courseDetailsPromises = stats.coursesEnrolled.map(async (enrollment) => {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASEURL}/courses/${enrollment.course.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            if (!response.ok) return null;
            
            const courseData = await response.json();
            return {
              enrollment,
              courseData,
            };
          } catch (error) {
            console.error(`Failed to fetch course ${enrollment.course.id}:`, error);
            return null;
          }
        });

        const coursesWithDetails = await Promise.all(courseDetailsPromises);

        // Filter for truly completed courses
        // A course is ONLY completed when ALL published chapters are done
        const completed = coursesWithDetails.filter((item) => {
          if (!item) return false;
          
          const { enrollment, courseData } = item;
          const completedChapters = enrollment.comppletedChapters?.length || 0;
          const totalPublishedChapters = courseData.chapters?.filter(
            (chapter: any) => chapter.isPublished
          ).length || 0;

          // Must have completed chapters AND must have completed ALL published chapters
          return completedChapters > 0 && completedChapters >= totalPublishedChapters;
        }).map(item => item!.enrollment);

        setCompletedCourses(completed);
      } catch (error) {
        console.error("Error validating completed courses:", error);
        // Fallback: Use simpler logic if fetching fails
        const simpleCompleted = stats.coursesEnrolled.filter(enrollment => 
          enrollment.comppletedChapters?.length > 0
        );
        setCompletedCourses(simpleCompleted);
      } finally {
        setLoadingCourseDetails(false);
      }
    };

    validateCompletedCourses();
  }, [stats]);

  // Check if user has completed ALL enrolled courses
  // Master Certificate is ONLY awarded when:
  // 1. User has enrolled in at least 1 course (completedCourses.length > 0)
  // 2. Number of completed courses equals total enrolled courses
  // This means every single course the user enrolled in is completed
  const hasCompletedAllCourses = completedCourses.length > 0 && 
    stats?.coursesEnrolled && 
    completedCourses.length === stats.coursesEnrolled.length;

  if (!isLoaded || statsLoading || loadingCourseDetails) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
        <div className="text-center text-sm text-muted-foreground mt-4">
          {loadingCourseDetails && "Validating course completions..."}
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="text-center py-20">
        <Trophy className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-muted-foreground">Please log in to view your certificates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 px-4 md:px-0">
      <Crumb
        current={{ title: "Certificates", link: "/learner/certificates" }}
        previous={[
          { link: "/learner", title: "Dashboard" },
        ]}
      />

      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="p-2 md:p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
          <Trophy className="h-6 w-6 md:h-8 md:w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Achievements</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            View your earned badges and master certificate
          </p>
        </div>
      </div>

      {/* Master Certificate - Shown when ALL courses are completed */}
      {hasCompletedAllCourses && user && (
        <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  🏆 Master Certificate
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Unlocked
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Congratulations! You&apos;ve earned all badges by completing every course
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CompletionCertificate
              user={user}
              courseTitle="All Courses - Master Achievement"
              completionDate={new Date().toISOString()}
            />
          </CardContent>
        </Card>
      )}

      {/* Course Badges - No Individual Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Course Badges ({completedCourses.length})
          </CardTitle>
          <CardDescription>
            Earn badges for completing individual courses. Complete all courses to unlock the Master Certificate!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedCourses.length > 0 ? (
            <div className="space-y-6">
              {/* Course Badge List */}
              <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {completedCourses.map((enrollment) => {
                  return (
                    <div
                      key={enrollment.course.id}
                      className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                        <Badge variant="secondary" className="text-xs">
                          Badge Earned
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        ✓ Course completed
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Information about badges vs certificates */}
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-800 rounded-full flex-shrink-0">
                    <Award className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">About Course Badges</h4>
                    <p className="text-xs text-muted-foreground">
                      You earn a badge for each course you complete. These badges showcase your learning achievements. 
                      {!hasCompletedAllCourses && " Complete all enrolled courses to unlock your Master Certificate!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Badges Yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete your first course to earn a badge!
              </p>
              {stats?.coursesEnrolled && stats.coursesEnrolled.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  You&apos;re enrolled in {stats.coursesEnrolled.length} course{stats.coursesEnrolled.length !== 1 ? 's' : ''}. 
                  Keep learning!
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      {stats?.coursesEnrolled && stats.coursesEnrolled.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed Courses</span>
                <span className="font-semibold">
                  {completedCourses.length} / {stats.coursesEnrolled.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedCourses.length / stats.coursesEnrolled.length) * 100}%`,
                  }}
                />
              </div>
              {!hasCompletedAllCourses && (
                <p className="text-sm text-muted-foreground">
                  Complete {stats.coursesEnrolled.length - completedCourses.length} more course
                  {stats.coursesEnrolled.length - completedCourses.length !== 1 ? 's' : ''} to unlock 
                  your Master Certificate! (Only the Master Certificate is downloadable as PDF)
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CertificatesPage;
