'use client'

import Link from 'next/link'
import Image from 'next/image'

const contactInfo = [
  { label: 'Email', value: 'CSC_growth@clawpointsecuritycollective.com', href: 'mailto:CSC_growth@clawpointsecuritycollective.com' },
  { label: 'Location', value: '4833 Berewick Town Center Drive, Unit E, #277, Charlotte, NC 28278', href: null }
]

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/clawpoint/', icon: 'LINKED IN' }
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-black border-t border-tactical-green-dark">
      {/* Tactical grid background */}
      <div className="absolute inset-0 tactical-grid opacity-5" />

      {/* Scanline effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night-vision/5 to-transparent opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-tactical-green-dark">
          {/* Logo & Tagline */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/logo.png"
                  alt="Clawpoint Security Collective"
                  fill
                  className="object-contain drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]"
                />
              </div>
              <div>
                <div className="text-white font-mono font-bold text-base tracking-wider">
                  CLAWPOINT
                </div>
                <div className="text-night-vision font-mono font-bold text-base tracking-wider">
                  SECURITY COLLECTIVE
                </div>
              </div>
            </Link>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              Protecting what matters most. Expert cybersecurity for modern threats.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-mono font-bold text-sm tracking-wider uppercase mb-6 relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-night-vision to-transparent" />
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item) => (
                <li key={item.label} className="font-mono text-sm">
                  <div className="text-tactical-green-light text-xs uppercase tracking-wider mb-1">
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-night-vision transition-colors duration-300"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-gray-300">{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Security */}
          <div className="md:flex md:flex-col md:items-end">
            <h3 className="text-white font-mono font-bold text-sm tracking-wider uppercase mb-6 relative inline-block">
              Connect
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-night-vision to-transparent" />
            </h3>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-10 px-3 border border-tactical-green bg-black hover:bg-tactical-green-dark hover:border-night-vision transition-all duration-300 flex items-center justify-center text-night-vision font-mono text-xs font-bold group relative"
                  aria-label={social.label}
                >
                  {social.icon}
                  {/* Tactical corners */}
                  <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-night-vision opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-night-vision opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Copyright */}
          <div className="text-gray-500 font-mono text-xs text-center">
            <p>
              &copy; {currentYear} Clawpoint Security Collective. All rights reserved.
            </p>
          </div>
        </div>

      </div>

      {/* Decorative tactical corners */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-tactical-green-dark/30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-tactical-green-dark/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-tactical-green-dark/30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-tactical-green-dark/30 pointer-events-none" />

      {/* Background eyes watching (very subtle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute left-[10%] top-[20%] flex gap-3">
          <div className="w-1 h-1 bg-night-vision rounded-full" />
          <div className="w-1 h-1 bg-night-vision rounded-full" />
        </div>
        <div className="absolute right-[15%] top-[40%] flex gap-2">
          <div className="w-0.5 h-0.5 bg-night-vision rounded-full" />
          <div className="w-0.5 h-0.5 bg-night-vision rounded-full" />
        </div>
        <div className="absolute left-[70%] bottom-[30%] flex gap-4">
          <div className="w-1 h-1 bg-night-vision rounded-full" />
          <div className="w-1 h-1 bg-night-vision rounded-full" />
        </div>
      </div>
    </footer>
  )
}
