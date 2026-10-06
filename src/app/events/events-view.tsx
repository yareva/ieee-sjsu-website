'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CALENDAR_URL } from '@/components/google-calendar';
import { UpcomingAndCalendar } from '@/components/upcoming-events';
import { GarageTour } from '@/components/garage/garage-tour';
import { FeaturedShowcase, type ShowcaseItem } from '@/components/featured-showcase';
import type { Slide } from '@/components/garage/screens';
import { coverImage, displayDate, flyerOnly, type SiteContent, type SiteEvent } from '@/lib/content';

type Bucket = 'All' | 'Events' | 'Projects' | 'Workshops';
const TABS: Bucket[] = ['All', 'Events', 'Projects', 'Workshops'];
const bucketOf = (e: SiteEvent): Exclude<Bucket, 'All'> =>
  e.kind === 'project' ? 'Projects' : e.kind === 'workshop' ? 'Workshops' : 'Events';

// The showcase's background, so the intro fades straight into it
const SHOWCASE_BG = '#05080e';

// A sideways row of event cards that snaps card to card; the arrows scroll
// it by one card.
function PastEvents({ cards }: { cards: SiteEvent[] }) {
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = row.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(() => {
    row.current?.scrollTo({ left: 0 });
    update();
  }, [cards]);

  const scrollBy = (dir: number) => {
    const el = row.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 18), behavior: 'smooth' });
  };

  return (
    <>
      <div ref={row} className="past-row" onScroll={update}>
        {cards.map((card) => {
          const image = coverImage(card);
          const sheet = flyerOnly(card);
          return (
            <article key={card.id} className="past-card">
              <div className={`past-img ${sheet ? 'is-flyer' : ''}`} style={sheet ? { ['--flyer' as string]: `url("${image}")` } : undefined}>
                {image
                  ? <img src={image} alt={`${card.title} ${sheet ? 'flyer' : 'photo'}`} loading="lazy" />
                  : <span>No photo yet</span>}
                <span className="past-tag">{bucketOf(card)}</span>
              </div>
              <div className="past-body">
                <p className="past-date">{displayDate(card)}</p>
                <h3>{card.title}</h3>
                <p className="past-desc">{card.description}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="past-controls">
        <button type="button" className="fs-arrow past-arrow" aria-label="Scroll back" onClick={() => scrollBy(-1)} disabled={edge.start}><ChevronLeft size={20} /></button>
        <button type="button" className="fs-arrow past-arrow" aria-label="Scroll forward" onClick={() => scrollBy(1)} disabled={edge.end}><ChevronRight size={20} /></button>
      </div>
    </>
  );
}

export function EventsView({ content }: { content: SiteContent }) {
  const [tab, setTab] = useState<Bucket>('All');
  const cards = tab === 'All' ? content.past : content.past.filter((c) => bucketOf(c) === tab);

  const featured: ShowcaseItem[] = useMemo(() => content.featured.map((e) => ({
    id: e.id,
    title: e.title,
    label: e.category ?? bucketOf(e),
    date: displayDate(e),
    location: e.location ?? undefined,
    description: e.description,
    image: coverImage(e)!,
  })), [content.featured]);
  // what the projector shows in the 3D intro: the same featured items
  const slides: Slide[] = useMemo(() => featured.map((i) => ({ image: i.image, title: i.title, date: i.date, label: i.label })), [featured]);

  return (
    <main className="home flex flex-col min-h-screen">
      <Navbar themeToggle />

      {/* ── 3D INTRO — under the lab's projector as it shows the featured
          events, then into the screen ── */}
      <GarageTour tour="events" slides={slides} fadeTo={SHOWCASE_BG} />

      {/* ── FEATURED EVENTS ── */}
      <FeaturedShowcase items={featured} />

      {/* ── UPCOMING EVENTS beside the calendar ── */}
      <section className="home-section">
        <div className="home-container">
          <div className="home-head-row">
            <div>
              <p className="home-kicker">Coming up</p>
              <h2 className="home-h2">Upcoming <span className="home-h2-outline">Events</span></h2>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="home-btn home-btn-ghost">
              Add to your calendar
            </a>
          </div>
          <UpcomingAndCalendar events={content.upcoming} />
        </div>
      </section>

      {/* ── PAST EVENTS, PROJECTS & WORKSHOPS ── */}
      <section className="home-section">
        <div className="home-container">
          <div className="home-head-row">
            <div>
              <p className="home-kicker">IEEE Student Branch of SJSU</p>
              <h2 className="home-h2">Past <span className="home-h2-outline">Events</span></h2>
            </div>
            <div className="past-tabs" role="tablist" aria-label="Filter">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`past-tab ${tab === t ? 'on' : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <PastEvents cards={cards} />
        </div>
      </section>

      {/* ── STAY CONNECTED ── */}
      <section className="home-section">
        <div className="home-container">
          <div className="m-card stay">
            <div>
              <p className="home-kicker">Stay connected</p>
              <h2 className="home-h2">Stay in <span className="home-h2-outline">the loop</span></h2>
              <p className="home-lede">
                All announcements, reminders, and recaps go out on our Discord first. Free and open to all SJSU students.
                Events are at <b>ENGR 376</b> unless noted.
              </p>
            </div>
            <a href="https://discord.gg/VwPdYWSVPS" target="_blank" rel="noopener noreferrer" className="home-btn home-btn-primary">
              Join the Discord
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
