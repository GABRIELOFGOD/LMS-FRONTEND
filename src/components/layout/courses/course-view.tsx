"use client";
import Crumb from "@/components/Crumb";
import { useCourse } from "@/hooks/useCourse";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enrollCourse } from "@/services/common";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { isError } from "@/services/helper";
import { toast } from "sonner";

const CourseView = ({id}: {id: string}) => {
  const [course, setCourse] = useState<Course | null>(null);

  const { getACourse } = useCourse();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const gettingCourse = async () => {
    const course = await getACourse(id);
    setCourse(course);
  }

  const enrollForCurrentCourse = async () => {
    if (!course) return;
    if (!user || !isLoaded) {
      toast.error("You must be logged in to enroll in a course");
      router.push(`/login?to=/course/${course.id}`);
      return;
    };
    try {
      await enrollCourse(course.id);
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

      <div className="mt-5">
        <div className="flex flex-col gap-2">
          <p className="text-2xl md:text-4xl font-bold capitalize">{course?.title}</p>
          <p className="text-lg text-foreground/50 font-light">{course?.description}</p>
        </div>

        <div className="mt-5">
          <p className="font-bold">Course info</p>
          <div className="mt-2 w-full h-[2px] bg-border "/>
        </div>

        <div className="flex flex-col gap-2 mt-10">
          <p className="font-bold text-xl">Course Overview</p>
          <p>{course?.description}</p>
        </div>

        {/* <div className="flex flex-col gap-2 mt-10">
          <p className="font-bold text-lg">Instructor</p>
          <div className="flex gap-5">
            <div className="h-20 w-20 bg-accent rounded-full overflow-hidden relative">
              <Image
                src={Instructor}
                alt="Instructor Image"
                fill
                className="object-bottom rounded-full w-full h-full relative"
              />
            </div>
            <div className="my-auto">
              <p className="font-bold text-lg">{course?.instructor.name}</p>
              <p className="text-foreground/50">{course?.instructor.role}</p>
            </div>
          </div>

          <div>
            <p>{course?.instructor.description}</p>
          </div>
        </div> */}

        <div className="flex flex-col gap-2 mt-10">
          <p className="font-bold text-xl">Syllabus</p>
          <div className="mt-5 flex flex-col gap-3">
            {course?.chapters.filter(cht => cht.isPublished).map((mod, i) => (
              <div
                key={i}
                className="flex gap-[10px]"
              >
                <div className="flex justify-center items-center rounded-sm h-[48px] w-[48px] bg-accent text-accent-foreground">
                  <Check />
                </div>
                <div className="my-auto">
                  <p className="font-medium text-[16px]">{mod.name}</p>
                  {/* <p className="text-foreground/50">{mod.description}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {course && (<div className="mt-10">
          <Button
            onClick={enrollForCurrentCourse}
          >
            Enroll (Free)
          </Button>
        </div>)}
      </div>
      
    </div>
  )
}

export default CourseView;