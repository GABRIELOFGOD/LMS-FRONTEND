import { RegistrationFormType } from "@/components/registration-form";
import { BASEURL } from "@/lib/utils";
import { isError } from "@/services/helper";
import { toast } from "sonner";

export const useAuth = () => {

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
      if (data.error || !data.token) throw new Error(data.message || "Login failed");
      const token = data.token;
      localStorage.setItem("token", token);
      
      // Return success to allow the component to handle routing
      return { success: true, user: data.user };
      
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData: Omit<RegistrationFormType, 'confirmPassword'>) => {
    try {
      const response = await fetch(`${BASEURL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        toast.error(data.message);
        return;
      }

      toast.success("Account created successfully. Redirecting...");
      location.assign(`/verify-otp?email=${userData.email}`);
      
    } catch (error) {
      console.log(error);
    }
  }

  const verifyOtp = async (otp: string, email: string) => {
    try {
      const req = await fetch(`${BASEURL}/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp })
      });

      const res = await req.json();

      if (res.success === true) {
        toast.success(res.message);
        location.assign("/login");
      }
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Login failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  }

  const resendOpt = async (email: string) => {
    try {
      const req = await fetch(`${BASEURL}/users/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
      });

      const res = await req.json();

      if (res.success === true) {
        toast.success(res.message);
      }
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Login failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  }

  return { login, registerUser, verifyOtp, resendOpt };
};


