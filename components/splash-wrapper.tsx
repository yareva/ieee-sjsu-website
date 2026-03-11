'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Phase = 'spinning' | 'sjsu' | 'subtitle' | 'hold' | 'exit' | 'done';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [phase, setPhase] = useState<Phase>('spinning');

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('splashed')) {
      setPhase('done');
      return;
    }
    setShowSplash(true);

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
    }, 5000);

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

  const showSJSU = ['sjsu', 'subtitle', 'hold', 'exit'].includes(phase);
  const showSubtitle = ['subtitle', 'hold', 'exit'].includes(phase);
  const isExiting = phase === 'exit';

  return (
    <>
      {showSplash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#1a6fa8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isExiting ? 'translateY(-100%)' : 'translateY(0)',
            transition: isExiting ? 'transform 800ms cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Logo - starts large, spins and shrinks */}
            <div
              style={{
                transform: phase === 'spinning' ? 'rotate(0deg) scale(6)' : 'rotate(360deg) scale(1)',
                transition: 'transform 1500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transformOrigin: 'center',
              }}
            >
              <Image
                src="/ieee_logoo.png"
                alt="IEEE Logo"
                width={80}
                height={80}
                style={{ width: '80px', height: 'auto', filter: 'brightness(0) invert(1)' }}
                priority
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/ieee-mb.png';
                }}
              />
            </div>

            {/* Text */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* SJSU slams in */}
              <div
                style={{
                  transform: showSJSU ? 'translateX(0)' : 'translateX(80px)',
                  opacity: showSJSU ? 1 : 0,
                  transition: 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease',
                }}
              >
                <span style={{ color: 'white', fontWeight: 900, fontSize: '72px', letterSpacing: '-2px', lineHeight: 1 }}>
                  SJSU
                </span>
              </div>

              {/* IEEE Student Branch fades up */}
              <div
                style={{
                  transform: showSubtitle ? 'translateY(0)' : 'translateY(12px)',
                  opacity: showSubtitle ? 1 : 0,
                  transition: 'transform 500ms ease, opacity 500ms ease',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500, letterSpacing: '4px', textTransform: 'uppercase' }}>
                  IEEE Student Branch
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 500ms ease' }}>
        {children}
      </div>
    </>
  );
}