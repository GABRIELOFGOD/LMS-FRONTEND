"use client";

import { ReactNode, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Crumb from "@/components/Crumb";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/user-context";
import SimpleLoader from "@/components/simple-loader";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ children }: {
  children: ReactNode
}) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push(`/login?to=${path}`);
    } else {
      if (user?.role !== "admin") {
        router.back();
      }
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center gap-2">
        <SimpleLoader />
      </div>
    )
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Crumb
              current={{
                title: "Dashboard",
                link: "/dashboard",
              }}
            />
          </div>
          <div className="ml-auto px-3">
            {/* <NavActions /> */}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
export default DashboardLayout;