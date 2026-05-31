'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import DownloadBrief from '@/components/DownloadBrief'

export default function AboutPage() {
  const [eyesVisible, setEyesVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Predator eyes appearing
  useEffect(() => {
    setTimeout(() => setEyesVisible(true), 800)
  }, [])

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-black relative min-h-screen">
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black z-50">
        <div
          className="h-full bg-gradient-to-r from-[var(--tactical-green)] via-[var(--night-vision)] to-[var(--tactical-green-light)] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background tactical grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(var(--tactical-green) 1px, transparent 1px), linear-gradient(90deg, var(--tactical-green) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/AdobeStock_241827782.jpeg"
            alt=""
            fill
            className="object-cover opacity-15 mix-blend-screen"
            priority
          />
        </div>

        {/* Predator eyes watching */}
        {eyesVisible && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-[10%] top-[25%] flex gap-6 predator-eyes-pulse" style={{ animationDelay: '0s' }}>
              <div className="w-2 h-2 bg-[var(--night-vision)] rounded-full shadow-[0_0_15px_rgba(0,255,65,0.6)]" />
              <div className="w-2 h-2 bg-[var(--night-vision)] rounded-full shadow-[0_0_15px_rgba(0,255,65,0.6)]" />
            </div>

            <div className="absolute right-[15%] top-[40%] flex gap-8 predator-eyes-pulse" style={{ animationDelay: '5s' }}>
              <div className="w-2.5 h-2.5 bg-[var(--night-vision)] rounded-full shadow-[0_0_20px_rgba(0,255,65,0.6)]" />
              <div className="w-2.5 h-2.5 bg-[var(--night-vision)] rounded-full shadow-[0_0_20px_rgba(0,255,65,0.6)]" />
            </div>
          </div>
        )}

        {/* Forest depth layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--forest-depth-3)] via-transparent to-[var(--forest-depth-2)] opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-depth-1)] via-transparent to-transparent opacity-15" />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.9)_100%)]" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center pt-24 pb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-10 font-mono tracking-wider stalk-in" style={{ animationDelay: '0.2s' }}>
            CLAWPOINT SECURITY
            <span className="block text-[var(--night-vision)] text-glow mt-3">
              COLLECTIVE
            </span>
          </h1>

          <div className="text-left max-w-3xl mx-auto stalk-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">MISSION-01</span>
            </div>
            <h2 className="heading-h3 text-white mb-4">WHO WE ARE</h2>
            <p className="text-sm md:text-base text-gray-300 font-mono leading-relaxed">
              Clawpoint Security Collective (CSC) is a mission-centric cybersecurity company built to deliver precision over panic—turning fragmented telemetry, complex risk, and operational uncertainty into actionable outcomes. CSC operates at the intersection of mission assurance, cyber resilience, and analyst enablement to reduce exposure while strengthening mission continuity.
            </p>
          </div>

          {/* ACQUISITION PATHWAYS */}
          <div className="text-left max-w-3xl mx-auto stalk-in mt-6 mb-8" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">MISSION-02</span>
            </div>
            <h2 className="heading-h3 text-white mb-4">ACQUISITION PATHWAYS</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: 'NAICS', value: '541519', note: 'Primary' },
                { label: 'NAICS', value: '541511' },
                { label: 'NAICS', value: '541512' },
                { label: 'NAICS', value: '541611' },
                { label: 'NAICS', value: '561690' },
                { label: 'NAICS', value: '541690' },
                { label: 'UEI', value: 'QMGUKY66AD53' },
                { label: 'CAGE', value: '8P5B8' },
                { label: null, value: 'SDVOSB' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border border-[var(--night-vision)] bg-black px-4 py-2 hover:bg-[var(--tactical-green-dark)]/20 transition-tactical cursor-pointer whitespace-nowrap"
                >
                  <div className="flex items-baseline gap-2">
                    {item.label && (
                      <span className="text-gray-400 font-mono text-xs">{item.label}</span>
                    )}
                    <span className="text-white font-mono text-sm font-bold">{item.value}</span>
                    {item.note && (
                      <span className="text-[var(--night-vision)] font-mono text-xs">{item.note}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Government agency logos — row 1: 4, row 2: 5 */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {[
                  { src: '/images/Service-Disabled Veteran-Owned-Certified.png', alt: 'Service-Disabled Veteran-Owned Small Business Certified' },
                  { src: '/images/government%20logos/ANG-large.jpg', alt: 'Air National Guard' },
                  { src: '/images/government%20logos/census-logo-blue.avif', alt: 'U.S. Census Bureau' },
                  { src: '/images/government%20logos/dhs-seal-250%20(1).jpg', alt: 'Department of Homeland Security' },
                ].map((logo, idx) => (
                  <div key={idx} className="bg-black/60 border border-[var(--tactical-green-dark)] p-2 flex items-center justify-center h-20 flex-1 hover:border-[var(--night-vision)] transition-all duration-300">
                    <Image src={logo.src} alt={logo.alt} width={64} height={64} className="object-contain max-h-14 w-auto" unoptimized />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {[
                  { src: '/images/government%20logos/DTRA_Seal-PNG.png', alt: 'Defense Threat Reduction Agency' },
                  { src: '/images/government%20logos/NavyColorJPEG.jpg', alt: 'U.S. Navy' },
                  { src: '/images/government%20logos/ngen-logo-800-x-250.webp', alt: 'NGEN' },
                  { src: '/images/government%20logos/NMCI_Square.webp', alt: 'NMCI' },
                  { src: '/images/government%20logos/USHMM_White.webp', alt: 'U.S. Holocaust Memorial Museum' },
                ].map((logo, idx) => (
                  <div key={idx} className="bg-black/60 border border-[var(--tactical-green-dark)] p-2 flex items-center justify-center h-20 flex-1 hover:border-[var(--night-vision)] transition-all duration-300">
                    <Image src={logo.src} alt={logo.alt} width={64} height={64} className="object-contain max-h-14 w-auto" unoptimized />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body: 2/3 content left + 1/3 team sidebar right */}
      <section className="relative border-t border-[var(--tactical-green-dark)]">
        <div className="absolute inset-0 tactical-grid opacity-5" />
        <div className="absolute inset-0">
          <Image
            src="/images/AdobeStock_328406149.jpeg"
            alt=""
            fill
            className="object-cover opacity-10 mix-blend-lighten"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3">

          {/* Left 2/3: WHAT WE DO + PROVEN PERFORMANCE */}
          <div className="md:col-span-2 px-4 sm:px-6 lg:px-8 divide-y divide-[var(--tactical-green-dark)]">

            {/* WHAT WE DO — single compressed block */}
            <div className="pt-14 pb-12 emerge-from-forest">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-[var(--tactical-green)]" />
                <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">CAPABILITIES-03</span>
              </div>
              <h2 className="heading-h2 text-white mb-6">WHAT WE DO</h2>
              <p className="text-base md:text-lg text-gray-300 font-mono leading-relaxed mb-6">
                Clawpoint Security Collective partners with mission-critical organizations to:
              </p>
              <div className="border-l-4 border-[var(--tactical-green)] pl-6 py-4 bg-black/40 backdrop-blur-sm space-y-4 stalk-in">
                <p className="text-base text-gray-300 font-mono leading-relaxed">
                  <span className="text-[var(--night-vision)] font-bold mr-3">01</span>
                  Surface enterprise risk that undermines operational effectiveness
                </p>
                <div className="h-px bg-[var(--tactical-green-dark)]" />
                <p className="text-base text-gray-300 font-mono leading-relaxed">
                  <span className="text-[var(--night-vision)] font-bold mr-3">02</span>
                  Accelerate leadership decisions with context and confidence
                </p>
                <div className="h-px bg-[var(--tactical-green-dark)]" />
                <p className="text-base text-gray-300 font-mono leading-relaxed">
                  <span className="text-[var(--night-vision)] font-bold mr-3">03</span>
                  Fortify mission continuity against dynamic threats
                </p>
              </div>
              <div className="mt-6 p-6 border border-[var(--tactical-green-dark)] bg-black/60">
                <p className="text-sm md:text-base text-gray-400 font-mono leading-relaxed italic">
                  We combine operational experience, risk-informed methodologies, and a human-centered approach to secure the mission—not just infrastructure.
                </p>
              </div>
            </div>

            {/* PROVEN PERFORMANCE */}
            <div className="py-12 emerge-from-forest">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-[var(--tactical-green)]" />
                <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">PERFORMANCE-04</span>
              </div>
              <h2 className="heading-h2 text-white mb-6">PROVEN PERFORMANCE</h2>
              <p className="text-base md:text-lg text-gray-300 font-mono leading-relaxed mb-8">
                Our operational track record demonstrates mission success at scale
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                <article className="relative group stalk-in min-w-0 border-2 border-[var(--tactical-green-dark)] bg-black/60 backdrop-blur-sm p-6 hover:border-[var(--night-vision)] transition-all duration-500" style={{ animationDelay: '0.1s' }}>
                  <div className="text-4xl font-bold text-[var(--night-vision)] font-mono mb-3 break-words">22,000</div>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">Privileged accounts secured</p>
                </article>
                <article className="relative group stalk-in min-w-0 border-2 border-[var(--tactical-green-dark)] bg-black/60 backdrop-blur-sm p-6 hover:border-[var(--night-vision)] transition-all duration-500" style={{ animationDelay: '0.2s' }}>
                  <div className="text-2xl font-bold text-[var(--night-vision)] font-mono mb-3 break-words">ACCELERATED</div>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">Authorization delivery across multiple enclaves</p>
                </article>
                <article className="relative group stalk-in min-w-0 border-2 border-[var(--tactical-green-dark)] bg-black/60 backdrop-blur-sm p-6 hover:border-[var(--night-vision)] transition-all duration-500" style={{ animationDelay: '0.3s' }}>
                  <div className="text-2xl font-bold text-[var(--night-vision)] font-mono mb-3 break-words uppercase">Mission Assurance</div>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">Bridging compliance and operational reality</p>
                </article>
              </div>
            </div>

            {/* CAPABILITIES STATEMENT */}
            <div className="py-12 emerge-from-forest">
              <DownloadBrief variant="banner" title="CAPABILITIES STATEMENT" hideLabel />
            </div>

          </div>

          {/* Right 1/3: THE TEAM sidebar */}
          <div className="md:col-span-1 md:border-l border-t md:border-t-0 border-[var(--tactical-green-dark)] px-4 sm:px-6 lg:px-8 pt-14 pb-12 bg-gradient-to-b from-black via-[var(--forest-depth-2)] to-black">
            <div className="emerge-from-forest">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-[var(--tactical-green)]" />
                <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">LEADERSHIP-05</span>
              </div>
              <h2 className="heading-h2 text-white mb-8">THE TEAM</h2>

              <div className="space-y-10">
                {/* Will Smith */}
                <article className="relative group stalk-in max-w-[220px] mx-auto" style={{ animationDelay: '0.1s' }}>
                  <div className="credential-shine border-2 border-[var(--tactical-green-dark)] bg-black/80 backdrop-blur-sm relative overflow-hidden hover:border-[var(--night-vision)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="relative aspect-square overflow-hidden">
                      <Image src="/images/headshots/will-smith.jpg" alt="Will Smith" fill className="object-cover transition-all duration-500" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-bold text-white font-mono mb-1 tracking-wide">Will Smith</h3>
                      <p className="text-[var(--night-vision)] font-mono text-xs font-bold">Founder & CEO</p>
                    </div>
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </article>

                {/* Charles Walker */}
                <article className="relative group stalk-in max-w-[220px] mx-auto" style={{ animationDelay: '0.2s' }}>
                  <div className="credential-shine border-2 border-[var(--tactical-green-dark)] bg-black/80 backdrop-blur-sm relative overflow-hidden hover:border-[var(--night-vision)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-bold text-white font-mono mb-1 tracking-wide">Charles Walker</h3>
                      <p className="text-[var(--night-vision)] font-mono text-xs font-bold">Director, Mission Capture</p>
                    </div>
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </article>

                {/* Corey Green */}
                <article className="relative group stalk-in max-w-[220px] mx-auto" style={{ animationDelay: '0.3s' }}>
                  <div className="credential-shine border-2 border-[var(--tactical-green-dark)] bg-black/80 backdrop-blur-sm relative overflow-hidden hover:border-[var(--night-vision)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-bold text-white font-mono mb-1 tracking-wide">Corey Green</h3>
                      <p className="text-[var(--night-vision)] font-mono text-xs font-bold">Chief Security Officer</p>
                    </div>
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </article>

                {/* Tosha Dennis */}
                <article className="relative group stalk-in max-w-[220px] mx-auto" style={{ animationDelay: '0.4s' }}>
                  <div className="credential-shine border-2 border-[var(--tactical-green-dark)] bg-black/80 backdrop-blur-sm relative overflow-hidden hover:border-[var(--night-vision)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-bold text-white font-mono mb-1 tracking-wide">Tosha Dennis</h3>
                      <p className="text-[var(--night-vision)] font-mono text-xs font-bold">Director, National Security</p>
                    </div>
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </article>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
