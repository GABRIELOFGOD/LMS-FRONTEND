"use client";

import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import LearnerNavbar from '@/components/layout/learner/learner-navbar';
import { useUser } from '@/context/user-context';
import { ReactNode } from 'react';

const HomeLayout = ({
  children
}: {
  children: ReactNode
}) => {
  const { isLoggedIn, isLoaded } = useUser();

  // Show loading state while user context is loading
  if (!isLoaded) {
    return (
      <div>
        <Navbar />
        {children}
        <Footer />
      </div>
    );
  }

  return (
    <div>
      {/* Show LearnerNavbar for logged-in users, regular Navbar for guests */}
      {isLoggedIn ? <LearnerNavbar /> : <Navbar />}
      {children}
      <Footer />
    </div>
  )
}

export default HomeLayout