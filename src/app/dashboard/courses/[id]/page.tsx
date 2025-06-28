"use client";

import AdminSubHeader from "@/components/layout/admin/admin-subheader";
import TitleForm from "@/components/layout/admin/courses/edit-course/title";
import { useCourse } from "@/hooks/useCourse";
import { isError } from "@/services/helper";
import { Course } from "@/types/course";
import { use, useEffect, useState } from "react";
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

  const { getACourse } = useCourse();

  const gettingACourse = async () => {
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
  }

  useEffect(() => {
    gettingACourse();
  }, [id]);

  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      <AdminSubHeader
        title="Edit course"
        desc={`1/4 completed`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2">
        <TitleForm
          courseId={id}
          title={course ? course.title : ""}
        />
      </div>
    </div>
  )
}

export default EditCourseDetails;