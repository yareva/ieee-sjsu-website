'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Site-wide scroll transitions. Mounted once per page, from the Navbar.
//
// What animates (styles live in globals.css under "Scroll reveal"):
//  - the content of every top-level <section> on a page — its direct
//    children slide up and fade in, staggered, when the section scrolls in
//  - any element with [data-reveal]       — slides in on its own
//  - any element with [data-reveal-group] — its children stagger in one by one
// Opt a section out with [data-no-reveal] (used on the hero headers, which
// have their own intro).
//
// Hidden-until-revealed styles only apply once <html> has the `sr-on` class,
// which an inline script in the layout adds before first paint — so with
// JavaScript off, nothing is ever hidden. That script also removes the class
// again if this component hasn't started within a few seconds, so a script
// error can never leave the page blank.
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    (window as unknown as { __srReady?: boolean }).__srReady = true;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main > section:not([data-no-reveal]), [data-reveal], [data-reveal-group]'
      )
    );

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('sr-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-in');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    root.classList.add('sr-on');

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
