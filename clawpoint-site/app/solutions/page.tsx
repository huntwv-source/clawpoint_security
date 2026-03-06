import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Solutions | Clawpoint Security Collective',
  description:
    'Mission-centric assurance, cyber operations design, and security architecture services. We transform compliance into operational advantage.',
}

export default function SolutionsPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/AdobeStock_352206247.jpeg"
            alt=""
            fill
            className="object-cover opacity-15 mix-blend-screen"
            priority
          />
        </div>

        {/* Tactical grid */}
        <div className="absolute inset-0 tactical-grid opacity-5" />

        {/* Forest depth layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--forest-depth-3)] via-transparent to-[var(--forest-depth-2)] opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-depth-1)] via-transparent to-transparent opacity-15" />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.9)_100%)]" />

        <div className="max-w-6xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-mono tracking-wider stalk-in mb-16 text-center" style={{ animationDelay: '0.2s' }}>
            EMPOWER YOUR
            <span className="block text-[var(--night-vision)] text-glow mt-3">MISSION</span>
          </h1>

          {/* Security Categories */}
          <div className="max-w-6xl stalk-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">DOMAINS-01</span>
            </div>
            <h2 className="heading-h3 text-white mb-5">SECURITY CATEGORIES</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-3">
              {[
                'MISSION ASSURANCE',
                'CYBER RESILIENCE',
                'ANALYST ENABLEMENT',
                'DECISION SUPPORT',
                'INCIDENT RESPONSE',
                'THREAT HUNTING',
                'OPERATIONAL TRUTH',
                'COMPLIANCE POSTURE',
                'ZERO TRUST',
                'SIGNAL EXTRACTION',
                'MISSION CONTINUITY',
                'COGNITIVE LOAD REDUCTION',
              ].map((topic, index) => (
                <div
                  key={index}
                  className="border-2 border-[var(--night-vision)]/80 bg-[var(--tactical-green-dark)]/30 backdrop-blur-sm px-5 py-2 text-center hover:border-[var(--night-vision)] hover:bg-[var(--tactical-green-dark)]/50 transition-tactical cursor-pointer"
                >
                  <span className="text-white font-mono text-xs tracking-wider transition-colors">
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Offerings Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--tactical-green-dark)]">
        <div className="absolute inset-0 tactical-grid opacity-5" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 stalk-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-mono tracking-wider">
              OUR <span className="text-[var(--night-vision)]">APPROACH</span>
            </h2>
            <p className="text-lg text-gray-300 font-mono">
              Frameworks → Force Multipliers → Mission Outcomes
            </p>
          </div>

          {/* Core Offerings Cards */}
          <div className="space-y-8 mb-16">
            {[
              {
                number: '01',
                title: 'Mission Assurance Baseline™ (MAB™)',
                description: "Clawpoint's baseline assessment offering that establishes the operational truth of a mission environment—what matters most, what is exposed, what is failing silently, and what must be prioritized now. It produces a mission-linked risk baseline that informs both remediation and Infinite View alignment.",
                highlights: ['Operational Truth', 'Risk Baseline', 'Priority Mapping', 'Mission-Linked Controls']
              },
              {
                number: '02',
                title: 'Operation Ready™ (OR™)',
                description: "Clawpoint's scenario-driven readiness offering that pressure-tests decision-making and response effectiveness under realistic mission disruption conditions. It converts compliance posture into operational performance and exposes human + process friction before a real event forces the lesson.",
                highlights: ['Scenario Exercises', 'Readiness Testing', 'Performance Metrics', 'Friction Detection']
              },
              {
                number: '03',
                title: 'Adversary Signal™ (AS™)',
                description: "Clawpoint's hunt and detection offering focused on extracting meaningful adversary activity from noisy environments. It prioritizes signal over volume and drives action before compromise becomes mission damage.",
                highlights: ['Hunt Operations', 'Signal Extraction', 'Early Detection', 'Action-Driven']
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden stalk-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                {/* Card */}
                <div className="relative border-l-4 border-[var(--tactical-green)] bg-black/50 backdrop-blur-sm p-8 hover:border-[var(--night-vision)] hover:bg-black/70 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    {/* Number indicator */}
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center border-2 border-[var(--tactical-green-dark)] bg-black/60 group-hover:border-[var(--night-vision)] transition-colors">
                      <span className="text-2xl font-bold text-[var(--night-vision)] font-mono">{item.number}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-4 font-mono tracking-wide group-hover:text-[var(--night-vision)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="body-regular text-gray-300 mb-6">
                        {item.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-3">
                        {item.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 border border-[var(--tactical-green-dark)] bg-black/40 text-sm text-gray-300 font-mono hover:border-[var(--night-vision)] hover:text-white transition-colors"
                          >
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
