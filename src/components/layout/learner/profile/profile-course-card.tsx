import { Course } from "@/types/course";
import Image from "next/image";

import CourseImage from "@/assets/hero-fc.png";

const ProfileCourseCard = ({
  course
}: {
  course: Course;
}) => {
  return (
    <div className="flex gap-3 flex-col">
      <div className="w-full h-32 relative rounded-md overflow-hidden bg-primary/60">
        <Image
          src={CourseImage}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-lg font-bold line-clamp-2">{course.title}</p>
        <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
      </div>
    </div>
  )
}

export default ProfileCourseCard;