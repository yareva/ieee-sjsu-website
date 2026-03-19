'use client';

import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasPlayed = sessionStorage.getItem('splash-played');
      if (hasPlayed) {
        setVisible(false);
        onComplete();
        return;
      }
    }

    const t = setTimeout(() => {
      setVisible(false);
      if (typeof window !== 'undefined') sessionStorage.setItem('splash-played', 'true');
      onComplete();
    }, 1800);

    return () => clearTimeout(t);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f172a]">
      <p className="text-white text-2xl font-bold tracking-wide">IEEE</p>
      <p className="text-white/70 text-sm mt-1 tracking-widest uppercase">San Jose State University Student Chapter</p>
    </div>
  );
}
