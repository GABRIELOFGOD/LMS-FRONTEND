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

// Extended interface for user course data
export interface UserCourseStats extends UserStats {
  enrolledCourses: Course[];
  completedCourses: Course[];
  inProgressCourses: Course[];
}

// Import Course type
import { Course } from "@/types/course";

export const getUserStats = async (): Promise<UserStats | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found");
      return null;
    }
    
    const req = await fetch(`${BASEURL}/users/stats`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${token}`,
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

// Get user enrolled courses (in-progress and completed)
export const getUserCourses = async (): Promise<UserCourseStats | null> => {
  try {
    const req = await fetch(`${BASEURL}/users/enrolled-courses`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
    });

    const res = await req.json();
    if (!req.ok) throw new Error(res.message || "Failed to fetch user courses");
    
    return res as UserCourseStats;
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Failed to fetch user courses", error.message);
    } else {
      console.error("Unknown error fetching user courses", error);
    }
    return null;
  }
}

// Alternative: Get courses from stats endpoint if it includes course data
export const getUserCoursesFromStats = async (): Promise<{ inProgressCourses: Course[], completedCourses: Course[] } | null> => {
  try {
    const req = await fetch(`${BASEURL}/users/stats`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
    });

    const res = await req.json();
    if (!req.ok) throw new Error(res.message || "Failed to fetch user stats");
    
    // Assuming the stats endpoint returns course data along with stats
    return {
      inProgressCourses: res.inProgressCourses || [],
      completedCourses: res.completedCourses || []
    };
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Failed to fetch user courses from stats", error.message);
    } else {
      console.error("Unknown error fetching user courses from stats", error);
    }
    return null;
  }
}