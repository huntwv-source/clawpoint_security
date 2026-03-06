'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function InfiniteViewPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

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

      {/* Hero Section — logo + platform overview */}
      <section className="relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(var(--tactical-green) 1px, transparent 1px), linear-gradient(90deg, var(--tactical-green) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="absolute inset-0">
          <Image
            src="/images/AdobeStock_241827782.jpeg"
            alt=""
            fill
            className="object-cover opacity-15 mix-blend-screen"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_70%,rgba(0,0,0,0.95)_100%)]" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full py-20 pt-28">
          {/* Logo — smaller */}
          <div className="mb-10 iv-emerge flex justify-center">
            <Image
              src="/images/New Infinite view.png"
              alt="Infinite View"
              width={680}
              height={680}
              className="object-contain drop-shadow-[0_0_40px_rgba(0,255,65,0.4)]"
              priority
            />
          </div>

          {/* Platform Overview — left aligned, about-page hero style */}
          <div className="text-left max-w-3xl mx-auto stalk-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">PLATFORM-01</span>
            </div>
            <h2 className="heading-h3 text-white mb-4">MODULAR ARCHITECTURE FOR MISSION SUCCESS</h2>
            <p className="text-base md:text-lg text-gray-300 font-mono leading-relaxed">
              Infinite View is Clawpoint&apos;s concept-stage analyst augmentation platform designed to reduce cognitive load and accelerate mission response by translating scattered security telemetry into a coherent operational picture. It is built to strengthen analyst judgment—not replace it.
            </p>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--tactical-green-dark)] bg-gradient-to-b from-black via-[var(--forest-depth-2)] to-black">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(var(--tactical-green) 1px, transparent 1px), linear-gradient(90deg, var(--tactical-green) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 emerge-from-forest">
            <h2 className="heading-h2 text-white mb-3">
              THREE PILLARS
            </h2>
            <p className="text-gray-300 font-mono text-base">
              Cut Noise. Reduce Cognitive Load. Outpace Threats.
            </p>
          </div>

          <div className="space-y-4">
            {/* Pillar 1: MCI */}
            <article className="relative group stalk-in" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative border-l-4 border-[var(--tactical-green)] bg-black/50 backdrop-blur-sm p-6 hover:border-[var(--night-vision)] hover:bg-black/70 transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center border-2 border-[var(--tactical-green-dark)] bg-black/60 group-hover:border-[var(--night-vision)] transition-colors">
                    <span className="text-2xl font-bold text-[var(--night-vision)] font-mono">01</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-h3 text-white mb-1">
                      MCI (Mission Cognition Interface)
                    </h3>
                    <div className="text-sm text-[var(--tactical-green-light)] font-mono mb-3 tracking-wider">
                      PILLAR 1: HUMAN-CENTERED INTERFACE
                    </div>
                    <p className="body-regular text-gray-300">
                      Infinite View&apos;s human-centered interface layer that converts complexity into comprehension. MCI is how Infinite View presents mission-relevant context, relationships, and meaning so analysts and leaders can understand what is happening, why it matters, and what must happen next.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Pillar 2: MDSK */}
            <article className="relative group stalk-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative border-l-4 border-[var(--tactical-green)] bg-black/50 backdrop-blur-sm p-6 hover:border-[var(--night-vision)] hover:bg-black/70 transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center border-2 border-[var(--tactical-green-dark)] bg-black/60 group-hover:border-[var(--night-vision)] transition-colors">
                    <span className="text-2xl font-bold text-[var(--night-vision)] font-mono">02</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-h3 text-white mb-1">
                      MDSK (Modular Decision Support Kit)
                    </h3>
                    <div className="text-sm text-[var(--tactical-green-light)] font-mono mb-3 tracking-wider">
                      PILLAR 2: MODULAR BACKBONE
                    </div>
                    <p className="body-regular text-gray-300">
                      The modular backbone that ingests, stores, normalizes, and quality-checks mission-relevant data so it can be used for decision support. MDSK is the buildable core that makes fusion, explainability, and operational analytics possible without forcing a full-stack replacement.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Pillar 3: HRE */}
            <article className="relative group stalk-in" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative border-l-4 border-[var(--tactical-green)] bg-black/50 backdrop-blur-sm p-6 hover:border-[var(--night-vision)] hover:bg-black/70 transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center border-2 border-[var(--tactical-green-dark)] bg-black/60 group-hover:border-[var(--night-vision)] transition-colors">
                    <span className="text-2xl font-bold text-[var(--night-vision)] font-mono">03</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-h3 text-white mb-1">
                      HRE (Horizon Engine)
                    </h3>
                    <div className="text-sm text-[var(--tactical-green-light)] font-mono mb-3 tracking-wider">
                      PILLAR 3: PREDICTIVE INTELLIGENCE
                    </div>
                    <p className="body-regular text-gray-300">
                      HRE (Horizon Engine) is Infinite View&apos;s human-machine resilience and decision engine that turns information into timelines, beacons, and mission-aligned decision triggers. HRE is where Infinite View becomes a mission system—compressing time-to-truth and enabling proactive action through explainable insight paths.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

    </div>
  )
}
