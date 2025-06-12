import { useGlobalContext } from "@/context/GlobalContext";
import { BASEURL } from "@/lib/utils";
import { toast } from "sonner";

export const useAuth = () => {
  const { isLoggedIn, setIsLoggedIn } = useGlobalContext();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASEURL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error || !data.token) {
        toast.error(data.message);
        return;
      }
      const token = data.token;

      if (token) {
        setIsLoggedIn(true);
        localStorage.setItem("token", token);
        await getProfile();
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    try {
      const response = await fetch(`${BASEURL}/users/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok){
        throw new Error(data.message);
      }
      return data;

    } catch (error) {
      console.log("Error: ", error);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      // location.assign("/login");
    }
  }

  return { isLoggedIn, setIsLoggedIn, login, getProfile };
};


