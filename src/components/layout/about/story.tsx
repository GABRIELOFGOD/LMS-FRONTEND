"use client";

import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Users, CheckCircle } from 'lucide-react';

const Story = () => {
  return (
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
                Built under the <strong>FactCheck Africa</strong>, we combine cutting-edge technology 
                with proven educational methodologies.
              </p>
              <p>
                As a registered platform under <strong className="text-blue-600">Brain Builders Youth Development Initiative (BBYDI)</strong>, 
                we&apos;ve created an ecosystem where learners can develop critical thinking skills, master fact-checking 
                techniques, and become champions of truth in their communities.
              </p>
              <p>
                Our courses are crafted by industry experts and align with international standards, including 
                the <strong>International Fact-Checking Network (IFCN) principles</strong>. Every student who 
                completes our programs gains practical skills that are immediately applicable in today&apos;s 
                information-rich environment.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">11+</div>
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
  );
};

export default Story;
