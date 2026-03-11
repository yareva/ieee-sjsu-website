'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-12">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/ieee-mb.png"
              alt="IEEE SJSU Logo"
              width={200}
              height={60}
              className="object-contain h-16 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Discord CTA */}
        <div className="bg-primary text-white rounded-2xl p-8 mb-12 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">Join the Community</h3>
          <p className="text-white/90 mb-6">Connect with fellow engineers and stay updated on events</p>
          <a
            href="https://discord.gg/VwPdYWSVPS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-white text-primary rounded-xl font-semibold hover:scale-105 transition-transform duration-200"
          >
            Join Discord Server
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8 border-t border-white/10 pt-8">
          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:ieee@sjsu.edu" className="hover:text-white transition-colors">
                  ieee@sjsu.edu
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>
                  ENGR 376<br />
                  One Washington Square<br />
                  San José, CA 95192-0084
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-white/80 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white/80 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-white/80 hover:text-white transition-colors">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-white/80 hover:text-white transition-colors">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://discord.gg/VwPdYWSVPS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  Discord <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/ieee_sjsu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  Instagram <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/ieee-sjsu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  LinkedIn <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/ieee.sjsu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  Facebook <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-sm text-white/60">
          <p>© 2026 IEEE San José State University Student Chapter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
