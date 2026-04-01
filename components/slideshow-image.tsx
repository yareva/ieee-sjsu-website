'use client';

import { useState, useEffect } from 'react';

interface SlideshowImageProps {
  slides: string[];
  alt: string;
}

export function SlideshowImage({ slides, alt }: SlideshowImageProps) {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % slides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [hovered, slides.length]);

  return (
    <div
      className="w-full h-full relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setIdx(0); }}
    >
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Dot indicators — only shown when multiple images */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === idx ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
