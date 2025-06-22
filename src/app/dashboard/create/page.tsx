import CreateCourseForm from "@/components/layout/admin/create/create-course-form";

const CreateCourse = () => {
  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      <p className="font-bold text-2xl">Courses</p>
      <CreateCourseForm />
    </div>
  )
}
export default CreateCourse;