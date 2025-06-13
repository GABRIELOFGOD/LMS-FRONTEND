import { Button } from "@/components/ui/button";

const DashboardCourses = () => {
  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      <div className="w-full flex justify-between">
        <p className="font-bold text-2xl">Courses</p>
        <Button
          className=""
        >
          Create Course
        </Button>
      </div>
    </div>
  )
}
export default DashboardCourses;