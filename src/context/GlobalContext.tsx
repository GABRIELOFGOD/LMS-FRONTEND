"use client";

import { User } from "@/types/user";
import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

type GlobalContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const GlobalContext = createContext<GlobalContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
});

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
