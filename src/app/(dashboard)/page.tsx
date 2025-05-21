import CoursePreview from '@/components/layout/home/course-preview';
import Hero from '@/components/layout/home/hero';
import HowItWorks from '@/components/layout/home/how-it-works';
import React from 'react';
import Testimony from '../../components/layout/home/students-testimony';

const Home = () => {
  return (
    <div>
      <Hero />
      <CoursePreview />
      <HowItWorks />
      <Testimony />
    </div>
  )
}

export default Home