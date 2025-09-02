import { BASEURL } from "@/lib/utils";
import { isError } from "./helper";
import { toast } from "sonner";

export const enrollCourse = async (courseId: string) => {
  try {
    const req = await fetch(`${BASEURL}/courses/enroll/${courseId}`, {
      method: "PUT",
      headers: {
        "authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
    });

    const res = await req.json();
    if (!req.ok) throw new Error(res.message || "Failed to enroll for course");
  } catch (error: unknown) {
    if (isError(error)) {
      toast.error(error.message);
      console.error("Login failed", error.message);
    } else {
      console.error("Unknown error", error);
    }
  }
}

// User Stats API
export interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  totalLessons: number;
  overallProgress: number;
  trends: {
    coursesThisMonth: string;
    completedThisMonth: string;
    remainingLessons: string;
    progressEncouragement: string;
  };
}

export const getUserStats = async (): Promise<UserStats | null> => {
  try {
    // Check if running on client side or if we have a base URL
    const baseUrl = BASEURL || (typeof window !== 'undefined' ? window.location.origin : '');
    
    const req = await fetch(`${baseUrl}/api/users/stats`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
    });

    const res = await req.json();
    if (!req.ok) throw new Error(res.message || "Failed to fetch user stats");
    
    return res as UserStats;
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Failed to fetch user stats", error.message);
    } else {
      console.error("Unknown error fetching user stats", error);
    }
    return null;
  }
}