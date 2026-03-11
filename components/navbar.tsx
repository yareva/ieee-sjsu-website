'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects & Workshops' },
    { href: '/events', label: 'Events' },
    { href: '/membership', label: 'Membership' },
    { href: '/team', label: 'Team' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-sm border-b border-[#e5e5ea]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Image
                src="/ieee-mb.png"
                alt="IEEE SJSU Logo"
                width={140}
                height={40}
                style={{ height: '40px', width: 'auto' }}
                className={scrolled ? '' : 'brightness-0 invert'}
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  scrolled 
                    ? 'text-[#1d1d1f] hover:text-[#2563eb]' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Join Discord - outlined */}
            <a
              href="https://discord.gg/VwPdYWSVPS"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-xl font-semibold text-sm border-2 transition-all duration-200 ${
                scrolled
                  ? 'border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb]/10'
                  : 'border-white text-white hover:bg-white/10'
              }`}
            >
              Join Discord
            </a>
            
            {/* Join Now - filled */}
            <Link
              href="/membership"
              className="px-4 py-2 rounded-xl font-semibold text-sm bg-[#2563eb] text-white transition-all duration-200 hover:bg-[#1d4ed8]"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled 
                ? 'text-[#1d1d1f] hover:bg-[#f5f5f7]' 
                : 'text-white hover:bg-white/20'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden pb-4 border-t ${
          scrolled 
            ? 'bg-white border-[#e5e5ea]' 
            : 'bg-[#1d1d1f]/95 backdrop-blur-md border-white/20'
        }`}>
          <div className="px-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  scrolled 
                    ? 'text-[#1d1d1f] hover:bg-[#f5f5f7]' 
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile buttons */}
            <div className="pt-2 space-y-2">
              <a
                href="https://discord.gg/VwPdYWSVPS"
                target="_blank"
                rel="noopener noreferrer"
                className={`block px-4 py-3 rounded-xl font-semibold text-sm text-center border-2 transition-all ${
                  scrolled
                    ? 'border-[#2563eb] text-[#2563eb]'
                    : 'border-white text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Join Discord
              </a>
              <Link
                href="/membership"
                className="block px-4 py-3 rounded-xl font-semibold text-sm text-center bg-[#2563eb] text-white"
                onClick={() => setIsOpen(false)}
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
