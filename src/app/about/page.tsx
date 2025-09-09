"use client";

import React from 'react';
import { 
  Shield, 
  Users, 
  Globe, 
  CheckCircle, 
  Award,
  FileText,
  Eye,
  Scale,
  Newspaper,
  MapPin,
  ExternalLink,
  Building,
  Calendar,
  Target,
  BookOpen,
  GraduationCap,
  Star,
  Quote
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/footer';

// Import existing testimonials from home component
const testimonials = [
  {
    name: "Jane Doe",
    role: "Frontend Developer",
    rating: 5,
    text: "This LMS helped me land my first tech job. The content is top-notch and easy to follow! The fact-checking methodology course completely transformed my approach to information verification.",
  },
  {
    name: "Alex Johnson", 
    role: "Digital Media Specialist",
    rating: 5,
    text: "I never thought online learning could be this effective. The quizzes and videos are so engaging. The practical exercises helped me identify misinformation in my daily work.",
  },
  {
    name: "Maria Gonzalez",
    role: "Journalism Graduate",
    rating: 5,
    text: "The mentorship and structure of this platform made all the difference in my learning journey. I now feel confident fact-checking claims and verifying sources before publishing.",
  },
  {
    name: "David Kim",
    role: "Communications Manager",
    rating: 5,
    text: "The practical projects included really helped me build my portfolio. The fact-checking skills I learned are now essential in my role managing corporate communications.",
  },
  {
    name: "Sara Lee",
    role: "Social Media Coordinator",
    rating: 5,
    text: "After using this LMS, I successfully enhanced my career prospects. The certificate I earned opened doors to new opportunities in digital communications and content verification.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Real Story */}
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
                Join Nigeria's premier Learning Management System dedicated to building 
                critical thinking skills and combating misinformation across Africa.
              </p>
              
              {/* Organization Info */}
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

            {/* Right Content - Clean Professional Layout */}
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

      {/* Benefits of Online Learning Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">Why Online Learning</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Benefits of Our
              <span className="text-blue-600"> Online Learning Platform</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the transformative power of digital education designed specifically for fact-checking and media literacy.
            </p>
          </div>

          <div className="space-y-20">
            {/* Interactive Hub Diagram */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
              {/* Central Hub */}
              <div className="text-center mb-12">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white mx-auto max-w-md">
                  <GraduationCap className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-3">Benefits of Online Learning</h3>
                  <p className="text-blue-100">Central platform connecting all learning advantages</p>
                </div>
              </div>

              {/* Benefit Nodes Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-3 text-white flex-shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Stronger Collaboration</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">Between Teachers</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white flex-shrink-0">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Higher Cognitive Skills</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">Development</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3 text-white flex-shrink-0">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Student Transformation</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">Beliefs and Actions</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-3 text-white flex-shrink-0">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Authentic Context</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">Contextualised Content</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-3 text-white flex-shrink-0">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Learner-Centred</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">Communication Context</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white flex-shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Authentic Communication</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">Real-world Practice</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Benefits with Research Image */}
            <div className="grid lg:grid-cols-2 gap-16 items-start mt-20">
              {/* Left Side - Research Image */}
              <div className="lg:pr-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 sticky top-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Research-Based Evidence</h3>
                  <div className="relative rounded-xl overflow-hidden mb-6">
                    <Image
                      src="/images/benefit.jpeg"
                      alt="Benefits of Online Learning Research Diagram"
                      width={500}
                      height={400}
                      className="object-contain w-full h-auto"
                      priority
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      Educational research demonstrates the measurable impact of online learning on student outcomes and teacher collaboration.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Peer-Reviewed Research</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Detailed Benefits */}
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    How Our Platform Delivers These Benefits
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Each benefit is carefully integrated into our learning experience through proven methodologies.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Users className="h-8 w-8" />,
                      title: "Stronger Collaboration Between Teachers",
                      description: "Our platform connects expert fact-checkers and educators globally, fostering knowledge sharing and collaborative curriculum development through integrated communication tools.",
                      color: "text-emerald-600",
                      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
                    },
                    {
                      icon: <BookOpen className="h-8 w-8" />,
                      title: "Development of Higher Cognitive Skills",
                      description: "Interactive modules and case studies enhance critical thinking, analytical reasoning, and information evaluation capabilities through structured learning paths.",
                      color: "text-purple-600",
                      bgColor: "bg-purple-50 dark:bg-purple-900/20"
                    },
                    {
                      icon: <Globe className="h-8 w-8" />,
                      title: "Transformation of Students' Beliefs and Actions",
                      description: "Evidence-based learning transforms how students approach information, making them active defenders against misinformation in their communities.",
                      color: "text-orange-600",
                      bgColor: "bg-orange-50 dark:bg-orange-900/20"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className={`p-6 ${benefit.bgColor} rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300`}>
                      <div className="flex gap-4">
                        <div className={`${benefit.color} mt-1 flex-shrink-0`}>
                          {benefit.icon}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{benefit.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">Our Learning Platform</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Empowering Africa Through 
                <span className="text-blue-600"> Digital Literacy</span>
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                <p>
                  Our comprehensive <strong className="text-gray-900 dark:text-white">Learning Management System</strong> is specifically 
                  designed to address the critical need for media literacy and fact-checking skills across Africa. 
                  Built under the <strong>FactCheck Africa initiative</strong>, we combine cutting-edge technology 
                  with proven educational methodologies.
                </p>
                <p>
                  As a registered platform under <strong className="text-blue-600">Brain Builders Youth Development Initiative (BBYDI)</strong>, 
                  we've created an ecosystem where learners can develop critical thinking skills, master fact-checking 
                  techniques, and become champions of truth in their communities.
                </p>
                <p>
                  Our courses are crafted by industry experts and align with international standards, including 
                  the <strong>International Fact-Checking Network (IFCN) principles</strong>. Every student who 
                  completes our programs gains practical skills that are immediately applicable in today's 
                  information-rich environment.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1,500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Active Learners</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-2xl">
                <div className="absolute top-6 right-6">
                  <BookOpen className="h-12 w-12 text-blue-600 opacity-20" />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Expert-Led Courses</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Industry professionals and certified trainers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Certified Learning</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Internationally recognized certificates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Community Learning</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Peer-to-peer support and collaboration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Focus Areas */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Mission Statement */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">Our Mission</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 max-w-4xl mx-auto leading-tight">
              To provide accurate, timely, and unbiased fact-check reports that 
              <span className="text-blue-600"> empower citizens</span> to make informed decisions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We believe that access to factual information is a fundamental right that enables citizens 
              to demand accountability and drive positive change across Africa.
            </p>
          </div>

          {/* Focus Areas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Electoral Activities",
                description: "Fact-checking political claims, campaign promises, and election-related information to ensure voters have accurate data.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <Building className="h-8 w-8" />,
                title: "Government Issues",
                description: "Verifying government statements, policy claims, and public announcements to promote transparency.",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                icon: <Scale className="h-8 w-8" />,
                title: "Governance Accountability",
                description: "Holding leaders accountable by fact-checking their actions, promises, and public statements.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Climate Issues",
                description: "Verifying climate-related claims and environmental information crucial for Africa's sustainable development.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Conflicts in Africa",
                description: "Fact-checking conflict-related information to prevent the spread of harmful misinformation during crises.",
                color: "from-red-500 to-red-600"
              },
              {
                icon: <Eye className="h-8 w-8" />,
                title: "Media Literacy",
                description: "Educating citizens on how to identify misinformation and become critical consumers of information.",
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((area, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800 overflow-hidden">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center p-4 bg-gradient-to-r ${area.color} rounded-xl mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {area.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{area.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Principles */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Our Principles</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Guided by the International 
              <span className="text-emerald-600"> Fact-Checking Network</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We uphold the five core principles of the IFCN, ensuring our courses meet the highest 
              international standards of fact-checking excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { value: "Accuracy", icon: <Target className="h-6 w-6" />, color: "bg-blue-500" },
              { value: "Integrity", icon: <Shield className="h-6 w-6" />, color: "bg-emerald-500" },
              { value: "Ethics", icon: <Scale className="h-6 w-6" />, color: "bg-purple-500" },
              { value: "Transparency", icon: <Eye className="h-6 w-6" />, color: "bg-orange-500" },
              { value: "Independence", icon: <Award className="h-6 w-6" />, color: "bg-red-500" }
            ].map((principle, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 ${principle.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {principle.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{principle.value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">Student Success Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real experiences from learners who have transformed their careers through our fact-checking courses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800 overflow-hidden">
                <CardContent className="p-8">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200 dark:text-blue-800" />
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic pl-6">
                      "{testimonial.text}"
                    </p>
                  </div>
                  
                  {/* Student Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500">
                      <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* View More Testimonials */}
          <div className="text-center mt-12">
            <Link 
              href="/testimonials" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              View More Success Stories
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-8">
            <GraduationCap className="h-4 w-4" />
            Join 1,500+ Students Already Learning
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Fact-Checking Journey Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Master critical thinking skills, learn professional fact-checking methodologies, and earn 
            internationally recognized certificates. Your journey to becoming a digital literacy champion starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/courses" 
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 justify-center"
            >
              <BookOpen className="h-5 w-5" />
              Browse All Courses
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
            >
              <Users className="h-5 w-5" />
              Join Our Community
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-200">Expert-Led Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-200">Student Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Learning Access</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
