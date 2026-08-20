'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Instagram, Facebook, ArrowUp } from 'lucide-react';

export function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="bg-black text-white">
      <div className="px-8 md:px-16 py-16 grid md:grid-cols-2 gap-12">
        {/* Left — brand + contact */}
        <div>
          <Link href="/" className="flex items-center gap-4 mb-6">
            <Image src="/ieee-mb.png" alt="IEEE SJSU" width={56} height={56}
              style={{ height: '48px', width: 'auto' }}
              className="brightness-0 invert" />
            <div>
              <p className="text-lg font-bold leading-tight">IEEE Student Branch</p>
              <p className="text-white/50 text-sm">San José State University</p>
            </div>
          </Link>

          <ul className="text-sm text-white/60 space-y-1 mb-6">
            <li>IEEE SJSU</li>
            <li>ENGR 376</li>
            <li>One Washington Square</li>
            <li>San Jose, CA 95192</li>
            <li className="pt-1">
              <span className="font-bold text-white">Email:</span>{' '}
              <a href="mailto:ieee@sjsu.edu" className="hover:text-white transition-colors">ieee@sjsu.edu</a>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <a href="https://discord.gg/VwPdYWSVPS" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-blue-500 hover:bg-blue-500/10 transition-all"
              aria-label="Discord">
              <svg className="w-4 h-4 fill-white/60" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            </a>
            <a href="https://instagram.com/ieee_sjsu" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-pink-500 hover:bg-pink-500/10 transition-all"
              aria-label="Instagram">
              <Instagram size={14} className="text-white/60" />
            </a>
            <a href="https://facebook.com/ieee.sjsu" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-blue-400 hover:bg-blue-400/10 transition-all"
              aria-label="Facebook">
              <Facebook size={14} className="text-white/60" />
            </a>
          </div>
        </div>

        {/* Right — Discord CTA */}
        <div className="md:flex md:flex-col md:justify-center">
          <p className="text-lg font-bold mb-3">Join Our Discord</p>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-5">
            Join our Discord and receive updates about meetings, workshops, industry speakers, and more!
          </p>
          <a
            href="https://discord.gg/VwPdYWSVPS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-fit px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-semibold text-sm"
          >
            Join Discord
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-8 md:px-16 py-5 text-center">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} <span className="font-bold text-white/70">IEEE SJSU Student Branch</span> — All Rights Reserved
        </p>
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-slate-900 hover:bg-blue-600 flex items-center justify-center shadow-lg transition-all ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} className="text-white" />
      </button>
    </footer>
  );
}
