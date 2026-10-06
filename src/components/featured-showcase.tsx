'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export interface ShowcaseItem {
  id: string;
  title: string;
  label: string;
  date: string;
  location?: string;
  description: string;
  image: string;
}

const SLIDE_MS = 6500;

// Featured Events, picking up where the events page's projector intro ends:
// the text on the left, the photo in a frame on the right. Advances on its
// own (paused while hovered or focused); the arrows on the photo, the
// progress bars and the keyboard arrow keys move through it.
export function FeaturedShowcase({ items }: { items: ShowcaseItem[] }) {
  const n = items.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || reduce || n < 2) return;
    const t = window.setTimeout(() => go(i + 1), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [i, paused, reduce, n, go]);

  if (n === 0) return null;
  const item = items[i];
  const autoplay = !paused && !reduce;

  return (
    <section
      data-no-reveal
      className="fs"
      aria-roledescription="carousel"
      aria-label="Featured events"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1);
        if (e.key === 'ArrowLeft') go(i - 1);
      }}
    >
      <div className="fs-grid">
        {/* text */}
        <div className="fs-text">
          <p className="fs-kicker">IEEE SJSU · Innovation Garage</p>
          <h1 className="fs-heading">Featured Events</h1>

          <div key={item.id} className="fs-caption" aria-live="polite">
            <p className="fs-meta">
              <span>{item.label}</span>
              <span>{item.date}</span>
              {item.location && <span><MapPin size={14} /> {item.location}</span>}
            </p>
            <h2 className="fs-title">{item.title}</h2>
            <p className="fs-desc">{item.description}</p>
          </div>

          <div className="fs-segs">
            {items.map((it, k) => (
              <button
                key={it.id}
                type="button"
                aria-label={`Show ${it.title}`}
                aria-current={k === i}
                className={`fs-seg ${k < i ? 'done' : ''} ${k === i ? 'on' : ''}`}
                onClick={() => go(k)}
              >
                <i style={k === i && autoplay ? { animationDuration: `${SLIDE_MS}ms` } : undefined} className={k === i && autoplay ? 'run' : ''} />
              </button>
            ))}
          </div>
        </div>

        {/* photo, with prev / next halfway down its sides */}
        <div className="fs-media">
          {items.map((it, k) => (
            <img
              key={it.id}
              src={it.image}
              alt={k === i ? it.title : ''}
              aria-hidden={k !== i}
              loading={k < 2 ? 'eager' : 'lazy'}
              className={`fs-img ${k === i ? 'on' : ''}`}
            />
          ))}
          <button type="button" className="fs-arrow fs-prev" aria-label="Previous event" onClick={() => go(i - 1)}><ChevronLeft size={22} /></button>
          <button type="button" className="fs-arrow fs-next" aria-label="Next event" onClick={() => go(i + 1)}><ChevronRight size={22} /></button>
        </div>
      </div>
    </section>
  );
}
