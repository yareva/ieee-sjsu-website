'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ScrollReveal } from '@/components/scroll-reveal';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavbarProps {
  primaryAction?: string;
  /** Set when the page's top section is light-colored, so the nav needs
   *  dark text/logo instead of white before you've scrolled past it. */
  onLight?: boolean;
  /** Show the light/dark switch. Only for pages whose own styles follow
   *  <html data-theme> (the home page); the bar's colors then follow the
   *  theme too. */
  themeToggle?: boolean;
  /** Bar colors follow the light/dark theme (implied by themeToggle) —
   *  for pages whose top section follows the theme but have no switch. */
  themed?: boolean;
}

export function Navbar({ primaryAction = "Become a Member", onLight = false, themeToggle = false, themed = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events & Projects' },
  ];
  // "Membership" and "Join Us" are one button (below) that goes to /membership
  const onMembership = pathname.startsWith('/membership');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Once scrolled, the bar itself is always dark, so text is always white.
  // Before that, it follows whatever the page underneath needs.
  const dark = !scrolled && onLight;
  // On themed pages the light theme flips the bar to dark-on-light, in CSS
  // (theme-light: variants) so it's right before hydration.
  const lt = (classes: string) => (themeToggle || themed ? classes : '');

  return (
    <>
    {/* Started from here (not the root layout) because the navbar hydrates
        together with each page's content — starting earlier would mark
        sections before React has hydrated them and cause a mismatch. */}
    <ScrollReveal />
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? `bg-slate-950/70 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/10 ${lt('theme-light:bg-white/75 theme-light:border-slate-900/10 theme-light:shadow-slate-900/5')}`
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
            <Image
              src="/ieee-mb.png"
              alt="IEEE SJSU Logo"
              width={140}
              height={48}
              style={{ height: '34px', width: 'auto' }}
              className={dark ? '' : `brightness-0 invert ${lt('theme-light:filter-none')}`}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              const linkColor = isActive
                ? (dark ? 'text-blue-600' : `text-blue-400 ${lt('theme-light:text-blue-600')}`)
                : (dark ? 'text-slate-700 hover:text-slate-900' : `text-white/80 hover:text-white ${lt('theme-light:text-slate-700 theme-light:hover:text-slate-950')}`);
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

            <Link
              href="/membership"
              className={`shrink-0 px-5 py-2 rounded-full font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors ${
                onMembership ? 'ring-2 ring-offset-2 ring-blue-600 ring-offset-transparent' : ''
              }`}
            >
              {primaryAction}
            </Link>

            {themeToggle && (
              <ThemeToggle className="-ml-3 text-white/85 hover:bg-white/10 theme-light:text-slate-800 theme-light:hover:bg-slate-900/5" />
            )}
          </div>

          <div className="md:hidden flex items-center gap-1">
            {themeToggle && (
              <ThemeToggle className="text-white/85 hover:bg-white/10 theme-light:text-slate-800 theme-light:hover:bg-slate-900/5" />
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${
                dark ? 'text-slate-700 hover:bg-slate-900/5' : `text-white hover:bg-white/10 ${lt('theme-light:text-slate-800 theme-light:hover:bg-slate-900/5')}`
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
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
                className="block px-4 py-3 rounded-full font-semibold text-sm text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {primaryAction}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
