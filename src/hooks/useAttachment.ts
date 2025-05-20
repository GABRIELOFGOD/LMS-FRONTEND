import { BASEURL } from "@/lib/utils";
import axios from "axios";

export const useAttachment = () => {

  const uploadAttachment = async (id: string, value: File) => {
    try {
      const formData = new FormData();
      formData.append("file", value);
      const response = await axios.put(`${BASEURL}/courses/attachments/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  return {
    uploadAttachment
  }
  
}