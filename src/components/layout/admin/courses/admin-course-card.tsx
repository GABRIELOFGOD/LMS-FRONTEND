"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { Edit, Eye, EyeOff, Users, ImageIcon, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCourse } from "@/hooks/useCourse";
import { toast } from "sonner";
import { useStats } from "@/context/stats-context";

const AdminCourseCard = ({
  course,
  onCourseUpdate,
  onCourseDelete
}: { 
  course: Course;
  onCourseUpdate?: () => void;
  onCourseDelete?: (courseId: string) => void;
}) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const { publishCourse, deleteCourse } = useCourse();
  const { refreshStats } = useStats();

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      const newPublishStatus = !course.publish; // Toggle the current status
      console.log('AdminCourseCard - Toggling course publish status:', course.id, 'From:', course.publish, 'To:', newPublishStatus);
      await publishCourse(course.id, newPublishStatus);
      
      toast.success(`Course ${newPublishStatus ? 'published' : 'unpublished'} successfully!`);
      
      // Refresh the course list to show updated status
      if (onCourseUpdate) {
        onCourseUpdate();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("AdminCourseCard - Publish error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Provide specific error messages based on common issues
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        toast.error("Authentication failed. Please log in again.");
      } else if (errorMessage.includes("404")) {
        toast.error("Course not found or endpoint unavailable.");
      } else {
        toast.error(`Failed to update course: ${errorMessage}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    try {
      console.log('AdminCourseCard - Deleting course:', course.id);
      await deleteCourse(course.id);
      
      toast.success('Course moved to deleted items! All student enrollments will be automatically cleaned up.');
      
      // Use optimistic update if available, otherwise refetch all courses
      if (onCourseDelete) {
        onCourseDelete(course.id); // Remove from local state immediately
      } else if (onCourseUpdate) {
        onCourseUpdate(); // Fallback to refetching all courses
      } else {
        // Last resort: reload the page
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      
      // Refresh stats to update course counts and user statistics
      refreshStats();
    } catch (error) {
      console.error("AdminCourseCard - Delete error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Provide specific error messages based on common issues
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        toast.error("Authentication failed. Please log in again.");
      } else if (errorMessage.includes("404")) {
        toast.error("Course not found or delete endpoint not available.");
      } else if (errorMessage.includes("405")) {
        toast.error("Delete method not supported. Please check the API documentation.");
      } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
        toast.error("You don't have permission to delete this course.");
      } else if (errorMessage.includes("500")) {
        toast.error("Server error occurred. Please try again later.");
      } else {
        toast.error(`Failed to delete course: ${errorMessage}`);
      }
      
      // Log detailed error information for debugging
      console.error("Detailed error information:", {
        error,
        courseId: course.id,
        errorMessage,
        timestamp: new Date().toISOString()
      });
      
      // If optimistic delete was used, we might want to refetch to ensure consistency
      if (onCourseDelete && onCourseUpdate) {
        console.log("Delete failed after optimistic update, refetching courses...");
        onCourseUpdate();
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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
            {isPublishing ? <Loader2 size={12} className="animate-spin" /> : (course.publish ? <EyeOff size={12} /> : <Eye size={12} />)}
            <p className="my-auto">
              {isPublishing ? "..." : (course.publish ? "Unpublish" : "Publish")}
            </p>
          </Button>
          <Button 
            size={"sm"} 
            variant="destructive"
            className="flex gap-1 text-xs"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            <p className="my-auto">
              {isDeleting ? "..." : "Delete"}
            </p>
          </Button>
        </div>
      )}
      <div className="h-[150px] md:h-[200px] w-full relative rounded-t-xl overflow-hidden">
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt="Course image"
            fill
            className="object-fill w-full h-full absolute"
          />
        ) : (
          <Image
            src="/images/student-learning.jpg"
            alt="Course image"
            fill
            className="object-fill w-full h-full absolute opacity-70"
          />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move course to deleted items?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the course &quot;{course.title}&quot; to your deleted courses archive.
              The course will no longer be visible to students, but you can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Move to Deleted"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
export default AdminCourseCard;