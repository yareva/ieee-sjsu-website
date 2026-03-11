import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GuideCard } from '@/components/guide-card';
import { SponsorMarquee } from '@/components/sponsor-marquee';
import { AnimatedSection } from '@/components/animated-section';
import { Lightbulb, Users, Calendar, Cpu } from 'lucide-react';

export default function Home() {
  const guides = [
    {
      icon: Cpu,
      title: 'Technical Projects',
      description: 'Explore cutting-edge PCB design, microcontrollers, and hardware projects.',
      href: '/projects',
    },
    {
      icon: Users,
      title: 'Membership Info',
      description: 'Join our community and gain access to exclusive workshops and events.',
      href: '/membership',
    },
    {
      icon: Calendar,
      title: 'Event Calendar',
      description: 'View upcoming technical sessions, social events, and networking opportunities.',
      href: '/events',
    },
    {
      icon: Lightbulb,
      title: 'Lab Access (ENGR 376)',
      description: 'Get hands-on experience with professional tools and equipment.',
      href: '/projects',
    },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/astera_lab.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-block mb-6">
              <div className="px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white">
                <span className="text-sm font-semibold">IEEE SJSU Student Chapter</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-pretty tracking-tight leading-tight">
              IEEE San José<br />State University
            </h1>

            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto text-balance font-medium leading-relaxed">
              Advancing technology, innovation, and professional excellence through hands-on technical experience and community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <a
                href="/membership"
                className="px-8 py-3 bg-white text-primary rounded-xl font-bold hover:scale-105 transition-transform duration-200"
              >
                Join Now
              </a>
              <a
                href="/events"
                className="px-8 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-200"
              >
                View Events
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="relative py-24 px-4 bg-white overflow-hidden">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-[2rem] p-12 text-center shadow-2xl relative overflow-hidden">
            {/* Subtle blue glow behind the text so it's not just a flat box */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00629B]/20 rounded-full blur-3xl" />

            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              To empower the next generation of engineers through hands-on technical
              experience, industry readiness, and a community dedicated to professional excellence.
            </p>
            <p className="text-2xl font-bold text-[#E5A823]">
              We build for the betterment of our students' success.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Guide Cards Section */}
      <section className="relative px-4 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Explore IEEE SJSU
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Discover technical projects, events, membership opportunities, and lab access.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, i) => (
              <AnimatedSection key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <GuideCard
                  title={guide.title}
                  description={guide.description}
                  href={guide.href}
                  icon={guide.icon}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Marquee */}
      <SponsorMarquee />

      {/* CTA Section */}
      <section className="relative px-4 py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Get Involved?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Whether you're interested in technical projects, professional development, or networking, IEEE SJSU has opportunities for you.
            </p>
            <a
              href="/membership"
              className="inline-block px-10 py-4 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-transform duration-200"
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
