import Image from "next/image";
// import Rating from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import Link from "next/link";
import { Video, FileText } from "lucide-react";

const CourseCard = ({ course }: {
  course: Course;
}) => {
  const actualChapters = course.chapters.filter((cht) => cht.isPublished);
  
  // Helper function to detect media types in course chapters
  const getMediaTypes = () => {
    const mediaTypes = new Set();
    actualChapters.forEach(chapter => {
      if (chapter.video) {
        const lower = chapter.video.toLowerCase();
        if (lower.includes('.pdf') || lower.includes('application/pdf')) {
          mediaTypes.add('pdf');
        } else {
          mediaTypes.add('video');
        }
      }
    });
    return Array.from(mediaTypes) as string[];
  };

  const mediaTypes = getMediaTypes();
  
  return (
    <div className="rounded border-border border bg-muted overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative w-full h-[120px] md:h-[150px] shadow-sm">
        <Image
          src={course.imageUrl || ""}
          alt="course image"
          fill
          className="object-cover h-full w-full"
        />
      </div>
      <div className="flex flex-col p-3 md:p-4">
        <p className="font-extrabold text-base md:text-xl truncate line-clamp-2">
          {course.title}
        </p>
        <p className="text-foreground/80 text-xs md:text-sm line-clamp-2 my-2">
          {course.description}
        </p>
        <div className="mt-2 flex justify-between items-center">
          {/* <div>
            <p className="text-xs text-foreground/60 italic">Rating: ({course.rating.vote}/{course.rating.total})</p>
            <Rating
              rate={course.rating.vote}
              total={course.rating.total}
            />
          </div> */}
          {/* <div className="rounded bg-secondary text-white text-xs italic h-fit w-fit px-4 py-1 my-auto font-semibold">Free</div> */}
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-600 font-bold">{actualChapters.length} Chapters</p>
            {mediaTypes.length > 0 && (
              <div className="flex items-center gap-1">
                {mediaTypes.includes('video') && (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Video className="h-3 w-3" />
                  </div>
                )}
                {mediaTypes.includes('pdf') && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <FileText className="h-3 w-3" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 md:mt-5 w-full">
          <Link href={`/learner/courses/${course.id}`} className="w-full">
            <Button className="w-full text-sm md:text-base">
              Enroll
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseCard;