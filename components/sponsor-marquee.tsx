'use client';

export function SponsorMarquee() {
  const sponsors = [
    { name: 'Apple' },
    { name: 'Intel' },
    { name: 'NVIDIA' },
    { name: 'Meta' },
    { name: 'TSMC' },
  ];

  return (
    <div className="w-full py-16 md:py-20 border-y border-border bg-muted/40">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-widest">
          Trusted by Industry Leaders
        </p>
        <div className="relative overflow-hidden">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-muted/40 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-muted/40 to-transparent z-10" />

          {/* Marquee */}
          <div className="flex gap-16 animate-marquee">
            {[...sponsors, ...sponsors].map((sponsor, i) => (
              <div key={i} className="whitespace-nowrap flex-shrink-0 font-bold text-foreground/70 text-lg hover:text-foreground transition-colors">
                {sponsor.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
