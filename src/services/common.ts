import { BASEURL } from "@/lib/utils";
import { isError } from "./helper";
import { toast } from "sonner";

export const enrollCourse = async (courseId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please log in to enroll in courses");
    }

    const req = await fetch(`${BASEURL}/courses/enroll/${courseId}`, {
      method: "PUT",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!req.ok) {
      const errorRes = await req.json().catch(() => ({}));
      if (req.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      } else if (req.status === 409) {
        toast.info("You are already enrolled in this course!");
        return { success: true, message: "Already enrolled" };
      }
      throw new Error(errorRes.message || errorRes.error || `Enrollment failed (${req.status})`);
    }

    const res = await req.json();
    toast.success("Successfully enrolled in course!");
    return res;
  } catch (error: unknown) {
    console.error('enrollCourse - Error:', error);
    if (isError(error)) {
      if (!error.message.includes('already enrolled')) {
        toast.error(error.message);
      }
      console.error("Enrollment failed", error.message);
    } else {
      toast.error("Failed to enroll in course");
      console.error("Unknown error", error);
    }
    throw error;
  }
}

// User Stats API - Updated to match actual backend response
export interface UserStats {
  progress: unknown[]; // Progress tracking array
  certificates: unknown[]; // User certificates
  coursesCompleted: unknown[]; // Completed courses array
  // coursesEnrolled: {
  //   id: string;
  //   title: string;
  //   description: string;
  //   price: string;
  //   imageUrl: string;
  //   isFree: boolean;
  //   publish: boolean;
  //   isDeleted: boolean;
  //   createdAt: string;
  //   updatedAt: string;
  // }[]; // Enrolled courses array
  coursesEnrolled: EnrolledCourse[] // Use our extended type with backend typo
  currentStraek: number; // Current streak (note: API has typo "Straek")
  longestStreak: number; // Longest streak
  trends?: {
    coursesThisMonth: string;
    completedThisMonth: string;
    remainingLessons: string;
    progressEncouragement: string;
  };
}

// Extended interface for user course data  
export interface UserCourseStats {
  enrolledCourses: Course[];
  completedCourses: Course[];
  inProgressCourses: Course[];
  stats: UserStats;
}

// Import Course type
import { Course, EnrolledCourseTypes } from "@/types/course";

// Extend EnrolledCourseTypes to include both spellings for compatibility
export interface EnrolledCourse extends Omit<EnrolledCourseTypes, 'comppletedChapters'> {
  comppletedChapters: EnrolledCourseTypes['comppletedChapters']; // Backend typo spelling
  completedChapters?: EnrolledCourseTypes['comppletedChapters']; // Future-proof correct spelling
}

// Cache for getUserStats to prevent excessive API calls
let statsCache: { data: UserStats | null; timestamp: number } | null = null;
const STATS_CACHE_DURATION = 30000; // 30 seconds

export const getUserStats = async (): Promise<UserStats | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found");
      return null;
    }
    
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (statsCache && (now - statsCache.timestamp) < STATS_CACHE_DURATION) {
      console.log('getUserStats - Returning cached data');
      return statsCache.data;
    }
    
    console.log('getUserStats - Fetching user statistics...');
    const req = await fetch(`${BASEURL}/users/stats`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!req.ok) {
      if (req.status === 401) {
        console.warn("getUserStats - Unauthorized, token may be expired");
        // Clear cache on auth error
        statsCache = null;
        return null;
      }
      const errorRes = await req.json().catch(() => ({}));
      throw new Error(errorRes.message || `Failed to fetch user stats (${req.status})`);
    }

    const res = await req.json();
    console.log('getUserStats - Raw response:', res);
    console.log('getUserStats - Response type:', typeof res);
    console.log('getUserStats - coursesEnrolled:', res.coursesEnrolled, typeof res.coursesEnrolled);
    console.log('getUserStats - progress:', res.progress, typeof res.progress);
    console.log('getUserStats - currentStraek:', res.currentStraek, typeof res.currentStraek);
    console.log('getUserStats - longestStreak:', res.longestStreak, typeof res.longestStreak);
    
    // Ensure the response matches expected structure
    const filteredEnrolledCourses = await filterValidCourses(res.coursesEnrolled || []);
    const userStats: UserStats = {
      progress: res.progress || [],
      certificates: res.certificates || [],
      coursesCompleted: res.coursesCompleted || [],
      coursesEnrolled: filteredEnrolledCourses as EnrolledCourse[],
      currentStraek: res.currentStraek || 0,
      longestStreak: res.longestStreak || 0,
      trends: res.trends || {
        coursesThisMonth: "+0 this month",
        completedThisMonth: "+0 this month",
        remainingLessons: "0 remaining",
        progressEncouragement: "Getting started!"
      }
    };
    
    // Cache the result
    statsCache = {
      data: userStats,
      timestamp: now
    };
    
    console.log('getUserStats - Processed stats with course filtering:', {
      originalEnrolled: res.coursesEnrolled?.length || 0,
      filteredEnrolled: filteredEnrolledCourses.length
    });
    return userStats;
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Failed to fetch user stats", error.message);
    } else {
      console.error("Unknown error fetching user stats", error);
    }
    return null;
  }
}

