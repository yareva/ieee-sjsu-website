'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FlipDetails, useFlip } from '@/components/flip-card';

export interface CoverFlowItem {
  id: string;
  title: string;
  label: string;        // category pill, top-right of the cover
  date: string;
  location?: string;
  description: string;
  image: string;
}

// Cover-flow carousel — a regular section on the site's off-white background. When the page opens it sweeps through every event (last to
// first) and settles on the first one; any interaction stops the sweep. Move through it with the arrows, the scrubber, clicking a side
// cover, swiping/dragging, a sideways trackpad swipe, or arrow keys.
//
// The front cover "pops out": it sits forward in 3D and tilts toward the
// mouse. Same flip rules as every card on the site (see useFlip). Clicking a
// side cover brings it to the front already flipped.
//
// Whether the mouse is "on" the front cover is worked out from the cover's
// position on screen rather than enter/leave events on the cover itself —
// the cover tilts and floats, so those events would fire over and over at
// its edges and make it flicker.
export function CoverFlow({ items, title }: { items: CoverFlowItem[]; title: string }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(0);            // eased, fractional position actually drawn
  const current = useRef(0);
  const activeRef = useRef(0);
  const flip = useFlip();
  const flipped = flip.flipped;
  const frontRef = useRef<HTMLDivElement>(null);
  const mouseInside = useRef(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const wheelLock = useRef(0);

  // Glide the drawn position toward the active card. The animation loop only
  // runs while the cards are actually moving, then stops.
  const raf = useRef(0);
  const animate = useCallback(() => {
    if (raf.current) return;
    const tick = () => {
      const diff = activeRef.current - current.current;
      if (Math.abs(diff) > 0.001) {
        current.current += diff * 0.14;
        setPos(current.current);
        raf.current = requestAnimationFrame(tick);
      } else {
        current.current = activeRef.current;
        setPos(current.current);
        raf.current = 0;
      }
    };
    raf.current = requestAnimationFrame(tick);
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(n - 1, i));
    activeRef.current = next;
    setActive(next);
    animate();
  }, [n, animate]);

  // Changing cards resets the tilt (the flip is set by whoever changed it)
  useEffect(() => setTilt({ x: 0, y: 0 }), [active]);

  // Intro sweep: jump to the last card, then step back to the first —
  // quick at the start, slowing as it lands.
  const introTimers = useRef<number[]>([]);
  const stopIntro = useCallback(() => {
    introTimers.current.forEach((t) => window.clearTimeout(t));
    introTimers.current = [];
  }, []);
  useEffect(() => {
    if (n < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    current.current = n - 1;
    activeRef.current = n - 1;
    setPos(n - 1);
    setActive(n - 1);
    let t = 650; // let the section slide in first
    for (let k = n - 2, step = 0; k >= 0; k--, step++) {
      t += 90 + step * 14;
      const idx = k;
      introTimers.current.push(window.setTimeout(() => go(idx), t));
    }
    return stopIntro;
  }, [n, go, stopIntro]);

  const goAndReset = (i: number) => {
    stopIntro();
    flip.reset();
    go(i);
  };

  // Slider: while dragging, the cards follow the handle exactly (no easing,
  // so it responds instantly); on release it settles on the nearest card.
  const scrub = (v: number) => {
    stopIntro();
    flip.reset();
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    current.current = v;
    const nearest = Math.round(v);
    activeRef.current = nearest;
    setActive(nearest);
    setPos(v);
  };
  const endScrub = () => go(Math.round(current.current));

  // Mouse over the stage: is it on the front cover? Drives the hover flip
  // and the tilt.
  const trackMouse = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const rect = frontRef.current?.getBoundingClientRect();
    const inside = !!rect &&
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (inside !== mouseInside.current) {
      mouseInside.current = inside;
      if (inside) flip.enter(); else flip.leave();
    }
    if (inside && rect) {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: px * 12, y: -py * 12 });
    } else {
      setTilt({ x: 0, y: 0 });
    }
  };
  const mouseLeftStage = () => {
    if (mouseInside.current) {
      mouseInside.current = false;
      flip.leave();
    }
    setTilt({ x: 0, y: 0 });
  };

  // Sideways trackpad swipes move the carousel; vertical scrolling is left
  // alone so the page always scrolls normally.
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 8) return;
    const now = Date.now();
    if (now - wheelLock.current < 350) return;
    wheelLock.current = now;
    goAndReset(activeRef.current + (e.deltaX > 0 ? 1 : -1));
  };

  // Swipe / drag sideways
  const onPointerDown = (e: React.PointerEvent) => {
    stopIntro();
    drag.current = { x: e.clientX, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    trackMouse(e);
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50) {
      goAndReset(activeRef.current + (dx < 0 ? 1 : -1));
      drag.current = { x: e.clientX, moved: true };
    }
  };
  // Cleared after the click event fires, so a drag doesn't also count as a click
  const endDrag = () => setTimeout(() => (drag.current = null), 0);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goAndReset(active + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goAndReset(active - 1); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stopIntro(); flip.toggle(); }
  };

  if (n === 0) return null;

  const front = items[active];

  return (
    <section className="relative bg-[#f4f4f2] pt-28 md:pt-32 pb-16 md:pb-20 [overflow-x:clip]">

      <h2
        className="text-center font-bold text-[#294867] leading-none px-6"
        style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)', letterSpacing: '-0.05em' }}
      >
        {title}
      </h2>

      {/* Stage */}
      <div
        className="cf-stage relative mt-8 md:mt-10 flex items-center justify-center outline-none select-none touch-pan-y"
        style={{ perspective: '1100px' }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => { endDrag(); mouseLeftStage(); }}
        aria-roledescription="carousel"
        aria-label={title}
      >
        <div className="relative cf-card-size -translate-y-[10%]" style={{ transformStyle: 'preserve-3d' }}>
          {items.map((item, i) => {
            const d = i - pos;
            const a = Math.abs(d);
            if (a > 6) return null;
            const s = Math.sign(d);
            const x = s * (a < 1 ? a * 72 : 72 + (a - 1) * 20);   // % of card width
            const z = a < 1 ? 90 - a * 330 : -240 - (a - 1) * 60; // px — front card sits forward
            const r = -Math.max(-1, Math.min(1, d)) * 60;          // deg
            const isFront = i === active;
            const isFlipped = isFront && flipped;

            return (
              <div
                key={item.id}
                ref={isFront ? frontRef : undefined}
                className="absolute inset-0"
                style={{
                  transform: `translateX(${x}%) translateZ(${z}px) rotateY(${r}deg)`,
                  zIndex: 1000 - Math.round(a * 100),
                  opacity: a > 5 ? Math.max(0, 6 - a) : 1,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className={isFront ? 'cf-float h-full' : 'h-full'} style={{ transformStyle: 'preserve-3d' }}>
                  {/* Tilt toward the mouse (front card only) */}
                  <div
                    className="h-full transition-transform duration-300 ease-out"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFront ? `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` : undefined,
                    }}
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={isFront ? `${item.title}: ${isFlipped ? 'hide' : 'show'} details` : `Go to ${item.title}`}
                      onClick={() => {
                        if (drag.current?.moved) return;
                        stopIntro();
                        if (isFront) flip.toggle();
                        else { go(i); flip.show(); }
                      }}
                      className="relative block w-full h-full cursor-pointer transition-transform duration-500"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
                        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                      }}
                    >
                      {/* Front — the cover */}
                      <div
                        className="absolute inset-0 overflow-hidden rounded-lg bg-slate-200 [backface-visibility:hidden]"
                        style={{
                          boxShadow: isFront
                            ? '0 40px 70px -20px rgba(41,72,103,0.55), 0 18px 30px -12px rgba(0,0,0,0.35)'
                            : '0 20px 40px -18px rgba(41,72,103,0.45)',
                        }}
                      >
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" draggable={false} />
                        {/* side covers fade back into the background */}
                        <div className="absolute inset-0 bg-[#f4f4f2] pointer-events-none" style={{ opacity: Math.min(a, 3) * 0.12 }} />
                        {/* glossy highlight that shifts with the tilt */}
                        {isFront && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: `linear-gradient(${135 + tilt.x * 4}deg, rgba(255,255,255,0.22), transparent 45%)` }}
                          />
                        )}
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest">
                          {item.label}
                        </span>
                      </div>

                      {/* Back — details */}
                      <div
                        className="absolute inset-0 overflow-hidden rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
                        style={{ boxShadow: '0 40px 70px -20px rgba(41,72,103,0.55)' }}
                      >
                        <FlipDetails {...item} />
                      </div>
                    </button>
                  </div>

                  {/* Reflection on the "floor" */}
                  <div
                    className="absolute left-0 right-0 top-full mt-2 h-[35%] overflow-hidden rounded-lg pointer-events-none transition-opacity duration-500"
                    style={{
                      opacity: isFlipped ? 0 : 0.22,
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%)',
                    }}
                    aria-hidden="true"
                  >
                    <img src={item.image} alt="" className="w-full aspect-square object-cover" style={{ transform: 'scaleY(-1)' }} draggable={false} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption + controls */}
      <div className="px-6">
        <p className="text-center text-[#294867] font-bold text-base md:text-lg leading-snug truncate">{front.title}</p>
        <p className="text-center text-[#58708a] text-sm mb-5">{front.date}</p>

        <div className="mx-auto max-w-xl flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => goAndReset(active - 1)}
            disabled={active === 0}
            aria-label="Previous"
            className="shrink-0 w-9 h-9 rounded-full border border-[#d8d9d6] bg-[#f8f8f6] text-[#294867] flex items-center justify-center hover:border-[#294867] disabled:opacity-30 transition"
          >
            <ChevronLeft size={18} />
          </button>

          <input
            type="range"
            min={0}
            max={n - 1}
            step="any"
            value={pos}
            onChange={(e) => scrub(Number(e.target.value))}
            onPointerUp={endScrub}
            onPointerCancel={endScrub}
            onTouchEnd={endScrub}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); goAndReset(active + 1); }
              if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); goAndReset(active - 1); }
            }}
            aria-label="Choose event"
            aria-valuetext={front.title}
            className="cf-range flex-1"
            style={{ '--cf-fill': `${n > 1 ? (pos / (n - 1)) * 100 : 0}%` } as React.CSSProperties}
          />

          <button
            onClick={() => goAndReset(active + 1)}
            disabled={active === n - 1}
            aria-label="Next"
            className="shrink-0 w-9 h-9 rounded-full border border-[#d8d9d6] bg-[#f8f8f6] text-[#294867] flex items-center justify-center hover:border-[#294867] disabled:opacity-30 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
