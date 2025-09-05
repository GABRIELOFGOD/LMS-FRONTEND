"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { Edit, Eye, EyeOff, Users, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCourse } from "@/hooks/useCourse";
import { toast } from "sonner";

const AdminCourseCard = ({
  course,
  onCourseUpdate
}: { 
  course: Course;
  onCourseUpdate?: () => void;
}) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const { publishCourse } = useCourse();

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      const newPublishStatus = !course.publish; // Toggle the current status
      console.log('AdminCourseCard - Toggling course publish status:', course.id, 'From:', course.publish, 'To:', newPublishStatus);
      await publishCourse(course.id, newPublishStatus);
      toast.success(newPublishStatus ? "Course published successfully!" : "Course unpublished successfully!");
      
      // Better state management: refresh the parent component's course list
      if (onCourseUpdate) {
        onCourseUpdate();
      } else {
        // Fallback to reload if no callback provided
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Give time for the toast to show
      }
    } catch (error) {
      console.error("AdminCourseCard - Publish error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to update course publish status: ${errorMessage}`);
    } finally {
      setIsPublishing(false);
    }
  };
  
  return (
    <div
      className="w-full rounded-xl border border-border/90 p-2 overflow-hidden relative hover:shadow-lg transition-shadow duration-200"
      onMouseEnter={() => setShowEdit(true)}
      onMouseLeave={() => setShowEdit(false)}
    >
      {showEdit && (
        <div className="w-fit h-fit absolute top-2 right-2 z-30 flex gap-2 outline-none border-none animate-in">
          <Link href={`/dashboard/courses/${course.id}`}>
            <Button size={"sm"} className="flex gap-1 text-xs">
              <Edit size={12} className="my-auto" />
              <p className="my-auto">Edit</p>
            </Button>
          </Link>
          <Button 
            size={"sm"} 
            variant={course.publish ? "destructive" : "default"}
            className="flex gap-1 text-xs"
            onClick={handlePublishToggle}
            disabled={isPublishing}
          >
            {course.publish ? <EyeOff size={12} /> : <Eye size={12} />}
            <p className="my-auto">
              {isPublishing ? "..." : (course.publish ? "Unpublish" : "Publish")}
            </p>
          </Button>
        </div>
      )}
      <div className="h-[150px] md:h-[200px] w-full relative rounded-t-xl overflow-hidden">
        {course.imageUrl ?
        (<Image
          src={course.imageUrl}
          alt="Course image"
          fill
          className="object-fill w-full h-full absolute"
        />) : 
        (
          <div className="h-full w-full justify-center items-center flex text-gray-300 animate-pulse">
            <ImageIcon size={40} className="md:size-[50px]" />
          </div>
        )}
      </div>
      <div className="p-2 md:p-3">
        <h3 className="text-base md:text-lg font-semibold line-clamp-2">{course.title}</h3>
        <p className="text-gray-500 line-clamp-2 text-xs md:text-sm">{course.description}</p>
        <div className="flex justify-between items-center gap-3 pt-2 mt-auto">
          <div className="flex items-center gap-1">
            <Users size={14} className="text-gray-400" />
            <p className="text-xs font-bold text-gray-400">Enrolled:</p>
          </div>
          <p className="text-xs font-bold">0 students</p>
        </div>
        <div className="flex justify-between items-center gap-3 pt-1">
          <p className="text-xs font-bold text-gray-400">Status:</p>
          <div className={`px-2 py-1 rounded text-xs font-semibold ${
            course.publish 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {course.publish ? 'Published' : 'Draft'}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminCourseCard;