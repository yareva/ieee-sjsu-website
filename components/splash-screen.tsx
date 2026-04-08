'use client';

import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [show,  setShow]  = useState(false);
  const [fade,  setFade]  = useState(false);
  const [gone,  setGone]  = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('splash-played')) {
      setGone(true); onComplete(); return;
    }
    requestAnimationFrame(() => setShow(true));
    const t1 = setTimeout(() => setFade(true), 2000);
    const t2 = setTimeout(() => {
      setGone(true);
      sessionStorage.setItem('splash-played', 'true');
      onComplete();
    }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f172a]"
      style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.8s ease' }}
    >
      <div style={{
        opacity:   show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
      }}>
        <img
          src="/ieee-mb.png"
          alt="IEEE"
          className="brightness-0 invert"
          style={{ width: '200px', height: 'auto' }}
          draggable={false}
        />
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 400,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          San José State University Student Branch
        </p>
      </div>
    </div>
  );
}
