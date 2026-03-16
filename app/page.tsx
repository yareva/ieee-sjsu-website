'use client';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { SplashWrapper } from '@/components/splash-wrapper';
import { Apple } from 'lucide-react';
import { upcomingEvents, pastEvents, sponsorshipPages } from '@/lib/data';
import { FlipBook } from '@/components/flip-book';

const GOOGLE_CAL_URL = 'https://calendar.google.com/calendar/r?cid=YOUR_CALENDAR_ID';
const ICAL_URL = '/ieee-sjsu.ics';
const HERO_VIDEO: string | null = null;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['/astera_lab.jpg', '/Image 2.jpeg', '/image_4.jpg'];

  useEffect(() => {
    if (HERO_VIDEO) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <SplashWrapper>
      <main className="flex flex-col min-h-screen bg-white">
        <Navbar transparent />

        {/* ── 1. HERO — dark photo ── */}
        <section className="relative flex items-end" style={{ height: '100dvh' }}>
          {HERO_VIDEO ? (
            <video className="absolute inset-0 w-full h-full object-cover" src={HERO_VIDEO} autoPlay muted loop playsInline />
          ) : (
            slides.map((slide, i) => (
              <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                style={{ backgroundImage: `url("${slide}")`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === currentSlide ? 1 : 0 }} />
            ))
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="relative z-10 px-8 md:px-16 pb-16 md:pb-24 w-full">
            <AnimatedSection>
              <p className="text-white/50 text-xs font-bold tracking-[0.35em] uppercase mb-4">IEEE SJSU · Student Chapter</p>
              <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black text-white leading-none tracking-tighter uppercase">
                IEEE<br />San Jose State
              </h1>
              <p className="text-white/60 text-base mt-4 mb-8 max-w-sm tracking-wide">
                Advancing Technology · Innovation · Community
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/projects" className="px-6 py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-slate-100 transition-colors">
                  Explore Projects
                </a>
                <a href="/membership" className="px-6 py-3 border border-white/40 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors">
                  Join Now
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── 2. MISSION — white ── */}
        <section className="bg-white py-24 px-8 md:px-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase mb-4">Who We Are</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">Our<br />Mission</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                To empower the next generation of engineers through hands-on technical experience, industry readiness, and a community dedicated to professional excellence.
              </p>
              <p className="text-blue-600 font-bold text-lg">
                We build for the betterment of our students' success.
              </p>
            </AnimatedSection>
            <AnimatedSection>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
                <img src="/Image 2.jpeg" alt="IEEE SJSU" className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── 3. THREE-PANEL GRID — dark photos ── */}
        <section className="grid grid-cols-1 md:grid-cols-3">
          {[
            { img: '/astera_lab.jpg',  label: 'Our',      title: 'PROJECTS', href: '/projects', cta: 'View Projects' },
            { img: '/Image 2.jpeg',    label: 'Attend an', title: 'EVENT',    href: '/events',   cta: 'See Schedule'  },
            { img: '/image_4.jpg',     label: 'Meet the',  title: 'TEAM',     href: '/team',     cta: 'Meet the Team' },
          ].map((panel) => (
            <a key={panel.title} href={panel.href} className="relative group overflow-hidden" style={{ height: '460px' }}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url("${panel.img}")` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 z-10">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{panel.label}</p>
                <h3 className="text-5xl font-black text-white uppercase tracking-tight leading-none mb-5">{panel.title}</h3>
                <span className="inline-block px-5 py-2 bg-white text-slate-900 text-xs font-bold uppercase tracking-widest rounded-full">
                  {panel.cta}
                </span>
              </div>
            </a>
          ))}
        </section>

        {/* ── 4. STATS | CALENDAR | SPONSORSHIP ── */}
        <section className="bg-white py-24 px-8 md:px-20">
          <div className="grid md:grid-cols-[1fr_2fr_2fr] divide-x divide-slate-200">

            {/* Stats — compact */}
            <div className="md:pr-12">
              <AnimatedSection>
                <p className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase mb-3">By the Numbers</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-6">
                  What We've<br />Built
                </h2>
                <div className="grid grid-cols-2 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
                  {[
                    { n: '7+',   label: 'Workshops' },
                    { n: '5+',   label: 'Partners' },
                    { n: '100+', label: 'Members' },
                    { n: '2',    label: 'Semesters' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white px-5 py-5">
                      <p className="text-3xl font-black text-slate-900 mb-0.5">{s.n}</p>
                      <p className="text-slate-500 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Scrollable Calendar */}
            <div className="md:px-16">
              <AnimatedSection>
                <p className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase mb-4">Stay in the Loop</p>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-6">
                  Our<br />Calendar
                </h2>
                <div className="h-72 overflow-y-auto space-y-1.5 pr-1 mb-5" style={{ scrollbarWidth: 'thin' }}>
                  {upcomingEvents.length > 0 && (
                    <>
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Upcoming</p>
                      {upcomingEvents.map(e => (
                        <div key={e.id} className="flex gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50">
                          <div className="shrink-0 w-9 text-center">
                            <p className="text-[9px] font-bold text-blue-400 uppercase leading-none">
                              {new Date(e.date).toLocaleString('default', { month: 'short' })}
                            </p>
                            <p className="text-base font-black text-blue-700 leading-tight">
                              {new Date(e.date).getUTCDate()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-snug">{e.title}</p>
                            <p className="text-xs text-slate-400">{e.location}</p>
                          </div>
                        </div>
                      ))}
                      <div className="h-px bg-slate-100 my-2" />
                    </>
                  )}
                  {upcomingEvents.length === 0 && (
                    <p className="text-xs text-slate-400 italic mb-3">No upcoming events — check back soon.</p>
                  )}
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Past Events</p>
                  {pastEvents.map(e => (
                    <div key={e.id} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="shrink-0 w-9 text-center">
                        <p className="text-[9px] font-bold text-slate-300 uppercase leading-none">
                          {e.date.split(' ')[0]}
                        </p>
                        <p className="text-base font-black text-slate-300 leading-tight">
                          {e.date.split(' ')[1]?.replace(',', '')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500 leading-snug">{e.title}</p>
                        <p className="text-xs text-slate-400">{e.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <a href={GOOGLE_CAL_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-sm hover:border-blue-400 transition-all">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" fill="none">
                      <path d="M34.98 10H13.02C11.35 10 10 11.35 10 13.02v21.96C10 36.65 11.35 38 13.02 38h21.96C36.65 38 38 36.65 38 34.98V13.02C38 11.35 36.65 10 34.98 10z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
                      <path d="M24 20a4 4 0 100 8 4 4 0 000-8z" fill="#2563eb"/>
                      <path d="M13 10v4M35 10v4M10 18h28" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Add to Google Calendar
                  </a>
                  <a href={ICAL_URL}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-sm hover:border-blue-400 transition-all">
                    <Apple size={16} className="shrink-0 text-slate-700" />
                    Add to Apple / iCal
                  </a>
                </div>
              </AnimatedSection>
            </div>

            {/* Sponsorship Packet FlipBook */}
            <div className="md:pl-16">
              <AnimatedSection>
                <p className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase mb-4">Partner With Us</p>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-6">
                  Sponsorship<br />Packet
                </h2>
                <FlipBook pages={sponsorshipPages} />
              </AnimatedSection>
            </div>

          </div>
        </section>

        {/* ── 5. CTA ── */}
        <section className="relative min-h-[420px] flex items-stretch">
          <img src="/astera_lab.jpg" alt="IEEE SJSU" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative z-10 grid md:grid-cols-2 w-full">
            {/* Left — photo shows through cleanly */}
            <div />
            {/* Right — frosted glass over the photo */}
            <div className="bg-black/40 backdrop-blur-md py-24 px-12 flex flex-col justify-center border-l border-white/20">
              <AnimatedSection>
                <p className="text-xs font-bold tracking-[0.3em] text-blue-300 uppercase mb-4">Get Involved</p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  Join IEEE SJSU
                </h2>
                <p className="text-white/70 text-base mb-8 max-w-sm leading-relaxed">
                  Workshops, industry events, and hands-on projects — open to all SJSU students.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="/membership" className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors">
                    Become a Member
                  </a>
                  <a href="https://discord.gg/VwPdYWSVPS" target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-white/10 border border-white/30 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-colors">
                    Join Discord
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </SplashWrapper>
  );
}
