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

interface EditCourseDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCourseDetails = ({ params }: EditCourseDetailsProps) => {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);

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
    try {
      const res = await publishCourse(id);
      toast.success(res.message);
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
      }
    }
  }

  useEffect(() => {
    gettingACourse();
  }, [id, gettingACourse]);

  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      {/* <AdminSubHeader
        title="Edit course"
        desc={`${completedText} completed`}
      /> */}
      <div className="w-full flex justify-between">
        <div>
          <h1 className="font-bold text-2xl">Edit Course</h1>
          <p>{completedText} completed</p>
        </div>
        <Button
          onClick={togglePublishCourse}
          disabled={!course?.publish && completedField >= totalFields ? false : true}
        >
          Publish course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <ChapterForm
          initialData={{
            chapters: course?.chapters || []
          }}
          courseId={id}
        />
      </div>
    </div>
  )
}

export default EditCourseDetails;