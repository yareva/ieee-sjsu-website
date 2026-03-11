'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const events = [
  {
    id: '1',
    title: 'Tesla Tech Talk',
    date: '2026-03-12',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'ENGR 376',
    category: 'Speaker',
    description: 'Industry speaker from Tesla covering cutting-edge engineering topics.',
    image: null as string | null,
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
    image: null as string | null,
  },
];

const categoryColors: Record<string, string> = {
  Speaker: 'bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20',
  Workshop: 'bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20',
  Networking: 'bg-[#6e6e73]/10 text-[#6e6e73] border border-[#6e6e73]/20',
  Social: 'bg-[#6e6e73]/10 text-[#6e6e73] border border-[#6e6e73]/20',
};

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getWeekDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getDayBadge(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (formatDateStr(d) === formatDateStr(today)) return { label: 'Today', isToday: true };
  if (formatDateStr(d) === formatDateStr(tomorrow)) return { label: 'Tomorrow', isToday: false };
  return null;
}

interface EventType {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  description: string;
  image: string | null;
}

export function WeeklyEvents() {
  const weekDays = getWeekDays();
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[900px] mx-auto">
          {/* Apple-style floating card */}
          <div className="bg-white border border-[#e5e5ea] rounded-2xl shadow-lg p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-[#1d1d1f]">This Week</h2>
              <Link 
                href="/events" 
                className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
              >
                View all →
              </Link>
            </div>

            {/* 7 day grid */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, i) => {
                const dateStr = formatDateStr(day);
                const dayEvents = events.filter((e) => e.date === dateStr);
                const badge = getDayBadge(day);
                const isToday = badge?.isToday;

                return (
                  <div
                    key={dateStr}
                    className={`rounded-xl p-2 min-h-[140px] flex flex-col ${
                      isToday 
                        ? 'bg-[#2563eb]/5 border border-[#2563eb]/20' 
                        : 'bg-[#f5f5f7] border border-transparent'
                    }`}
                  >
                    {/* Day header */}
                    <div className="text-center mb-2">
                      <span className="text-[10px] font-bold tracking-widest text-[#6e6e73] uppercase block">
                        {DAY_NAMES[i]}
                      </span>
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-lg font-bold ${
                          isToday 
                            ? 'bg-[#2563eb] text-white' 
                            : 'text-[#1d1d1f]'
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {badge && !isToday && (
                        <span className="block text-[9px] font-semibold text-[#2563eb] bg-[#2563eb]/10 rounded-full px-2 py-0.5 mt-1">
                          {badge.label}
                        </span>
                      )}
                    </div>

                    {/* Events */}
                    <div className="flex-1 space-y-1">
                      {dayEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className="w-full text-left bg-white rounded-lg p-1.5 border border-[#e5e5ea] hover:border-[#2563eb]/30 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="w-full h-6 bg-[#f5f5f7] rounded mb-1 flex items-center justify-center overflow-hidden">
                            {event.image ? (
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[8px] text-[#6e6e73]">Flyer</span>
                            )}
                          </div>
                          <p className="text-[9px] font-bold text-[#1d1d1f] leading-tight truncate">
                            {event.title}
                          </p>
                          <p className="text-[8px] text-[#6e6e73] leading-tight">
                            {event.startTime}
                          </p>
                          <span
                            className={`inline-block text-[7px] font-bold px-1 py-0.5 rounded mt-0.5 ${
                              categoryColors[event.category] ?? ''
                            }`}
                          >
                            {event.category}
                          </span>
                        </button>
                      ))}
                    </div>

                    {dayEvents.length === 0 && (
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-[10px] text-[#d1d1d6]">—</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Flyer image slot */}
            <div className="aspect-video bg-[#f5f5f7] flex items-center justify-center">
              {selectedEvent.image ? (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#6e6e73]">Event Flyer</span>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className={`inline-block text-xs font-bold px-2 py-1 rounded-full mb-2 ${
                      categoryColors[selectedEvent.category] ?? ''
                    }`}
                  >
                    {selectedEvent.category}
                  </span>
                  <h3 className="text-2xl font-heading font-bold text-[#1d1d1f]">
                    {selectedEvent.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-[#f5f5f7] rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-[#6e6e73]" />
                </button>
              </div>

              <div className="space-y-2 text-sm text-[#6e6e73] mb-4">
                <p>
                  <span className="font-semibold text-[#1d1d1f]">Time:</span>{' '}
                  {selectedEvent.startTime} – {selectedEvent.endTime}
                </p>
                <p>
                  <span className="font-semibold text-[#1d1d1f]">Location:</span>{' '}
                  {selectedEvent.location}
                </p>
              </div>

              <p className="text-[#6e6e73] leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
