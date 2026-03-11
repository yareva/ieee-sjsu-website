'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Phase = 'spinning' | 'sjsu' | 'subtitle' | 'hold' | 'exit' | 'done';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [phase, setPhase] = useState<Phase>('spinning');

  useEffect(() => {
    // Only show once per session
    if (typeof window !== 'undefined' && sessionStorage.getItem('splashed')) {
      setPhase('done');
      return;
    }
    setShowSplash(true);

    // Timing per spec:
    // 0ms — large logo starts spinning and slowly shrinking
    // 1500ms — logo reaches final small size, "SJSU" slams in from right
    // 2200ms — "IEEE Student Branch" fades up
    // 3500ms — full lockup visible, brief pause
    // 4200ms — screen slides up revealing site
    // 4900ms — splash unmounts

    const t1 = setTimeout(() => setPhase('sjsu'), 1500);
    const t2 = setTimeout(() => setPhase('subtitle'), 2200);
    const t3 = setTimeout(() => setPhase('hold'), 3500);
    const t4 = setTimeout(() => setPhase('exit'), 4200);
    const t5 = setTimeout(() => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('splashed', '1');
      }
      setShowSplash(false);
      setPhase('done');
    }, 4900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (phase === 'done' && !showSplash) {
    return <>{children}</>;
  }

  const showSJSU = phase === 'sjsu' || phase === 'subtitle' || phase === 'hold' || phase === 'exit';
  const showSubtitle = phase === 'subtitle' || phase === 'hold' || phase === 'exit';
  const isExiting = phase === 'exit';

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
            isExiting ? '-translate-y-full' : 'translate-y-0'
          }`}
          style={{ backgroundColor: '#1a6fa8' }}
        >
          <div className="flex items-center gap-6">
            {/* Logo - starts massive, spins 360 while shrinking */}
            <div
              className="transition-all duration-[1500ms] ease-out"
              style={{
                transform: phase === 'spinning' 
                  ? 'rotate(0deg) scale(3)' 
                  : 'rotate(360deg) scale(1)',
                transformOrigin: 'center',
              }}
            >
              <Image
                src="/ieee_logoo.png"
                alt="IEEE Logo"
                width={80}
                height={80}
                style={{ 
                  width: '80px', 
                  height: 'auto',
                  filter: 'brightness(0) invert(1)',
                }}
                priority
                onError={(e) => {
                  // Fallback to ieee-mb.png if ieee_logoo.png doesn't exist
                  (e.target as HTMLImageElement).src = '/ieee-mb.png';
                }}
              />
            </div>

            {/* Text container */}
            <div className="flex flex-col">
              {/* SJSU - slams in from right */}
              <div
                className={`transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  showSJSU ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
                }`}
              >
                <span className="text-white font-heading font-black text-5xl md:text-7xl tracking-tight">
                  SJSU
                </span>
              </div>

              {/* IEEE Student Branch - fades up */}
              <div
                className={`transition-all duration-500 ease-out ${
                  showSubtitle ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <span className="text-white/80 text-sm md:text-base font-medium tracking-widest uppercase">
                  IEEE Student Branch
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
}
