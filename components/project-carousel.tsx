'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredProjects, workshops } from '@/lib/data';

// Merge featured + workshops into one flat list for the homepage carousel
const allItems = [
  ...featuredProjects,
  ...workshops.map(ws => ({
    id: ws.id,
    title: ws.title,
    category: 'Workshop' as const,
    description: ws.description,
    date: ws.date,
    image: ws.image,
  })),
];

const categoryColors: Record<string, string> = {
  'Active Project':    'bg-blue-600 text-white',
  'Industry Challenge':'bg-slate-800 text-white',
  'Speaker Event':     'bg-blue-100 text-blue-700',
  'Workshop':          'bg-slate-100 text-slate-700',
  'Networking':        'bg-slate-100 text-slate-700',
};

export function ProjectCarousel() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex(i => (i + 1) % allItems.length);
  const prev = () => setIndex(i => (i - 1 + allItems.length) % allItems.length);
  const item = allItems[index];

  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.25em] text-blue-600 uppercase mb-3">What We Do</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Project Showcase</h2>
        </div>

        <div className="relative">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-2">
              <div className="aspect-[4/3] md:aspect-auto min-h-[240px] bg-slate-100 flex items-center justify-center">
                {item.image
                  ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  : <span className="text-slate-400 text-sm">Project Image</span>
                }
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 w-fit ${categoryColors[item.category] || 'bg-slate-100 text-slate-600'}`}>
                  {item.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-4">{item.description}</p>
                <p className="text-sm text-slate-400">{item.date}</p>
              </div>
            </div>
          </div>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white border border-slate-200 rounded-full shadow-sm hover:border-blue-300 hover:shadow-md transition-all" aria-label="Previous">
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white border border-slate-200 rounded-full shadow-sm hover:border-blue-300 hover:shadow-md transition-all" aria-label="Next">
            <ChevronRight size={24} className="text-slate-700" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {allItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
