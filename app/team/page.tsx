import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { Mail, Linkedin } from 'lucide-react';

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
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="relative px-4 py-16 md:py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Team
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Meet the passionate engineers and visionaries driving IEEE SJSU forward.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Grid */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <AnimatedSection
                key={i}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg hover:scale-105 transition-all h-full flex flex-col">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-lg font-bold text-white mb-4 group-hover:scale-110 transition-transform">
                    {member.initials}
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-secondary font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">{member.bio}</p>

                  {/* Contact */}
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-primary/10 text-foreground hover:text-primary transition-colors text-sm font-medium"
                      title={`Email ${member.name}`}
                    >
                      <Mail size={16} />
                      <span className="hidden sm:inline">Email</span>
                    </a>
                    <a
                      href="https://linkedin.com/company/ieee-sjsu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-primary/10 text-foreground hover:text-primary transition-colors text-sm font-medium"
                      title={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin size={16} />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-16 md:py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground">
              These principles guide everything we do at IEEE SJSU.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Innovation',
                description: 'Pushing the boundaries of technology and engineering excellence.',
                icon: '💡',
              },
              {
                title: 'Collaboration',
                description: 'Working together to solve complex technical challenges.',
                icon: '🤝',
              },
              {
                title: 'Excellence',
                description: 'Maintaining the highest standards in all our endeavors.',
                icon: '⭐',
              },
            ].map((value, i) => (
              <AnimatedSection key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be part of something special. Whether you're looking to lead, contribute, or learn, there's a place for you.
            </p>
            <a
              href="/membership"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
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
