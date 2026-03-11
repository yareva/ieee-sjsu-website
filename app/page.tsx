import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GuideCard } from '@/components/guide-card';
import { WeeklyEvents } from '@/components/weekly-events';
import { SnackBar } from '@/components/snack-bar';
import { ProjectCarousel } from '@/components/project-carousel';
import { AnimatedSection } from '@/components/animated-section';
import { SplashWrapper } from '@/components/splash-wrapper';
import { Lightbulb, Users, Calendar, Cpu } from 'lucide-react';

export default function Home() {
  const guides = [
    { 
      icon: Cpu, 
      title: 'Technical Projects', 
      description: 'Explore cutting-edge PCB design, microcontrollers, and hardware projects.', 
      href: '/projects' 
    },
    { 
      icon: Users, 
      title: 'Membership Info', 
      description: 'Join our community and gain access to exclusive workshops and events.', 
      href: '/membership' 
    },
    { 
      icon: Calendar, 
      title: 'Event Calendar', 
      description: 'View upcoming technical sessions, social events, and networking opportunities.', 
      href: '/events' 
    },
    { 
      icon: Lightbulb, 
      title: 'Lab Access', 
      description: 'Mon–Fri: 7AM–10:30PM · Sat: 8AM–7PM · Sun: Closed', 
      href: '/membership' 
    },
  ];

  return (
    <SplashWrapper>
      <main className="flex flex-col min-h-screen bg-white">
        <Navbar />

        {/* Hero — full screen with dark overlay */}
        <section className="relative min-h-screen flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 z-0" 
            style={{ 
              backgroundImage: 'url("/astera_lab.jpg")', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }} 
          />
          <div className="absolute inset-0 bg-black/65 z-10" />
          <div className="relative z-20 max-w-5xl mx-auto text-center">
            <AnimatedSection>
              {/* Eyebrow pill */}
              <div className="inline-block mb-6">
                <div className="px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white">
                  <span className="text-sm font-medium tracking-widest uppercase">IEEE SJSU Student Chapter</span>
                </div>
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-tight leading-tight text-balance">
                IEEE San Jose<br />State University
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-medium tracking-wide">
                Advancing Technology · Innovation · Community
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/projects" 
                  className="px-8 py-3 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-[#1d4ed8] transition-colors"
                >
                  Explore Projects
                </a>
                <a 
                  href="/membership" 
                  className="px-8 py-3 border-2 border-white/40 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                  Join Now
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Weekly Events Widget */}
        <WeeklyEvents />

        {/* Mission Section — white background, no card */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-xs font-bold tracking-[0.25em] text-[#2563eb] uppercase mb-3">Who We Are</p>
                  <h2 className="text-4xl md:text-5xl font-heading font-black text-[#1d1d1f] mb-6 tracking-tight leading-tight">
                    Our Mission
                  </h2>
                  <p className="text-lg text-[#6e6e73] leading-relaxed mb-6">
                    To empower the next generation of engineers through hands-on technical experience, industry readiness, and a community dedicated to professional excellence.
                  </p>
                  <p className="text-xl font-bold text-[#2563eb]">
                    We build for the betterment of our students&apos; success.
                  </p>
                </div>
                <div className="bg-[#f5f5f7] rounded-2xl aspect-[4/3] flex items-center justify-center">
                  <span className="text-[#6e6e73] text-sm">Drop a photo here</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Project Showcase Carousel */}
        <ProjectCarousel />

        {/* Explore IEEE SJSU — light grey background */}
        <section className="py-20 px-4 bg-[#f5f5f7]">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-black text-[#1d1d1f] mb-3">
                  Explore IEEE SJSU
                </h2>
                <p className="text-[#6e6e73] max-w-xl mx-auto">
                  Discover technical projects, events, membership opportunities, and lab access.
                </p>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {guides.map((guide, i) => (
                <AnimatedSection key={i}>
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

        {/* Ready to Get Involved CTA — white background */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-[#1d1d1f] mb-4">
                Ready to Get Involved?
              </h2>
              <p className="text-[#6e6e73] mb-10 leading-relaxed max-w-xl mx-auto">
                Whether you&apos;re interested in technical projects, professional development, or networking, IEEE SJSU has opportunities for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a 
                  href="/membership" 
                  className="inline-block px-8 py-3 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-[#1d4ed8] transition-colors"
                >
                  Become a Member
                </a>
                <a 
                  href="https://discord.gg/VwPdYWSVPS" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 border-2 border-[#2563eb] text-[#2563eb] rounded-xl font-bold hover:bg-[#2563eb]/10 transition-colors"
                >
                  Join Discord Server
                </a>
              </div>

            </AnimatedSection>
          </div>
        </section>

        {/* Snack Bar Widget */}
        <SnackBar />

        <Footer />
      </main>
    </SplashWrapper>
  );
}
