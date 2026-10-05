'use client';

import { useEffect, useRef, useState } from 'react';
import { pastEvents } from '@/lib/data';
import { FlipCard, FlipDetails } from '@/components/flip-card';

// The most recent past events that have a photo. Pulled straight from
// data.ts, so adding a new past event with an image updates this section.
const highlights = pastEvents.filter((e) => e.image).slice(0, 5);

// Homepage "Past Events" strip, on a dark background.
//  - Large screens:   five equal columns, photos run edge-to-edge
//  - Phones/tablets:  one swipeable row, columns snap into place
// When the row first scrolls into view the cards "flip through" — each one
// flips over and back in turn — then they settle and wait for the visitor.
// The photos also drift (parallax) while you scroll past.
export function EventHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // -1 → 1 as the section passes through the viewport
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when the section is centered in the viewport
        const p = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        setProgress(Math.max(-1, Math.min(1, p)));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Start the flip-through once, when the cards are mostly on screen
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntro(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (highlights.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative pt-20 md:pt-28 overflow-hidden bg-[#060b14]"
    >

      <a href="/events" className="relative z-10 block w-fit mx-auto px-6 group">
        <h2
          className="text-center font-bold text-white leading-none transition-colors group-hover:text-blue-300"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)', letterSpacing: '-0.05em' }}
        >
          Past Events
        </h2>
      </a>

      <div
        ref={rowRef}
        data-reveal-group
        className="
          relative z-10 mt-10 md:mt-14 flex gap-[3px] overflow-x-auto snap-x snap-mandatory
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          lg:grid lg:grid-cols-5 lg:overflow-visible
        "
      >
        {highlights.map((event, i) => (
          <div key={event.id} className="shrink-0 snap-start w-[72%] sm:w-[40%] lg:w-auto flex flex-col">
            {/* Text */}
            <div className="px-5 md:px-6 pb-6 flex-1">
              <p className="text-xs text-slate-400 mb-2">{event.date}</p>
              <h3 className="text-lg font-bold text-white leading-snug truncate mb-2">{event.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{event.description}</p>
            </div>

            {/* Photo — square, flips for details */}
            <FlipCard
              className="aspect-square"
              peekAt={intro ? 250 + i * 260 : null}
              front={
                <div className="relative w-full h-full bg-slate-900">
                  <img
                    src={event.image!}
                    alt={event.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover"
                    style={{ transform: `translateY(${progress * (i % 2 === 0 ? 6 : -6)}%)` }}
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest">
                    {event.category}
                  </span>
                </div>
              }
              back={<FlipDetails label={event.category} {...event} />}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
