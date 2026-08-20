'use client';

import { useState, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { SlideshowImage } from '@/components/slideshow-image';
import { GoogleCalendar } from '@/components/google-calendar';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { pastEvents, featuredProjects, workshops } from '@/lib/data';

type Bucket = 'All' | 'Events' | 'Projects' | 'Workshops';

type Card = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string | null;
  images?: string[];
  bucket: Exclude<Bucket, 'All'>;
};

// Events with category 'Workshop' already live in the standalone workshops[]
// list — excluding them here avoids showing the same thing twice.
const eventCards: Card[] = pastEvents
  .filter((e) => e.category !== 'Workshop')
  .map((e) => ({ ...e, bucket: 'Events' }));

const projectCards: Card[] = featuredProjects.map((p) => ({ ...p, bucket: 'Projects' }));

const workshopCards: Card[] = workshops.map((w) => ({ ...w, bucket: 'Workshops' }));

const allCards: Card[] = [...eventCards, ...projectCards, ...workshopCards];

const TABS: Bucket[] = ['All', 'Events', 'Projects', 'Workshops'];

export default function EventsPage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [tab, setTab] = useState<Bucket>('All');

  const cards = tab === 'All' ? allCards : allCards.filter((c) => c.bucket === tab);

  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  const switchTab = (t: Bucket) => {
    setTab(t);
    if (carouselRef.current) carouselRef.current.scrollLeft = 0;
    setTimeout(checkScroll, 50);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar onLight />

      {/* ── FEATURED EVENTS — vertical timeline over a photo backdrop, alternating sides ── */}
      <section className="relative pt-32 pb-40 px-8 overflow-hidden">
        <img src="/Innovation Garage Event 3.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/85" />

        <div className="max-w-5xl mx-auto relative">
          <h2 className="text-4xl font-black text-white tracking-tight mb-16">Featured Events</h2>
          <div className="absolute left-0 top-20 bottom-2 w-px bg-white/15 hidden sm:block" />
          <div className="space-y-12">
            {featuredProjects.map((proj, i) => (
              <AnimatedSection key={proj.id}>
                <div
                  className={`relative sm:pl-10 flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-6 md:gap-10`}
                >
                  <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 ring-4 ring-slate-950/85 hidden sm:block" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-white mb-3">{proj.title}</h3>
                    <p className="text-white/60 leading-relaxed max-w-md">{proj.description}</p>
                  </div>
                  <div className="relative w-full md:w-[420px] aspect-[16/10] rounded-xl overflow-hidden shadow-lg shrink-0">
                    <img src={proj.image!} alt={proj.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Fade into the white calendar section below */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </section>

      {/* ── CALENDAR ── */}
      <section className="pb-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Our Calendar</h2>
          <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-xl">
            This is our schedule of events — plan ahead and check back anytime.
          </p>
          <GoogleCalendar />
        </div>
      </section>

      {/* ── PAST EVENTS, PROJECTS & WORKSHOPS ── */}
      <section className="pt-16 pb-8 px-8 bg-[#f4f5f7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-4">
                Past Events
              </h1>
              <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
                Everything we've built, hosted, and run — in one place.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => scroll('left')} disabled={!canLeft}
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-400 hover:bg-white disabled:opacity-30 transition-all">
                <ArrowLeft size={16} className="text-slate-600" />
              </button>
              <button onClick={() => scroll('right')} disabled={!canRight}
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-400 hover:bg-white disabled:opacity-30 transition-all">
                <ArrowRight size={16} className="text-slate-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${
                  tab === t
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 bg-[#f4f5f7]">
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cards.map((card) => (
            <div key={card.id} className="shrink-0 w-[78vw] sm:w-[280px] flex flex-col">
              <p className="text-xs font-bold text-blue-800/70 mb-2">{card.date}</p>
              <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 line-clamp-2 min-h-[2.75rem]"
                style={{ fontFamily: 'var(--font-chakra-petch)' }}>
                {card.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-[2.5rem] mb-4">
                {card.description}
              </p>
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-200 mt-auto">
                {(card.images?.length ?? 0) > 0 || card.image
                  ? <SlideshowImage
                      slides={card.images?.length ? card.images : [card.image!]}
                      alt={card.title}
                    />
                  : <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">No Photo</span>
                    </div>
                }
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STAY CONNECTED ── */}
      <section className="tech-bg py-20 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Stay in the loop</h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-md">
              All announcements, reminders, and recaps go out on our Discord first. Free and open to all SJSU students.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-7 md:w-72 shrink-0 flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Join the community</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Events at <span className="font-semibold text-slate-700">ENGR 376</span> unless noted.
              </p>
            </div>
            <a
              href="https://discord.gg/VwPdYWSVPS"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold text-center hover:bg-blue-700 transition-colors"
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
