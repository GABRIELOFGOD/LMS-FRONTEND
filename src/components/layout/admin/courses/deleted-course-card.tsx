"use client";

import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
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
import { Loader2, RotateCcw, Users, Trash2, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCourse } from "@/hooks/useCourse";
import { toast } from "sonner";
import { useStats } from "@/context/stats-context";

const DeletedCourseCard = ({
  course,
  onCourseUpdate,
  onCourseRestore
}: { 
  course: Course;
  onCourseUpdate?: () => void;
  onCourseRestore?: (courseId: string) => void;
}) => {
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [isPermanentDeleting, setIsPermanentDeleting] = useState<boolean>(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<boolean>(false);
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState<boolean>(false);
  const { restoreCourse } = useCourse();
  const { refreshStats } = useStats();

  const handleRestoreCourse = async () => {
    setIsRestoring(true);
    try {
      console.log('DeletedCourseCard - Restoring course:', course.id);
      await restoreCourse(course.id);
      
      toast.success('Course restored successfully!');
      
      // Use optimistic update if available, otherwise refetch all courses
      if (onCourseRestore) {
        onCourseRestore(course.id); // Remove from deleted list immediately
      } else if (onCourseUpdate) {
        onCourseUpdate(); // Fallback to refetching all courses
      }
      
      // Refresh stats to update course counts and user statistics
      refreshStats();
    } catch (error) {
      console.error("DeletedCourseCard - Restore error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Provide specific error messages based on common issues
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        toast.error("Authentication failed. Please log in again.");
      } else if (errorMessage.includes("404")) {
        toast.error("Course not found or already restored.");
      } else if (errorMessage.includes("405")) {
        toast.error("Restore method not supported. Please check the API documentation.");
      } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
        toast.error("You don't have permission to restore this course.");
      } else if (errorMessage.includes("500")) {
        toast.error("Server error occurred. Please try again later.");
      } else {
        toast.error(`Failed to restore course: ${errorMessage}`);
      }
      
      // If optimistic restore was used, we might want to refetch to ensure consistency
      if (onCourseRestore && onCourseUpdate) {
        console.log("Restore failed after optimistic update, refetching courses...");
        onCourseUpdate();
      }
    } finally {
      setIsRestoring(false);
      setShowRestoreConfirm(false);
    }
  };

  const handlePermanentDelete = async () => {
    setIsPermanentDeleting(true);
    try {
      console.log('DeletedCourseCard - Permanently deleting course:', course.id);
      // You might want to implement a separate permanent delete endpoint
      // For now, this could be another DELETE call or a different endpoint
      toast.success('Course permanently deleted!');
      
      if (onCourseRestore) {
        onCourseRestore(course.id); // Remove from deleted list
      } else if (onCourseUpdate) {
        onCourseUpdate();
      }
      
      refreshStats();
    } catch (error) {
      console.error("DeletedCourseCard - Permanent delete error:", error);
      toast.error("Failed to permanently delete course");
    } finally {
      setIsPermanentDeleting(false);
      setShowPermanentDeleteConfirm(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Deleted Badge */}
      <div className="absolute top-2 left-2 z-10 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-xs font-semibold">
        Deleted
      </div>

      {/* Course Image */}
      <div className="relative h-32 md:h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover opacity-60" // Reduced opacity for deleted courses
          />
        ) : (
          <Image
            src="/images/student-learning.jpg"
            alt={course.title}
            fill
            className="object-cover opacity-40" // Even more reduced opacity for deleted courses with fallback
          />
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRestoreConfirm(true)}
            disabled={isRestoring || isPermanentDeleting}
            className="bg-white/90 hover:bg-white"
            title="Restore course"
          >
            {isRestoring ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPermanentDeleteConfirm(true)}
            disabled={isRestoring || isPermanentDeleting}
            className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            title="Permanently delete course"
          >
            {isPermanentDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-2 md:p-3">
        <h3 className="text-base md:text-lg font-semibold line-clamp-2 text-slate-600 dark:text-slate-300">
          {course.title}
        </h3>
        <p className="text-gray-500 line-clamp-2 text-xs md:text-sm">{course.description}</p>
        
        <div className="flex justify-between items-center gap-3 pt-2 mt-auto">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-gray-400" />
            <p className="text-xs text-gray-400">Deleted:</p>
          </div>
          <p className="text-xs text-gray-500">
            {course.updatedAt ? formatDate(course.updatedAt) : 'Unknown'}
          </p>
        </div>
        
        <div className="flex justify-between items-center gap-3 pt-1">
          <p className="text-xs font-bold text-gray-400">Original Status:</p>
          <div className={`px-2 py-1 rounded text-xs font-semibold ${
            course.publish 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {course.publish ? 'Published' : 'Draft'}
          </div>
        </div>
      </div>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore &quot;{course.title}&quot;? 
              This will move the course back to your active courses list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreCourse}
              disabled={isRestoring}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                "Restore Course"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={showPermanentDeleteConfirm} onOpenChange={setShowPermanentDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to permanently delete &quot;{course.title}&quot;? 
              This action cannot be undone and will remove all course data permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPermanentDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              disabled={isPermanentDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPermanentDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeletedCourseCard;
