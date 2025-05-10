
import axios from "axios";
import { BASEURL } from '@/lib/utils';

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
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        window.location.href = '/teacher/courses';
      } else {
        throw error;
      }
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

  const updateCourseDescription = async ({ id, value }: {
    id: string;
    value: string;
  }) => {
    try {
      const response = await axios.put(`${BASEURL}/courses/${id}`, {
        description: value
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const updateCourseImage = async ({ id, value }: {
    id: string;
    value: File;
  }) => {

    const formData = new FormData();
    formData.append('file', value);

    console.log('FormData:', formData);
    
    try {
      const response = await axios.put(`${BASEURL}/courses/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  return { submitCourse, getSingleCourse, updateCourseTitle, updateCourseDescription, updateCourseImage };
};