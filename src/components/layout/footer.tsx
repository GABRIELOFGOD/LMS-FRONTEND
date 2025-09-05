import { socials } from '@/data/socials';
import Link from 'next/link';
import React from 'react'

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
  ]
  
  return (
    <div className='bg-muted'>
      <div className="container mx-auto px-3 text-foreground/50 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          {/* Quick Links */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center md:text-left">
            {quickLinks.map((link) => (
              <Link
                key={link.id}
                href={link.path}
                className="hover:text-primary transition-colors"
              >
                <p className='capitalize text-sm md:text-base'>{link.label}</p>
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className='flex gap-4 md:gap-5 justify-center md:ml-auto'>
            {socials.map(({
              icon: Icon, id, link
            }) => (
              <Link
                key={id}
                href={link}
                className="hover:text-primary transition-colors p-1"
              >
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className='pb-6 md:pb-10 text-foreground/60 border-t border-border/20'>
        <p className="text-center text-xs md:text-sm pt-4 md:pt-6">
          &copy; {new Date().getFullYear()} Fact-check Africa. All Rights Reserved
        </p>
      </div>
    </div>
  )
}

export default Footer;