import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import { ReactNode } from 'react';
import { AuthProvider } from "@/providers/authProvider";

const HomeLayout = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        {children}
        <Footer />
      </AuthProvider>
    </div>
  )
}

export default HomeLayout