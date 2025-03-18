"use client";

import Image from "next/image"
import SidebarButton, { SidebarButtonProp } from "./SidebarButton"
import { BarChart, Compass, Layout, List } from "lucide-react"
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const path = usePathname();
  
  const homePageNav: SidebarButtonProp[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: Layout
    },
    {
      href: "/courses",
      label: "Browse",
      icon: Compass
    },
  ];

  const teacherPage: SidebarButtonProp[] = [
    {
      href: "/teacher/courses",
      label: "Courses",
      icon: List
    },
    {
      href: "/teacher/analytics",
      label: "Analytics",
      icon: BarChart
    }
  ];

  const isiTeacherPage = path?.includes("/teacher");
  
  const currentPage: SidebarButtonProp[] = isiTeacherPage ? teacherPage : homePageNav;
  
  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-3 w-full mx-auto">
        <div className="w-full mx-auto flex justify-center">
          <Image
            src="/images/Factcheck_Elections.png"
            alt="Logo"
            height={50}
            width={150}
          />
        </div>
      </div>
      <hr className="w-full" />
      <div className="flex flex-col">
        {currentPage.map((page, i) => (
          <SidebarButton
            key={i}
            href={page.href}
            label={page.label}
            icon={page.icon}
          />
        ))}
      </div>
      <div className="mt-auto flex my-5 w-full flex-col">
        <p className="text-center text-gray-500">&copy; FactCheckAfrica {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
export default Sidebar