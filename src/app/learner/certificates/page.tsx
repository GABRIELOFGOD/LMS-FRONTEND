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

const CertificatesPage = () => {
  const { user, isLoggedIn, isLoaded, courseProgress } = useUser();
  const { stats, isLoading: statsLoading } = useStats();
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [showMasterCertificate, setShowMasterCertificate] = useState(false);

  useEffect(() => {
    if (stats?.coursesEnrolled) {
      // Get completed courses from context
      const completed = Array.from(courseProgress.values())
        .filter(progress => progress.isCompleted)
        .map(progress => {
          const course = stats.coursesEnrolled.find(c => c.id === progress.courseId);
          return course;
        })
        .filter(course => course !== undefined);
      
      setCompletedCourses(completed);
    }
  }, [stats, courseProgress]);

  // Check if user has completed all courses
  const hasCompletedAllCourses = completedCourses.length > 0 && 
    stats?.coursesEnrolled && 
    completedCourses.length === stats.coursesEnrolled.length;

  if (!isLoaded || statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
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
    <div className="space-y-6 pb-10">
      <Crumb
        current={{ title: "Certificates", link: "/learner/certificates" }}
        previous={[
          { link: "/learner", title: "Dashboard" },
        ]}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Certificates</h1>
          <p className="text-muted-foreground">
            View and download your earned certificates
          </p>
        </div>
      </div>

      {/* Master Certificate Card */}
      {hasCompletedAllCourses && (
        <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  Master Certificate
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Unlocked
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Congratulations! You&apos;ve completed all available courses
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => setShowMasterCertificate(true)}
              className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-yellow-400 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-500 font-semibold">
                <Award className="h-5 w-5" />
                View Master Certificate
              </div>
            </button>
          </CardContent>
        </Card>
      )}

      {/* Master Certificate Display */}
      {showMasterCertificate && user && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Master Completion Certificate</CardTitle>
              <button
                onClick={() => setShowMasterCertificate(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <CompletionCertificate
              user={user}
              courseTitle="All Courses"
              completionDate={new Date().toISOString()}
            />
          </CardContent>
        </Card>
      )}

      {/* Individual Course Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Course Certificates ({completedCourses.length})
          </CardTitle>
          <CardDescription>
            Individual certificates for each completed course
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedCourses.length > 0 ? (
            <div className="space-y-6">
              {/* Course Certificate List */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedCourses.map((course) => {
                  const progressData = courseProgress.get(course.id);
                  return (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <Badge variant="secondary" className="text-xs">
                          {progressData?.completedAt 
                            ? new Date(progressData.completedAt).toLocaleDateString()
                            : 'Completed'
                          }
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Click to view certificate
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Selected Certificate Display */}
              {selectedCourse && user && (
                <div className="mt-8 pt-8 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">
                      Certificate for: {selectedCourse.title}
                    </h3>
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Close
                    </button>
                  </div>
                  <CompletionCertificate
                    user={user}
                    courseTitle={selectedCourse.title}
                    completionDate={courseProgress.get(selectedCourse.id)?.completedAt}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete your first course to earn a certificate!
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
                  your Master Certificate!
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
