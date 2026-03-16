'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  primaryAction?: string;
  transparent?: boolean;
}

export function Navbar({ primaryAction = "Join Now", transparent = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!transparent);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects & Workshops' },
    { href: '/events', label: 'Events' },
    { href: '/membership', label: 'Membership' },
  ];

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image
              src="/ieee-mb.png"
              alt="IEEE SJSU Logo"
              width={140}
              height={48}
              style={{ height: '48px', width: 'auto' }}
              className={scrolled ? '' : 'brightness-0 invert'}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-semibold transition-colors ${
                  scrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <a
              href="https://discord.gg/VwPdYWSVPS"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-xl font-semibold text-sm border-2 transition-all duration-200 ${
                scrolled
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  : 'border-white/50 text-white hover:bg-white/10'
              }`}
            >
              Join Discord
            </a>

            <Link
              href="/membership"
              className="px-4 py-2 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {primaryAction}
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden pb-4 border-t ${
          scrolled ? 'bg-white border-slate-200' : 'bg-slate-900/95 backdrop-blur-md border-white/10'
        }`}>
          <div className="px-4 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  scrolled ? 'text-slate-700 hover:bg-slate-50' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <a
                href="https://discord.gg/VwPdYWSVPS"
                target="_blank"
                rel="noopener noreferrer"
                className={`block px-4 py-3 rounded-xl font-semibold text-sm text-center border-2 ${
                  scrolled ? 'border-blue-600 text-blue-600' : 'border-white/50 text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Join Discord
              </a>
              <Link
                href="/membership"
                className="block px-4 py-3 rounded-xl font-semibold text-sm text-center bg-blue-600 text-white"
                onClick={() => setIsOpen(false)}
              >
                {primaryAction}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
