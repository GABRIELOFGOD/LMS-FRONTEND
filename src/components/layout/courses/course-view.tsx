"use client";
import Crumb from "@/components/Crumb";
import { useCourse } from "@/hooks/useCourse";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";


const CourseView = ({id}: {id: string}) => {
  const [course, setCourse] = useState<Course | null>(null);

  const { getACourse } = useCourse();

  const gettingCourse = async () => {
    const course = await getACourse(id);
    setCourse(course);
  }

  useEffect(() => {
    gettingCourse();
  }, [id]);
  
  return (
    <div>
      <Crumb
        current={{
          title: course?.title || "",
          link: `/course/${course?.id}`
        }}
        previous={[
          {link: "/", title: "Home"},
          {link: "/courses", title: "Courses"},
        ]}
      />

      <div>
        <div>

        </div>
      </div>
      
    </div>
  )
}

export default CourseView;