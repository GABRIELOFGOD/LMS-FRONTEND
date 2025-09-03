import CourseView from "@/components/layout/courses/course-view";

const SingleCoursePreview = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div>
      <div className="container px-3 py-10 mx-auto">
        {id && <CourseView id={id} />}
      </div>
    </div>
  );
};

export default SingleCoursePreview;
