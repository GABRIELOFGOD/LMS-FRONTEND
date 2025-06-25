import { BASEURL } from "@/lib/utils";
import { UserRole } from "@/types/user";

export const useUser = () => {

  const token = localStorage.getItem("token");

  const getAllUsers = async () => {
    try {
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

  const changeRole = async (role: UserRole, id: string) => {
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