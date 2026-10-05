'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

// How long the mouse has to rest on a card before it flips by itself.
export const HOVER_FLIP_DELAY_MS = 4000;

// The one set of flip rules every card on the site follows:
//  - mouse rests on the card for HOVER_FLIP_DELAY_MS → it flips over
//  - mouse leaves the card → it flips back (always, however it was flipped)
//  - click / tap → flips it; click again → flips back
// Plus `peek(delay)`: an automatic quick flip-and-back, used for the intro
// "flip through" when a row of cards first scrolls into view. Any real
// hover or click cancels it.
export function useFlip() {
  const [flipped, setFlipped] = useState(false);
  const timer = useRef<number | null>(null);
  const peekTimers = useRef<number[]>([]);

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    peekTimers.current.forEach((t) => window.clearTimeout(t));
    peekTimers.current = [];
  }, []);

  const enter = useCallback(() => {
    clear();
    timer.current = window.setTimeout(() => setFlipped(true), HOVER_FLIP_DELAY_MS);
  }, [clear]);
  const leave = useCallback(() => { clear(); setFlipped(false); }, [clear]);
  const toggle = useCallback(() => { clear(); setFlipped((f) => !f); }, [clear]);
  const show = useCallback(() => { clear(); setFlipped(true); }, [clear]);
  const reset = useCallback(() => { clear(); setFlipped(false); }, [clear]);
  const peek = useCallback((delay: number, hold = 900) => {
    clear();
    peekTimers.current = [
      window.setTimeout(() => setFlipped(true), delay),
      window.setTimeout(() => setFlipped(false), delay + hold),
    ];
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { flipped, enter, leave, toggle, show, reset, peek };
}

// A card that flips between `front` and `back` using the rules above.
// Hover is tracked on the outer, non-rotating box so the card doesn't
// flicker when it turns edge-on mid-flip.
export function FlipCard({
  front,
  back,
  className = '',
  peekAt = null,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  /** When this becomes a number, the card does one intro flip-and-back after that many ms. */
  peekAt?: number | null;
}) {
  const { flipped, enter, leave, toggle, peek } = useFlip();

  useEffect(() => {
    if (peekAt === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    peek(peekAt);
  }, [peekAt, peek]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      className={`relative cursor-pointer outline-none [perspective:1200px] ${className}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && enter()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && leave()}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </div>
    </div>
  );
}

// The "back of the card" used everywhere — navy panel with the event details.
export function FlipDetails({
  label,
  title,
  date,
  location,
  description,
  image,
}: {
  label?: string;
  title: string;
  date: string;
  location?: string;
  description: string;
  image?: string | null;
}) {
  return (
    <div className="relative w-full h-full bg-[#294867] text-left text-white">
      {image && (
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-25" draggable={false} />
      )}
      <div className="relative h-full flex flex-col p-5 sm:p-6">
        {label && (
          <span className="self-end px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-widest">
            {label}
          </span>
        )}
        <h3 className="mt-3 text-lg sm:text-xl font-black leading-tight">{title}</h3>
        <div className="mt-3 flex flex-col gap-1.5 text-xs sm:text-sm text-white/75">
          <span className="inline-flex items-center gap-2"><CalendarDays size={14} /> {date}</span>
          {location && <span className="inline-flex items-center gap-2"><MapPin size={14} /> {location}</span>}
        </div>
        {/* Fills whatever height is left and fades out if it runs long, so it
            fits any card size without spilling */}
        <p
          className="mt-4 flex-1 min-h-0 overflow-hidden text-xs sm:text-sm leading-relaxed text-white/90"
          style={{
            maskImage: 'linear-gradient(to bottom, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent)',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
