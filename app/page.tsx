import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { Cpu, Users, Calendar, Lightbulb, MapPin, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// ─── EVENTS DATA — edit this array to add/change events ───────────────────────
const events = [
  {
    id: '1',
    title: 'Tesla Tech Talk',
    date: '2026-03-12',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'ENGR 376',
    category: 'Speaker' as const,
    description: 'Industry speaker from Tesla covering cutting-edge engineering topics.',
    image: null,
  },
  {
    id: '2',
    title: 'ALU Workshop',
    date: '2026-03-13',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    location: 'ENGR 376',
    category: 'Workshop' as const,
    description: 'Build your own ALU from scratch using Verilog — no prior experience needed.',
    image: null,
  },
];

const categoryColors: Record<string, string> = {
  Speaker: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Workshop: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  Networking: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  Social: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
};

const guides = [
  { icon: Cpu, title: 'Technical Projects', description: 'Explore cutting-edge PCB design, microcontrollers, and hardware projects.', href: '/projects' },
  { icon: Users, title: 'Membership Info', description: 'Join our community and gain access to exclusive workshops and events.', href: '/membership' },
  { icon: Calendar, title: 'Event Calendar', description: 'View upcoming technical sessions, social events, and networking opportunities.', href: '/events' },
  { icon: Lightbulb, title: 'Lab Access (ENGR 376)', description: 'Mon–Fri: 7AM–10:30PM · Sat: 8AM–7PM · Sun: Closed', href: '/membership' },
];

const snacks = [
  'Doritos Nacho Cheese',
  'Doritos Cool Ranch',
  "Lay's Classic",
  "Lay's Barbecue",
  'Ruffles Cheddar',
  'Cheetos',
  'Fritos Corn Chips',
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getWeekDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDayLabel(d: Date) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (formatDateStr(d) === formatDateStr(today)) return { label: 'Today', class: 'bg-blue-600 text-white' };
  if (formatDateStr(d) === formatDateStr(tomorrow)) return { label: 'Tomorrow', class: 'bg-blue-400/20 text-blue-300 border border-blue-400/40' };
  return null;
}

export default function Home() {
  const weekDays = getWeekDays();
  const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url("/astera_lab.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-black/65 z-10" />
        <div className="relative z-20 max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-block mb-6">
              <div className="px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white">
                <span className="text-sm font-semibold tracking-widest uppercase">IEEE SJSU Student Chapter</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              IEEE San José<br />State University
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto tracking-wide">
              Advancing Technology &nbsp;·&nbsp; Innovation &nbsp;·&nbsp; Community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:scale-105 hover:bg-blue-700 transition-all duration-200">
                Explore Projects
              </Link>
              <Link href="/membership" className="px-8 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-200">
                Join Now
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── WEEKLY EVENTS STRIP ── */}
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
              const badge = getDayLabel(day);
              const isToday = badge?.label === 'Today';
              return (
                <div key={dateStr} className={`rounded-xl p-2 min-h-[120px] flex flex-col gap-1 ${isToday ? 'bg-blue-600/10 border border-blue-500/30' : 'bg-gray-900 border border-gray-800'}`}>
                  <div className="flex flex-col items-center mb-1">
                    <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{DAY_NAMES[i]}</span>
                    <span className={`text-lg font-black ${isToday ? 'text-blue-400' : 'text-gray-300'}`}>{day.getDate()}</span>
                    {badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${badge.class}`}>{badge.label}</span>
                    )}
                  </div>
                  {dayEvents.map(event => (
                    <div key={event.id} className="bg-gray-800 rounded-lg p-1.5 border border-gray-700">
                      {/* flyer image slot */}
                      <div className="w-full h-8 bg-gray-700 rounded mb-1 flex items-center justify-center overflow-hidden">
                        {event.image
                          ? <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded" />
                          : <span className="text-[8px] text-gray-500">Flyer</span>
                        }
                      </div>
                      <p className="text-[10px] font-bold text-white leading-tight truncate">{event.title}</p>
                      <p className="text-[9px] text-gray-400 leading-tight">{event.startTime}</p>
                      <span className={`inline-block text-[8px] font-bold px-1 py-0.5 rounded mt-0.5 ${categoryColors[event.category]}`}>{event.category}</span>
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

      {/* ── OUR MISSION ── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-blue-600 uppercase mb-3">Who We Are</p>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  To empower the next generation of engineers through hands-on technical experience, industry readiness, and a community dedicated to professional excellence.
                </p>
                <p className="text-xl font-bold text-blue-600">
                  We build for the betterment of our students' success.
                </p>
              </div>
              <div className="bg-gray-200 rounded-2xl aspect-video flex items-center justify-center">
                <span className="text-gray-400 text-sm">Drop a photo here</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── EXPLORE IEEE SJSU ── */}
      <section className="py-20 px-4 bg-black/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Explore IEEE SJSU</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Discover technical projects, events, membership opportunities, and lab access.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {guides.map((guide, i) => (
                <Link key={i} href={guide.href} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                  <guide.icon size={24} className="text-blue-600 mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{guide.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{guide.description}</p>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── SNACK BAR ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto bg-gray-950 rounded-2xl border border-gray-800 p-6 shadow-xl">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-white font-black text-xl">Innovation Garage Snack Bar</h3>
                  <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                    <MapPin size={12} /> Stop by ENGR 376 between classes
                  </p>
                </div>
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-700">
                  <span className="text-[9px] text-gray-500 text-center leading-tight">Flyer</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-2">Drinks</p>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-800">
                    <span className="text-gray-300 text-sm">Red Bull Energy Drink</span>
                    <span className="text-white font-bold text-sm">$3.00</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-2">Snacks</p>
                  {snacks.map(s => (
                    <div key={s} className="flex justify-between items-center py-1 border-b border-gray-800/50">
                      <span className="text-gray-300 text-xs">{s}</span>
                      <span className="text-gray-400 font-semibold text-xs">$1.50</span>
                    </div>
                  ))}
                </div>
              </div>
              <a
                href="https://tinyurl.com/IEEE-sjsu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all hover:scale-[1.02]"
              >
                Pay via Square <ExternalLink size={13} />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── READY TO GET INVOLVED ── */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Get Involved?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Whether you're interested in technical projects, professional development, or networking, IEEE SJSU has opportunities for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/membership" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:scale-105 hover:bg-blue-700 transition-all duration-200">
                Become a Member
              </Link>
              <a
                href="https://discord.gg/your-invite"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-blue-500 text-blue-400 rounded-xl font-bold hover:bg-blue-500/10 transition-all duration-200"
              >
                Join Discord Server
              </a>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500 text-sm mb-4 uppercase tracking-widest font-bold">Follow Us</p>
              <div className="flex justify-center gap-6">
                {[
                  { label: 'Discord', href: 'https://discord.gg/your-invite', icon: '💬' },
                  { label: 'Instagram', href: 'https://instagram.com', icon: '📸' },
                  { label: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' },
                  { label: 'Facebook', href: 'https://facebook.com', icon: '👥' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
                    <span>{s.icon}</span>{s.label}
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}