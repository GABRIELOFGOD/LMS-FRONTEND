
import axios from "axios";
import { BASEURL } from '@/lib/utils';
import { Course } from "@/types/course";

export const useCreateCourse = () => {

  const submitCourse = async (title: string) => {
    try {
      const response = await axios.post(`${BASEURL}/courses`, {
        title
      });
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const getSingleCourse = async (id: string) => {
    try {
      const course = await axios.get(`${BASEURL}/courses/${id}`);
      return course.data;
    } catch (error) {
      throw error;
    }
  }

  const updateCourseTitle = async ({
    id, value
  }: {
    id: string,
    value: string
  }) => {
    try {
      const response = await axios.patch(`${BASEURL}/courses/${id}`, {
        title: value
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  return { submitCourse, getSingleCourse, updateCourseTitle };
};