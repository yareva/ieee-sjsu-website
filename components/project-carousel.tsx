'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'ECG Monitor',
    category: 'Featured Project',
    description: 'Real-time heart monitoring PCB built from scratch',
    date: 'Ongoing',
  },
  {
    id: 2,
    title: 'QSpice 2-Day Workshop',
    category: 'Hall of Fame',
    description: 'Learn from Mike Engelhardt, creator of LTspice and QSpice',
    date: 'Nov 5 & Nov 12',
  },
  {
    id: 3,
    title: 'Cognichip AI + Chip Design Challenge',
    category: 'Industry Challenge',
    description: 'Work with a Silicon Valley AI chip startup — thousands in prizes',
    date: 'Spring 2026',
  },
  {
    id: 4,
    title: 'ALU Workshop',
    category: 'Workshop',
    description: 'Build your own ALU from scratch using Verilog',
    date: 'Mar 13, 2026',
  },
  {
    id: 5,
    title: 'Nuvoton Technical Workshop',
    category: 'Workshop',
    description: 'Hands-on microcontroller programming with industry professionals',
    date: 'Feb 25, 2026',
  },
  {
    id: 6,
    title: 'Altium PCB Workshop',
    category: 'Workshop',
    description: 'End-to-end PCB design using Altium Designer',
    date: 'Mar 6, 2026',
  },
  {
    id: 7,
    title: 'Tesla Tech Talk',
    category: 'Speaker Event',
    description: 'Exclusive talk with Tesla engineers',
    date: 'Mar 12, 2026',
  },
  {
    id: 8,
    title: 'Astera Labs x IEEE Networking',
    category: 'Networking',
    description: 'Connect with engineers from Astera Labs',
    date: 'Nov 6, 2025',
  },
  {
    id: 9,
    title: 'Renesas Networking Event',
    category: 'Networking',
    description: 'Exclusive networking with Renesas recruiters',
    date: 'Feb 18, 2026',
  },
];

const categoryColors: Record<string, string> = {
  'Featured Project': 'bg-[#2563eb] text-white',
  'Hall of Fame': 'bg-[#2563eb] text-white',
  'Industry Challenge': 'bg-[#1d1d1f] text-white',
  'Workshop': 'bg-[#6e6e73] text-white',
  'Speaker Event': 'bg-[#2563eb]/80 text-white',
  'Networking': 'bg-[#6e6e73]/80 text-white',
};

export function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const current = projects[currentIndex];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.25em] text-[#2563eb] uppercase mb-3">
            What We Do
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-[#1d1d1f] tracking-tight">
            Project Showcase
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Main Card */}
          <div className="bg-white border border-[#e5e5ea] rounded-2xl overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2">
              {/* Image placeholder */}
              <div className="aspect-[4/3] md:aspect-auto bg-[#f5f5f7] flex items-center justify-center">
                <span className="text-[#6e6e73] text-sm">Project Image</span>
              </div>
              
              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 w-fit ${categoryColors[current.category] || 'bg-[#6e6e73] text-white'}`}>
                  {current.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-[#1d1d1f] mb-4">
                  {current.title}
                </h3>
                <p className="text-[#6e6e73] text-lg leading-relaxed mb-6">
                  {current.description}
                </p>
                <p className="text-sm text-[#6e6e73]">
                  {current.date}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white border border-[#e5e5ea] rounded-full shadow-lg hover:bg-[#f5f5f7] transition-colors"
            aria-label="Previous project"
          >
            <ChevronLeft size={24} className="text-[#1d1d1f]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white border border-[#e5e5ea] rounded-full shadow-lg hover:bg-[#f5f5f7] transition-colors"
            aria-label="Next project"
          >
            <ChevronRight size={24} className="text-[#1d1d1f]" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex 
                  ? 'w-8 bg-[#2563eb]' 
                  : 'bg-[#e5e5ea] hover:bg-[#d1d1d6]'
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
