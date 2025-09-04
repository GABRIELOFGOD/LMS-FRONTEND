import { ReactNode } from "react";
import Crumb from "@/components/Crumb";
import { AuthProvider } from "@/providers/authProvider";

const DashboardLayout = ({ children }: {
  children: ReactNode
}) => {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <header className="flex h-12 md:h-14 shrink-0 items-center gap-2 border-b bg-background">
          <div className="flex flex-1 items-center gap-2 px-3 md:px-4">
            <Crumb
              current={{
                title: "Dashboard",
                link: "/dashboard",
              }}
            />
          </div>
          <div className="ml-auto px-3 md:px-4">
            {/* <NavActions /> */}
          </div>
        </header>
        <main className="p-3 md:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
export default DashboardLayout;