// Function to clear the stats cache (call this when user enrolls/unenrolls from courses)
export const clearStatsCache = () => {
  console.log('clearStatsCache - Clearing user stats cache');
  statsCache = null;
}

// Filter valid courses (remove deleted/unavailable courses)
// This function now uses client-side filtering based on course properties to avoid API loops
export const filterValidCourses = async (courses: EnrolledCourse[]): Promise<EnrolledCourse[]> => {
  if (!Array.isArray(courses) || courses.length === 0) {
    return courses;
  }

  try {
    console.log('filterValidCourses - Filtering', courses.length, 'courses client-side');
    const validCourses = [];
    
    for (const course of courses) {
      if (!course || typeof course !== 'object') {
        console.warn('filterValidCourses - Invalid course object:', course);
        continue;
      }
      
      // const courseObj = course as { 
      //   id?: string;
      //   isDeleted?: boolean;
      //   deleted?: boolean;
      //   status?: string;
      //   deletedAt?: string | null;
      //   publish?: boolean;
      // };
      const courseObj = course
      
      // Skip if no id
      if (!courseObj.course.id) {
        console.warn('filterValidCourses - Course missing id:', course);
        continue;
      }
      
      // Check if course is deleted using client-side data
      if (courseObj.course.isDeleted === true) {
        console.log(`filterValidCourses - Course ${courseObj.course.id} is deleted, removing from list`);
        continue;
      }
      
      // Optional: Remove unpublished courses (uncomment if needed)
      // if (courseObj.publish === false) {
      //   console.log(`filterValidCourses - Course ${courseObj.id} is unpublished, removing from list`);
      //   continue;
      // }
      
      // Course appears valid based on client data
      validCourses.push(course);
    }
    
    if (validCourses.length !== courses.length) {
      console.log(`filterValidCourses - Filtered courses: ${validCourses.length}/${courses.length} valid`);
    }
    
    return validCourses;
  } catch (error) {
    console.error('filterValidCourses - Error filtering courses:', error);
    // Return original courses if filtering fails
    return courses;
  }
};

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

// Get user profile data
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("getUserProfile - No token found");
      return null;
    }
    
    console.log('getUserProfile - Fetching user profile...');
    
    //  /users/profile first
    const req = await fetch(`${BASEURL}/users/profile`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

  

    if (!req.ok) {
      if (req.status === 401) {
        console.warn("getUserProfile - Unauthorized, token may be expired");
        return null;
      }
      if (req.status === 404) {
        console.warn("getUserProfile - User profile endpoints not available");
        return null;
      }
      const errorRes = await req.json().catch(() => ({}));
      throw new Error(errorRes.message || `Failed to fetch user profile (${req.status})`);
    }

    const userData = await req.json();
    console.log('getUserProfile - User profile fetched successfully:', userData);
    
    // Normalize the user data structure
    const normalizedUser = {
      id: userData.id || userData._id,
      role: userData.role,
      email: userData.email,
      fname: userData.fname || userData.firstName || userData.first_name,
      lname: userData.lname || userData.lastName || userData.last_name,
      bio: userData.bio || userData.biography || '',
      avatar: userData.avatar || userData.profileImage || userData.profile_image || '',
      profileImage: userData.profileImage || userData.avatar || userData.profile_image || '',
      createdAt: userData.createdAt || userData.created_at,
      updatedAt: userData.updatedAt || userData.updated_at
    };
    
    return normalizedUser;
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Failed to fetch user profile", error.message);
    } else {
      console.error("Unknown error fetching user profile", error);
    }
    return null;
  }
};

// Admin Stats Interface - Matches actual backend API response structure
export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  // Optional fields for backward compatibility
  recentActivity?: Array<{
    id: string;
    user: string;
    action: string;
    course: string;
    time: string;
  }>;
  trends?: {
    usersThisMonth: number;
    coursesThisMonth: number;
    enrollmentsThisMonth: number;
  };
}

// Backend API Response Structure (as returned from /users/admin-stats)
export interface BackendAdminStatsResponse {
  details: {
    name: string;
    bio: string | null;
    avatar: string;
    initials: string;
    joinedAt: string;
  };
  stats: Array<{
    title: string;
    value: number;
    icon: string;
    trend: string;
  }>;
}

