import CoursesTable from "@/components/layout/admin/courses/courses-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DashboardCourses = () => {
  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      <div className="w-full flex justify-between">
        <p className="font-bold text-2xl">Courses</p>
        <Button
          className=""
        >
          <Link
            href={"/dashboard/create"}
          >
            Create Course
          </Link>
        </Button>
      </div>
      <CoursesTable />
    </div>
  )
}
export default DashboardCourses;