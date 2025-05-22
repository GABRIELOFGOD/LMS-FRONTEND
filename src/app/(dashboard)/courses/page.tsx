import CourseMapper from "@/components/layout/courses/course-mapper";

const Courses = () => {
  return (
    <div>
      <div className="container mx-auto px-3 py-10">
        <p className='text-2xl md:text-4xl font-bold'>Courses</p>
        <p className='text-foreground/50 text-sm'>Explore our courses and learn how to identify misinformation and disinformation.</p>
        <div className="mt-10">
          <CourseMapper />
        </div>
      </div>
    </div>
  )
}

export default Courses