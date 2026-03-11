import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GuideCard } from '@/components/guide-card';
import { WeeklyEvents } from '@/components/weekly-events';
import { SnackBar } from '@/components/snack-bar';
import { AnimatedSection } from '@/components/animated-section';
import { SplashWrapper } from '@/components/splash-wrapper';
import { Lightbulb, Users, Calendar, Cpu } from 'lucide-react';

export default function Home() {
  const guides = [
    { icon: Cpu, title: 'Technical Projects', description: 'Explore cutting-edge PCB design, microcontrollers, and hardware projects.', href: '/projects' },
    { icon: Users, title: 'Membership Info', description: 'Join our community and gain access to exclusive workshops and events.', href: '/membership' },
    { icon: Calendar, title: 'Event Calendar', description: 'View upcoming technical sessions, social events, and networking opportunities.', href: '/events' },
    { icon: Lightbulb, title: 'Lab Access (ENGR 376)', description: 'Get hands-on experience with professional tools and equipment.', href: '/projects' },
  ];

  return (
    <SplashWrapper>
      <main className="flex flex-col min-h-screen bg-[#0f1117]">
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url("/astera_lab.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-black/70 z-10" />
          <div className="relative z-20 max-w-5xl mx-auto text-center">
            <AnimatedSection>
              <div className="inline-block mb-6">
                <div className="px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white">
                  <span className="text-sm font-medium">IEEE SJSU Student Chapter</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                IEEE San Jose<br />State University
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-medium tracking-wide">
                Advancing Technology &middot; Innovation &middot; Community
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/projects" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors">
                  Explore Projects
                </a>
                <a href="/membership" className="px-8 py-3 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                  Join Now
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Weekly Events Strip */}
        <WeeklyEvents />

        {/* Mission Section */}
        <section className="py-20 px-4 bg-[#0f1117]">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Our Mission</h2>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    To empower the next generation of engineers through hands-on technical experience, industry readiness, and a community dedicated to professional excellence.
                  </p>
                  <p className="text-2xl font-bold text-blue-400">
                    We build for the betterment of our students&apos; success.
                  </p>
                </div>
                <div className="bg-gray-800 rounded-2xl aspect-[4/3] flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Mission Photo</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Explore IEEE SJSU */}
        <section className="py-16 px-4 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore IEEE SJSU</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">Discover technical projects, events, membership opportunities, and lab access.</p>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {guides.map((guide, i) => (
                <AnimatedSection key={i}>
                  <GuideCard title={guide.title} description={guide.description} href={guide.href} icon={guide.icon} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-[#0f1117]">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Involved?</h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                Whether you&apos;re interested in technical projects, professional development, or networking, IEEE SJSU has opportunities for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <a href="/membership" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors">
                  Become a Member
                </a>
                <a href="https://discord.gg/VwPdYWSVPS" target="_blank" rel="noopener noreferrer"
                  className="inline-block px-8 py-3 border border-blue-500 text-blue-400 rounded-xl font-bold hover:bg-blue-500/10 transition-colors">
                  Join Discord Server
                </a>
              </div>
              <div className="border-t border-gray-800 pt-8">
                <p className="text-gray-500 text-sm mb-4 uppercase tracking-widest font-bold">Follow Us</p>
                <div className="flex justify-center gap-8">
                  <a href="https://discord.gg/VwPdYWSVPS" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm font-semibold transition-colors">Discord</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm font-semibold transition-colors">Instagram</a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm font-semibold transition-colors">Facebook</a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Snack Bar */}
        <SnackBar />

        <Footer />
      </main>
    </SplashWrapper>
  );
}