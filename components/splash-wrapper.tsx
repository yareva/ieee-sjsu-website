'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [show,  setShow]  = useState(false);
  const [slide, setSlide] = useState(false);
  const [done,  setDone]  = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('splashed')) {
      setDone(true);
      return;
    }
    requestAnimationFrame(() => setShow(true));
    const t1 = setTimeout(() => setSlide(true), 2200);
    const t2 = setTimeout(() => {
      setDone(true);
      sessionStorage.setItem('splashed', '1');
    }, 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (done) return <>{children}</>;

  return (
    <>
      {/* Splash — slides up like a curtain */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#1a6fa8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: slide ? 'translateY(-100%)' : 'translateY(0)',
        transition: slide ? 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <Image
            src="/ieee-mb.png"
            alt="IEEE"
            width={260}
            height={70}
            priority
            style={{ filter: 'brightness(0) invert(1)', width: '260px', height: 'auto' }}
          />
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '15px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 400,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            margin: 0,
          }}>
            San José State University · Student Branch
          </p>
        </div>
      </div>

      {/* Page always rendered underneath */}
      <>{children}</>
    </>
  );
}
