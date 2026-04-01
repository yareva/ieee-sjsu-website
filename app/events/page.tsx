'use client';

import { useState, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { SlideshowImage } from '@/components/slideshow-image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { upcomingEvents, pastEvents } from '@/lib/data';
import { MapPin, Clock } from 'lucide-react';

// Events page = networking / socials / speakers — workshops live in Projects
const eventCategories = ['Speaker', 'Networking', 'Social', 'Recruiting', 'Industry', 'Hackathon'];
const allEvents = [...upcomingEvents, ...pastEvents].filter(e => eventCategories.includes(e.category));

const categoryColors: Record<string, string> = {
  Speaker:    'bg-blue-100 text-blue-700',
  Workshop:   'bg-blue-100 text-blue-700',
  Networking: 'bg-slate-100 text-slate-600',
  Social:     'bg-slate-100 text-slate-600',
  Recruiting: 'bg-slate-100 text-slate-600',
  Industry:   'bg-slate-800 text-white',
  Hackathon:  'bg-violet-100 text-violet-700',
};

export default function EventsPage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    setScrolled(el.scrollLeft > 40);
  };

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'right' ? 380 : -380, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── FULL-BLEED MAGAZINE SECTION ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100dvh', height: '100dvh' }}>
        {/* Background */}
        <img
          src="/Innovation Garage Event 2.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Title — top left */}
        <div className={`absolute top-32 left-8 md:left-16 z-10 max-w-xs transition-all duration-500 ${scrolled ? 'opacity-0 -translate-x-6 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
          <p className="text-xs font-bold tracking-[0.35em] text-white/50 uppercase mb-3">IEEE SJSU</p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Events &<br />Community
          </h1>
          <p className="text-white/50 text-sm mt-4 leading-relaxed">
            Workshops, speaker series,<br />networking, and more.
          </p>
        </div>

        {/* Arrows — bottom left */}
        <div className="absolute bottom-10 left-8 md:left-16 z-10 flex gap-2">
          <button onClick={() => scroll('left')} disabled={!canLeft}
            className="w-10 h-10 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 disabled:opacity-25 transition-all">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <button onClick={() => scroll('right')} disabled={!canRight}
            className="w-10 h-10 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 disabled:opacity-25 transition-all">
            <ArrowRight size={16} className="text-white" />
          </button>
        </div>

        {/* Scrollable staggered cards */}
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
          {allEvents.map((event) => (
            <div
              key={event.id}
              className="shrink-0 w-[420px] mr-5 bg-[#f5f2ec] overflow-hidden shadow-2xl hover:-translate-y-2 transition-transform duration-300 flex flex-col rounded-sm"
            >
              {/* Photo */}
              <div className="overflow-hidden relative shrink-0" style={{ height: '320px' }}>
                {(event.images?.length ?? 0) > 0 || event.image
                  ? <SlideshowImage
                      slides={event.images?.length ? event.images : [event.image!]}
                      alt={event.title}
                    />
                  : <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">No Photo</span>
                    </div>
                }
              </div>
              {/* Text */}
              <div className="px-5 py-4 flex flex-col flex-1">
                <span className={`self-start text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide mb-3 ${categoryColors[event.category] || 'bg-slate-100 text-slate-500'}`}>
                  {event.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight mb-2"
                  style={{ fontFamily: 'var(--font-chakra-petch)' }}>
                  {event.title}
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-4 flex-1">
                  {event.description}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 border-t border-slate-200 pt-3">
                  {event.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT'S COMING ── */}
      <section className="tech-bg py-24 px-8 relative overflow-hidden">
        <div className="blob animate-blob absolute -top-20 right-10 w-[500px] h-[400px] bg-blue-300/25 opacity-70" />
        <div className="blob animate-blob-delay absolute bottom-0 left-0 w-[400px] h-[350px] bg-indigo-200/30 opacity-60" />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-start relative z-10">

          {/* Left: upcoming dates */}
          <div className="flex-1">
            <p className="text-xs font-bold tracking-[0.35em] text-blue-600 uppercase mb-3">On the Calendar</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-8">What's Coming Up</h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 py-4 border-b border-slate-200 last:border-0">
                  <div className="shrink-0 w-12 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      {new Date(event.date).toLocaleString('en-US', { month: 'short' })}
                    </p>
                    <p className="text-2xl font-black text-slate-900 leading-none">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-chakra-petch)' }}>
                      {event.title}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <Clock size={10} /> {event.startTime ?? 'TBD'}
                      <span className="mx-1">·</span>
                      <MapPin size={10} /> {event.location}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide self-start mt-0.5 ${categoryColors[event.category] || 'bg-slate-100 text-slate-500'}`}>
                    {event.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: stay connected */}
          <div className="md:w-72 shrink-0">
            <div className="glass-card rounded-2xl p-7 flex flex-col gap-5">
              <div>
                <p className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase mb-2">Never Miss One</p>
                <h3 className="text-xl font-black text-slate-900 leading-tight">Stay in the loop</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  All event announcements, reminders, and recaps go out on our Discord first.
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
              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Events are held at <span className="font-semibold text-slate-600">ENGR 376</span> unless noted otherwise. Free and open to all SJSU students.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
