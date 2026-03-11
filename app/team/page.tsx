import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { Mail } from 'lucide-react';

export default function TeamPage() {
  const team = [
    {
      name: 'Alex Chen',
      role: 'Chapter Chair',
      initials: 'AC',
      email: 'alex.chen@sjsu.edu',
      bio: 'Leading IEEE SJSU with a passion for PCB design and hardware innovation.',
    },
    {
      name: 'Sarah Martinez',
      role: 'Vice Chair',
      initials: 'SM',
      email: 'sarah.martinez@sjsu.edu',
      bio: 'Coordinating technical workshops and member engagement initiatives.',
    },
    {
      name: 'James Wilson',
      role: 'Treasurer',
      initials: 'JW',
      email: 'james.wilson@sjsu.edu',
      bio: 'Managing club finances and sponsorship partnerships.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Technical Lead',
      initials: 'ER',
      email: 'emily.rodriguez@sjsu.edu',
      bio: 'Directing PCB design and digital electronics projects.',
    },
    {
      name: 'Michael Park',
      role: 'Events Coordinator',
      initials: 'MP',
      email: 'michael.park@sjsu.edu',
      bio: 'Organizing workshops, seminars, and networking events.',
    },
    {
      name: 'Jessica Thompson',
      role: 'Social Media Manager',
      initials: 'JT',
      email: 'jessica.thompson@sjsu.edu',
      bio: 'Keeping the community connected through digital platforms.',
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
              Our Team
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Meet the passionate engineers and visionaries driving IEEE SJSU forward.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Grid */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <AnimatedSection key={i}>
                <div className="group p-6 rounded-2xl border border-[#e5e5ea] bg-white hover:border-[#2563eb]/30 hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-lg font-bold text-white mb-4 group-hover:scale-110 transition-transform">
                    {member.initials}
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-heading font-bold text-[#1d1d1f] mb-1">{member.name}</h3>
                  <p className="text-[#2563eb] font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-sm text-[#6e6e73] mb-6 flex-grow leading-relaxed">{member.bio}</p>

                  {/* Contact */}
                  <div className="pt-4 border-t border-[#e5e5ea]">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-sm font-medium text-[#6e6e73] hover:text-[#2563eb] transition-colors"
                      title={`Email ${member.name}`}
                    >
                      <Mail size={16} />
                      <span>{member.email}</span>
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-16 md:py-20 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-heading font-black text-[#1d1d1f] mb-4">Our Values</h2>
            <p className="text-[#6e6e73]">
              These principles guide everything we do at IEEE SJSU.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Innovation',
                description: 'Pushing the boundaries of technology and engineering excellence.',
              },
              {
                title: 'Collaboration',
                description: 'Working together to solve complex technical challenges.',
              },
              {
                title: 'Excellence',
                description: 'Maintaining the highest standards in all our endeavors.',
              },
            ].map((value, i) => (
              <AnimatedSection key={i}>
                <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-white hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-heading font-bold text-[#1d1d1f] mb-2">{value.title}</h3>
                  <p className="text-sm text-[#6e6e73]">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-black text-[#1d1d1f] mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-lg text-[#6e6e73] mb-8">
              Be part of something special. Whether you&apos;re looking to lead, contribute, or learn, there&apos;s a place for you.
            </p>
            <a
              href="/membership"
              className="inline-block px-8 py-3 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-[#1d4ed8] transition-colors"
            >
              Become a Member
            </a>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
