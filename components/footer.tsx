'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { upcomingEvents } from '@/lib/data';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">

      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase mb-2">Get Involved</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Join the community.<br className="hidden md:block" /> Build something great.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://discord.gg/VwPdYWSVPS"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-full transition-colors text-center"
            >
              Join Discord
            </a>
            <Link
              href="/membership"
              className="px-6 py-3 border border-white/20 hover:border-white/50 text-white font-bold text-sm rounded-full transition-colors text-center"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/">
              <Image
                src="/ieee-mb.png"
                alt="IEEE SJSU"
                width={130}
                height={44}
                className="brightness-0 invert mb-4"
                style={{ height: '36px', width: 'auto' }}
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              IEEE San José State University Student Chapter — advancing technology, innovation, and community at SJSU.
            </p>
            <div className="mt-5 space-y-2 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <Mail size={13} />
                <a href="mailto:ieee@sjsu.edu" className="hover:text-white/80 transition-colors">ieee@sjsu.edu</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 shrink-0" />
                <span>ENGR 376 · One Washington Square · San Jose, CA</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase mb-4">Pages</p>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/',           label: 'Home' },
                { href: '/projects',   label: 'Projects & Workshops' },
                { href: '/events',     label: 'Events' },
                { href: '/membership', label: 'Membership' },
                { href: '/team',       label: 'Team' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase mb-4">Socials</p>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: 'https://discord.gg/VwPdYWSVPS',     label: 'Discord' },
                { href: 'https://instagram.com/ieee_sjsu',   label: 'Instagram' },
                { href: 'https://facebook.com/ieee.sjsu',    label: 'Facebook' },
              ].map(s => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming events */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase mb-4">Upcoming</p>
            {upcomingEvents.length === 0 ? (
              <p className="text-white/30 text-xs">No upcoming events. Check back soon.</p>
            ) : (
              <ul className="space-y-4">
                {upcomingEvents.slice(0, 3).map(e => (
                  <li key={e.id}>
                    <p className="text-xs text-blue-400 font-bold mb-0.5">
                      {new Date(e.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-white/70 text-sm font-medium leading-snug">{e.title}</p>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/events" className="inline-block mt-4 text-xs text-white/30 hover:text-white/60 transition-colors">
              View all events →
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <p>© 2025 IEEE SJSU Student Chapter. All rights reserved.</p>
          <p>San José State University · College of Engineering</p>
        </div>
      </div>

    </footer>
  );
}
