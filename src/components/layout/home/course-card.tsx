import Image from "next/image";
// import Rating from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import Link from "next/link";

const CourseCard = ({ course }: {
  course: Course;
}) => {
  const actualChapters = course.chapters.filter((cht) => cht.isPublished);
  
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
          <div className="flex justify-between gap-3">
            <p className="text-xs text-gray-600 font-bold">{actualChapters.length} Chapters</p>
          </div>
        </div>
        <div className="mt-3 md:mt-5 w-full">
          <Link href={`/course/${course.id}`} className="w-full">
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