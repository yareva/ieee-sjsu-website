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
    <div className={`${sz} rounded-full bg-slate-700/60 border border-slate-600/50 flex items-center justify-center font-bold text-slate-300 shrink-0`}>
      {initials}
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className="flex flex-col min-h-screen tech-bg">
      <Navbar />

      {/* HEADER */}
      <section className="pt-36 pb-20 px-8 relative overflow-hidden">
        <div className="blob animate-blob absolute top-10 right-20 w-96 h-80 bg-blue-300/20 opacity-60" />
        <div className="blob animate-blob-delay absolute top-40 left-10 w-64 h-64 bg-indigo-200/30 opacity-40" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-xs font-bold tracking-[0.35em] text-blue-600 uppercase mb-4">IEEE SJSU</p>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-none mb-5">
            Meet the<br />Team
          </h1>
          <p className="text-slate-500 text-lg max-w-md leading-relaxed">
            The people behind the workshops, events, and projects that make IEEE SJSU run.
          </p>
        </div>
      </section>

      {/* EXECUTIVES */}
      <section className="py-20 px-8 relative" style={{
        background: 'linear-gradient(180deg, transparent 0%, #0f172a 6%, #0f172a 94%, transparent 100%)'
      }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-8">Executive Board</p>
          <div className="flex flex-wrap gap-4 justify-start">
            {executives.map((exec) => (
              <div key={exec.role}
                className="glass-card-dark rounded-2xl p-6 flex items-center gap-5 min-w-[260px] hover:bg-white/10 transition-all">
                <Avatar member={exec} size="lg" />
                <div>
                  <p className="text-base font-black text-white leading-tight">{exec.name}</p>
                  <p className="text-blue-400 text-xs font-semibold mt-1 uppercase tracking-wide">{exec.role}</p>
                  {exec.linkedin && (
                    <a href={exec.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors mt-2">
                      <Linkedin size={11} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="py-20 px-8 pb-28">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase mb-8">Departments</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {departments.map((dept) => (
              <div key={dept.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">

                {/* Dept header */}
                <div className="px-5 pt-5 pb-4 border-b border-slate-100 flex items-start gap-3">
                  <span className="text-xl mt-0.5">{dept.icon}</span>
                  <div>
                    <p className="font-black text-slate-900 text-sm leading-tight">{dept.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5 leading-snug">{dept.description}</p>
                  </div>
                </div>

                {/* Chief officer */}
                <div className="px-5 pt-4 pb-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Chief Officer</p>
                  <div className="flex items-center gap-3">
                    <Avatar member={dept.lead} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-tight truncate">{dept.lead.name}</p>
                      <p className="text-xs text-slate-400 truncate">{dept.lead.role}</p>
                    </div>
                    {dept.lead.linkedin && (
                      <a href={dept.lead.linkedin} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <Linkedin size={13} className="text-slate-400 hover:text-blue-500" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Sub-departments */}
                {dept.subDepartments.length > 0 && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex-1 space-y-4">
                    {dept.subDepartments.map((sub) => (
                      <div key={sub.id}>
                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-2">{sub.name}</p>
                        {/* Sub lead */}
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar member={sub.lead} size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 leading-tight truncate">{sub.lead.name}</p>
                            <p className="text-[10px] text-slate-400">Lead</p>
                          </div>
                        </div>
                        {/* Officers */}
                        <div className="pl-1 space-y-1.5">
                          {sub.officers.map((officer, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Avatar member={officer} size="sm" />
                              <p className="text-[11px] text-slate-500 truncate">{officer.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
