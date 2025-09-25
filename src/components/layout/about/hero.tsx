"use client";

import { GraduationCap, Building, Award } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Counter Component
const Counter = ({ end, duration = 2000, suffix = "", color = "" }: { end: number; duration?: number; suffix?: string; color?: string }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          
          const startTime = Date.now();
          const startValue = 0;
          
          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart);
            
            setCount(currentValue);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [end, duration, hasStarted]);

  return (
    <div id={`counter-${end}`} className={`text-2xl md:text-3xl font-bold ${color}`}>
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const AboutHero = () => {
  return (
    <section className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden bg-primary/80">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs md:text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            Leading LMS Platform for Fact-Checking Education
          </div>
          
          {/* Main Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Master the Art of 
            <span className="bg-gradient-to-r from-secondary to-yellow-400 bg-clip-text text-transparent"> Digital Literacy</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join Nigeria&apos;s premier Learning Management System dedicated to building 
            critical thinking skills and combating misinformation across Africa.
          </p>
          
          {/* Organization Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 text-sm">
              <Building className="h-4 w-4" />
              <span className="font-medium">FactCheck Africa Learning Platform</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 text-sm">
              <Award className="h-4 w-4" />
              <span className="font-medium">IFCN Certified Training</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link 
              href="/courses" 
              className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              Explore Our Courses
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-primary rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center text-sm md:text-base"
            >
              Start Learning Free
              <GraduationCap className="h-3 w-3 md:h-4 md:w-4" />
            </Link>
          </div>

          {/* Compact Stats & Features */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
            {/* Statistics Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Counter end={7} suffix="+" color="text-secondary" />
                <div className="text-white/80 text-xs md:text-sm">Students</div>
              </div>
              <div className="text-center">
                <Counter end={4} suffix="+" color="text-yellow-400" />
                <div className="text-white/80 text-xs md:text-sm">Courses</div>
              </div>
              <div className="text-center">
                <Counter end={95} suffix="%" color="text-blue-300" />
                <div className="text-white/80 text-xs md:text-sm">Success</div>
              </div>
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-white/90">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                <span>Real-world scenarios</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-white/90">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <span>Expert mentorship</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-white/90">
                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
                <span>Certified training</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutHero;
