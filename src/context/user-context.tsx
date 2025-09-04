"use client";

import { BASEURL } from "@/lib/utils";
import { User } from "@/types/user";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface userContextType {
  user: User | null;
  isLoaded: boolean;
  isLoggedIn: boolean;
  refreshUser: () => void;
}

const UserContext = createContext<userContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isloaded, setIsLoaded] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
      
      // Token is valid, get or create user data
      const storedUserData = localStorage.getItem("user");
      let userData;
      
      if (storedUserData) {
        try {
          userData = JSON.parse(storedUserData);
          console.log('UserContext - Using stored user data:', userData);
          
          // Validate required fields and fill in missing ones
          userData = {
            id: userData.id || 'unknown',
            role: userData.role || 'student',
            email: userData.email || '',
            fname: userData.fname || userData.name?.split(' ')[0] || 'Learner',
            lname: userData.lname || userData.name?.split(' ')[1] || '',
            createdAt: userData.createdAt || new Date().toISOString(),
            updatedAt: userData.updatedAt || new Date().toISOString()
          };
        } catch {
          console.log('UserContext - Failed to parse stored user data, creating minimal user');
          userData = {
            id: 'unknown',
            role: 'student',
            email: '',
            fname: 'Learner',
            lname: '',
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

  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <UserContext.Provider value={{ 
      user, 
      isLoaded: isloaded, 
      isLoggedIn,
      refreshUser 
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