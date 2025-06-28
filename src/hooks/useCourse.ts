import { BASEURL } from "@/lib/utils";
import { toast } from "sonner";

export const useCourse = () => {

  const token = localStorage.getItem("token");

  const getAvailableCourses = async () => {
    try {
      const response = await fetch(`${BASEURL}/courses/published`);
      return await response.json();
    } catch (error) {
      toast.error("Error fetching courses");
      console.error(error);
    }
  }
  
  const getCourses = async () => {
    try {
      const response = await fetch(`${BASEURL}/courses`, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      toast.error("Error fetching courses");
      console.error(error);
    }
  };

  const getACourse = async (id: string) => {
    try {
      const req = await fetch(`${BASEURL}/courses/${id}`);
      const theCourse = await req.json();
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

  const updateCourseTitle = async (id: string, title: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const req = await fetch(`${BASEURL}/courses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: title })
      });

      return await req.json();
      
    } catch (error) {
      throw error;
    }
  }
  
  return {
    getCourses,
    getACourse,
    createCourse,
    getAvailableCourses,

    updateCourseTitle
  }
}
