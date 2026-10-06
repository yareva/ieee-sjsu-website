import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { DearFlipBook } from '@/components/dearflip-book';
import { GoogleCalendar, CALENDAR_URL } from '@/components/google-calendar';
import { GarageTour } from '@/components/garage/garage-tour';
import { CountUp } from '@/components/home-extras';
import { clubStats, sponsorshipPacketUrl, sponsorshipPacketWebUrl } from '@/lib/data';
import './home.css';

// Home page. Follows the light/dark switch in the navbar; colors are the
// tokens at the top of home.css.
export default function Home() {
  return (
    <main className="home flex flex-col min-h-screen">
      <Navbar themeToggle />

      {/* ── 3D LAB TOUR: terminal → room → scope → multimeter → into the office ── */}
      <GarageTour tour="home" fadeTo="var(--bg)" />

      {/* ── CALENDAR ── */}
      <section className="home-section">
        <div className="home-container">
          <div className="home-head-row">
            <div>
              <p className="home-kicker">Live schedule</p>
              <h2 className="home-h2">On the <span className="home-h2-outline">Calendar</span></h2>
            </div>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="home-btn home-btn-ghost">
              Add to your calendar
            </a>
          </div>
          <div className="cal-card">
            <GoogleCalendar />
          </div>
        </div>
      </section>

      {/* ── SPONSORSHIP ── */}
      <section className="home-section">
        <div className="home-container sponsor-grid">
          <div>
            <p className="home-kicker">Partner with us</p>
            <h2 className="home-h2">Become a <span className="home-h2-outline">Sponsor</span></h2>
            <p className="home-lede">
              Sponsoring us puts your company directly in front of SJSU&apos;s engineering students. See the packet for tiers and details.
            </p>

            <div data-reveal-group className="stats-grid">
              {clubStats.map((s) => (
                <div key={s.label} className="stat">
                  <p className="stat-value"><CountUp value={s.value} suffix={s.suffix} /></p>
                  <p className="stat-label">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="mailto:ieee@sjsu.edu" className="home-btn home-btn-primary">Get in Touch</a>
              <a href={sponsorshipPacketUrl} target="_blank" rel="noopener noreferrer" className="home-btn home-btn-ghost">
                Download Packet
              </a>
            </div>
          </div>

          <AnimatedSection>
            <div className="flipbook-card">
              <DearFlipBook source={sponsorshipPacketWebUrl} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
