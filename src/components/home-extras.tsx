'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

// Number that counts up the first time it scrolls into view
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Only count up if it starts off-screen; otherwise leave the real number
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setN(0);

    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);

  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' } as CSSProperties}>{n}{suffix}</span>;
}
