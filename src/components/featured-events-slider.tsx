'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '@/lib/data';

interface FeaturedEventsSliderProps {
  items: Project[];
}

export function FeaturedEventsSlider({ items }: FeaturedEventsSliderProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;

  const go = (i: number) => setActive(((i % n) + n) % n);

  // Autoplay — pauses while the pointer is over the slider, same as the
  // reference's :hover { animation-play-state: paused }.
  useEffect(() => {
    if (paused || n <= 1) return;
    const timer = setInterval(() => go(active + 1), 5000);
    return () => clearInterval(timer);
  }, [active, paused, n]);

  return (
    <div
      className="relative w-full h-[60vh] sm:h-[70vh] max-h-[600px] overflow-hidden rounded-2xl shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? 'auto' : 'none' }}
        >
          <img src={item.image!} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Head — title/description overlay, top-left */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-sm bg-black/50 backdrop-blur-sm text-white p-4 sm:p-5 rounded-lg">
            <p className="text-[10px] font-bold tracking-widest text-blue-300 uppercase mb-1">{item.category}</p>
            <h3 className="text-lg sm:text-2xl font-black uppercase leading-tight mb-2">{item.title}</h3>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-3">{item.description}</p>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={() => go(active - 1)}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(active + 1)}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full border-2 border-blue-400 transition-colors ${
              i === active ? 'bg-blue-400' : 'bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-20 sm:h-24 flex bg-black/70">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => go(i)}
            className="relative flex-1 h-full"
            aria-label={item.title}
          >
            <img
              src={item.image!}
              alt=""
              className="w-full h-full object-cover transition-opacity"
              style={{ opacity: i === active ? 1 : 0.45 }}
            />
            {i === active && <div className="absolute inset-0 ring-2 ring-inset ring-blue-400" />}
          </button>
        ))}
      </div>
    </div>
  );
}
