import { BASEURL } from "@/lib/utils";

export const useUser = () => {

  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(`${BASEURL}/users`, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });

      const res = await req.json();

      return res;

    } catch (error) {
      throw error;
    }
  }

  return {
    getAllUsers,
  }
  
}