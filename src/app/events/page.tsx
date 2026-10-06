'use client';

import { useEffect, useRef, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GoogleCalendar } from '@/components/google-calendar';
import { CoverFlow, type CoverFlowItem } from '@/components/cover-flow';
import { FlipCard, FlipDetails } from '@/components/flip-card';
import { GlassBackdrop } from '@/components/glass-backdrop';
import { GarageTour } from '@/components/garage/garage-tour';
import type { Slide } from '@/components/garage/screens';
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

// Featured Events cover-flow: the featured projects first, then every past
// event that has a photo (skipping any photo a featured project already uses).
const featuredItems: CoverFlowItem[] = (() => {
  const items: CoverFlowItem[] = featuredProjects
    .filter((p) => p.image)
    .map((p) => ({ id: p.id, title: p.title, label: p.category, date: p.date, description: p.description, image: p.image! }));
  const used = new Set(items.map((i) => i.image));
  for (const e of pastEvents) {
    if (!e.image || used.has(e.image)) continue;
    used.add(e.image);
    items.push({ id: e.id, title: e.title, label: e.category, date: e.date, location: e.location, description: e.description, image: e.image });
  }
  return items;
})();

// What the projector shows in the 3D intro: the same featured items
const projectorSlides: Slide[] = featuredItems.map((i) => ({ image: i.image, title: i.title, date: i.date, label: i.label }));

const TABS: Bucket[] = ['All', 'Events', 'Projects', 'Workshops'];

// Click/arrow-driven scroll-snap carousel — the active card is tracked in
// state and scrolled into view; a progress bar + counter reflect position
// the same way page numbers would. Card heights are pinned (min-height +
// line-clamp) so every card lines up level with the next regardless of how
// long its title or description runs.
function PastEventsCarousel({ cards }: { cards: Card[] }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => setActive(0), [cards]);

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(cards.length - 1, i));
    setActive(next);
    track.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  if (cards.length === 0) return null;

  return (
    <div className="pe-track-wrap">
      <div ref={track} className="pe-track">
        {cards.map((card, i) => {
          const image = card.image ?? card.images?.[0] ?? null;
          return (
            <article
              key={card.id}
              className={`pe-card ${i === active ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
            >
              <div className="pe-details">
                <p className="pe-date">{card.date}</p>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </div>
              <FlipCard
                className="pe-image"
                front={image
                  ? <img src={image} alt={`${card.title} event photo`} />
                  : <span className="pe-noimg">No Photo</span>
                }
                back={<FlipDetails label={card.bucket} title={card.title} date={card.date} description={card.description} image={image} />}
              />
            </article>
          );
        })}
      </div>

      <div className="pe-controls">
        <div className="pe-progress"><span style={{ width: `${((active + 1) / cards.length) * 100}%` }} /></div>
        <span className="pe-counter">{String(active + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</span>
        <button className="pe-arrow" aria-label="Previous event" onClick={() => goTo(active - 1)} disabled={active === 0}>‹</button>
        <button className="pe-arrow" aria-label="Next event" onClick={() => goTo(active + 1)} disabled={active === cards.length - 1}>›</button>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [tab, setTab] = useState<Bucket>('All');

  const cards = tab === 'All' ? allCards : allCards.filter((c) => c.bucket === tab);

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar themed />

      {/* ── 3D INTRO — under the lab's projector as it shows the featured
          events, then into the screen; fades into the cover-flow below ── */}
      <GarageTour tour="events" slides={projectorSlides} fadeTo="#f4f4f2" />

      {/* ── FEATURED EVENTS — scroll-driven cover-flow ── */}
      <CoverFlow items={featuredItems} title="Featured Events" />

      {/* ── CALENDAR ── */}
      <section className="relative py-20 px-6 sm:px-8 bg-[#eef0f3] overflow-hidden">
        <GlassBackdrop />
        <div className="glass-light relative z-10 w-full max-w-5xl mx-auto rounded-3xl p-5 sm:p-8 md:p-10">
          <h2 className="text-4xl font-black text-[#294867] tracking-tight mb-3">Our Calendar</h2>
          <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-xl">
            This is our schedule of events — plan ahead and check back anytime.
          </p>
          <GoogleCalendar />
        </div>
      </section>

      {/* ── PAST EVENTS, PROJECTS & WORKSHOPS — editorial scroll carousel ── */}
      <section className="pe-page pt-20 pb-24 bg-white">
        <div className="pe-heading">
          <p>IEEE Student Branch of SJSU</p>
          <h1>Past Events</h1>
          <div className="pe-tabs">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pe-tab ${tab === t ? 'is-active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <PastEventsCarousel cards={cards} />
      </section>

      {/* ── STAY CONNECTED ── */}
      <section className="relative py-20 px-8 bg-[#0a1630] overflow-hidden">
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Stay in the loop</h2>
            <p className="text-slate-300 text-base leading-relaxed max-w-md">
              All announcements, reminders, and recaps go out on our Discord first. Free and open to all SJSU students.
            </p>
          </div>
          <div className="glass-dark rounded-2xl p-7 md:w-72 shrink-0 flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-black text-white leading-tight">Join the community</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Events at <span className="font-semibold text-white">ENGR 376</span> unless noted.
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
