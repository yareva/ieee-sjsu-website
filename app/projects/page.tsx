'use client';

import { useRef, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { SlideshowImage } from '@/components/slideshow-image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredProjects, workshops } from '@/lib/data';
import type { Project, Workshop } from '@/lib/data';

type Tab = 'all' | 'projects' | 'workshops';

type AnyItem = (Project & { _type: 'project' }) | (Workshop & { _type: 'workshop' });

const taggedProjects: AnyItem[] = featuredProjects.map(p => ({ ...p, _type: 'project' as const }));
const taggedWorkshops: AnyItem[] = workshops.map(w => ({ ...w, _type: 'workshop' as const }));

export default function ProjectsPage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [tab, setTab] = useState<Tab>('all');
  const [scrolled, setScrolled] = useState(false);

  const items = tab === 'projects' ? taggedProjects
    : tab === 'workshops' ? taggedWorkshops
    : [...taggedProjects, ...taggedWorkshops];

  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    setScrolled(el.scrollLeft > 40);
  };

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    if (carouselRef.current) carouselRef.current.scrollLeft = 0;
    setTimeout(checkScroll, 50);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── FULL-BLEED MAGAZINE SECTION ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100dvh', height: '100dvh' }}>
        {/* Background */}
        <img
          src="/ECG Workshop Soldering.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Title — top left */}
        <div className={`absolute top-32 left-8 md:left-16 z-10 max-w-xs transition-all duration-500 ${scrolled ? 'opacity-0 -translate-x-6 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
          <p className="text-xs font-bold tracking-[0.35em] text-white/50 uppercase mb-3">IEEE SJSU</p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Projects &<br />Workshops
          </h1>
          <p className="text-white/50 text-sm mt-3 leading-relaxed">
            Hardware builds, PCB design,<br />digital logic, and more.
          </p>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-5">
            {(['all', 'projects', 'workshops'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${
                  tab === t
                    ? 'bg-white text-slate-900'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All' : t === 'projects' ? 'Projects' : 'Workshops'}
              </button>
            ))}
          </div>
        </div>

        {/* Arrows — bottom left */}
        <div className="absolute bottom-10 left-8 md:left-16 z-10 flex gap-2">
          <button onClick={() => scroll('left')} disabled={!canLeft}
            className="w-10 h-10 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 disabled:opacity-25 transition-all">
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button onClick={() => scroll('right')} disabled={!canRight}
            className="w-10 h-10 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 disabled:opacity-25 transition-all">
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>

        {/* Scrollable cards */}
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="absolute inset-0 flex items-start overflow-x-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: '30%',
            paddingTop: '190px',
            paddingRight: '48px',
            paddingBottom: '120px',
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="shrink-0 w-[420px] mr-5 bg-[#f5f2ec] overflow-hidden shadow-2xl hover:-translate-y-2 transition-transform duration-300 flex flex-col rounded-sm"
            >
              {/* Photo */}
              <div className="overflow-hidden relative shrink-0" style={{ height: '320px' }}>
                {(item.images?.length ?? 0) > 0 || item.image
                  ? <SlideshowImage
                      slides={item.images?.length ? item.images : [item.image!]}
                      alt={item.title}
                    />
                  : <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">No Photo</span>
                    </div>
                }
              </div>
              {/* Text */}
              <div className="px-5 py-4 flex flex-col flex-1">
                <span className="self-start text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">
                  {item._type === 'project' ? item.category : item.tag}
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight mb-2"
                  style={{ fontFamily: 'var(--font-chakra-petch)' }}>
                  {item.title}
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-4 flex-1">
                  {item.description}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 border-t border-slate-200 pt-3">
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="tech-bg py-24 px-8 pb-28 relative overflow-hidden">
        <div className="blob animate-blob absolute top-0 right-20 w-[500px] h-[400px] bg-blue-300/25" />
        <div className="blob animate-blob-delay absolute bottom-0 left-10 w-[400px] h-[400px] bg-indigo-200/20" />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <p className="text-xs font-bold tracking-[0.35em] text-blue-600 uppercase mb-4">IEEE SJSU</p>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-5">
              Build something<br />real.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-md">
              Join a project team, show up to a workshop, or pitch your own idea. IEEE SJSU is student-run and open to everyone at SJSU — no experience needed.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 md:w-80 shrink-0 flex flex-col gap-4">
            <p className="text-slate-900 font-black text-lg leading-tight">Want in? Start on Discord.</p>
            <p className="text-slate-500 text-sm leading-relaxed">That's where we post project openings, workshop announcements, and everything else.</p>
            <a
              href="https://discord.gg/VwPdYWSVPS"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold text-center hover:bg-blue-700 transition-colors mt-2"
            >
              Join the Discord
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
