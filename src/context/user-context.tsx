"use client";

import { BASEURL } from "@/lib/utils";
import { User } from "@/types/user";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getUserProfile } from "@/services/common";

// interface ChapterProgress {
//   chapterId: string;
//   courseId: string;
//   completed: boolean;
//   completedAt?: string;
// }

interface CourseProgress {
  courseId: string;
  completedChapters: string[];
  totalChapters: number;
  progress: number;
  isCompleted: boolean;
  completedAt?: string;
}

interface userContextType {
  user: User | null;
  isLoaded: boolean;
  isLoggedIn: boolean;
  refreshUser: () => void;
  // Simple progress tracking
  courseProgress: Map<string, CourseProgress>;
  updateChapterProgress: (courseId: string, chapterId: string, totalChapters: number) => Promise<void>;
  getCourseProgress: (courseId: string) => CourseProgress | null;
}

const UserContext = createContext<userContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isloaded, setIsLoaded] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [courseProgress, setCourseProgress] = useState<Map<string, CourseProgress>>(new Map());

  const getUser = async (retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      const token = localStorage.getItem("token");
      console.log('UserContext - Token found:', !!token);
      
      if (!token) {
        console.log('UserContext - No token, setting as logged out');
        setIsLoggedIn(false);
        setUser(null);
        setIsLoaded(true);
        return;
      }

      console.log('UserContext - Validating token with server...');
      
      // Use /users/stats endpoint (works for all roles) to validate token
      const req = await fetch(`${BASEURL}/users/stats`, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });

      console.log('UserContext - Server response:', { status: req.status, ok: req.ok });
      
      if (!req.ok) {
        if (req.status === 401) {
          console.log('UserContext - Token expired or invalid, clearing token');
          localStorage.removeItem("token");
          throw new Error('Authentication token expired');
        }
        if (req.status === 403) {
          console.log('UserContext - Access forbidden, clearing token');
          localStorage.removeItem("token");
          throw new Error('Access forbidden - please login again');
        }
        const res = await req.json().catch(() => ({}));
        throw new Error(res.error || res.message || `HTTP ${req.status}`);
      }
      
      // Token is valid, try to get fresh user profile data first
      console.log('UserContext - Token valid, fetching user profile...');
      const freshUserData = await getUserProfile();
      
      if (freshUserData && freshUserData.fname) {
        console.log('UserContext - Fresh user data retrieved:', freshUserData);
        
        // Clean up any dummy bio data from the backend
        if (freshUserData.bio && (
          freshUserData.bio.includes('Passionate learner exploring new technologies') ||
          freshUserData.bio.includes('building amazing projects')
        )) {
          console.log('UserContext - Removing dummy bio data');
          freshUserData.bio = '';
        }
        
        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(freshUserData));
        setUser(freshUserData as User);
        setIsLoggedIn(true);
        return;
      }
      
      console.log('UserContext - No fresh user data available, using stored data...');
      
      // Token is valid, get or create user data
      const storedUserData = localStorage.getItem("user");
      let userData;
      
      if (storedUserData) {
        try {
          userData = JSON.parse(storedUserData);
          console.log('UserContext - Using stored user data:', userData);
          
          // Validate required fields - only use default if fname is truly missing
          const originalData = userData; // Keep reference to original for checking
          userData = {
            id: userData.id || 'unknown',
            role: userData.role || 'student',
            email: userData.email || '',
            fname: userData.fname || userData.firstName || '', // Don't default to 'Learner' if we have stored data
            lname: userData.lname || userData.lastName || '',
            bio: userData.bio || '',
            avatar: userData.avatar || '',
            profileImage: userData.profileImage || userData.avatar || '',
            createdAt: userData.createdAt || new Date().toISOString(),
            updatedAt: userData.updatedAt || new Date().toISOString()
          };
          
          // Clean up any dummy bio data from stored data
          if (userData.bio && (
            userData.bio.includes('Passionate learner exploring new technologies') ||
            userData.bio.includes('building amazing projects')
          )) {
            console.log('UserContext - Removing dummy bio data from stored data');
            userData.bio = '';
            localStorage.setItem("user", JSON.stringify(userData)); // Update localStorage
          }
          
          // Only default to 'Learner' if we have no first name at all
          if (!userData.fname && !originalData.firstName) {
            console.log('UserContext - No first name found, using default');
            userData.fname = 'Learner';
          }
          
        } catch {
          console.log('UserContext - Failed to parse stored user data, creating minimal user');
          userData = {
            id: 'unknown',
            role: 'student',
            email: '',
            fname: 'Learner',
            lname: '',
            bio: '',
            avatar: '',
            profileImage: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      } else {
        console.log('UserContext - No stored user data, creating minimal user');
        userData = {
          id: 'unknown',
          role: 'student',
          email: '',
          fname: 'Learner',
          lname: '',
          bio: '',
          avatar: '',
          profileImage: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      console.log('UserContext - User authenticated successfully:', userData);
      setUser(userData as User);
      setIsLoggedIn(true);

    } catch (error: unknown) {
      console.error("UserContext - Authentication error:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Retry on network errors, but not on auth errors
      if (retryCount < maxRetries && !errorMessage.includes('401') && !errorMessage.includes('expired')) {
        console.log(`UserContext - Retrying authentication attempt ${retryCount + 1}/${maxRetries}`);
        setTimeout(() => getUser(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      setUser(null);
      setIsLoggedIn(false);
      
      // Clear invalid token only if it's an authentication error
      if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('token') || errorMessage.includes('expired')) {
        console.log('UserContext - Clearing invalid token');
        localStorage.removeItem("token");
      }
    } finally {
      console.log('UserContext - Setting loaded to true');
      setIsLoaded(true);
    }
  }

  const refreshUser = () => {
    setIsLoaded(false);
    getUser();
  }

  // Simple chapter completion - just call the API
  const updateChapterProgress = async (courseId: string, chapterId: string, totalChapters: number) => {
    try {
      console.log('updateChapterProgress - Completing chapter:', { courseId, chapterId });

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Call the API to mark chapter as completed
      const response = await fetch(`${BASEURL}/users/complete/chapter/${courseId}/${chapterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to complete chapter: ${response.status}`);
      }

      const result = await response.json();
      console.log('updateChapterProgress - Chapter completed successfully:', result);

      // Update local progress for immediate UI feedback
      const currentProgress = courseProgress.get(courseId) || {
        courseId,
        completedChapters: [],
        totalChapters,
        progress: 0,
        isCompleted: false,
        completedAt: undefined
      };

      // Add chapter to completed list if not already there
      const updatedChapters = currentProgress.completedChapters.includes(chapterId)
        ? currentProgress.completedChapters
        : [...currentProgress.completedChapters, chapterId];

      const updatedProgress: CourseProgress = {
        ...currentProgress,
        completedChapters: updatedChapters,
        progress: result.progress || Math.round((updatedChapters.length / totalChapters) * 100),
        isCompleted: result.completed || updatedChapters.length >= totalChapters,
        completedAt: result.completed ? new Date().toISOString() : currentProgress.completedAt
      };

      // Update local state
      const newMap = new Map(courseProgress);
      newMap.set(courseId, updatedProgress);
      setCourseProgress(newMap);

      console.log('updateChapterProgress - Local progress updated:', updatedProgress);
      
    } catch (error) {
      console.error('updateChapterProgress - Failed:', error);
      throw error;
    }
  };

  const getCourseProgress = (courseId: string): CourseProgress | null => {
    return courseProgress.get(courseId) || null;
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <UserContext.Provider value={{ 
      user, 
      isLoaded: isloaded, 
      isLoggedIn,
      refreshUser,
      courseProgress,
      updateChapterProgress,
      getCourseProgress
    }}>
      {children}
    </UserContext.Provider>
  )
}


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("User context must be used within the provider");
  return context;
}