'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Helper functions
function formatDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDaysBetween(d1: Date, d2: Date) {
  const diff = d2.getTime() - d1.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getBadgeText(eventDate: string, currentDate: Date | null) {
  if (!currentDate) return null;
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  const days = getDaysBetween(today, event);
  
  if (days === 0) return { text: 'Today', color: 'bg-[#2563eb] text-white' };
  if (days === 1) return { text: 'Tomorrow', color: 'bg-[#2563eb]/20 text-[#2563eb]' };
  if (days > 1 && days <= 7) return { text: `In ${days} days`, color: 'bg-[#f5f5f7] text-[#6e6e73]' };
  return null;
}

const upcomingEvents = [
  {
    id: '1',
    title: 'Tesla Tech Talk',
    date: '2026-03-12',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'ENGR 376',
    category: 'Speaker',
    description: 'Industry speaker from Tesla covering cutting-edge engineering topics.',
  },
  {
    id: '2',
    title: 'ALU Workshop',
    date: '2026-03-13',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    location: 'ENGR 376',
    category: 'Workshop',
    description: 'Build your own ALU from scratch using Verilog — no prior experience needed.',
  },
];

const pastEvents = [
  {
    id: 'p1',
    title: 'Innovation Garage & Pipeline Kickoff',
    date: 'Mar 9',
    location: 'ENGR 376',
    description: 'Welcome back event for the spring semester',
    category: 'Social',
  },
  {
    id: 'p2',
    title: 'Nuvoton Networking',
    date: 'Feb 25',
    location: 'ENGR 376',
    description: 'Network with Nuvoton engineers and recruiters',
    category: 'Networking',
  },
  {
    id: 'p3',
    title: 'Renesas Networking Event',
    date: 'Feb 18',
    location: 'ENGR 376',
    description: 'Exclusive networking with Renesas recruiters',
    category: 'Networking',
  },
  {
    id: 'p4',
    title: 'Astera Labs x IEEE Networking',
    date: 'Nov 6',
    location: 'ENGR 376',
    description: 'Connect with engineers from Astera Labs',
    category: 'Networking',
  },
  {
    id: 'p5',
    title: 'Lockheed Martin Recruiter Insights',
    date: 'Oct 31',
    location: 'ENGR 376',
    description: 'Career insights from Lockheed Martin',
    category: 'Networking',
  },
  {
    id: 'p6',
    title: 'Cadence Career Talk',
    date: 'Oct 16',
    location: 'ENGR 376',
    description: 'Career opportunities at Cadence',
    category: 'Recruiting',
  },
  {
    id: 'p7',
    title: 'Cognichip Kickoff Presentation',
    date: 'May 6',
    location: 'ENGR 376',
    description: 'Introduction to the Cognichip challenge',
    category: 'Industry',
  },
];

const categoryColors: Record<string, string> = {
  Speaker: 'bg-[#2563eb]/10 text-[#2563eb]',
  Workshop: 'bg-[#2563eb]/10 text-[#2563eb]',
  Networking: 'bg-[#6e6e73]/10 text-[#6e6e73]',
  Social: 'bg-[#6e6e73]/10 text-[#6e6e73]',
  Recruiting: 'bg-[#6e6e73]/10 text-[#6e6e73]',
  Industry: 'bg-[#1d1d1f]/10 text-[#1d1d1f]',
};

// Calendar Component
function MiniCalendar({ selectedDate, onSelectDate, events }: { 
  selectedDate: Date; 
  onSelectDate: (d: Date) => void;
  events: typeof upcomingEvents;
}) {
  const [viewDate, setViewDate] = useState(new Date());
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = (firstDay.getDay() + 6) % 7; // Monday start
  const daysInMonth = lastDay.getDate();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const eventDates = events.map(e => e.date);
  
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  
  const days = [];
  for (let i = 0; i < startPadding; i++) {
    days.push(<div key={`pad-${i}`} className="h-8" />);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDateStr(date);
    const isToday = formatDateStr(today) === dateStr;
    const isSelected = formatDateStr(selectedDate) === dateStr;
    const hasEvent = eventDates.includes(dateStr);
    
    days.push(
      <button
        key={day}
        onClick={() => onSelectDate(date)}
        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all relative ${
          isSelected 
            ? 'bg-[#2563eb] text-white' 
            : isToday 
              ? 'ring-2 ring-[#2563eb] text-[#2563eb]' 
              : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
        }`}
      >
        {day}
        {hasEvent && !isSelected && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2563eb]" />
        )}
      </button>
    );
  }
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return (
    <div className="bg-white border border-[#e5e5ea] rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-[#f5f5f7] rounded-lg transition-colors">
          <ChevronLeft size={20} className="text-[#6e6e73]" />
        </button>
        <span className="font-heading font-bold text-[#1d1d1f]">
          {monthNames[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-[#f5f5f7] rounded-lg transition-colors">
          <ChevronRight size={20} className="text-[#6e6e73]" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="h-8 flex items-center justify-center text-xs font-bold text-[#6e6e73]">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  
  // Set current date on client-side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);
  
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="relative px-4 pt-32 pb-16 bg-[#1d1d1f] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-xs font-bold tracking-[0.25em] text-[#2563eb] uppercase mb-3">
              IEEE SJSU
            </p>
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 tracking-tight">
              Events
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join us for technical workshops, professional development sessions, and community events.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            {/* Mini Calendar */}
            <AnimatedSection>
              <MiniCalendar 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate}
                events={upcomingEvents}
              />
            </AnimatedSection>

            {/* Upcoming Events Strip */}
            <AnimatedSection>
              <h2 className="text-2xl font-heading font-black text-[#1d1d1f] mb-4">
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => {
                  const badge = getBadgeText(event.date, currentDate);
                  return (
                    <div 
                      key={event.id}
                      className="bg-white border border-[#e5e5ea] rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[event.category] || ''}`}>
                          {event.category}
                        </span>
                        {badge && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                            {badge.text}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-heading font-bold text-[#1d1d1f] mb-2">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-[#6e6e73] mb-3">
                        <span>{event.startTime} – {event.endTime}</span>
                        <span>{event.location}</span>
                      </div>
                      <p className="text-[#6e6e73] text-sm">
                        {event.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Past Events Grid */}
      <section className="px-4 py-16 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-black text-[#1d1d1f] mb-8">
              Past Events
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <AnimatedSection key={event.id}>
                <div className="bg-white border border-[#e5e5ea] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col">
                  {/* Image placeholder */}
                  <div className="aspect-video bg-[#f5f5f7] flex items-center justify-center">
                    <span className="text-[#6e6e73] text-sm">Event Flyer</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#6e6e73]">{event.date}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[event.category] || ''}`}>
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-[#1d1d1f] mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[#6e6e73] mb-2">
                      {event.location}
                    </p>
                    <p className="text-sm text-[#6e6e73] flex-1">
                      {event.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-black text-[#1d1d1f] mb-6">
              Stay Updated
            </h2>
            <p className="text-lg text-[#6e6e73] mb-10">
              Join our Discord community to get notified about all IEEE SJSU events and announcements.
            </p>
            <a
              href="https://discord.gg/VwPdYWSVPS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-[#1d4ed8] transition-colors"
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
