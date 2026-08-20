import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { Check, ExternalLink, Coffee } from 'lucide-react';

const SIGNUP_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScWnWYaIF0Hpwuz_6_ZdB69o8bjAmCd9Y_l5xrclvjXCpgm8g/viewform';

export default function MembershipPage() {
  const tiers = [
    {
      name: 'Paid Membership',
      price: '$20/Semester or $30/Year',
      benefits: ['Priority access to all workshops/events', 'Exclusive resources and discounts'],
    },
    {
      name: 'General Membership',
      price: '$5 per workshop',
      benefits: ['Pay-as-you-go', 'Subject to availability'],
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
  const maxMajor = Math.max(...majors.map(m => m.count));

  const classStanding = [
    { label: 'Graduate (M.S.)', count: 52 },
    { label: '4th Year (B.S.)', count: 45 },
    { label: '3rd Year (B.S.)', count: 30 },
    { label: '2nd Year (B.S.)', count: 14 },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="relative px-4 pt-32 pb-16 text-white overflow-hidden">
        <img src="/Innovation Garage Event.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 tracking-tight">
              Membership
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Join IEEE SJSU and unlock access to exclusive technical projects, workshops, and networking events.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Sign Up */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 px-8 py-12 md:px-14 md:py-14 text-center">
              <p className="text-xs font-bold tracking-[0.3em] text-slate-900 uppercase mb-4">How to Join</p>
              <h2 className="text-2xl md:text-4xl font-heading font-black text-slate-900 mb-4">
                Become an Official Member
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto mb-8">
                To become an official member of IEEE, please fill out this form.
              </p>
              <a
                href={SIGNUP_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Sign Up Now <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </AnimatedSection>

          {/* Tiers (reference only — pricing info) */}
          <AnimatedSection className="mt-10">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Membership Tiers</p>
            <div className="grid md:grid-cols-2 gap-6">
              {tiers.map((tier, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-600/30 hover:shadow-sm transition-all"
                >
                  <h3 className="font-heading font-bold text-slate-900 mb-2">{tier.name}</h3>
                  <p className="text-blue-600 font-bold text-lg mb-4">{tier.price}</p>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-500">
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Our Chapter */}
          <AnimatedSection className="mt-8 p-8 rounded-2xl border border-slate-200 bg-white">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Our Chapter</p>
            <h3 className="text-2xl font-heading font-black text-slate-900 mb-8">150+ Members and Growing</h3>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Major Distribution</p>
                <div className="space-y-3">
                  {majors.map((m) => (
                    <div key={m.name} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-sm text-slate-500">{m.name}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-blue-50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${(m.count / maxMajor) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-sm font-bold text-slate-900 text-right">{m.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Class Standing</p>
                <div className="space-y-3">
                  {classStanding.map((c) => (
                    <div key={c.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{c.label}</span>
                      <span className="font-bold text-slate-900">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Benefits + Lab Access, side by side */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <AnimatedSection className="p-8 rounded-2xl border border-slate-200 bg-white h-full">
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-4">Membership Benefits</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-900">
                    {benefit.includes('Snack Bar') ? (
                      <Coffee className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    )}
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection className="p-8 rounded-2xl border border-slate-200 bg-white h-full">
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-4">Lab Access Hours</h3>
              <p className="text-slate-500 mb-4">Location: ENGR 376</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between max-w-xs">
                  <span className="text-slate-500">Monday - Friday:</span>
                  <span className="font-medium text-slate-900">7:00 AM - 10:30 PM</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span className="text-slate-500">Saturday:</span>
                  <span className="font-medium text-slate-900">8:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span className="text-slate-500">Sunday:</span>
                  <span className="font-medium text-slate-900">Closed</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* FAQ */}
          <AnimatedSection className="mt-8 p-8 rounded-2xl border border-slate-200 bg-white">
            <h3 className="text-xl font-heading font-bold text-slate-900 mb-6">Questions?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Contact Us</h4>
                <p className="text-slate-500">
                  Email:{' '}
                  <a href="mailto:ieee@sjsu.edu" className="text-blue-600 hover:underline">
                    ieee@sjsu.edu
                  </a>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Join Our Community</h4>
                <p className="text-slate-500">
                  Connect on{' '}
                  <a
                    href="https://discord.gg/VwPdYWSVPS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Discord
                  </a>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
