"use client";

import ChapterForm from "@/components/layout/admin/courses/edit-course/chapter-form";
import DescriptionForm from "@/components/layout/admin/courses/edit-course/description-form";
import ImageForm from "@/components/layout/admin/courses/edit-course/image-form";
import TitleForm from "@/components/layout/admin/courses/edit-course/title";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/hooks/useCourse";
import { isError } from "@/services/helper";
import { Course } from "@/types/course";
import { use, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface EditCourseDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCourseDetails = ({ params }: EditCourseDetailsProps) => {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const { getACourse, publishCourse } = useCourse();

  const gettingACourse = useCallback(async () => {
    try {
      const gottenCourse = await getACourse(id);
      setCourse(gottenCourse);
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Login failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  }, [id, getACourse]);

  const requiredFields = [
    course?.title,
    course?.description,
    course?.imageUrl,
    course?.chapters.some((cht) => cht.isPublished)
  ];

  const totalFields = requiredFields.length;
  const completedField = requiredFields.filter(Boolean).length;
  const completedText = `(${completedField}/${totalFields})`;

  const togglePublishCourse = async () => {
    if (!course || isPublishing) return;
    
    setIsPublishing(true);
    try {
      const res = await publishCourse(id);
      if (res?.message) {
        toast.success(res.message);
        // Refresh course data to get updated publish status
        await gettingACourse();
      }
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update course status");
      }
    } finally {
      setIsPublishing(false);
    }
  }

  useEffect(() => {
    gettingACourse();
  }, [id, gettingACourse]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {/* Header Section with better mobile styling */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="w-full flex flex-col gap-4">
            {/* Title and Progress */}
            <div className="flex flex-col space-y-3">
              <div>
                <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white leading-tight">
                  Edit Course
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                    Progress: {completedText} completed
                  </p>
                  {course && (
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 sm:ml-2 sm:pl-2 sm:border-l border-slate-300">
                      ID: {course.id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile First */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto order-2 sm:order-1"
                size="sm"
              >
                ← Back to Courses
              </Button>
              <Button
                onClick={togglePublishCourse}
                disabled={!course || completedField < totalFields || isPublishing}
                className="w-full sm:w-auto order-1 sm:order-2"
                variant={course?.publish ? "secondary" : "default"}
                size="sm"
              >
                {isPublishing ? (
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Processing...</span>
                  </div>
                ) : course?.publish ? (
                  "Unpublish Course"
                ) : (
                  "Publish Course"
                )}
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 sm:mt-6">
            <div className="flex justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2">
              <span>Course Completion</span>
              <span className="font-medium">{Math.round((completedField / totalFields) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 sm:h-2.5">
              <div 
                className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(completedField / totalFields) * 100}%` }}
              />
            </div>
            
            {/* Requirements Info - Mobile Optimized */}
            {completedField < totalFields && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <p className="text-sm sm:text-base text-amber-800 dark:text-amber-200 font-medium">
                  To publish this course, please complete:
                </p>
                <ul className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1.5 pl-1">
                  {!course?.title && <li>• Add a course title</li>}
                  {!course?.description && <li>• Add a course description</li>}
                  {!course?.imageUrl && <li>• Upload a course image</li>}
                  {!course?.chapters?.some(ch => ch.isPublished) && <li>• Publish at least one chapter</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        
        {/* Course Edit Forms - Mobile Optimized Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <TitleForm
              courseId={id}
              title={course ? course.title : ""}
            />

            <DescriptionForm
              initialData={{
                description: course?.description || ""
              }}
              courseId={id}
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <ImageForm
              initialData={{
                imageUrl: course?.imageUrl || ""
              }}
              courseId={id}
            />

            {/* Mobile: Show a placeholder or summary for chapters */}
            <div className="xl:hidden bg-white dark:bg-slate-800 rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Chapters Overview
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                {course?.chapters?.length || 0} chapters created
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scroll down to manage chapters
              </p>
            </div>
          </div>

          {/* Chapter Form - Full Width Section */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
              <div className="border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                  Course Chapters
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Add and manage your course content
                </p>
              </div>
              <div className="p-4 sm:p-6">
                <ChapterForm
                  initialData={{
                    chapters: course?.chapters || []
                  }}
                  courseId={id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCourseDetails;