import { BASEURL } from "@/lib/utils";
import { UserRole } from "@/types/user";

export const useUser = () => {

  
  const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const req = await fetch(`${BASEURL}/users`, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });

      const res = await req.json();
      if (!req.ok) throw new Error(res.message);
      return res;
      
    } catch (error) {
      throw error;
    }
  }
  
  const changeRole = async (role: UserRole, id: string) => {
    const token = localStorage.getItem("token");
    try {
      const req = await fetch(`${BASEURL}/users/role/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({role: role})
      });
      
      const res = await req.json();
      return res;
    } catch (error) {
      throw error;
    }
  }
  
  return {
    getAllUsers,
    changeRole
  }
  
}
