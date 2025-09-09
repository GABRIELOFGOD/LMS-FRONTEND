import { socials } from '@/data/socials';
import Link from 'next/link';
import React from 'react';
import { MapPin, Mail, Phone, Building } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const Footer = () => {
  const quickLinks = [
    {
      id: 1,
      label: "About",
      path: "/about",
    },
    {
      id: 2,
      label: "Courses",
      path: "/courses"
    },
    {
      id: 3,
      label: "Contact",
      path: "/contacts"
    },
    {
      id: 4,
      label: "Privacy Policy",
      path: "/privacy"
    }
  ];

  const learningLinks = [
    {
      id: 1,
      label: "Dashboard",
      path: "/dashboard"
    },
    {
      id: 2,
      label: "My Courses",
      path: "/learner/courses"
    },
    {
      id: 3,
      label: "Certifications",
      path: "/dashboard/certifications"
    },
    {
      id: 4,
      label: "Resources",
      path: "/dashboard/resources"
    }
  ];
  
  return (
    <footer className='bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white w-full'>
      {/* Main Footer Content */}
      <div className="w-full px-2 py-4 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
              <div className="bg-white rounded-lg p-1.5 shadow-lg">
                <Logo />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white">FactCheck Africa</h3>
                <p className="text-xs text-blue-200">Learning Platform</p>
              </div>
            </div>
            <p className="text-blue-100 leading-relaxed mb-4 text-xs md:text-sm">
              Nigeria's premier Learning Management System dedicated to building critical thinking skills and combating misinformation across Africa.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-200">
                <Building className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs">Brain Builders Youth Development Initiative</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-200">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs">Lagos, Nigeria</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-200">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs">info@factcheckafrica.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm md:text-base font-semibold text-white mb-3">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-1 transform text-xs md:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Learning Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm md:text-base font-semibold text-white mb-3">Learning</h4>
            <div className="space-y-2">
              {learningLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-1 transform text-xs md:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect & Newsletter */}
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm md:text-base font-semibold text-white mb-3">Connect With Us</h4>
            
            {/* Social Links */}
            <div className='flex gap-2 md:gap-3 mb-4 justify-center sm:justify-start'>
              {socials.map(({
                icon: Icon, id, link
              }) => (
                <Link
                  key={id}
                  href={link}
                  className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="h-3 w-3 md:h-4 md:w-4" />
                </Link>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              <h5 className="text-white font-semibold mb-2 text-xs md:text-sm">Stay Updated</h5>
              <p className="text-blue-200 text-xs mb-3">Get latest courses and resources.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white placeholder-blue-300 text-xs focus:outline-none focus:border-blue-400"
                />
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs font-semibold transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className='border-t border-white/10 bg-black/20 w-full'>
        <div className="w-full px-2 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-blue-200 text-xs text-center">
              <p>&copy; {new Date().getFullYear()} FactCheck Africa. All Rights Reserved</p>
              <div className="flex items-center gap-2 md:gap-3">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-1 text-blue-200 text-xs text-center">
              <span>Powered by</span>
              <span className="font-semibold text-white">Brain Builders Youth Development Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;