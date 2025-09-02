"use client";

import { BASEURL } from "@/lib/utils";
import { User } from "@/types/user";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface GlobalContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  refreshUser: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
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
      
      setUser(res.user as User);
      setIsLoggedIn(true);

    } catch (error: unknown) {
      console.log("[ERROR] ", error);
      setUser(null);
      setIsLoggedIn(false);
      // Clear invalid token
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }

  const refreshUser = () => {
    setIsLoading(true);
    getUser();
  }

  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <GlobalContext.Provider value={{ 
      user, 
      isLoggedIn, 
      isLoading,
      refreshUser 
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}