'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';

export default function ProjectsPage() {
  const featuredProjects = [
    {
      title: 'ECG Monitor',
      badge: 'Featured Project',
      description: 'Real-time heart monitoring PCB built from scratch. A complete end-to-end biomedical project showcasing analog design, signal processing, and PCB layout.',
      badgeColor: 'bg-[#2563eb] text-white',
      isHero: true,
    },
    {
      title: 'QSpice 2-Day Workshop',
      badge: 'Hall of Fame',
      description: 'Meet Mike Engelhardt, creator of LTspice and QSpice. Day 1: Nov 5 | Day 2: Nov 12',
      badgeColor: 'bg-[#2563eb] text-white',
      isHero: false,
    },
    {
      title: 'Cognichip AI + Chip Design Challenge',
      badge: 'Industry Challenge',
      description: 'Work with a Silicon Valley AI chip startup. Thousands in prizes for the best designs.',
      badgeColor: 'bg-[#1d1d1f] text-white',
      isHero: false,
    },
  ];

  const pastWorkshops = [
    {
      title: 'ALU Workshop',
      date: 'Mar 13',
      description: 'Build your own ALU from scratch using Verilog',
      badge: 'Verilog / Digital Logic',
    },
    {
      title: 'Nuvoton Technical Workshop',
      date: 'Feb 25',
      description: 'Hands-on microcontroller programming',
      badge: 'Microcontrollers',
    },
    {
      title: 'Altium PCB Workshop',
      date: 'Mar 6',
      description: 'End-to-end PCB design using Altium Designer',
      badge: 'PCB Design',
    },
    {
      title: 'Quantum Computing Workshop',
      date: 'Oct 30',
      description: 'Introduction to quantum computing concepts',
      badge: 'Lecture',
    },
    {
      title: 'Digital Systems Workshop',
      date: 'Oct 23',
      description: 'Embedded systems programming with STM32',
      badge: 'Embedded / STM32',
    },
    {
      title: 'Microchip FPGA Tech Talk',
      date: 'Nov 20',
      description: 'Hardware design with modern FPGAs',
      badge: 'Hardware',
    },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="relative px-4 pt-32 pb-16 bg-[#1d1d1f] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 tracking-tight">
              Projects & Workshops
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Cutting-edge projects in hardware design, digital electronics, and biomedical engineering.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-black text-[#1d1d1f] mb-8">
              Featured Projects
            </h2>
          </AnimatedSection>

          <div className="space-y-6">
            {/* Hero project - ECG Monitor */}
            <AnimatedSection>
              <div className="bg-white border border-[#e5e5ea] rounded-2xl overflow-hidden shadow-lg">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto bg-[#f5f5f7] flex items-center justify-center">
                    <span className="text-[#6e6e73]">Project Image</span>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 w-fit ${featuredProjects[0].badgeColor}`}>
                      {featuredProjects[0].badge}
                    </span>
                    <h3 className="text-3xl font-heading font-black text-[#1d1d1f] mb-4">
                      {featuredProjects[0].title}
                    </h3>
                    <p className="text-[#6e6e73] text-lg leading-relaxed">
                      {featuredProjects[0].description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Other featured projects */}
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.slice(1).map((project, i) => (
                <AnimatedSection key={i}>
                  <div className="bg-white border border-[#e5e5ea] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full">
                    <div className="aspect-video bg-[#f5f5f7] flex items-center justify-center">
                      <span className="text-[#6e6e73]">Project Image</span>
                    </div>
                    <div className="p-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3 ${project.badgeColor}`}>
                        {project.badge}
                      </span>
                      <h3 className="text-xl font-heading font-bold text-[#1d1d1f] mb-2">
                        {project.title}
                      </h3>
                      <p className="text-[#6e6e73] text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Past Workshops Section */}
      <section className="px-4 py-16 md:py-20 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-black text-[#1d1d1f] mb-8">
              Past Workshops
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastWorkshops.map((workshop, i) => (
              <AnimatedSection key={i}>
                <div className="bg-white border border-[#e5e5ea] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col">
                  <div className="aspect-video bg-[#f5f5f7] flex items-center justify-center relative">
                    <span className="text-[#6e6e73] text-sm">Workshop Image</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#6e6e73]">{workshop.date}</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f5f5f7] text-[#6e6e73]">
                        {workshop.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-[#1d1d1f] mb-2">
                      {workshop.title}
                    </h3>
                    <p className="text-sm text-[#6e6e73] flex-1">
                      {workshop.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Access Section */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-black text-[#1d1d1f] mb-4">Lab Access</h2>
              <p className="text-[#6e6e73]">
                All projects are developed in our state-of-the-art laboratory at ENGR 376.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-white">
                <h3 className="text-lg font-heading font-bold text-[#1d1d1f] mb-3">Equipment Available</h3>
                <ul className="space-y-2 text-sm text-[#6e6e73]">
                  <li>Oscilloscopes & Function Generators</li>
                  <li>PCB Design Workstations</li>
                  <li>Soldering & Assembly Tools</li>
                  <li>FPGA Development Boards</li>
                  <li>Multimeters & Power Supplies</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-white">
                <h3 className="text-lg font-heading font-bold text-[#1d1d1f] mb-3">Access Hours</h3>
                <div className="space-y-2 text-sm text-[#6e6e73]">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium text-[#1d1d1f]">7:00 AM - 10:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium text-[#1d1d1f]">8:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium text-[#1d1d1f]">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:py-20 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-black text-[#1d1d1f] mb-6">
              Ready to Join Our Projects?
            </h2>
            <p className="text-lg text-[#6e6e73] mb-8">
              Whether you&apos;re a beginner or experienced engineer, there&apos;s a place for you in IEEE SJSU.
            </p>
            <a
              href="/membership"
              className="inline-block px-8 py-3 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-[#1d4ed8] transition-colors"
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
