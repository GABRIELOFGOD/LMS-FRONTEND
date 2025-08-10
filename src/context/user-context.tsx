"use client";

import { BASEURL } from "@/lib/utils";
import { User } from "@/types/user";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface userContextType {
  user: User | null
}

const UserContext = createContext<userContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isloaded, setIsLoaded] = useState<boolean>(false);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
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

    } catch (error: unknown) {
      if (error == typeof Error){
        console.log("[ERROR] ", error);
      }
      console.log("[ERROR] ", error);
    } finally {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("User context must be used within the provider");
  return context;
}