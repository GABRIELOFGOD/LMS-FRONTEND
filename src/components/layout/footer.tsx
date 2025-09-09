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
    <footer className='bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white'>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <Logo />
              </div>
              <div>
              </div>
            </div>
            <p className="text-blue-100 leading-relaxed mb-6">
              Nigeria's premier Learning Management System dedicated to building critical thinking skills and combating misinformation across Africa.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-200">
                <Building className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Brain Builders Youth Development Initiative</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">info@factcheckafrica.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-1 transform"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Learning Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Learning</h4>
            <div className="space-y-3">
              {learningLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-1 transform"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Connect With Us</h4>
            
            {/* Social Links */}
            <div className='flex gap-4 mb-8'>
              {socials.map(({
                icon: Icon, id, link
              }) => (
                <Link
                  key={id}
                  href={link}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h5 className="text-white font-semibold mb-3">Stay Updated</h5>
              <p className="text-blue-200 text-sm mb-4">Get the latest courses and fact-checking resources.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 text-sm focus:outline-none focus:border-blue-400"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-semibold transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className='border-t border-white/10 bg-black/20'>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-blue-200 text-sm">
              <p>&copy; {new Date().getFullYear()} FactCheck Africa. All Rights Reserved</p>
              <div className="hidden md:flex items-center gap-4">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-blue-200 text-sm">
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