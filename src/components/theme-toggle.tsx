'use client';

import { Moon, Sun } from 'lucide-react';

// Light / dark switch for pages that support both (currently the home page).
// The theme lives on <html data-theme="…">, which an inline script in the
// root layout sets before first paint from localStorage (default: dark), so
// the page never flashes the wrong colors. Both icons are rendered and CSS
// shows the right one, so the button is correct before hydration too.
//
// Switching uses a View Transition: the new theme wipes in as a circle
// growing out of the button. Browsers without View Transitions (or with
// reduced motion on) just switch instantly.

export type Theme = 'light' | 'dark';

export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const apply = () => {
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* private mode */ }
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduced || !origin) { apply(); return; }

  const { x, y } = origin;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  }).catch(() => {});
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      onClick={(e) => {
        const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
        const rect = e.currentTarget.getBoundingClientRect();
        setTheme(current === 'light' ? 'dark' : 'light', {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }}
      className={`theme-toggle relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${className}`}
    >
      <Sun size={17} className="theme-icon-sun" />
      <Moon size={17} className="theme-icon-moon" />
    </button>
  );
}
