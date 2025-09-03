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
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      const req = await fetch(`${BASEURL}/auth/`, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });

      const res = await req.json();
      if (!req.ok) throw new Error(res.error);
      if (res.error) throw new Error(res.error);
      
      console.log('UserContext - User authenticated:', res.user);
      setUser(res.user as User);
      setIsLoggedIn(true);

    } catch (error: unknown) {
      console.log("UserContext - Authentication error:", error);
      setUser(null);
      setIsLoggedIn(false);
      // Clear invalid token
      localStorage.removeItem("token");
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