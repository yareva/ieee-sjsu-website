'use client';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { SplashWrapper } from '@/components/splash-wrapper';
import { ArrowRight } from 'lucide-react';
import { upcomingEvents, pastEvents, sponsorshipPages, workshops } from '@/lib/data';
import { FlipBook } from '@/components/flip-book';

const HERO_VIDEO: string | null = null;

const TABS = ['All', 'Events', 'Projects', 'Workshops'] as const;
type Tab = typeof TABS[number];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const slides = [
    '/Apple Speaker Event 2.jpg',
    '/Innovation Garage Event 2.jpg',
    '/Nuvoton Workshop 2.jpg',
    '/Altium PCB Design Workshop.jpg',
    '/astera_lab.jpg',
  ];

  useEffect(() => {
    if (HERO_VIDEO) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const allCards = [
    ...upcomingEvents.map(e => ({ id: e.id, tab: 'Events' as Tab, image: e.image, category: e.category, title: e.title, description: e.description, date: e.date })),
    ...pastEvents.slice(0, 4).map(e => ({ id: e.id, tab: 'Events' as Tab, image: e.image, category: e.category, title: e.title, description: e.description, date: e.date })),
    ...workshops.slice(0, 3).map(w => ({ id: w.id, tab: 'Workshops' as Tab, image: w.image, category: w.tag, title: w.title, description: w.description, date: w.date })),
  ];

  const filtered = activeTab === 'All' ? allCards : allCards.filter(c => c.tab === activeTab);

  return (
    <SplashWrapper>
      <main className="flex flex-col min-h-screen bg-white">
        <Navbar transparent />

        {/* ── HERO ── */}
        <section className="relative" style={{ height: '100dvh', minHeight: '600px' }}>
          {HERO_VIDEO ? (
            <video className="absolute inset-0 w-full h-full object-cover" src={HERO_VIDEO} autoPlay muted loop playsInline />
          ) : (
            slides.map((slide, i) => (
              <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                style={{ backgroundImage: `url("${slide}")`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === currentSlide ? 1 : 0 }} />
            ))
          )}
          <div className="absolute inset-0 bg-black/50" />

          {/* Slide dots */}
          <div className="absolute bottom-8 left-10 md:left-16 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`} />
            ))}
          </div>

          {/* Text bottom-left */}
          <div className="absolute bottom-16 left-10 md:left-16 z-10 max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-4">
              IEEE SJSU
            </span>
            <h1 className="font-bold text-white leading-none tracking-tight uppercase text-[clamp(2.5rem,5vw,4.5rem)]"
              style={{ fontFamily: 'var(--font-chakra-petch)' }}>
              IEEE
            </h1>
            <p className="text-white/70 text-sm md:text-base font-medium tracking-[0.18em] uppercase mt-1 mb-1">
              San José State University
            </p>
            <p className="text-white/35 text-xs tracking-[0.3em] uppercase mb-6">Student Chapter</p>
            <div className="flex flex-wrap gap-3">
              <a href="/projects" className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-slate-100 transition-colors">
                Explore Projects
              </a>
              <a href="/membership" className="px-5 py-2.5 border border-white/40 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors">
                Join Now
              </a>
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="tech-bg relative py-24 px-8 md:px-20 overflow-hidden">
          <div className="blob animate-blob absolute top-0 right-0 w-[500px] h-[400px] bg-blue-300/25" />
          <div className="blob animate-blob-delay absolute bottom-0 left-10 w-[400px] h-[350px] bg-indigo-200/20" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold tracking-[0.35em] text-blue-600 uppercase mb-5">Who We Are</p>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
                  Engineering<br />community<br />at SJSU.
                </h2>
                <p className="text-slate-500 text-base leading-relaxed max-w-md">
                  IEEE SJSU is a student-run chapter of the world's largest technical professional organization. We run workshops, host industry speakers, and build real hardware projects — all open to every SJSU student.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: '100+', label: 'Active Members' },
                  { num: '20+', label: 'Events per Year' },
                  { num: '5+', label: 'Industry Partners' },
                  { num: '3', label: 'Active Projects' },
                ].map(stat => (
                  <div key={stat.label} className="glass-card rounded-2xl p-6">
                    <p className="text-4xl font-black text-slate-900 mb-1" style={{ fontFamily: 'var(--font-chakra-petch)' }}>{stat.num}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── THREE-PANEL ── */}
        <section className="grid grid-cols-1 md:grid-cols-3">
          {[
            { img: '/Altium PCB Design Workshop.jpg', label: 'Our',       title: 'PROJECTS', href: '/projects', cta: 'View Projects' },
            { img: '/Innovation Garage Event 3.jpg',  label: 'Attend an', title: 'EVENT',    href: '/events',   cta: 'See Schedule'  },
            { img: '/Nuvoton Workshop 2.jpg',         label: 'Meet the',  title: 'TEAM',     href: '/team',     cta: 'Meet the Team' },
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

        {/* ── LATEST ── */}
        <section className="relative px-8 md:px-16 pt-16 pb-20 overflow-hidden">
          <img src="/Innovation Garage Event 3.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/88 backdrop-blur-md" />
          <div className="max-w-7xl mx-auto relative z-10">

            {/* Header */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Latest from IEEE SJSU</h2>
                <p className="text-slate-500 text-sm mt-1">Events, workshops, and projects from our chapter.</p>
              </div>
              <a href="/events" className="flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors shrink-0">
                View All <ArrowRight size={14} />
              </a>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Cards + sidebar widget */}
            <div className="flex gap-6 items-start">
              {/* Card grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filtered.slice(0, 4).map((card) => (
                  <AnimatedSection key={card.id}>
                    <a href={card.tab === 'Workshops' ? '/projects' : '/events'}
                      className="group block rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all bg-white">
                      <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                        {card.image
                          ? <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="w-full h-full bg-slate-100" />
                        }
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">{card.category}</span>
                          <span className="text-xs text-slate-400">{card.date}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 leading-snug mb-2">{card.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{card.description}</p>
                      </div>
                    </a>
                  </AnimatedSection>
                ))}
              </div>

              {/* Upcoming widget */}
              <div className="hidden lg:block w-72 shrink-0 rounded-2xl overflow-hidden border border-slate-200 bg-white/70 backdrop-blur-sm">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Coming Up</p>
                  <a href="/events" className="text-[10px] text-slate-400 hover:text-slate-700 transition-colors font-semibold">See all →</a>
                </div>
                <div className="divide-y divide-slate-100">
                  {upcomingEvents.map((e) => (
                    <div key={e.id} className="flex gap-4 px-5 py-4 items-start">
                      <div className="shrink-0 w-9 text-center pt-0.5">
                        <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                          {new Date(e.date).toLocaleString('en-US', { month: 'short' })}
                        </p>
                        <p className="text-xl font-black text-slate-900 leading-tight">
                          {new Date(e.date).getUTCDate()}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 leading-snug">{e.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{e.startTime ?? ''} · {e.location}</p>
                        <span className="inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">{e.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── SPONSORSHIP ── */}
        <section className="tech-bg relative py-24 px-8 md:px-20 overflow-hidden">
          <div className="blob animate-blob absolute top-0 left-1/4 w-[500px] h-[400px] bg-blue-300/25" />
          <div className="blob animate-blob-delay absolute bottom-0 right-10 w-[400px] h-[400px] bg-violet-200/20" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold tracking-[0.35em] text-blue-600 uppercase mb-5">Partner With Us</p>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
                  Sponsor<br />IEEE SJSU.
                </h2>
                <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md">
                  We're a student chapter with real reach — 100+ active members, 20+ events per year, and direct access to SJSU's engineering talent pipeline. Your brand in front of the next generation of engineers.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="mailto:ieee.sjsu@gmail.com"
                    className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors">
                    Get in Touch
                  </a>
                  <a href="/sponsorship-packet.pdf" target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 border border-slate-300 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors">
                    Download Packet
                  </a>
                </div>
              </div>
              <AnimatedSection>
                <FlipBook pages={sponsorshipPages} />
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative min-h-[420px] flex items-stretch">
          <img src="/astera_lab.jpg" alt="IEEE SJSU" className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative z-10 grid md:grid-cols-2 w-full">
            <div />
            <div className="bg-black/40 backdrop-blur-md py-24 px-12 flex flex-col justify-center border-l border-white/20">
              <AnimatedSection>
                <p className="text-xs font-bold tracking-[0.3em] text-blue-300 uppercase mb-4">Get Involved</p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">Join IEEE SJSU</h2>
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
