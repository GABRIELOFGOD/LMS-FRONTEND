import { BASEURL } from "@/lib/utils";
import axios from "axios";

export const useCategory = () => {

  const getCategories = async () => {
    try {
      const response = await axios.get(`${BASEURL}/categories`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  

  return {
    getCategories
  }
  
}