"use client";

import Link from "next/link";
import Logo from "../ui/Logo";
import { Button } from "../ui/button";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  label: string;
  path: string;
}

const Navbar = () => {
  const { user } = useGlobalContext();
  const [menu, setMenu] = useState<MenuItem[]>([]);

  const menuItems = [
    {
      id: 1,
      label: "Home",
      path: "/"
    },
    {
      id: 2,
      label: "courses",
      path: "/courses"
    },
    {
      id: 3,
      label: "About",
      path: "/about"
    },
    {
      id: 4,
      label: "contact",
      path: "/contact"
    },
    {
      id: 5,
      label: "Login",
      path: "/login"
    }
  ]

  useEffect(() => {
    if (user) {
      setMenu(menuItems.slice(0, 4));
    } else {
      setMenu(menuItems);
    }
  }, [user]);
  
  return (
    <div className="shadow-sm bg-background">
      <div className="w-full px-3 py-4 flex justify-between container md:px-0 mx-auto">
        <Logo />
        <div className="flex gap-10">
          <div className="flex gap-5 my-auto">
            {menu.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="capitalize text-sm font-semibold"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Button>
            <Link href={"/register"}>Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Navbar