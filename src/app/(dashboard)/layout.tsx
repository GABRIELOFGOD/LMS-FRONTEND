"use client";

import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import LearnerNavbar from '@/components/layout/learner/learner-navbar';
import LearnerSidebar from '@/components/layout/learner/learner-sidebar';
import LearnerHeader from '@/components/layout/learner/learner-header';
import { useUser } from '@/context/user-context';
import { ReactNode } from 'react';

const HomeLayout = ({
  children
}: {
  children: ReactNode
}) => {
  const { isLoggedIn, isLoaded } = useUser();

  // Debug logging
  console.log('Dashboard Layout - isLoaded:', isLoaded, 'isLoggedIn:', isLoggedIn);

  // Show loading state while user context is loading
  if (!isLoaded) {
    console.log('Dashboard Layout - Showing loading state');
    return (
      <div>
        <Navbar />
        {children}
        <Footer />
      </div>
    );
  }

  // Layout for logged-in users (similar to learner layout)
  if (isLoggedIn) {
    console.log('Dashboard Layout - Showing learner layout');
    return (
      <div className="h-screen flex flex-col">
        {/* Learner Navbar at the top */}
        <LearnerNavbar />
        
        {/* Main content area with sidebar and content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:flex">
            <LearnerSidebar />
          </div>
          <div className="px-3 md:px-5 h-full overflow-auto w-full">
            <LearnerHeader />
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Layout for guest users
  console.log('Dashboard Layout - Showing guest layout');
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default HomeLayout