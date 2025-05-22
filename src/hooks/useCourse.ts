import { Course } from "@/types/course";
import axios from "axios";
import { toast } from "sonner";

export const useCourse = () => {

  const getCourses = async () => {
    try {
      const response = await axios.get("/courses.json");
      return response.data;
    } catch (error) {
      toast.error("Error fetching courses");
      console.error(error);
    }
  };

  const getACourse = async (id: string) => {
    try {
      const allCourses = await axios.get("/courses.json");
      const theCourse = allCourses.data.find((course: Course) => course.id === id);
      return theCourse;
    } catch (error) {
      toast.error("Error occur while getting this course data");
      console.error(error);
    }
  }
  
  return {
    getCourses,
    getACourse
  }
}
