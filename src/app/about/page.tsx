"use client";

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';
import AboutHero from '@/components/layout/about/hero';
import Benefits from '@/components/layout/about/benefits';
import Story from '@/components/layout/about/story';
import Mission from '@/components/layout/about/mission';
import Values from '@/components/layout/about/values';
import Testimony from '@/components/layout/home/students-testimony';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AboutHero />
      <Benefits />
      <Story />
      <Mission />
      <Values />
      <Testimony />
      <Footer />
    </div>
  );
};

export default AboutPage;
