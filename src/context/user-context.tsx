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
  // Progress tracking
  courseProgress: Map<string, CourseProgress>;
  updateChapterProgress: (courseId: string, chapterId: string, totalChapters: number) => Promise<void>;
  getCourseProgress: (courseId: string) => CourseProgress | null;
  refreshProgress: () => void;
  syncAllProgressToAPI: () => Promise<void>;
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

  // Progress tracking functions
  const updateChapterProgress = async (courseId: string, chapterId: string, totalChapters: number) => {
    try {
      console.log('updateChapterProgress - Updating progress:', { courseId, chapterId, totalChapters });

      let updatedProgress: Map<string, CourseProgress>;

      setCourseProgress(prev => {
        const newProgress = new Map(prev);
        const existing = newProgress.get(courseId) || {
          courseId,
          completedChapters: [],
          totalChapters,
          progress: 0,
          isCompleted: false
        };

        // Add chapter to completed list if not already there
        if (!existing.completedChapters.includes(chapterId)) {
          existing.completedChapters.push(chapterId);
        }

        // Calculate new progress
        existing.progress = (existing.completedChapters.length / totalChapters) * 100;
        existing.isCompleted = existing.completedChapters.length === totalChapters;

        if (existing.isCompleted && !existing.completedAt) {
          existing.completedAt = new Date().toISOString();
        }

        newProgress.set(courseId, existing);
        updatedProgress = newProgress;
        
        // Store in localStorage for persistence
        const progressData = Object.fromEntries(newProgress);
        localStorage.setItem('courseProgress', JSON.stringify(progressData));
        
        return newProgress;
      });

      // Sync to backend API (single course update)
      await syncCourseProgressToAPI(courseId, updatedProgress!.get(courseId)!);
      
    } catch (error) {
      console.error('Failed to update chapter progress:', error);
    }
  };

  // Single API call to sync course progress
  const syncCourseProgressToAPI = async (courseId: string, courseProgress: CourseProgress) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`${BASEURL}/users/progress/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          completedChapters: courseProgress.completedChapters,
          totalChapters: courseProgress.totalChapters,
          progress: courseProgress.progress,
          isCompleted: courseProgress.isCompleted,
          completedAt: courseProgress.completedAt
        })
      });

      console.log('syncCourseProgressToAPI - Progress synced successfully for course:', courseId);
    } catch (error) {
      console.error('syncCourseProgressToAPI - Failed to sync progress:', error);
      // Don't throw - keep local state even if API fails
    }
  };

  // Bulk sync all progress to API (useful for initial load or periodic sync)
  const syncAllProgressToAPI = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || courseProgress.size === 0) return;

      const progressArray = Array.from(courseProgress.values());

      await fetch(`${BASEURL}/users/progress/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseProgress: progressArray
        })
      });

      console.log('syncAllProgressToAPI - All progress synced successfully');
    } catch (error) {
      console.error('syncAllProgressToAPI - Failed to sync all progress:', error);
    }
  };

  const getCourseProgress = (courseId: string): CourseProgress | null => {
    return courseProgress.get(courseId) || null;
  };

  const refreshProgress = async () => {
    try {
      // Try to load from API first
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${BASEURL}/users/progress`, {
            headers: {
              'authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const apiProgressData = await response.json();
            const progressMap = new Map<string, CourseProgress>();
            
            // Convert API response to Map
            if (Array.isArray(apiProgressData.courseProgress)) {
              apiProgressData.courseProgress.forEach((course: CourseProgress) => {
                progressMap.set(course.courseId, course);
              });
              
              setCourseProgress(progressMap);
              
              // Update localStorage with API data
              const progressData = Object.fromEntries(progressMap);
              localStorage.setItem('courseProgress', JSON.stringify(progressData));
              
              console.log('refreshProgress - Loaded progress from API');
              return;
            }
          }
        } catch (apiError) {
          console.log('refreshProgress - API unavailable, falling back to localStorage');
        }
      }

      // Fallback to localStorage
      const stored = localStorage.getItem('courseProgress');
      if (stored) {
        const progressData = JSON.parse(stored);
        const progressMap = new Map<string, CourseProgress>();
        
        // Properly type the entries
        Object.entries(progressData).forEach(([key, value]) => {
          progressMap.set(key, value as CourseProgress);
        });
        
        setCourseProgress(progressMap);
        console.log('refreshProgress - Loaded progress from localStorage');
      }
    } catch (error) {
      console.error('Failed to load stored progress:', error);
    }
  };

  useEffect(() => {
    getUser();
    refreshProgress(); // Load stored progress on mount
  }, []);
  
  return (
    <UserContext.Provider value={{ 
      user, 
      isLoaded: isloaded, 
      isLoggedIn,
      refreshUser,
      courseProgress,
      updateChapterProgress,
      getCourseProgress,
      refreshProgress,
      syncAllProgressToAPI
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