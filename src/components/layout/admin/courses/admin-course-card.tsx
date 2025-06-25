"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { Edit, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const AdminCourseCard = ({
  course
}: { course: Course }) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  
  return (
    <div
      className="w-full rounded-xl border border-border/90 p-2 overflow-hidden relative"
      onMouseEnter={() => setShowEdit(true)}
      onMouseLeave={() => setShowEdit(false)}
    >
      {showEdit && (<div className="w-fit h-fit absolute top-2 right-2 z-30 flex outline-none border-none animate-in">
        <Link
          href={`/dashboard/courses/${course.id}`}
        >
          <Button
            size={"sm"}
            className="flex gap-2"
          >
            <Edit size={15} className="my-auto" />
            <p className="text-sm my-auto">Edit</p>
          </Button>
        </Link>
      </div>)}
      <div className="h-[200px] w-full relative rounded-t-xl overflow-hidden">
        {course.imageUrl ?
        (<Image
          src={course.imageUrl}
          alt="Course image"
          fill
          className="object-fill w-full h-full absolute"
        />) : 
        (
          <div className="h-full w-full justify-center items-center flex text-gray-300 animate-pulse">
            <ImageIcon size={50} />
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
        <p className="text-gray-500 line-clamp-2 text-sm">{course.description}</p>
        <div className="flex justify-between gap-3 pt-2 mt-auto h-full">
          <p className="text-xs font-bold text-gray-400">No. Enrolled:</p>
          <p className="text-xs font-bold">3 students</p>
        </div>
      </div>
    </div>
  )
}
export default AdminCourseCard;