"use client";

import CoursePreview from '@/components/layout/home/course-preview';
import Hero from '@/components/layout/home/hero';
import HowItWorks from '@/components/layout/home/how-it-works';
import React, { useEffect } from 'react';
import Testimony from '../../components/layout/home/students-testimony';
import About from '@/components/layout/home/home-about';
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';

const Home = () => {
  const { user, isLoggedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if user context is fully loaded
    if (isLoaded && isLoggedIn && user) {
      console.log('Home - User is logged in, redirecting based on role:', user.role);
      
      // Route based on user role
      switch (user.role) {
        case UserRole.ADMIN:
          router.push("/dashboard");
          break;
        case UserRole.TEACHER:
          router.push("/dashboard");
          break;
        case UserRole.STUDENT:
          router.push("/learner");
          break;
        default:
          router.push("/learner");
      }
    }
  }, [isLoaded, isLoggedIn, user, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show loading while redirecting
  if (isLoggedIn && user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  // Only show home page content to non-authenticated users
  return (
    <div>
      <Hero />
      <About />
      <CoursePreview />
      <HowItWorks />
      <Testimony />
    </div>
  )
}

export default Home