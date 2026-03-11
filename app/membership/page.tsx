import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { Check, CreditCard, Mail, UserCheck, Coffee } from 'lucide-react';

export default function MembershipPage() {
  const steps = [
    {
      number: 1,
      title: 'Choose a Tier & Pay',
      description: 'Select your membership level and complete payment securely.',
      tiers: [
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
      ],
      buttonLabel: 'Pay Dues via Square',
      buttonLink: 'https://checkout.square.site/merchant/7YKJXP8YNEQ7X/checkout/KKXRA7BNGVNQI3D4DEHZU2YT',
      icon: CreditCard,
    },
    {
      number: 2,
      title: 'Verify Payment',
      description: 'Send your Square payment confirmation receipt via email.',
      instruction: 'Email your Square payment confirmation receipt to ieee@sjsu.edu',
      icon: Mail,
    },
    {
      number: 3,
      title: 'Official Registration',
      description: 'Complete your registration on the SAMMY App.',
      instruction: 'Final Step: Join officially on the SAMMY App for school records.',
      buttonLabel: 'Join via SAMMY App',
      buttonLink: 'https://sammyapp.sjsu.edu/IEEE/club_signup',
      icon: UserCheck,
    },
  ];

  const benefits = [
    'Full access to IEEE SJSU events and workshops',
    'Lab access at ENGR 376',
    'Networking opportunities with industry partners',
    'Professional development resources',
    'Snack Bar access at ENGR 376',
  ];

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="relative px-4 pt-32 pb-16 bg-[#1d1d1f] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 tracking-tight">
              Membership
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join IEEE SJSU and unlock access to exclusive technical projects, workshops, and networking events.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={index}>
                  <div className="border-l-4 border-[#2563eb] pl-6 md:pl-8">
                    {/* Step Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#2563eb] text-white font-bold text-lg">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-6 h-6 text-[#2563eb]" />
                          <h2 className="text-2xl md:text-3xl font-heading font-black text-[#1d1d1f]">
                            {step.title}
                          </h2>
                        </div>
                        <p className="text-[#6e6e73]">{step.description}</p>
                      </div>
                    </div>

                    {/* Tiers (Step 1) */}
                    {step.tiers && (
                      <div className="grid md:grid-cols-2 gap-6 mb-6 ml-0 md:ml-16">
                        {step.tiers.map((tier, i) => (
                          <div
                            key={i}
                            className="p-6 rounded-2xl border border-[#e5e5ea] bg-white hover:border-[#2563eb]/30 hover:shadow-sm transition-all"
                          >
                            <h3 className="font-heading font-bold text-[#1d1d1f] mb-2">{tier.name}</h3>
                            <p className="text-[#2563eb] font-bold text-lg mb-4">{tier.price}</p>
                            <ul className="space-y-2">
                              {tier.benefits.map((benefit, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-[#6e6e73]">
                                  <Check className="w-4 h-4 text-[#2563eb] flex-shrink-0 mt-0.5" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Instruction (Step 2 & 3) */}
                    {step.instruction && (
                      <div className="ml-0 md:ml-16 p-4 rounded-xl bg-[#f5f5f7] border border-[#e5e5ea] mb-6">
                        <p className="text-[#1d1d1f] font-medium">{step.instruction}</p>
                      </div>
                    )}

                    {/* Action Button */}
                    {step.buttonLink && (
                      <div className="ml-0 md:ml-16">
                        <a
                          href={step.buttonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-8 py-3 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-[#1d4ed8] transition-colors"
                        >
                          {step.buttonLabel}
                        </a>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Summary */}
          <AnimatedSection className="mt-16 p-8 rounded-2xl border border-[#e5e5ea] bg-white">
            <h3 className="text-xl font-heading font-bold text-[#1d1d1f] mb-4">Membership Benefits</h3>
            <ul className="space-y-3">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-[#1d1d1f]">
                  {benefit.includes('Snack Bar') ? (
                    <Coffee className="w-5 h-5 text-[#2563eb] flex-shrink-0" />
                  ) : (
                    <Check className="w-5 h-5 text-[#2563eb] flex-shrink-0" />
                  )}
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Lab Access */}
          <AnimatedSection className="mt-8 p-8 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea]">
            <h3 className="text-xl font-heading font-bold text-[#1d1d1f] mb-4">Lab Access Hours</h3>
            <p className="text-[#6e6e73] mb-4">Location: ENGR 376</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between max-w-xs">
                <span className="text-[#6e6e73]">Monday - Friday:</span>
                <span className="font-medium text-[#1d1d1f]">7:00 AM - 10:30 PM</span>
              </div>
              <div className="flex justify-between max-w-xs">
                <span className="text-[#6e6e73]">Saturday:</span>
                <span className="font-medium text-[#1d1d1f]">8:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between max-w-xs">
                <span className="text-[#6e6e73]">Sunday:</span>
                <span className="font-medium text-[#1d1d1f]">Closed</span>
              </div>
            </div>
          </AnimatedSection>

          {/* FAQ */}
          <AnimatedSection className="mt-8 p-8 rounded-2xl bg-white border border-[#e5e5ea]">
            <h3 className="text-xl font-heading font-bold text-[#1d1d1f] mb-6">Questions?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#1d1d1f] mb-2">Contact Us</h4>
                <p className="text-[#6e6e73]">
                  Email:{' '}
                  <a href="mailto:ieee@sjsu.edu" className="text-[#2563eb] hover:underline">
                    ieee@sjsu.edu
                  </a>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[#1d1d1f] mb-2">Join Our Community</h4>
                <p className="text-[#6e6e73]">
                  Connect on{' '}
                  <a
                    href="https://discord.gg/VwPdYWSVPS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563eb] hover:underline"
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
