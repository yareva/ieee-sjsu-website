'use client';

import { useRef, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredProjects, workshops } from '@/lib/data';

const categoryColors: Record<string, string> = {
  'Active Project':    'bg-blue-600 text-white',
  'Industry Challenge':'bg-slate-800 text-white',
  'Speaker Event':     'bg-blue-100 text-blue-700',
  'Workshop':          'bg-slate-100 text-slate-700',
  'Networking':        'bg-slate-100 text-slate-700',
};

export default function ProjectsPage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'right' ? 1020 : -1020, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* HEADER */}
      <section className="pt-32 pb-10 px-8 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Projects & Workshops</h1>
          <p className="text-slate-500 mt-2">Hardware builds, PCB design, digital logic, and hands-on workshops.</p>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="bg-white">
        {featuredProjects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl mx-8">
            <p className="text-slate-400">No featured projects yet. Add one in <code className="text-blue-600">lib/data.ts</code>.</p>
          </div>
        ) : (
          featuredProjects.map((project, i) => (
            <AnimatedSection key={project.id}>
              <div className={`grid md:grid-cols-2 min-h-[520px] ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                {/* Image */}
                <div className="relative bg-slate-900 overflow-hidden min-h-[300px]">
                  {project.image
                    ? <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    : <div className="absolute inset-0 bg-slate-800" />
                  }
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                {/* Text */}
                <div className={`flex flex-col justify-center px-12 md:px-16 py-16 ${i % 2 === 0 ? 'bg-slate-950' : 'bg-white'}`}>
                  <p className={`text-xs font-bold tracking-[0.3em] uppercase mb-4 ${i % 2 === 0 ? 'text-blue-400' : 'text-blue-600'}`}>
                    {project.category}
                  </p>
                  <h3 className={`text-3xl md:text-4xl font-black leading-tight mb-5 tracking-tight ${i % 2 === 0 ? 'text-white' : 'text-slate-900'}`}>
                    {project.title}
                  </h3>
                  <p className={`text-base leading-relaxed max-w-sm ${i % 2 === 0 ? 'text-slate-400' : 'text-slate-500'}`}>
                    {project.description}
                  </p>
                  <p className={`text-xs mt-6 font-medium tracking-widest uppercase ${i % 2 === 0 ? 'text-slate-600' : 'text-slate-400'}`}>
                    {project.date}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))
        )}
      </section>

      {/* WORKSHOPS CAROUSEL */}
      <section className="py-20 bg-slate-50">
        <div className="px-8 md:px-16 mb-8 max-w-6xl mx-auto flex items-end justify-between">
          <AnimatedSection>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Past Workshops</h2>
          </AnimatedSection>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} disabled={!canLeft}
              className="p-3 bg-white border border-slate-200 rounded-full hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={20} className="text-slate-700" />
            </button>
            <button onClick={() => scroll('right')} disabled={!canRight}
              className="p-3 bg-white border border-slate-200 rounded-full hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={20} className="text-slate-700" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto scroll-smooth px-8 md:px-16 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {workshops.map((ws) => (
            <div key={ws.id} className="shrink-0 w-[300px] bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all flex flex-col">
              <div className="h-40 bg-slate-100 flex items-center justify-center">
                {ws.image
                  ? <img src={ws.image} alt={ws.title} className="w-full h-full object-cover" />
                  : <span className="text-xs text-slate-400">Workshop Image</span>
                }
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-400">{ws.date}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{ws.tag}</span>
                </div>
                <h3 className="text-base font-black text-slate-900 leading-snug">{ws.title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{ws.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LAB ACCESS */}
      <section className="px-8 md:px-16 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center mb-10">Lab Access</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-black text-slate-900 mb-4">Equipment</h3>
                <ul className="space-y-2 text-sm text-slate-500">
                  {['Oscilloscopes & Function Generators', 'PCB Design Workstations', 'Soldering & Assembly Tools', 'FPGA Development Boards', 'Multimeters & Power Supplies'].map(eq => (
                    <li key={eq} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      {eq}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-black text-slate-900 mb-4">Hours · ENGR 376</h3>
                <div className="space-y-3 text-sm">
                  {[['Monday – Friday', '7:00 AM – 10:30 PM'], ['Saturday', '8:00 AM – 7:00 PM'], ['Sunday', 'Closed']].map(([day, hrs]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-slate-500">{day}</span>
                      <span className={`font-semibold ${hrs === 'Closed' ? 'text-red-500' : 'text-slate-900'}`}>{hrs}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 bg-slate-900 text-white text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-black mb-4">Ready to Build Something?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Whether you're a beginner or experienced engineer, there's a place for you in IEEE SJSU.
          </p>
          <a href="/membership" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors">
            Get Started
          </a>
        </AnimatedSection>
      </section>

      <Footer />
    </main>
  );
}
