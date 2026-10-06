import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { Check, ExternalLink, Coffee, MapPin, Mail, MessageCircle } from 'lucide-react';
import { clubStats } from '@/lib/data';
import '../home.css';

const SIGNUP_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScWnWYaIF0Hpwuz_6_ZdB69o8bjAmCd9Y_l5xrclvjXCpgm8g/viewform';
const DISCORD_URL = 'https://discord.gg/VwPdYWSVPS';

const tiers = [
  {
    name: 'Paid Membership',
    price: '$20',
    per: 'per semester · or $30 per year',
    benefits: ['Priority access to all workshops/events', 'Exclusive resources and discounts'],
    featured: true,
  },
  {
    name: 'General Membership',
    price: '$5',
    per: 'per workshop',
    benefits: ['Pay-as-you-go', 'Subject to availability'],
    featured: false,
  },
];

const benefits = [
  'Full access to events, workshops, tech talks, and live demos',
  'Lunch & learns, hackathons, and networking events with industry partners',
  'Opportunities to work on capstone and technical projects',
  'Lab access at ENGR 376',
  'Snack Bar access at ENGR 376',
  'Professional development resources',
];

const majors = [
  { name: 'Electrical Eng.', count: 108 },
  { name: 'Comp. Eng.',      count: 17 },
  { name: 'Comp. Sci.',      count: 8 },
  { name: 'Data Analysis',   count: 6 },
  { name: 'Software Eng.',   count: 5 },
];
const maxMajor = Math.max(...majors.map((m) => m.count));

const classStanding = [
  { label: 'Graduate (M.S.)', count: 52 },
  { label: '4th Year (B.S.)', count: 45 },
  { label: '3rd Year (B.S.)', count: 30 },
  { label: '2nd Year (B.S.)', count: 14 },
];
const maxStanding = Math.max(...classStanding.map((c) => c.count));

const hours = [
  ['Monday – Friday', '7:00 AM – 10:30 PM'],
  ['Saturday', '8:00 AM – 7:00 PM'],
  ['Sunday', 'Closed'],
];

// Membership: one straightforward page with everything you need to join.
// Follows the light/dark switch, using the home page's color tokens.
export default function MembershipPage() {
  const members = clubStats.find((s) => s.label === 'Active Members');

  return (
    <main className="home flex flex-col min-h-screen">
      <Navbar themeToggle />

      {/* ── HEADER + HOW TO JOIN ── */}
      <section data-no-reveal className="m-hero">
        <div className="home-container">
          <p className="home-kicker">Membership</p>
          <h1 className="m-title">Become a <span className="home-h2-outline">Member</span></h1>
          <p className="home-lede m-lede">
            Join IEEE SJSU and unlock access to exclusive technical projects, workshops, and networking events.
            To become an official member, fill out the sign-up form.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={SIGNUP_FORM_URL} target="_blank" rel="noopener noreferrer" className="home-btn home-btn-primary">
              Sign Up Now <ExternalLink size={15} />
            </a>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="home-btn home-btn-ghost">
              Join the Discord
            </a>
          </div>

          <div className="m-facts">
            <div><MapPin size={16} /> ENGR 376</div>
            <div><Check size={16} /> Open to every SJSU student</div>
            {members && <div><Check size={16} /> {members.value}{members.suffix} members</div>}
          </div>
        </div>
      </section>

      {/* ── TIERS ── */}
      <section className="home-section m-section">
        <div className="home-container">
          <p className="home-kicker">Pricing</p>
          <h2 className="home-h2">Membership <span className="home-h2-outline">Tiers</span></h2>
          <div data-reveal-group className="m-grid-2">
            {tiers.map((tier) => (
              <div key={tier.name} className={`m-card m-tier ${tier.featured ? 'is-featured' : ''}`}>
                <p className="m-card-label">{tier.name}</p>
                <p className="m-price">{tier.price}<span>{tier.per}</span></p>
                <ul className="m-list">
                  {tier.benefits.map((b) => (
                    <li key={b}><Check size={16} /> {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="home-section m-section">
        <div className="home-container">
          <p className="home-kicker">What you get</p>
          <h2 className="home-h2">Membership <span className="home-h2-outline">Benefits</span></h2>
          <ul data-reveal-group className="m-benefits">
            {benefits.map((b) => (
              <li key={b} className="m-card">
                {b.includes('Snack Bar') ? <Coffee size={20} /> : <Check size={20} />}
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── OUR CHAPTER ── */}
      <section className="home-section m-section">
        <div className="home-container">
          <p className="home-kicker">Our chapter</p>
          <h2 className="home-h2">{members ? `${members.value}${members.suffix}` : '150+'} Members <span className="home-h2-outline">and Growing</span></h2>
          <AnimatedSection className="m-grid-2">
            <div className="m-card">
              <p className="m-card-label">Major Distribution</p>
              <div className="m-bars">
                {majors.map((m) => (
                  <div key={m.name} className="m-bar">
                    <span>{m.name}</span>
                    <div><i style={{ width: `${(m.count / maxMajor) * 100}%` }} /></div>
                    <b>{m.count}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="m-card">
              <p className="m-card-label">Class Standing</p>
              <div className="m-bars">
                {classStanding.map((c) => (
                  <div key={c.label} className="m-bar">
                    <span>{c.label}</span>
                    <div><i style={{ width: `${(c.count / maxStanding) * 100}%` }} /></div>
                    <b>{c.count}</b>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── LAB HOURS + QUESTIONS ── */}
      <section className="home-section m-section">
        <div className="home-container m-grid-2">
          <AnimatedSection className="m-card">
            <p className="m-card-label">Lab Access Hours</p>
            <p className="m-muted m-loc"><MapPin size={16} /> ENGR 376</p>
            <dl className="m-hours">
              {hours.map(([d, h]) => (
                <div key={d}><dt>{d}</dt><dd>{h}</dd></div>
              ))}
            </dl>
          </AnimatedSection>
          <AnimatedSection className="m-card">
            <p className="m-card-label">Questions?</p>
            <div className="m-contact">
              <a href="mailto:ieee@sjsu.edu"><Mail size={18} /> <span><b>Email us</b>ieee@sjsu.edu</span></a>
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> <span><b>Join our community</b>Connect on Discord</span></a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
