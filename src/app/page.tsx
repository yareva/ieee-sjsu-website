'use client';
import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { sponsorshipPages } from '@/lib/data';
import { FlipBook } from '@/components/flip-book';
import { GoogleCalendar } from '@/components/google-calendar';

const HERO_VIDEO: string | null = null;

const aboutSlides = [
  '/ECG Workshop Testing.jpg',
  '/Renesas Speakers.jpg',
  '/Tesla Networking Event.jpg',
  '/Nuvoton Workshop.jpg',
];

// One row of the "IEEE SJSU" background text. Measures the width of a single
// repeated unit and wraps the scroll-driven offset with true modulo math, so
// the row tiles seamlessly edge-to-edge no matter how far the page scrolls —
// instead of the whole run eventually sliding off to one side with a gap.
function MarqueeRow({ scrollY, speed }: { scrollY: number; speed: number }) {
  const unitRef = useRef<HTMLSpanElement>(null);
  const [unitWidth, setUnitWidth] = useState(0);

  useEffect(() => {
    const measure = () => setUnitWidth(unitRef.current?.offsetWidth || 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const raw = scrollY * speed;
  const offset = unitWidth ? ((raw % unitWidth) + unitWidth) % unitWidth : 0;
  const textClass = 'text-7xl md:text-8xl font-black text-blue-950/[0.18] uppercase shrink-0';
  const textStyle = { fontFamily: 'var(--font-bebas)', letterSpacing: '-0.02em' } as const;

  return (
    <div className="overflow-hidden whitespace-nowrap leading-[0.9]">
      <div className="inline-flex" style={{ transform: `translateX(${-offset}px)` }}>
        <span ref={unitRef} className={textClass} style={textStyle}>IEEE&nbsp;SJSU&nbsp;IEEE&nbsp;SJSU&nbsp;</span>
        <span className={textClass} style={textStyle}>IEEE&nbsp;SJSU&nbsp;IEEE&nbsp;SJSU&nbsp;</span>
        <span className={textClass} style={textStyle}>IEEE&nbsp;SJSU&nbsp;IEEE&nbsp;SJSU&nbsp;</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [aboutSlide, setAboutSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroScroll, setHeroScroll] = useState(0); // 0–1 progress through the hero's own height
  const [pageScrollY, setPageScrollY] = useState(0); // raw scroll position — drives the About text, no autoplay

  const slides = [
    '/Apple Speaker Event 2.jpg',
    '/Innovation Garage Event 2.jpg',
    '/Nuvoton Workshop 2.jpg',
    '/Altium PCB Design Workshop.jpg',
    '/astera_lab.jpg',
  ];

  useEffect(() => {
    if (HERO_VIDEO) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(() => setAboutSlide(p => (p + 1) % aboutSlides.length), 3000);
    return () => clearInterval(timer);
  }, []);

  // Zoom + blur the hero background as you scroll past it — degree of the
  // effect is driven directly by scroll position, not time.
  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = heroRef.current?.offsetHeight || 1;
        setHeroScroll(Math.min(1, Math.max(0, window.scrollY / h)));
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setPageScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

        {/* ── HERO ── */}
        <section ref={heroRef} className="relative overflow-hidden" style={{ height: '100dvh', minHeight: '600px' }}>
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${1 + heroScroll * 0.25})`,
              filter: `blur(${heroScroll * 12}px)`,
            }}
          >
            {HERO_VIDEO ? (
              <video className="absolute inset-0 w-full h-full object-cover" src={HERO_VIDEO} autoPlay muted loop playsInline />
            ) : (
              slides.map((slide, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                  style={{ backgroundImage: `url("${slide}")`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === currentSlide ? 1 : 0 }} />
              ))
            )}
          </div>
          <div className="absolute inset-0 bg-black/50" />

          {/* Slide dots */}
          <div className="absolute bottom-8 left-10 md:left-16 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`} />
            ))}
          </div>

          {/* Text — centered */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-white leading-none"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(3.25rem, 8vw, 7rem)',
                letterSpacing: '0.05em',
                textShadow: '0 2px 60px rgba(0,0,0,0.35)',
              }}>
              Innovation Garage
            </h1>

            <p className="text-white/80 font-semibold mt-3 mb-10"
              style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                letterSpacing: '0.04em',
              }}>
              IEEE · San José State University · Student Chapter
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/events" className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-slate-100 transition-colors">
                Explore Events
              </a>
              <a href="/membership" className="px-5 py-2.5 border border-white/40 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors">
                Join Us!
              </a>
            </div>
          </div>
        </section>

        {/* ── ABOUT — text on the left, the marquee/photo on the right ── */}
        <section className="relative py-24 px-8 bg-[#f1f5f9]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                About Us
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-4">
                IEEE SJSU is the student-run chapter of IEEE — the world's largest technical professional organization, connecting a global network of over 400,000 members across nearly every field of engineering and technology.
              </p>
              <p className="text-slate-500 text-lg leading-relaxed mb-4">
                We run hands-on workshops covering PCB design, embedded systems, and digital logic, host speaker sessions and networking nights with companies like Apple, Tesla, and Lockheed Martin, and build real hardware projects — from wearable ECG monitors to chip design competitions.
              </p>
              <p className="text-slate-500 text-lg leading-relaxed">
                Membership is open to every SJSU student, not just engineering majors, and gets you access to our lab at ENGR 376, a community of 150+ active members, and direct connections to the companies hiring on campus.
              </p>
            </div>

            {/* Faint "IEEE SJSU" text confined behind the photo — moves only
                with scroll, fades out at the edges instead of a hard box */}
            <div className="relative w-full h-[400px] sm:h-[440px] overflow-hidden">
              <div
                className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 40%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 40%, transparent 100%)',
                }}
                aria-hidden="true"
              >
                {[0.22, -0.17, 0.26, -0.2].map((speed, row) => (
                  <MarqueeRow key={row} scrollY={pageScrollY} speed={speed} />
                ))}
              </div>

              {/* Photo, centered — cycles every few seconds */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[48%] max-w-[250px] aspect-[3/4] shadow-2xl">
                  {aboutSlides.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === aboutSlide ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TWO-PANEL ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-[3px] bg-slate-950">
          {[
            { img: '/Altium PCB Design Workshop.jpg', label: 'Explore our', title: 'EVENTS',     href: '/events',     cta: 'See Everything' },
            { img: '/Innovation Garage Event.jpg',    label: 'Become a',    title: 'MEMBER',     href: '/membership', cta: 'Join Us!'       },
          ].map((panel) => (
            <a key={panel.title} href={panel.href} className="relative group overflow-hidden" style={{ height: '460px' }}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url("${panel.img}")` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 z-10">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{panel.label}</p>
                <h3 className="text-5xl font-black text-white uppercase tracking-tight leading-none mb-5">{panel.title}</h3>
                <span className="inline-block px-5 py-2 bg-white text-slate-900 text-xs font-bold uppercase tracking-widest rounded-full">
                  {panel.cta}
                </span>
              </div>
            </a>
          ))}
        </section>

        {/* ── CALENDAR ── */}
        <section className="py-20 px-8 bg-[#f1f5f9]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-10">
              Our Calendar
            </h2>
            <GoogleCalendar />
          </div>
        </section>

        {/* ── SPONSORSHIP ── */}
        <section className="tech-bg relative py-24 px-8 md:px-20 overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-[1fr_1.1fr] gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-none mb-6 uppercase"
                style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.02em' }}>
                Sponsor IEEE SJSU
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-md">
                Sponsoring us puts your company directly in front of SJSU's engineering students — see the packet for tiers and details.
              </p>

              {/* Stats, straight from the sponsorship packet */}
              <div className="flex flex-wrap gap-x-10 gap-y-6 mb-10">
                {[
                  ['150+', 'Active Members'],
                  ['350+', 'Discord'],
                  ['850+', 'Instagram'],
                  ['250+', 'LinkedIn'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="text-3xl font-black text-slate-900">{n}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">{l}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="mailto:ieee@sjsu.edu"
                  className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors">
                  Get in Touch
                </a>
                <a href="/sponsorship-packet.pdf" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 border border-slate-300 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors">
                  Download Packet
                </a>
              </div>
            </div>

            <AnimatedSection>
              <FlipBook pages={sponsorshipPages} />
            </AnimatedSection>
          </div>
        </section>


      <Footer />
    </main>
  );
}
