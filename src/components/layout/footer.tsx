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
      <div className="container mx-auto px-3 text-foreground/50 py-10 grid grid-cols-2 md:grid-cols-1 gap-5">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.id}
              href={link.path}
            >
              <p className='capitalize'>{link.label}</p>
            </Link>
          ))}
        </div>

        <div className='flex gap-5 justify-center'>
          {socials.map(({
            icon: Icon, id, link
          }) => (
            <Link
              key={id}
              href={link}
            >
              <Icon />
            </Link>
          ))}
        </div>
      </div>
      <div className='pb-10 text-foreground/60'>
        <p className="text-center">
          &copy; {new Date().getFullYear()} Fact-check Africa. All Rights Reserved
        </p>
      </div>
    </div>
  )
}

export default Footer;