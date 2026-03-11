'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'exit' | 'done'>('logo');

  const text = "SJSU IEEE Student Branch";
  const letters = text.split('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasPlayed = sessionStorage.getItem('splash-played');
      if (hasPlayed) {
        setPhase('done');
        onComplete();
        return;
      }
    }

    const textTimer = setTimeout(() => setPhase('text'), 600);
    const exitTimer = setTimeout(() => setPhase('exit'), 2400);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('splash-played', 'true');
      }
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <>
      <style jsx>{`
        @keyframes coinFlip {
          0% { transform: rotateY(90deg) scale(0.8); opacity: 0; }
          100% { transform: rotateY(0deg) scale(1); opacity: 1; }
        }
        @keyframes letterRise {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        .coin-flip { animation: coinFlip 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .letter-rise { animation: letterRise 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .slide-up { animation: slideUp 0.6s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
      `}</style>

      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${phase === 'exit' ? 'slide-up' : ''}`}
        style={{ backgroundColor: '#1a6fa8' }}
      >
        <div className="coin-flip mb-8" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
          <Image
            src="/ieee-mb.png"
            alt="IEEE Logo"
            width={200}
            height={80}
            className="brightness-0 invert"
            priority
          />
        </div>

        <div className="flex flex-wrap justify-center gap-1 px-4">
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`text-white text-2xl md:text-4xl font-bold ${phase === 'text' || phase === 'exit' ? 'letter-rise' : ''}`}
              style={{
                opacity: phase === 'logo' ? 0 : undefined,
                animationDelay: phase !== 'logo' ? `${index * 50}ms` : '0ms',
                animationFillMode: 'forwards',
                display: letter === ' ' ? 'inline' : 'inline-block',
                minWidth: letter === ' ' ? '0.5em' : 'auto',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}