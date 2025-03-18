"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TeacherCourses = () => {
  const router = useRouter();
  
  return (
    <div className="py-10">
      <div className="flex justify-between gap-5">
        <Button
          variant="default"
          className="cursor-pointer"
          onClick={() => router.push("/teacher/create")}
        >New Course</Button>
      </div>
    </div>
  )
}
export default TeacherCourses