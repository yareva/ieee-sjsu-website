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
    { href: '/projects', label: 'Projects' },
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
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${scrolled
        ? 'bg-white/95 shadow-md border-gray-200'
        : 'bg-white/70 border-white/20' // Transparent white at the top
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Image
                src="/ieee-mb.png"
                alt="IEEE SJSU Logo"
                width={140}
                height={40}
                style={{ height: '40px', width: 'auto' }}
                priority
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/20'
              }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden pb-4 border-t ${scrolled ? 'border-border' : 'border-white/20'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${scrolled
                ? 'text-foreground hover:bg-muted'
                : 'text-white hover:bg-white/20'
                }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/membership"
            className={`block mx-4 mt-2 px-4 py-2 rounded-xl font-semibold text-sm text-center transition-all duration-200 hover:scale-105 ${scrolled
              ? 'bg-primary text-black'
              : 'bg-black text-primary'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Join Now
          </Link>
        </div>
      )}
    </div>
    </nav >
  );
}
