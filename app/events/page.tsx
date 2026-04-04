'use client';

import { useState, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { SlideshowImage } from '@/components/slideshow-image';
import { ArrowLeft, ArrowRight, MapPin, Clock } from 'lucide-react';
import { upcomingEvents, pastEvents } from '@/lib/data';

// Events page = networking / socials / speakers — workshops live in Projects
const eventCategories = ['Speaker', 'Networking', 'Social', 'Recruiting', 'Industry', 'Hackathon'];
const pastEventsList   = pastEvents.filter(e => eventCategories.includes(e.category));
const upcomingEventsList = upcomingEvents.filter(e => eventCategories.includes(e.category));

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
          {pastEventsList.map((event) => (
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

      {/* ── UPCOMING EVENTS ── */}
      <section className="relative py-20 px-8 overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.35em] text-blue-600 uppercase mb-3">What's Next</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-10">Upcoming Events</h2>

          {upcomingEventsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingEventsList.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6"
                >
                  <span className={`inline-block text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-4 ${categoryColors[event.category] || 'bg-slate-100 text-slate-500'}`}>
                    {event.category}
                  </span>
                  <h3 className="text-slate-900 font-black text-[15px] leading-tight mb-2 tracking-tight" style={{ fontFamily: 'var(--font-chakra-petch)' }}>
                    {event.title}
                  </h3>
                  <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 mb-5">
                    {event.description}
                  </p>
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={10} className="text-blue-500/60" />
                      {event.startTime ?? 'TBD'}
                      {event.endTime && ` – ${event.endTime}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="text-blue-500/60" />
                      {event.location}
                    </span>
                    <span className="ml-auto font-bold text-slate-600">
                      {new Date(event.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl shadow-sm p-12 text-center max-w-md mx-auto">
              <p className="text-4xl mb-4">📅</p>
              <h3 className="text-slate-900 font-black text-lg mb-2">Nothing just yet</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Check back soon — or keep an eye on our Discord where announcements drop first.
              </p>
              <a
                href="https://discord.gg/VwPdYWSVPS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Join the Discord
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── STAY CONNECTED ── */}
      <section className="tech-bg py-20 px-8 relative overflow-hidden">
        <div className="blob animate-blob absolute -top-20 right-10 w-[500px] h-[400px] bg-blue-300/25 opacity-70" />
        <div className="blob animate-blob-delay absolute bottom-0 left-0 w-[400px] h-[350px] bg-indigo-200/30 opacity-60" />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center relative z-10">
          <div className="flex-1">
            <p className="text-xs font-bold tracking-[0.35em] text-blue-600 uppercase mb-3">Never Miss One</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Stay in the loop</h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-md">
              All event announcements, reminders, and recaps go out on our Discord first. Free and open to all SJSU students.
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
