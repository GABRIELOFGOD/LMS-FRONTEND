import React from 'react'
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react'
import Link from 'next/link'

const About = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
            <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
            About fcalearn
          </h2>
          <p className='text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8'>
            fcalearn is a comprehensive Learning Management System designed to empower individuals 
            with practical skills and knowledge for the digital age. Our courses are crafted to address 
            real-world challenges and provide accessible, high-quality education for everyone.
          </p>
          <Link 
            href="/about" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Learn More About Us
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Quality Content</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Expert-curated courses with practical applications and real-world relevance.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Community Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join a vibrant community of learners and educators from across Africa and beyond.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Certified Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Earn recognized certificates and badges that validate your skills and achievements.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About