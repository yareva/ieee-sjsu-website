import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { executives, departments } from '@/lib/data';
import type { TeamMember } from '@/lib/data';
import { Linkedin } from 'lucide-react';

function Avatar({ member, size = 'md' }: { member: TeamMember; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const initials = member.name === 'Add Name' ? '?'
    : member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const sz = size === 'xl' ? 'w-20 h-20 text-xl'
    : size === 'lg'  ? 'w-14 h-14 text-base'
    : size === 'md'  ? 'w-10 h-10 text-sm'
    : 'w-8 h-8 text-xs';
  return member.photo ? (
    <img src={member.photo} alt={member.name} className={`${sz} rounded-full object-cover shrink-0`} />
  ) : (
    <div className={`${sz} rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* HEADER */}
      <section className="bg-slate-950 pt-36 pb-20 px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase mb-4">IEEE SJSU</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-5">
            Meet the<br />Team
          </h1>
          <p className="text-slate-400 text-base max-w-md leading-relaxed">
            The people behind the workshops, events, and projects that make IEEE SJSU run.
          </p>
        </div>
      </section>

      {/* EXECUTIVES */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase mb-8">Executive Board</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {executives.map((exec) => (
              <div key={exec.role} className="bg-slate-950 rounded-2xl p-6 flex flex-col items-center text-center">
                <Avatar member={exec} size="xl" />
                <p className="mt-4 text-base font-black text-white leading-tight">{exec.name}</p>
                <p className="text-blue-400 text-xs font-semibold mt-1 mb-4 uppercase tracking-wide">{exec.role}</p>
                {exec.linkedin ? (
                  <a href={exec.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors">
                    <Linkedin size={12} /> LinkedIn
                  </a>
                ) : <span className="text-xs text-slate-700">—</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="py-20 px-8 bg-slate-50 pb-28">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase mb-8">Departments</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col">

                {/* Dept name */}
                <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                  <p className="font-black text-slate-900 text-base">{dept.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{dept.description}</p>
                </div>

                {/* Lead */}
                <div className="px-5 pt-4 pb-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Lead</p>
                  <div className="flex items-center gap-3">
                    <Avatar member={dept.lead} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-tight truncate">{dept.lead.name}</p>
                      <p className="text-xs text-slate-400">{dept.lead.role}</p>
                    </div>
                    {dept.lead.linkedin && (
                      <a href={dept.lead.linkedin} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <Linkedin size={13} className="text-slate-400 hover:text-blue-500" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Officers */}
                {dept.officers.length > 0 && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Officers</p>
                    <div className="space-y-3">
                      {dept.officers.map((officer, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <Avatar member={officer} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 leading-tight truncate">{officer.name}</p>
                            <p className="text-[11px] text-slate-400">{officer.role}</p>
                          </div>
                          {officer.linkedin && (
                            <a href={officer.linkedin} target="_blank" rel="noopener noreferrer"
                              className="shrink-0 p-1 rounded hover:bg-slate-100 transition-colors">
                              <Linkedin size={11} className="text-slate-400 hover:text-blue-500" />
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
