import { ReactNode } from "react";
import Crumb from "@/components/Crumb";
import { AuthProvider } from "@/providers/authProvider";

const DashboardLayout = ({ children }: {
  children: ReactNode
}) => {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
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
        <main className="p-4">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
export default DashboardLayout;