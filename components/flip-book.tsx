'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Plus, Minus } from 'lucide-react';

interface FlipBookProps {
  pages: (string | null)[];
}

function Page({ src, num }: { src: string | null; num: number }) {
  return src ? (
    <img src={src} alt={`pg ${num}`} className="w-full h-full object-contain" draggable={false} />
  ) : (
    <div className="w-full h-full bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-8 select-none">
      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.25em] mb-3">IEEE SJSU</p>
      <p className="text-slate-400 text-sm font-bold text-center leading-snug">Sponsorship<br />Packet</p>
      <p className="text-slate-300 text-xs mt-4">pg. {num}</p>
    </div>
  );
}

// Spread layout:
// Spread 0        : cover (page 0) CENTERED alone, both halves blank behind it
// Spread k ≥ 1   : L = 2k-1,  R = 2k  (R = -1 if it doesn't exist → solo last)
function spreadInfo(s: number, total: number) {
  if (s === 0) return { L: -1, R: 0, cover: true };
  const L = 2 * s - 1;
  const R = 2 * s;
  return { L, R: R < total ? R : -1, cover: false };
}

export function FlipBook({ pages }: FlipBookProps) {
  const [spread,  setSpread]  = useState(0);
  const [phase,   setPhase]   = useState<'idle' | 'next' | 'prev'>('idle');
  const [pending, setPending] = useState(0);
  const [zoom,    setZoom]    = useState(1);
  const [isFS,    setIsFS]    = useState(false);
  const fsRef  = useRef<HTMLDivElement>(null);

  const n            = pages.length;
  const totalSpreads = n <= 1 ? 1 : 1 + Math.ceil((n - 1) / 2);
  const cur          = spreadInfo(spread,  n);
  const pen          = spreadInfo(pending, n);
  const get          = (i: number) => (i >= 0 && i < n ? pages[i] : null);
  const isFlipping   = phase !== 'idle';

  // Background pages visible during the flip
  const bgLeft  = isFlipping && phase === 'prev' ? get(pen.L) : get(cur.L);
  const bgRight = isFlipping && phase === 'next' ? get(pen.R) : get(cur.R);

  // Content on the animating half-page
  const flipFront    = phase === 'next' ? get(cur.R) : get(cur.L);
  const flipBack     = phase === 'next' ? get(pen.L) : get(pen.R);
  const flipFrontNum = phase === 'next' ? cur.R + 1  : cur.L + 1;
  const flipBackNum  = phase === 'next' ? pen.L + 1  : pen.R + 1;

  const showSpine = isFlipping || (cur.L >= 0 && cur.R >= 0 && !cur.cover);

  // Fullscreen API
  useEffect(() => {
    const h = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);
  const toggleFS = () => {
    if (!document.fullscreenElement) fsRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const navigate = (d: 'next' | 'prev') => {
    const ns = d === 'next' ? spread + 1 : spread - 1;
    if (ns < 0 || ns >= totalSpreads || phase !== 'idle') return;
    setPending(ns);
    setPhase(d);
    setTimeout(() => { setSpread(ns); setPhase('idle'); }, 800);
  };

  const zoomIn  = () => setZoom(z => Math.min(2.5, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom(z => Math.max(0.5,  +(z - 0.25).toFixed(2)));

  const pageLabel = () => {
    if (n <= 1)   return '1 / 1';
    if (cur.cover) return `1 / ${n}`;
    if (cur.R < 0) return `${cur.L + 1} / ${n}`;
    return `${cur.L + 1}–${cur.R + 1} / ${n}`;
  };

  const curlShadow = (side: 'L' | 'R') => (
    <div className="absolute inset-0 pointer-events-none" style={{
      background: side === 'R'
        ? 'linear-gradient(to right, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 45%, transparent 70%)'
        : 'linear-gradient(to left,  rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 45%, transparent 70%)',
      animation: 'flip-shadow-in 0.8s ease-in-out forwards',
    }} />
  );

  // Control bar — identical in both inline and fullscreen, always visible at top
  const controlBar = (
    <div className={`flex items-center justify-center gap-2 w-full ${isFS ? 'mb-6' : 'mb-3'}`}>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-sm border ${isFS ? 'bg-white/10 border-white/20 backdrop-blur-md' : 'bg-white border-slate-200'}`}>

        {/* Prev */}
        <button onClick={() => navigate('prev')} disabled={spread === 0 || phase !== 'idle'}
          className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronLeft size={16} className={isFS ? 'text-white' : 'text-slate-700'} />
        </button>

        <span className={`text-xs font-semibold tabular-nums min-w-[72px] text-center ${isFS ? 'text-white/70' : 'text-slate-500'}`}>
          {pageLabel()}
        </span>

        <button onClick={() => navigate('next')} disabled={spread >= totalSpreads - 1 || phase !== 'idle'}
          className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronRight size={16} className={isFS ? 'text-white' : 'text-slate-700'} />
        </button>

        <div className={`w-px h-4 mx-0.5 ${isFS ? 'bg-white/25' : 'bg-slate-200'}`} />

        {/* Zoom out */}
        <button onClick={zoomOut} disabled={zoom <= 0.5}
          className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <Minus size={13} className={isFS ? 'text-white' : 'text-slate-700'} />
        </button>

        <span className={`text-xs font-semibold tabular-nums w-9 text-center ${isFS ? 'text-white/70' : 'text-slate-500'}`}>
          {Math.round(zoom * 100)}%
        </span>

        {/* Zoom in */}
        <button onClick={zoomIn} disabled={zoom >= 2.5}
          className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <Plus size={13} className={isFS ? 'text-white' : 'text-slate-700'} />
        </button>

        <div className={`w-px h-4 mx-0.5 ${isFS ? 'bg-white/25' : 'bg-slate-200'}`} />

        {/* Fullscreen / Exit */}
        <button onClick={toggleFS}
          className="p-1.5 rounded-full hover:bg-slate-100 transition-all">
          {isFS
            ? <X size={14} className="text-white" />
            : <Maximize2 size={13} className="text-slate-700" />}
        </button>
      </div>
    </div>
  );

  // Book spread element
  const bookEl = (
    <div
      className="relative rounded-xl overflow-hidden select-none w-full"
      style={{
        aspectRatio: '2 / 1.41',
        boxShadow: isFS
          ? '0 40px 100px rgba(0,0,0,0.7), 0 12px 36px rgba(0,0,0,0.4)'
          : '0 28px 72px rgba(0,0,0,0.24), 0 6px 20px rgba(0,0,0,0.10)',
      }}
    >
      {/* ── COVER SPREAD: page 0 centered alone ── */}
      {cur.cover && !isFlipping && (
        <div className="absolute inset-0" style={{ background: '#e8ecf0' }}>
          {/* Centered single page with drop shadow */}
          <div className="absolute inset-y-0" style={{ left: '25%', right: '25%',
            boxShadow: '0 8px 40px rgba(0,0,0,0.28), 0 2px 10px rgba(0,0,0,0.14)' }}>
            <Page src={get(0)} num={1} />
          </div>
        </div>
      )}

      {/* ── NORMAL SPREAD backgrounds ── */}
      {(!cur.cover || isFlipping) && (
        <>
          {/* Left half */}
          <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
            style={{ background: bgLeft == null ? '#edf0f3' : 'white' }}>
            {bgLeft != null && <Page src={bgLeft} num={Math.max(cur.L, 0) + 1} />}
            {bgLeft != null && cur.R >= 0 && (
              <div className="absolute inset-y-0 right-0 w-12 pointer-events-none"
                style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.09))' }} />
            )}
          </div>

          {/* Right half */}
          <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
            style={{ background: bgRight == null ? '#edf0f3' : 'white' }}>
            {bgRight != null && <Page src={bgRight} num={Math.max(cur.R, 0) + 1} />}
            {bgRight != null && cur.L >= 0 && (
              <div className="absolute inset-y-0 left-0 w-12 pointer-events-none"
                style={{ background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.09))' }} />
            )}
          </div>

          {/* Spine */}
          {showSpine && (
            <div className="absolute inset-y-0 left-1/2 -translate-x-px w-[3px] z-20 pointer-events-none"
              style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.22), rgba(0,0,0,0.04), rgba(0,0,0,0.22))' }} />
          )}
        </>
      )}

      {/* ── FLIP NEXT ── */}
      {phase === 'next' && (
        <div key="fn" className="absolute inset-y-0 right-0 w-1/2 z-10"
          style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d',
            animation: 'book-flip-next 0.8s linear forwards' }}>
          <div className="absolute inset-0 overflow-hidden bg-white" style={{ backfaceVisibility: 'hidden' }}>
            <Page src={flipFront} num={flipFrontNum} />
            {curlShadow('R')}
          </div>
          <div className="absolute inset-0 overflow-hidden bg-white" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <Page src={flipBack} num={flipBackNum} />
            {curlShadow('L')}
          </div>
        </div>
      )}

      {/* ── FLIP PREV ── */}
      {phase === 'prev' && (
        <div key="fp" className="absolute inset-y-0 left-0 w-1/2 z-10"
          style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d',
            animation: 'book-flip-prev 0.8s linear forwards' }}>
          <div className="absolute inset-0 overflow-hidden bg-white" style={{ backfaceVisibility: 'hidden' }}>
            <Page src={flipFront} num={flipFrontNum} />
            {curlShadow('L')}
          </div>
          <div className="absolute inset-0 overflow-hidden bg-white" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <Page src={flipBack} num={flipBackNum} />
            {curlShadow('R')}
          </div>
        </div>
      )}
    </div>
  );

  // ── FULLSCREEN layout ──────────────────────────────────────
  if (isFS) {
    return (
      <div ref={fsRef} style={{
        width: '100vw', height: '100vh', background: '#0d0d0d',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px', boxSizing: 'border-box',
      }}>
        {controlBar}
        <div style={{ width: 'min(90vw, 1100px)', overflow: 'hidden', borderRadius: '0.75rem' }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center',
            transition: 'transform 0.2s ease' }}>
            {bookEl}
          </div>
        </div>
      </div>
    );
  }

  // ── INLINE layout ─────────────────────────────────────────
  // The outer div is always the same size — zoom scales INSIDE it (overflow hidden).
  // Controls sit above and NEVER move regardless of zoom level.
  return (
    <div ref={fsRef}>
      {controlBar}
      {/* Fixed-size viewport: book zooms inside, container never grows */}
      <div style={{ overflow: 'hidden', borderRadius: '0.75rem' }}>
        <div style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}>
          {bookEl}
        </div>
      </div>
    </div>
  );
}
