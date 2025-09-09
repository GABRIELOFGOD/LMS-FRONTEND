"use client";

import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  Users,
  BookOpen,
  Globe,
  Shield,
  GraduationCap
} from 'lucide-react';

const Benefits = () => {
  return (
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

              {/* Add more benefit nodes here */}
              {/* ... */}
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
  );
};

export default Benefits;
