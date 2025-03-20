"use client";

import IconBadge from "@/components/layouts/icon-badge";
import { useCreateCourse } from "@/hooks/create-course";
import { cn } from "@/lib/utils";
import { Course } from "@/types/course"
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import TitleForm from "./_components/TitleForm";

const CourseIdPage = ({
  params
}: {
  params: { courseId: string }
}) => {
  const { getSingleCourse } = useCreateCourse();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const gettingCourse = async () => {
      try {
        const course = await getSingleCourse(params.courseId);
        console.log("Courses JOY", course);
        setCourse(course);
      } catch (error: any) {
        toast.error(error.message || "An error occur");
      }
    }

    gettingCourse();
  }, []);

  const requiredFields = [
    course?.title,
    course?.description,
    course?.chapters,
    course?.imageUrl,
  ];

  const totalFields = requiredFields.length;
  const completedField = requiredFields.filter(Boolean).length;
  const completedText = `(${completedField}/${totalFields})`
  
  return (
    <div
      className={cn(
        "p-6 w-full"
      )}
    >
        <div className="flex flex-col gap-y-2">
          <p className="text-2xl font-medium">Course setup</p>
          <span className="text-sm text-gray-500">Complete all fields {completedText}</span>
        </div>
      <div className="flex items-center justify-between w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 w-full">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge
                icon={LayoutDashboard}
              />
              <p>Customise your course</p>
            </div>
            <TitleForm
              initialData={{
                title: course?.title!
              }}
              courseId={course?.id.toString()!}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default CourseIdPage