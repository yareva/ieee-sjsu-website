import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedSection } from '@/components/animated-section';
import { Check, CreditCard, Mail, UserCheck } from 'lucide-react';

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

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="relative px-4 py-16 md:py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Membership
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join IEEE SJSU and unlock access to exclusive technical projects, workshops, and networking events.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="border-l-4 border-primary pl-6 md:pl-8">
                    {/* Step Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-6 h-6 text-primary" />
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            {step.title}
                          </h2>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>

                    {/* Tiers (Step 1) */}
                    {step.tiers && (
                      <div className="grid md:grid-cols-2 gap-6 mb-6 ml-0 md:ml-16">
                        {step.tiers.map((tier, i) => (
                          <div
                            key={i}
                            className="p-6 rounded-lg border border-border bg-card hover:border-secondary transition-all"
                          >
                            <h3 className="font-semibold text-foreground mb-2">{tier.name}</h3>
                            <p className="text-secondary font-bold text-lg mb-4">{tier.price}</p>
                            <ul className="space-y-2">
                              {tier.benefits.map((benefit, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
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
                      <div className="ml-0 md:ml-16 p-4 rounded-lg bg-muted/50 border border-border mb-6">
                        <p className="text-foreground font-medium">{step.instruction}</p>
                      </div>
                    )}

                    {/* Action Button */}
                    {step.buttonLink && (
                      <div className="ml-0 md:ml-16">
                        <a
                          href={step.buttonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
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
          <AnimatedSection className="mt-16 p-8 rounded-xl border border-border bg-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Membership Summary</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Full access to IEEE SJSU events and workshops</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Lab access at ENGR 376</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Networking opportunities with industry partners</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Professional development resources</span>
              </li>
            </ul>
          </AnimatedSection>

          {/* FAQ */}
          <AnimatedSection className="mt-12 p-8 rounded-xl bg-muted/50 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">Questions?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Contact Us</h4>
                <p className="text-muted-foreground">
                  Email:{' '}
                  <a href="mailto:ieee@sjsu.edu" className="text-primary hover:underline">
                    ieee@sjsu.edu
                  </a>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Join Our Community</h4>
                <p className="text-muted-foreground">
                  Connect on{' '}
                  <a
                    href="https://discord.gg/VwPdYWSVPS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
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
