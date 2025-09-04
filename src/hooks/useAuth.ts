import { RegistrationFormType } from "@/components/registration-form";
import { BASEURL } from "@/lib/utils";
import { isError } from "@/services/helper";
import { toast } from "sonner";

export const useAuth = () => {

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      console.log('BASEURL:', BASEURL);
      console.log('Full login URL:', `${BASEURL}/auth/login`);
      
      if (!BASEURL) {
        throw new Error('API base URL is not configured');
      }
      
      const response = await fetch(`${BASEURL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, ok: response.ok, hasToken: !!data.token });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid email or password");
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        }
        throw new Error(data.message || data.error || `Login failed (${response.status})`);
      }
      
      if (data.error || !data.token) {
        throw new Error(data.message || data.error || "Login failed - no token received");
      }
      
      const token = data.token;
      console.log('Login successful, storing token');
      localStorage.setItem("token", token);
      
      // Store user data for use in user context
      const userData = {
        id: data.id,
        role: data.role,
        email: email, // Use the email from login form
        fname: data.fname || data.firstName || '', // Handle different API response formats
        lname: data.lname || data.lastName || '',  // Handle different API response formats
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      localStorage.setItem("user", JSON.stringify(userData));
      console.log('User data stored:', userData);
      
      // Return success to allow the component to handle routing
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('Login failed:', error);
      
      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('Network')) {
          toast.error('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Invalid email or password')) {
          toast.error('Invalid email or password. Please try again.');
        } else if (error.message.includes('Server error')) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      
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


