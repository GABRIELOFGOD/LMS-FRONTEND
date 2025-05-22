import CourseView from "@/components/layout/courses/course-view";

const SingleCoursePreview = ({params}: {params: {id: string}}) => {
  
  return (
    <div>
      <div className="container px-3 py-10 mx-auto">
        <CourseView id={params.id} />
      </div>
    </div>
  )
}

export default SingleCoursePreview;