'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [phase, setPhase] = useState<'logo' | 'text' | 'exit'>('logo');

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem('splashed')) return;
    setShowSplash(true);

    const t1 = setTimeout(() => setPhase('text'), 700);
    const t2 = setTimeout(() => setPhase('exit'), 2000);
    const t3 = setTimeout(() => {
      sessionStorage.setItem('splashed', '1');
      setShowSplash(false);
    }, 2700);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center transition-transform duration-700 ease-in-out ${
            phase === 'exit' ? '-translate-y-full' : 'translate-y-0'
          }`}
          style={{ backgroundColor: '#1a6fa8' }}
        >
          <div className="flex items-center gap-5">
            {/* Logo coin flip */}
            <div
              className="transition-all duration-700 ease-out"
              style={{
                transform: phase === 'logo' ? 'rotateY(90deg) scale(0.8)' : 'rotateY(0deg) scale(1)',
                opacity: phase === 'logo' ? 0 : 1,
              }}
            >
              <Image
                src="/ieee-mb.png"
                alt="IEEE SJSU"
                width={72}
                height={72}
                style={{ width: '72px', height: 'auto', filter: 'brightness(0) invert(1)' }}
                priority
              />
            </div>

            {/* Text reveal */}
            <div className="overflow-hidden">
              <div
                className="transition-all duration-500 ease-out"
                style={{
                  transform: phase === 'text' || phase === 'exit' ? 'translateY(0)' : 'translateY(100%)',
                  opacity: phase === 'text' || phase === 'exit' ? 1 : 0,
                }}
              >
                <p className="text-white font-black text-3xl tracking-tight leading-none">SJSU</p>
                <p className="text-white/70 text-sm font-medium tracking-[0.15em] uppercase mt-0.5">IEEE Student Branch</p>
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