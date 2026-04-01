'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { upcomingEvents } from '@/lib/data';

export function Footer() {
  return (
    <footer className="bg-[#080d14] text-white">
      {/* Main grid */}
      <div className="px-8 md:px-16 py-14 grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">

        {/* Brand */}
        <div>
          <Link href="/" className="inline-block mb-5">
            <Image src="/ieee-mb.png" alt="IEEE SJSU" width={140} height={48}
              style={{ height: '40px', width: 'auto' }}
              className="brightness-0 invert opacity-90" />
          </Link>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            San José State University Student Chapter — advancing technology, innovation, and community since our founding.
          </p>
          <div className="flex items-center gap-3 mt-6">
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

        {/* Pages */}
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-white/30 uppercase mb-5">Pages</p>
          <ul className="space-y-3">
            {[['/', 'Home'], ['/projects', 'Projects'], ['/events', 'Events'], ['/membership', 'Membership'], ['/team', 'Team']].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming */}
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-white/30 uppercase mb-5">Upcoming</p>
          <ul className="space-y-4">
            {upcomingEvents.slice(0, 3).map(e => (
              <li key={e.id}>
                <Link href="/events" className="group block">
                  <p className="text-xs text-blue-400 mb-0.5">
                    {new Date(e.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-white/50 group-hover:text-white transition-colors leading-snug">{e.title}</p>
                </Link>
              </li>
            ))}
            {upcomingEvents.length === 0 && <li><p className="text-sm text-white/25 italic">No upcoming events</p></li>}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-white/30 uppercase mb-5">Contact</p>
          <ul className="space-y-4 text-sm text-white/50">
            <li className="flex items-start gap-2.5">
              <Mail size={14} className="mt-0.5 shrink-0 text-white/30" />
              <a href="mailto:ieee@sjsu.edu" className="hover:text-white transition-colors">ieee@sjsu.edu</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-white/30" />
              <span>ENGR 376<br />One Washington Square<br />San Jose, CA 95192</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 px-8 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/25">© 2025 IEEE SJSU Student Chapter. All rights reserved.</p>
        <p className="text-xs text-white/20">San José State University · College of Engineering</p>
      </div>
    </footer>
  );
}
