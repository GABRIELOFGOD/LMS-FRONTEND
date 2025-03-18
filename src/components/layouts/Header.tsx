"use client";
import Sidebar from "@/app/(dashboard)/_components/Sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


import { cn } from "@/lib/utils"
import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <div className={cn(
      "flex justify-between py-2 bg-white shadow-sm md:px-10 px-3"
    )}>
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu size={22} />
          </SheetTrigger>
          <SheetContent side="left">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div></div>
      <div>
        <Button
          variant="ghost"
          className="cursor-pointer flex gap-3"
        >
          <LogOut
            size={22}
            className="my-auto"
          />
          <p className="flex my-auto font-semibold md:ml-auto">Logout</p>
        </Button>
      </div>
    </div>
  )
}
export default Header