import Image from "next/image";
import ImageUsed from "@/assets/hero-fc.png";
import Rating from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";

const CourseCard = ({ course }: {
  course: Course;
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
        <p className="text-foreground/80 text-sm line-clamp-2 my-2">
          {course.description}
        </p>
        <div className="mt-2 flex justify-between">
          {/* <div>
            <p className="text-xs text-foreground/60 italic">Rating: ({course.rating.vote}/{course.rating.total})</p>
            <Rating
              rate={course.rating.vote}
              total={course.rating.total}
            />
          </div> */}
          <div className="rounded bg-secondary text-white text-xs italic h-fit w-fit px-4 py-1 my-auto font-semibold">Free</div>
        </div>
        <div className="mt-5 w-full">
          <Button
            className="w-full"
          >
            Add to Wish-list
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard;