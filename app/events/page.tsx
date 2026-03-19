'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { upcomingEvents, pastEvents } from '@/lib/data';

const categoryColors: Record<string, string> = {
  Speaker:    'bg-blue-100 text-blue-700',
  Workshop:   'bg-blue-100 text-blue-700',
  Networking: 'bg-slate-100 text-slate-600',
  Social:     'bg-slate-100 text-slate-600',
  Recruiting: 'bg-slate-100 text-slate-600',
  Industry:   'bg-slate-800 text-white',
  Hackathon:  'bg-purple-100 text-purple-700',
};

function getBadge(dateStr: string, today: Date | null) {
  if (!today) return null;
  const t = new Date(today); t.setHours(0, 0, 0, 0);
  const e = new Date(dateStr); e.setHours(0, 0, 0, 0);
  const days = Math.ceil((e.getTime() - t.getTime()) / 86400000);
  if (days === 0) return { text: 'Today',    cls: 'bg-blue-600 text-white' };
  if (days === 1) return { text: 'Tomorrow', cls: 'bg-blue-100 text-blue-700' };
  if (days > 1 && days <= 7) return { text: `In ${days} days`, cls: 'bg-slate-100 text-slate-600' };
  return null;
}

export default function EventsPage() {
  const [today, setToday] = useState<Date | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => { setToday(new Date()); }, []);

  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'right' ? 1020 : -1020, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* HEADER */}
      <section className="pt-32 pb-10 px-8 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Events</h1>
          <p className="text-slate-500 mt-2">Workshops, speaker series, networking, and more.</p>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="px-8 md:px-16 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-10">Upcoming Events</h2>
          </AnimatedSection>

          {upcomingEvents.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-400 font-medium">No upcoming events right now.</p>
              <p className="text-slate-400 text-sm mt-1">Check back soon or join our Discord for announcements.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {upcomingEvents.map((event) => {
                const badge = getBadge(event.date, today);
                return (
                  <AnimatedSection key={event.id}>
                    <div className="flex gap-6 p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all">
                      {/* Date block */}
                      <div className="shrink-0 w-16 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          {new Date(event.date).toLocaleString('default', { month: 'short' })}
                        </p>
                        <p className="text-3xl font-black text-slate-900 leading-none">
                          {new Date(event.date).getUTCDate()}
                        </p>
                      </div>
                      <div className="w-px bg-slate-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${categoryColors[event.category] || ''}`}>
                            {event.category}
                          </span>
                          {badge && (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badge.cls}`}>
                              {badge.text}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-slate-500 mb-2">
                          {event.startTime && event.endTime ? `${event.startTime} – ${event.endTime} · ` : ''}{event.location}
                        </p>
                        <p className="text-sm text-slate-500">{event.description}</p>
                      </div>
                      {/* Flyer */}
                      {event.image ? (
                        <img src={event.image} alt={event.title} className="w-32 h-24 object-cover rounded-xl shrink-0" />
                      ) : (
                        <div className="w-32 h-24 bg-slate-100 rounded-xl shrink-0 flex items-center justify-center">
                          <span className="text-xs text-slate-400">Flyer</span>
                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* PAST EVENTS CAROUSEL */}
      <section className="py-20 bg-slate-50">
        <div className="px-8 md:px-16 mb-8 max-w-5xl mx-auto flex items-end justify-between">
          <AnimatedSection>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Past Events</h2>
          </AnimatedSection>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-3 bg-white border border-slate-200 rounded-full hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className="text-slate-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-3 bg-white border border-slate-200 rounded-full hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className="text-slate-700" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto scroll-smooth px-8 md:px-16 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {pastEvents.map((event) => (
            <div
              key={event.id}
              className="shrink-0 w-[320px] bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-400">{event.date}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryColors[event.category] || ''}`}>
                    {event.category}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2 leading-snug">{event.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{event.description}</p>
              </div>
              <div className="h-44 bg-slate-100 flex items-center justify-center">
                {event.image
                  ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  : <span className="text-xs text-slate-400">Event Flyer</span>
                }
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 bg-white text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Stay Updated</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Join our Discord to get notified about all IEEE SJSU events and announcements.
          </p>
          <a
            href="https://discord.gg/VwPdYWSVPS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors"
          >
            Join Our Discord
          </a>
        </AnimatedSection>
      </section>

      <Footer />
    </main>
  );
}
