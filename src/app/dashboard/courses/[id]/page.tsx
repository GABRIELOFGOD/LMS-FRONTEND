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
      <div className="flex flex-col px-3 md:px-5 py-10 gap-5 max-w-7xl mx-auto">
        {/* Header Section with better styling */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border p-6">
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-white">
                Edit Course
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Progress: {completedText} completed
              </p>
              {course && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Course ID: {course.id}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                ← Back to Courses
              </Button>
              <Button
                onClick={togglePublishCourse}
                disabled={!course || completedField < totalFields || isPublishing}
                className="w-full sm:w-auto"
                variant={course?.publish ? "secondary" : "default"}
              >
                {isPublishing ? (
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
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
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-2">
              <span>Course Completion</span>
              <span>{Math.round((completedField / totalFields) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedField / totalFields) * 100}%` }}
              />
            </div>
            
            {/* Requirements Info */}
            {completedField < totalFields && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>To publish this course, please complete:</strong>
                </p>
                <ul className="text-xs text-amber-700 dark:text-amber-300 mt-1 space-y-1">
                  {!course?.title && <li>• Add a course title</li>}
                  {!course?.description && <li>• Add a course description</li>}
                  {!course?.imageUrl && <li>• Upload a course image</li>}
                  {!course?.chapters?.some(ch => ch.isPublished) && <li>• Publish at least one chapter</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        
        {/* Course Edit Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <ImageForm
            initialData={{
              imageUrl: course?.imageUrl || ""
            }}
            courseId={id}
          />

          {/* Chapter Form spans full width on large screens */}
          <div className="lg:col-span-2">
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
  )
}

export default EditCourseDetails;