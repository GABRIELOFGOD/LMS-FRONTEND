"use client";

import { Badge } from '@/components/ui/badge';
import { Target, Shield, Scale, Eye, Award } from 'lucide-react';

const Values = () => {
  return (
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
  );
};

export default Values;
