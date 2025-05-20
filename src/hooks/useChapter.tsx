import { BASEURL } from "@/lib/utils";
import axios from "axios";

export const useChapter = () => {

  const createChapter = async ({
    courseId, name
  }: {
    courseId: number;
    name: string;
  }) => {
    try {
      const response = await axios.post(`${BASEURL}/chapters`, {
        courseId, name
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  return {
    createChapter,
  }
  
}