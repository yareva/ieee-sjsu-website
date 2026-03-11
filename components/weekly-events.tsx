'use client';

import Link from 'next/link';

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
  Speaker: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Workshop: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  Networking: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  Social: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
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
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (formatDateStr(d) === formatDateStr(today)) return { label: 'Today', cls: 'bg-blue-600 text-white' };
  if (formatDateStr(d) === formatDateStr(tomorrow)) return { label: 'Tomorrow', cls: 'bg-blue-400/20 text-blue-300 border border-blue-400/40' };
  return null;
}

export function WeeklyEvents() {
  const weekDays = getWeekDays();

  return (
    <section className="bg-gray-950 border-b border-gray-800 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg tracking-wide">This Week</h2>
          <Link href="/events" className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
            View all events →
          </Link>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const dateStr = formatDateStr(day);
            const dayEvents = events.filter(e => e.date === dateStr);
            const badge = getDayBadge(day);
            const isToday = badge?.label === 'Today';
            return (
              <div
                key={dateStr}
                className={`rounded-xl p-2 min-h-[120px] flex flex-col gap-1 ${
                  isToday ? 'bg-blue-600/10 border border-blue-500/30' : 'bg-gray-900 border border-gray-800'
                }`}
              >
                <div className="flex flex-col items-center mb-1">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{DAY_NAMES[i]}</span>
                  <span className={`text-lg font-black ${isToday ? 'text-blue-400' : 'text-gray-300'}`}>{day.getDate()}</span>
                  {badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${badge.cls}`}>{badge.label}</span>
                  )}
                </div>
                {dayEvents.map(event => (
                  <div key={event.id} className="bg-gray-800 rounded-lg p-1.5 border border-gray-700">
                    <div className="w-full h-8 bg-gray-700 rounded mb-1 flex items-center justify-center overflow-hidden">
                      {event.image
                        ? <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded" />
                        : <span className="text-[8px] text-gray-500">Flyer</span>
                      }
                    </div>
                    <p className="text-[10px] font-bold text-white leading-tight truncate">{event.title}</p>
                    <p className="text-[9px] text-gray-400 leading-tight">{event.startTime}</p>
                    <span className={`inline-block text-[8px] font-bold px-1 py-0.5 rounded mt-0.5 ${categoryColors[event.category] ?? ''}`}>
                      {event.category}
                    </span>
                  </div>
                ))}
                {dayEvents.length === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[10px] text-gray-700">—</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}