import { cn } from "@/lib/utils"
import Sidebar from "./_components/Sidebar"
import { ReactNode } from "react"
import Header from "@/components/layouts/Header";

const DashboardLayout = ({
  children
}: {
  children: ReactNode;
}) => {
  return (
    <div className="flex h-screen w-full">
      <div className={cn(
        "h-full hidden md:flex flex-col shadow-sm w-72"
      )}>
        <Sidebar />
      </div>
      <div className="w-full h-full flex flex-col">
        <Header />
        <div className="px-3 md:px-10 h-full">{children}</div>
      </div>
    </div>
  )
}
export default DashboardLayout