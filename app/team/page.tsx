import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { executives, departments } from '@/lib/data';
import type { TeamMember } from '@/lib/data';
import { Linkedin } from 'lucide-react';

function Avatar({ member, size = 'md' }: { member: TeamMember; size?: 'sm' | 'md' | 'lg' }) {
  const initials = member.name === 'Add Name' ? '?'
    : member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const sz = size === 'lg'
    ? 'w-20 h-20 text-xl'
    : size === 'md'
    ? 'w-12 h-12 text-sm'
    : 'w-9 h-9 text-xs';
  return member.photo ? (
    <img src={member.photo} alt={member.name} className={`${sz} rounded-full object-cover ring-2 ring-slate-200 shrink-0`} />
  ) : (
    <div className={`${sz} rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* HEADER */}
      <section className="bg-white border-b border-slate-200 pt-36 pb-16 px-8 text-center">
        <p className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase mb-3">IEEE SJSU</p>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">Meet the Team</h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          The board behind the workshops, events, and projects that make IEEE SJSU run.
        </p>
      </section>

      {/* EXECUTIVES */}
      <section className="py-16 px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase text-center mb-8">Executive Board</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {executives.map((exec) => (
              <div key={exec.role} className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                <Avatar member={exec} size="lg" />
                <p className="mt-4 text-xl font-black text-slate-900 leading-tight">{exec.name}</p>
                <p className="text-blue-600 text-sm font-semibold mt-1.5 mb-4">{exec.role}</p>
                {exec.linkedin ? (
                  <a href={exec.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-200">
                    <Linkedin size={12} />
                    LinkedIn
                  </a>
                ) : (
                  <span className="text-xs text-slate-300 italic">No LinkedIn</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="border-t border-slate-200" />
      </div>

      {/* DEPARTMENTS */}
      <section className="py-16 px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase text-center mb-10">Departments</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col">

                {/* Dept header */}
                <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-100">
                  <span className={`w-3 h-3 rounded-full ${dept.color} shrink-0`} />
                  <div>
                    <p className="font-black text-slate-900 text-sm leading-tight">{dept.name}</p>
                    <p className="text-slate-400 text-xs leading-tight mt-0.5">{dept.description}</p>
                  </div>
                </div>

                {/* Lead */}
                <div className="px-5 pt-4 pb-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Lead</p>
                  <div className="flex items-center gap-3">
                    <Avatar member={dept.lead} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-tight truncate">{dept.lead.name}</p>
                      <p className="text-xs text-slate-400 leading-tight">{dept.lead.role}</p>
                    </div>
                    {dept.lead.linkedin && (
                      <a href={dept.lead.linkedin} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <Linkedin size={13} className="text-blue-500" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Officers */}
                {dept.officers.length > 0 && (
                  <div className="px-5 pb-4 pt-1 border-t border-slate-100 flex-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-3">Officers</p>
                    <div className="space-y-2.5">
                      {dept.officers.map((officer, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <Avatar member={officer} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 leading-tight truncate">{officer.name}</p>
                            <p className="text-[11px] text-slate-400 leading-tight">{officer.role}</p>
                          </div>
                          {officer.linkedin && (
                            <a href={officer.linkedin} target="_blank" rel="noopener noreferrer"
                              className="shrink-0 p-1 rounded hover:bg-slate-100 transition-colors">
                              <Linkedin size={11} className="text-blue-400" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
