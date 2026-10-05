'use client';

import { useEffect, useId, useRef } from 'react';

// Served from jsDelivr off the published npm package — the CDN path the
// DearFlip Lite README documents for exactly this kind of integration.
const DFLIP_BASE = 'https://cdn.jsdelivr.net/npm/@dearhive/dearflip-jquery-flipbook/dflip';
const DFLIP_CSS = [`${DFLIP_BASE}/css/dflip.min.css`, `${DFLIP_BASE}/css/themify-icons.min.css`];
const JQUERY_SRC = `${DFLIP_BASE}/js/libs/jquery.min.js`;
const DFLIP_JS = `${DFLIP_BASE}/js/dflip.min.js`;

declare global {
  interface Window {
    [key: `option_${string}`]: unknown;
    jQuery?: unknown;
  }
}

function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') { resolve(); return; }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => { script.dataset.loaded = 'true'; resolve(); };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

interface DearFlipBookProps {
  /** URL of the PDF to display */
  source: string;
  className?: string;
}

// Renders the "_df_book" element DearFlip's own JS scans for on load, per
// its documented embed pattern — this isn't a React component in the usual
// sense, it's a stable DOM node that the DearFlip/jQuery bundle takes over
// once loaded, same as it would on a plain HTML page.
export function DearFlipBook({ source, className = '' }: DearFlipBookProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bookId = `df_book_${rawId}`;
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    DFLIP_CSS.forEach(loadCss);

    // DearFlip reads a global `option_<elementId>` variable when it scans
    // the page for ._df_book elements, so this has to be set before
    // dflip.min.js runs its scan.
    window[`option_${bookId}`] = {
      source,
      webgl: true,
      // Auto height per DearFlip's own recommendation — lets it size the
      // book to the PDF's real aspect ratio instead of stretching it.

      // scrollWheel defaults to true in DearFlip, which hijacks the mouse
      // wheel to zoom the 3D canvas the moment the cursor is over the book
      // — so scrolling the page while your mouse happens to be over the
      // flipbook zooms it instead of scrolling. Off, so the page scrolls
      // like normal no matter where the cursor is.
      scrollWheel: false,
    };

    loadScript(JQUERY_SRC)
      .then(() => loadScript(DFLIP_JS))
      .catch(() => { /* the div stays empty if the CDN is unreachable */ });
  }, [bookId, source]);

  return (
    <div
      className={`_df_book w-full ${className}`}
      id={bookId}
      source={source}
      scrollwheel="false"
      style={{ minHeight: 500 }}
    />
  );
}
