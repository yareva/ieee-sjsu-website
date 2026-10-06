'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { homeStops, clubStats } from '@/lib/data';
import type { GarageScene, Tour } from './scene';
import type { Slide } from './screens';
import './garage.css';

// A scroll-driven 3D walk through the Innovation Garage (ENGR 376).
//
// A tall section with a sticky full-screen <canvas>; scrolling through it
// moves the camera from shot to shot (shots live in scene.ts → TOURS).
//
//  home:   the 80s terminal boots to "WELCOME TO INNOVATION GARAGE" →
//          the room (About Us) → oscilloscope (What We Do) → multimeter
//          (Join) → the IEEE SJSU office door → into the office, where it
//          fades into the rest of the page. Text panels are `homeStops`.
//  events: under the projector as it switches on and runs a slideshow of
//          featured events → into the screen, fading into the page.
//
// three.js is only loaded in the browser (dynamic import), so it never runs
// on the server and doesn't weigh down the rest of the site.

const CONFIG: Record<Tour, { stopVh: number; stops: number; fadeFrom: number; title: string }> = {
  // stops = shots after the first one; must match TOURS in scene.ts
  home:   { stopVh: 90,  stops: 5, fadeFrom: 4.35, title: 'Welcome to Innovation Garage: IEEE SJSU Student Branch' },
  events: { stopVh: 110, stops: 1, fadeFrom: 0.5,  title: 'Featured Events' },
};
const HOME_DOTS = ['Welcome', ...homeStops.map((s) => s.title), 'Our Office'];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function GarageTour({ tour, slides, fadeTo }: {
  tour: Tour;
  /** projector slideshow (events) */
  slides?: Slide[];
  /** color the tour fades into at the end — the next section's background */
  fadeTo: string;
}) {
  const { stopVh, stops, fadeFrom, title } = CONFIG[tour];
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let scene: GarageScene | null = null;
    let disposed = false;
    let lastIdx = -1;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const progress = () => {
      const stop = (window.innerHeight * stopVh) / 100;
      return clamp(-section.getBoundingClientRect().top / stop, 0, stops);
    };
    const onScroll = () => {
      const p = progress();
      scene?.setProgress(p);
      if (fadeRef.current) fadeRef.current.style.opacity = String(clamp((p - fadeFrom) / (stops - fadeFrom), 0, 1));
      const idx = Math.round(p);
      if (idx !== lastIdx) { lastIdx = idx; setActive(idx); }
    };
    const onResize = () => scene?.resize();
    const onPointer = (e: PointerEvent) => {
      scene?.setPointer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    };
    const isDay = () => document.documentElement.dataset.theme === 'light';
    const themeObserver = new MutationObserver(() => scene?.setDay(isDay()));
    // only render while the section is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (!scene) return;
      if (entry.isIntersecting) scene.start(); else scene.stop();
    });

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    (async () => {
      try {
        const [{ createGarageScene }] = await Promise.all([
          import('./scene'),
          // the screens draw with the retro fonts, so wait for them
          document.fonts?.ready,
        ]);
        const css = getComputedStyle(document.documentElement);
        await Promise.all(['--font-pixel', '--font-vt323', '--font-bebas'].map((f) =>
          document.fonts?.load(`20px ${css.getPropertyValue(f)}`),
        )).catch(() => {});
        if (disposed) return;
        scene = createGarageScene(canvas, { tour, slides });
        scene.snapDay(isDay());
        onScroll();
        scene.start();
        setStatus('ready');
        // a beat of darkness, then the terminal / projector switches on
        setTimeout(() => scene?.powerOn(reduce), reduce ? 0 : 450);

        window.addEventListener('resize', onResize);
        if (!reduce && window.matchMedia('(pointer: fine)').matches) {
          window.addEventListener('pointermove', onPointer, { passive: true });
        }
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        io.observe(section);
      } catch {
        if (!disposed) setStatus('failed');
      }
    })();

    return () => {
      disposed = true;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      themeObserver.disconnect();
      io.disconnect();
      scene?.dispose();
    };
  }, [tour, slides, stopVh, stops, fadeFrom]);

  const jumpTo = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i * window.innerHeight * stopVh) / 100, behavior: 'smooth' });
  };

  const stop = tour === 'home' && active > 0 ? homeStops[active - 1] ?? null : null;
  const isJoin = tour === 'home' && active === homeStops.length;

  return (
    <section
      ref={sectionRef}
      data-no-reveal
      className="garage"
      style={{ height: `calc(100dvh + ${(stops + 0.3) * stopVh}vh)` }}
    >
      <div className={`garage-frame garage-${status}`}>
        <canvas ref={canvasRef} className="garage-canvas" aria-hidden="true" />

        <h1 className="sr-only">{title}</h1>

        {/* shown if WebGL isn't available */}
        {status === 'failed' && (
          <div className="garage-fallback">
            {tour === 'home' ? (
              <>
                <p className="garage-fallback-small">Welcome to</p>
                <p className="garage-fallback-big">Innovation<br />Garage</p>
                <p className="garage-fallback-sub">&gt; IEEE SJSU Student Branch</p>
              </>
            ) : (
              <p className="garage-fallback-big">Featured<br />Events</p>
            )}
          </div>
        )}

        <button
          type="button"
          className={`garage-hint ${tour === 'events' ? 'garage-hint-quick' : ''} ${active === 0 ? 'on' : ''}`}
          onClick={() => jumpTo(1)}
          tabIndex={active === 0 ? 0 : -1}
        >
          {tour === 'home' ? 'Scroll to enter' : 'Scroll to see them'} <span aria-hidden="true">▼</span>
        </button>

        {/* text panel for the current stop (home) */}
        <div className="garage-panel-wrap" aria-live="polite">
          {stop && (
            <div key={active} className="garage-panel">
              <p className="garage-prompt">{stop.prompt}<span className="garage-cursor" /></p>
              <h2 className="garage-title">
                {stop.title.split(' ').map((word, wi, words) => {
                  const offset = words.slice(0, wi).join('').length;
                  return (
                    <span key={wi}>
                      <span className="garage-word">
                        {Array.from(word).map((ch, i) => (
                          <span key={i} className="garage-char" style={{ ['--i' as string]: offset + i } as CSSProperties}>{ch}</span>
                        ))}
                      </span>
                      {wi < words.length - 1 && ' '}
                    </span>
                  );
                })}
              </h2>
              <p className="garage-body">{stop.body}</p>
              {stop.points && (
                <ul className="garage-points">
                  {stop.points.map((pt, i) => (
                    <li key={pt} style={{ ['--i' as string]: i } as CSSProperties}>{pt}</li>
                  ))}
                </ul>
              )}
              {isJoin && (
                <>
                  <dl className="garage-stats">
                    {clubStats.map((s) => (
                      <div key={s.label}>
                        <dt>{s.label}</dt>
                        <dd>{s.value}{s.suffix}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="garage-ctas">
                    <Link href="/membership" className="garage-btn garage-btn-primary">Become a Member</Link>
                    <Link href="/events" className="garage-btn">Explore Events</Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* progress dots (home) */}
        {tour === 'home' && (
          <nav className="garage-dots" aria-label="Tour of the lab">
            {HOME_DOTS.map((label, i) => {
              const on = Math.min(active, HOME_DOTS.length - 1) === i;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={on ? 'on' : ''}
                  aria-label={label}
                  aria-current={on ? 'step' : undefined}
                />
              );
            })}
          </nav>
        )}

        {/* fades into the next section at the end of the tour */}
        <div ref={fadeRef} className="garage-fade" style={{ background: fadeTo }} aria-hidden="true" />
      </div>
    </section>
  );
}
