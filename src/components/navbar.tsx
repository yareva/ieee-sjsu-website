'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  primaryAction?: string;
  /** Set when the page's top section is light-colored, so the nav needs
   *  dark text/logo instead of white before you've scrolled past it. */
  onLight?: boolean;
}

export function Navbar({ primaryAction = "Join Us!", onLight = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events & Projects' },
    { href: '/membership', label: 'Membership' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Once scrolled, the bar itself is always dark, so text is always white.
  // Before that, it follows whatever the page underneath needs.
  const dark = !scrolled && onLight;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-slate-950/70 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/10'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">

          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
            <Image
              src="/ieee-mb.png"
              alt="IEEE SJSU Logo"
              width={140}
              height={48}
              style={{ height: '34px', width: 'auto' }}
              className={dark ? '' : 'brightness-0 invert'}
              priority
            />
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center gap-10">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              const linkColor = isActive
                ? (dark ? 'text-blue-600' : 'text-blue-400')
                : (dark ? 'text-slate-700 hover:text-slate-900' : 'text-white/80 hover:text-white');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${linkColor}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/membership"
            className="hidden md:inline-block shrink-0 px-4 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            {primaryAction}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden ml-auto p-2 rounded-lg transition-colors ${
              dark ? 'text-slate-700 hover:bg-slate-900/5' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden pb-4 border-t border-white/10 bg-slate-950/95 backdrop-blur-lg">
          <div className="px-4 pt-2 space-y-1">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                    isActive ? 'text-blue-400 bg-white/5' : 'text-white/80 hover:bg-white/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/membership"
                className="block px-4 py-3 rounded-lg font-semibold text-sm text-center bg-blue-600 text-white"
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
