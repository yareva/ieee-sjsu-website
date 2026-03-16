'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Phase = 'intro' | 'lockup' | 'tagline' | 'hold' | 'exit' | 'done';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [phase, setPhase] = useState<Phase>('intro');

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('splashed')) {
      setPhase('done');
      return;
    }
    setShowSplash(true);

    // Timeline:
    // 0ms     — logo starts HUGE, glowing, pulsing
    // 1800ms  — logo shrinks to center, "SJSU IEEE Student Branch" rises up
    // 2600ms  — tagline fades in below
    // 3800ms  — hold on full lockup
    // 4500ms  — curtain slides up
    // 5300ms  — unmount

    const t1 = setTimeout(() => setPhase('lockup'), 1800);
    const t2 = setTimeout(() => setPhase('tagline'), 2600);
    const t3 = setTimeout(() => setPhase('hold'), 3800);
    const t4 = setTimeout(() => setPhase('exit'), 4500);
    const t5 = setTimeout(() => {
      sessionStorage.setItem('splashed', '1');
      setShowSplash(false);
      setPhase('done');
    }, 5300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (phase === 'done' && !showSplash) return <>{children}</>;

  const isIntro = phase === 'intro';
  const showText = ['lockup', 'tagline', 'hold', 'exit'].includes(phase);
  const showTagline = ['tagline', 'hold', 'exit'].includes(phase);
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
            flexDirection: 'column',
            transform: isExiting ? 'translateY(-100%)' : 'translateY(0)',
            transition: isExiting ? 'transform 800ms cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
            overflow: 'hidden',
          }}
        >
          {/* Radial glow behind logo */}
          <div style={{
            position: 'absolute',
            width: isIntro ? '600px' : '300px',
            height: isIntro ? '600px' : '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%)',
            transition: 'width 1800ms ease, height 1800ms ease',
            pointerEvents: 'none',
          }} />

          {/* Scanning line effect during intro */}
          {isIntro && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(transparent 0%, rgba(37,99,235,0.05) 50%, transparent 100%)',
              animation: 'scan 1.5s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          )}

          {/* IEEE Logo */}
          <div style={{
            // INCREASED BASE SCALE AND INTRO SCALE
            transform: isIntro ? 'scale(6)' : 'scale(1.5)', 
            transition: 'transform 1800ms cubic-bezier(0.16, 1, 0.3, 1)',
            filter: isIntro
              ? 'brightness(0) invert(1) drop-shadow(0 0 60px rgba(37,99,235,1))'
              : 'brightness(0) invert(1) drop-shadow(0 0 15px rgba(37,99,235,0.4))',
            transitionProperty: 'transform, filter',
            transitionDuration: '1800ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <Image
              src="/ieee-mb.png"
              alt="IEEE Logo"
              width={180} 
              height={180}
              style={{ width: '180px', height: 'auto' }}
              priority
            />
          </div>

          {/* SJSU IEEE Student Branch Text */}
          <div style={{
            marginTop: '40px', // Increased margin
            transform: showText ? 'translateY(0)' : 'translateY(30px)',
            opacity: showText ? 1 : 0,
            transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease',
            textAlign: 'center',
          }}>
            <div style={{
              color: 'white',
              fontSize: '84px', 
              fontWeight: 900,
              letterSpacing: '-2px', 
              lineHeight: 0.9,
              fontFamily: '"DM Sans", sans-serif',
            }}>
              SJSU IEEE
            </div>
          </div>

          {/* Student Branch tagline */}
          <div style={{
            marginTop: '10px',
            transform: showTagline ? 'translateY(0)' : 'translateY(10px)',
            opacity: showTagline ? 1 : 0,
            transition: 'transform 500ms ease, opacity 500ms ease',
            textAlign: 'center',
          }}>
            <div style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '5px',
              textTransform: 'uppercase',
              fontFamily: '"DM Sans", sans-serif',
            }}>
              Student Branch
            </div>
          </div>

          {/* Bottom progress bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            backgroundColor: '#2563eb',
            width: isExiting ? '100%' : isIntro ? '0%' : '80%',
            transition: isIntro
              ? 'width 1800ms ease'
              : 'width 2700ms linear',
          }} />

          <style>{`
            @keyframes scan {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100vh); }
            }
          `}</style>
        </div>
      )}

      <div style={{
        opacity: showSplash ? 0 : 1,
        transition: 'opacity 500ms ease',
      }}>
        {children}
      </div>
    </>
  );
}