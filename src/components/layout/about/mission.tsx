"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Building, Scale, Globe, Shield, Eye } from 'lucide-react';

const Mission = () => {
  return (
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
  );
};

export default Mission;
