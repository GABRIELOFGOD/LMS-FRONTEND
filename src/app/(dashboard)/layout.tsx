import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import { ReactNode } from 'react';

const HomeLayout = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default HomeLayout