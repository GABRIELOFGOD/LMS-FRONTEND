"use client";

import Link from "next/link";
import Logo from "../ui/Logo";
import { Button } from "../ui/button";
import { useGlobalContext } from "@/context/GlobalContext";
import { UserIcon } from "lucide-react";

const Navbar = () => {
  const { user } = useGlobalContext();

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
    // {
    //   id: 5,
    //   label: "Login",
    //   path: "/login"
    // }
  ]
  
  return (
    <div className="shadow-sm bg-background">
      <div className="w-full px-3 py-4 flex justify-between container md:px-0 mx-auto">
        <Logo />
        <div className="flex gap-10">
          <div className="flex gap-5 my-auto">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="capitalize text-sm font-semibold"
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <Link href={"/login"} className="capitalize text-sm font-semibold">
                Login
              </Link>
            )}
          </div>
          {!user ?
          (
            <Button>
              <Link href={"/register"}>Get Started</Link>
            </Button>
          ) :
          (
            <Button
              className="w-8 h-8 rounded-full flex justify-center items-center my-auto"
              variant={"ghost"}
            >
              <Link href={"/learner/profile"}>
                <UserIcon className="text-muted-foreground" size={20} />
              </Link>
            </Button>
              
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar