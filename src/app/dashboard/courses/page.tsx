"use client";

import CoursesTable from "@/components/layout/admin/courses/courses-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useDeletedCoursesCount } from "@/hooks/useDeletedCoursesCount";

const DashboardCourses = () => {
  const { deletedCount, isLoading } = useDeletedCoursesCount();

  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      <div className="w-full flex justify-between">
        <p className="font-bold text-2xl">Courses</p>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/courses/deleted">
              <Trash2 className="h-4 w-4 mr-2" />
              Deleted Courses
              {!isLoading && deletedCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                  {deletedCount}
                </span>
              )}
            </Link>
          </Button>
          <Button>
            <Link href="/dashboard/create">
              Create Course
            </Link>
          </Button>
        </div>
      </div>
      
      <CoursesTable />
    </div>
  )
}
export default DashboardCourses;