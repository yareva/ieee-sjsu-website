'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';

export default function EventsPage() {
  const [techEventIndex, setTechEventIndex] = useState(0);
  const [socialEventIndex, setSocialEventIndex] = useState(0);

  const technicalEvents = [
    {
      title: 'PCB Design Workshop with Altium',
      date: 'March 15, 2026',
      time: '2:00 PM - 4:00 PM',
      location: 'ENGR 376',
      description: 'Learn professional PCB design techniques using industry-standard Altium tools.',
      category: 'PCB Design',
      attendees: 28,
    },
    {
      title: 'Verilog for Digital Design',
      date: 'March 22, 2026',
      time: '3:00 PM - 5:00 PM',
      location: 'ENGR 376',
      description: 'Deep dive into hardware description languages and FPGA programming.',
      category: 'Digital Design',
      attendees: 34,
    },
    {
      title: 'ECG Circuit Analysis',
      date: 'March 29, 2026',
      time: '2:00 PM - 4:00 PM',
      location: 'ENGR 376',
      description: 'Explore biomedical electronics and analog circuit design.',
      category: 'Biomedical',
      attendees: 22,
    },
    {
      title: '32-Bit ALU Implementation',
      date: 'April 5, 2026',
      time: '3:00 PM - 5:00 PM',
      location: 'ENGR 376',
      description: 'Build a complete arithmetic logic unit from scratch.',
      category: 'Digital Systems',
      attendees: 31,
    },
  ];

  const socialEvents = [
    {
      title: 'Networking Mixer with Intel',
      date: 'March 20, 2026',
      time: '5:00 PM - 7:00 PM',
      location: 'Student Center',
      description: 'Meet Intel engineers and explore career opportunities.',
      category: 'Networking',
      attendees: 45,
    },
    {
      title: 'Tech Trivia Night',
      date: 'March 27, 2026',
      time: '6:00 PM - 8:00 PM',
      location: 'ENGR 376',
      description: 'Compete with other engineers in a fun tech trivia competition.',
      category: 'Social',
      attendees: 52,
    },
    {
      title: 'End of Semester Celebration',
      date: 'May 9, 2026',
      time: '4:00 PM - 7:00 PM',
      location: 'San Carlos Park',
      description: 'BBQ, games, and celebration with the IEEE SJSU community.',
      category: 'Celebration',
      attendees: 78,
    },
  ];

  const moveSlider = (direction: 'prev' | 'next', setter: any, length: number, current: number) => {
    if (direction === 'prev') {
      setter((current - 1 + length) % length);
    } else {
      setter((current + 1) % length);
    }
  };

  const EventCard = ({ event }: { event: any }) => (
    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-200 hover:scale-105 h-full flex flex-col">
      <div className="inline-block mb-4 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full w-fit">
        {event.category}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow">{event.description}</p>
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-foreground">
          <Calendar size={16} />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <Clock size={16} />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        {event.attendees} people interested
      </div>
    </div>
  );

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="relative px-4 py-16 md:py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Events & Workshops
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join us for technical workshops, professional development sessions, and community events.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Technical Events */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Technical Sessions
            </h2>
            <p className="text-muted-foreground">
              Learn from industry experts and hands-on technical workshops.
            </p>
          </AnimatedSection>

          <div className="relative">
            {/* Slider */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[0, 1, 2].map((offset) => {
                const index = (techEventIndex + offset) % technicalEvents.length;
                return (
                  <div key={offset} className={offset === 0 ? 'md:col-span-1 md:col-start-1' : ''}>
                    <AnimatedSection>
                      <EventCard event={technicalEvents[index]} />
                    </AnimatedSection>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => moveSlider('prev', setTechEventIndex, technicalEvents.length, techEventIndex)}
                className="p-3 rounded-xl border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-110"
                aria-label="Previous event"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {technicalEvents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTechEventIndex(i)}
                    className={`rounded-full transition-all ${
                      i === techEventIndex ? 'bg-primary w-8 h-2' : 'bg-border w-2 h-2'
                    }`}
                    aria-label={`Go to event ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => moveSlider('next', setTechEventIndex, technicalEvents.length, techEventIndex)}
                className="p-3 rounded-xl border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-110"
                aria-label="Next event"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Events */}
      <section className="px-4 py-16 md:py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Social & Networking
            </h2>
            <p className="text-muted-foreground">
              Connect with peers, meet industry professionals, and build lasting relationships.
            </p>
          </AnimatedSection>

          <div className="relative">
            {/* Slider */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[0, 1, 2].map((offset) => {
                const index = (socialEventIndex + offset) % socialEvents.length;
                return (
                  <div key={offset}>
                    <AnimatedSection>
                      <EventCard event={socialEvents[index]} />
                    </AnimatedSection>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => moveSlider('prev', setSocialEventIndex, socialEvents.length, socialEventIndex)}
                className="p-3 rounded-xl border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-110"
                aria-label="Previous event"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {socialEvents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSocialEventIndex(i)}
                    className={`rounded-full transition-all ${
                      i === socialEventIndex ? 'bg-primary w-8 h-2' : 'bg-border w-2 h-2'
                    }`}
                    aria-label={`Go to event ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => moveSlider('next', setSocialEventIndex, socialEvents.length, socialEventIndex)}
                className="p-3 rounded-xl border border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-110"
                aria-label="Next event"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join our Discord community to get notified about all IEEE SJSU events and announcements.
            </p>
            <a
              href="https://discord.gg/VwPdYWSVPS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-transform duration-200"
            >
              Join Our Discord
            </a>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
