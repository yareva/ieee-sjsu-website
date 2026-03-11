'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState(0);

  const projects = [
    {
      title: 'PCB Design',
      subtitle: 'Professional Circuit Design with Altium',
      color: 'from-blue-500 to-blue-600',
      description:
        'Learn industry-standard PCB design techniques using Altium Designer. From schematic capture to layout optimization, we cover the complete design workflow.',
      technologies: ['Altium Designer', 'Signal Integrity', 'Thermal Management'],
      details: [
        'Multi-layer board design',
        'Component placement optimization',
        'Manufacturing readiness',
        'Design rule checking',
      ],
      members: 12,
    },
    {
      title: '32-Bit ALU',
      subtitle: 'Arithmetic Logic Unit Implementation in Verilog',
      color: 'from-slate-600 to-slate-700',
      description:
        'Design and implement a complete 32-bit Arithmetic Logic Unit using Verilog. Build the fundamental computing component from scratch.',
      technologies: ['Verilog', 'Digital Logic', 'FPGA'],
      details: [
        'Logic operations',
        'Arithmetic operations',
        'Register file design',
        'Control unit design',
      ],
      members: 8,
    },
    {
      title: 'ECG Circuits',
      subtitle: 'Biomedical Signal Processing Electronics',
      color: 'from-indigo-500 to-indigo-600',
      description:
        'Explore biomedical electronics by designing ECG signal conditioning circuits. Learn analog signal processing and medical device design principles.',
      technologies: ['Analog Electronics', 'Signal Conditioning', 'Medical Devices'],
      details: [
        'Amplifier design',
        'Filtering circuits',
        'Signal conditioning',
        'Noise reduction techniques',
      ],
      members: 10,
    },
  ];

  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[activeProject];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="relative px-4 py-16 md:py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Technical Projects
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Cutting-edge projects in hardware design, digital electronics, and biomedical engineering.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Project Showcase */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Image */}
              <div className="flex items-center justify-center">
                <div className={`relative w-full aspect-square rounded-xl border border-primary/20 bg-gradient-to-br ${currentProject.color} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                <div className="inline-block mb-4 w-fit">
                  <div className="px-4 py-2 rounded-full border border-secondary/30 bg-secondary/5 text-primary">
                    <span className="text-sm font-medium">Featured Project</span>
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-foreground mb-2">{currentProject.title}</h2>
                <p className="text-xl text-secondary font-semibold mb-4">{currentProject.subtitle}</p>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{currentProject.description}</p>

                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Project Highlights</h3>
                  <ul className="space-y-2">
                    {currentProject.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 text-sm text-muted-foreground">
                  {currentProject.members} members involved
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={prevProject}
              className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex gap-3">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveProject(i)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    i === activeProject
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-border text-foreground hover:bg-muted'
                  }`}
                  aria-label={`Go to project ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextProject}
              className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              aria-label="Next project"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Project Cards Grid */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-foreground mb-8">All Projects</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <AnimatedSection
                  key={i}
                  className="animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${i * 100}ms` }}
                  onClick={() => setActiveProject(i)}
                >
                  <div
                    className={`p-6 rounded-xl border transition-all h-full flex flex-col ${
                      i === activeProject
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-border bg-card hover:border-secondary'
                    }`}
                  >
                    <div className="text-6xl mb-4">{project.image}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                    <p className="text-sm text-secondary font-medium mb-3">{project.subtitle}</p>
                    <p className="text-sm text-muted-foreground flex-grow">{project.description.substring(0, 80)}...</p>
                    <div className="mt-4 text-xs text-muted-foreground">{project.members} members</div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lab Access Section */}
      <section className="px-4 py-16 md:py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Lab Access</h2>
              <p className="text-muted-foreground">
                All projects are developed in our state-of-the-art laboratory at ENGR 376.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-lg font-bold text-foreground mb-3">Equipment Available</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Oscilloscopes & Function Generators</li>
                  <li>• PCB Design Workstations</li>
                  <li>• Soldering & Assembly Tools</li>
                  <li>• FPGA Development Boards</li>
                  <li>• Multimeters & Power Supplies</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-lg font-bold text-foreground mb-3">Access Hours</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium text-foreground">9 AM - 9 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium text-foreground">10 AM - 6 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium text-foreground">12 PM - 6 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to Join Our Projects?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're a beginner or experienced engineer, there's a place for you in IEEE SJSU.
            </p>
            <a
              href="/membership"
              className="inline-block px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Today
            </a>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
