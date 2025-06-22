import { BASEURL } from "@/lib/utils";
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

  const createCourse = async ({
    title,
    description
  }: {
    title: string;
    description?: string;
  }) => {
    const token = localStorage.getItem("token");
    
    try {
      const request = await fetch(`${BASEURL}/courses`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description
        })
      });

      const response = await request.json();

      console.log("[RESPONSE]: ", response);
    } catch (error) {
      throw error;
    }
  }
  
  return {
    getCourses,
    getACourse,
    createCourse
  }
}
