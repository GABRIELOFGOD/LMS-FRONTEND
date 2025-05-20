import { courses } from "@/data/courses";
import Image from "next/image";
import ImageUsed from "@/assets/hero-fc.png";
import Rating from "@/components/ui/rating";

const CourseCard = ({ course }: {
  course: typeof courses[0];
}) => {
  return (
    <div className="rounded border-border border bg-muted overflow-hidden">
      <div className="relative w-full h-[150px] shadow-sm">
        <Image
          src={ImageUsed}
          alt="course image"
          fill
          className="object-cover h-full w-full"
        />
      </div>
      <div className="flex flex-col p-3">
        <p className="font-extrabold text-xl truncate line-clamp-2">
          {course.title}
        </p>
        <p className="text-foreground/80 text-sm truncate">
          {course.description}
        </p>
      </div>
      <div className="mt-2 flex justify-between">
        <Rating
          rate={course.rating.vote}
          total={course.rating.total}
        />
      </div>
    </div>
  )
}

export default CourseCard;