import { Course } from "@/types/course";
import Image from "next/image";
import Link from "next/link";

import ImagePlaceholder from "@/assets/hero-fc.png";
import { Button } from "@/components/ui/button";

const MyCourseCard = ({
  course,
  isCompleted = false
}: {
  course: Course
  isCompleted?: boolean
}) => {
  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex-[5] flex flex-col gap-2">
          <p className="font-bold">{course.title}</p>
          <p className="text-sm text-foreground/60">{course.description}</p>
          <Button
            variant="outline"
            className="w-fit"
            asChild
          >
            <Link href={`/learner/courses/${course.id}`}>
              {isCompleted ? "Review course" : "Resume course"}
            </Link>
          </Button>
        </div>
        <div className="flex-[1] flex flex-col gap-2">
          <div className={`h-full w-full bg-primary rounded-md ${isCompleted ? "bg-green-500" : ""}`}>
            <Image
              src={ImagePlaceholder}
              alt={course.title}
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default MyCourseCard;