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

  const getUser = async () => {
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
      const req = await fetch(`${BASEURL}/auth/`, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });

      const res = await req.json();
      console.log('UserContext - Server response:', { status: req.status, ok: req.ok, response: res });
      
      if (!req.ok) {
        throw new Error(res.error || res.message || `HTTP ${req.status}`);
      }
      
      if (res.error) {
        throw new Error(res.error);
      }
      
      if (!res.user) {
        throw new Error('No user data received from server');
      }
      
      console.log('UserContext - User authenticated successfully:', res.user);
      setUser(res.user as User);
      setIsLoggedIn(true);

    } catch (error: unknown) {
      console.error("UserContext - Authentication error:", error);
      setUser(null);
      setIsLoggedIn(false);
      
      // Clear invalid token only if it's an authentication error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('token')) {
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