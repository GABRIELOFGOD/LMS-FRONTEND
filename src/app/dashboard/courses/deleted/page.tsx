import DeletedCoursesTable from "@/components/layout/admin/courses/deleted-courses-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const DeletedCoursesPage = () => {
  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
          <p className="font-bold text-2xl">Deleted Courses</p>
        </div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
            !
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              Deleted Courses Archive
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              These courses have been soft-deleted and are no longer visible to students. 
              You can restore them to make them active again, or permanently delete them.
            </p>
          </div>
        </div>
      </div>
      
      <DeletedCoursesTable />
    </div>
  )
}

export default DeletedCoursesPage;
