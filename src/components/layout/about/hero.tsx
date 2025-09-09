"use client";

import { GraduationCap, Building, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const AboutHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium mb-8">
              <GraduationCap className="h-4 w-4" />
              Leading LMS Platform for Fact-Checking Education
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Master the Art of 
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"> Digital Literacy</span>
            </h1>
            
            {/* Subheadline */}
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Join Nigeria&apos;s premier Learning Management System dedicated to building 
                critical thinking skills and combating misinformation across Africa.
              </p>            {/* Organization Info */}
            <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-6 mb-12">
              <div className="flex items-center gap-2 text-blue-200">
                <Building className="h-5 w-5" />
                <span>FactCheck Africa Learning Platform</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <Award className="h-5 w-5" />
                <span>IFCN Certified Training</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/courses" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore Our Courses
              </Link>
              <Link 
                href="/register" 
                className="px-8 py-4 border-2 border-blue-400 text-blue-200 hover:bg-blue-400 hover:text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
              >
                Start Learning Free
                <GraduationCap className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Content - Stats Grid */}
          <div className="relative lg:pl-8">
            {/* Main Content Container */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-8">
              {/* Student Images Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Primary Student Image */}
                <div className="col-span-2">
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/student.jpeg"
                      alt="Student learning fact-checking skills"
                      width={500}
                      height={300}
                      className="object-cover w-full h-64"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                </div>
                
                {/* Secondary Student Image */}
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <Image
                    src="/images/student2.jpeg"
                    alt="Student in learning session"
                    width={250}
                    height={150}
                    className="object-cover w-full h-32"
                  />
                </div>
                
                {/* Achievement Badge */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-4 text-white text-center">
                  <Award className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-bold">IFCN Certified</p>
                  <p className="text-xs opacity-90">Training Program</p>
                </div>
              </div>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-blue-400">1,500+</div>
                  <div className="text-xs text-blue-200 mt-1">Active Students</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-emerald-400">50+</div>
                  <div className="text-xs text-blue-200 mt-1">Expert Courses</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-purple-400">95%</div>
                  <div className="text-xs text-blue-200 mt-1">Success Rate</div>
                </div>
              </div>
              
              {/* Feature Highlights */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Real-world fact-checking scenarios</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm">Industry expert mentorship</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Internationally recognized certificates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