// Get admin statistics from the backend
export const getAdminStats = async (): Promise<AdminStats | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("getAdminStats - No authentication token found");
      return null;
    }
    
    console.log('getAdminStats - Fetching admin statistics...');
    const req = await fetch(`${BASEURL}/users/admin-stats`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!req.ok) {
      if (req.status === 401) {
        console.warn("getAdminStats - Unauthorized, token may be expired");
        return null;
      }
      if (req.status === 403) {
        console.warn("getAdminStats - Forbidden, user may not have admin access");
        return null;
      }
      const errorRes = await req.json().catch(() => ({}));
      throw new Error(errorRes.message || `Failed to fetch admin stats (${req.status})`);
    }

    const res: BackendAdminStatsResponse = await req.json();
    console.log('getAdminStats - Raw response:', res);
    
    // Transform backend response to our interface format
    const statsMap = new Map(res.stats.map(stat => [stat.title, stat]));
    
    const adminStats: AdminStats = {
      totalUsers: statsMap.get("Total Users")?.value || 0,
      totalCourses: statsMap.get("Active Courses")?.value || 0,
      publishedCourses: statsMap.get("Active Courses")?.value || 0, // Using same value as courses for now
      totalEnrollments: statsMap.get("Certifications")?.value || 0, // Map to available data
      // Generate mock recent activity for now since backend doesn't provide it
      recentActivity: [],
      // Generate trend data from backend trend strings
      trends: {
        usersThisMonth: extractTrendValue(statsMap.get("Total Users")?.trend || "0%"),
        coursesThisMonth: extractTrendValue(statsMap.get("Active Courses")?.trend || "0%"),
        enrollmentsThisMonth: extractTrendValue(statsMap.get("Certifications")?.trend || "0%")
      }
    };
    
    console.log('getAdminStats - Processed admin stats:', adminStats);
    return adminStats;
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Failed to fetch admin stats", error.message);
    } else {
      console.error("Unknown error fetching admin stats", error);
    }
    return null;
  }
};

// Helper function to extract numeric trend values from strings like "↑ 100%" or "0%"
const extractTrendValue = (trendString: string): number => {
  const match = trendString.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 0;
};

// User profile update interface
export interface UserProfileUpdate {
  fname?: string;
  lname?: string;
  bio?: string;
  phone?: string;
  address?: string;
  avatar?: File | string;
  profileImage?: string;
}

// Update user profile - supports both /users/{userId} and /users/profile endpoints
export const updateUserProfile = async (profileData: UserProfileUpdate, userId?: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("updateUserProfile - No authentication token found");
      return false;
    }
    
    console.log('updateUserProfile - Updating profile with:', profileData);
    
    // Use userId-specific endpoint if provided, otherwise use profile endpoint
    const endpoint = userId ? `/users/${userId}` : '/users/profile';
    
    // Check if we have an avatar file to upload
    if (profileData.avatar && profileData.avatar instanceof File) {
      // Use FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      if (profileData.fname) formData.append('fname', profileData.fname);
      if (profileData.lname) formData.append('lname', profileData.lname);
      if (profileData.bio) formData.append('bio', profileData.bio);
      if (profileData.phone) formData.append('phone', profileData.phone);
      if (profileData.address) formData.append('address', profileData.address);
      
      // Add avatar file
      formData.append('avatar', profileData.avatar);
      
      console.log('updateUserProfile - Uploading with FormData including avatar');
      
      const req = await fetch(`${BASEURL}${endpoint}`, {
        method: "PATCH",
        headers: {
          "authorization": `Bearer ${token}`
          // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData
      });

      if (!req.ok) {
        if (req.status === 401) {
          console.warn("updateUserProfile - Unauthorized, token may be expired");
          return false;
        }
        if (req.status === 403) {
          console.warn("updateUserProfile - Forbidden, user may not have access");
          return false;
        }
        const errorRes = await req.text();
        throw new Error(errorRes || `Failed to update profile (${req.status})`);
      }

      // Backend may return text or JSON response
      const response = await req.text();
      console.log('updateUserProfile - Profile update response:', response);
      
      return true;
    } else {
      // No file upload, use regular JSON request  
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { avatar, ...updateData } = profileData;
      
      const req = await fetch(`${BASEURL}${endpoint}`, {
        method: "PATCH",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      if (!req.ok) {
        if (req.status === 401) {
          console.warn("updateUserProfile - Unauthorized, token may be expired");
          return false;
        }
        if (req.status === 403) {
          console.warn("updateUserProfile - Forbidden, user may not have access");
          return false;
        }
        const errorRes = await req.text();
        throw new Error(errorRes || `Failed to update profile (${req.status})`);
      }

      // Backend may return text or JSON response
      const response = await req.text();
      console.log('updateUserProfile - Profile update response:', response);
      
      return true;
    }
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Failed to update user profile", error.message);
    } else {
      console.error("Unknown error updating user profile", error);
    }
    return false;
  }
};