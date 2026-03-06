'use client'

import { useState } from 'react'

interface DownloadBriefProps {
  variant?: 'inline' | 'banner'
  className?: string
  title?: string
  hideLabel?: boolean
}

export default function DownloadBrief({ variant = 'inline', className = '', title = 'CLAWPOINT SECURITY BRIEF', hideLabel = false }: DownloadBriefProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Tactical grid background */}
        <div className="absolute inset-0 tactical-grid opacity-5" />

        <div className="relative z-10 border border-[var(--tactical-green-dark)] bg-black/80 backdrop-blur-sm p-8 hover:border-[var(--night-vision)] transition-all duration-300 group">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side - Text content */}
            <div className="flex-1 text-center md:text-left">
              {!hideLabel && (
                <div className="inline-block border border-[var(--night-vision)] px-3 py-1 mb-4 font-mono text-xs text-[var(--night-vision)] bg-black/50">
                  <span className="inline-block w-1.5 h-1.5 bg-[var(--night-vision)] rounded-full mr-2 eye-glow" />
                  SECURITY OVERVIEW
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2 font-mono tracking-wider">
                {title}
              </h3>
              <p className="text-gray-400 font-mono text-sm">
                View our comprehensive security overview and capabilities brief
              </p>
            </div>

            {/* Right side - Download button */}
            <div>
              <a
                href="https://certifications.sba.gov/bucket/documents/100656_entity_id/QMGUKY66AD53_capability_statement_02232026_U9sg.pdf?Expires=1772912626&Signature=kecbme3WVNhECKK9QviDVRsXouk~XpBhUMQBtJSkRWbxX-mfLJYiguSYKM0-Ayr0HNiaOYQ6Vm297T6uBEdw8K~Kqdj9OhwxXJTNNLQx-UrfRiJpVlpMXkVNXOkW1EUCRwwpxNguqrpIuXw7zW6g2iuvkhKEYTvX2hi8Demeub-7Y4OKqAudhmiKc4HGARgLS7d7yA4UHkrEMCUbA-h6cMHmDU5yxfmkZh~DJuCiCm9rjuB3BunikRNHbdaCVzN8Vffku-4DGv4M~k8uE4zj6n7dc26uJeENaXrTf2CPvcJy950hURl1ud1zYcKzW3b-hY1kABWqFgmEcqLc1wyT3Q__&Key-Pair-Id=K1PLRK6QK6OJKS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Scan line effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/20 to-transparent transition-transform duration-700 ${
                    isHovered ? 'translate-x-full' : '-translate-x-full'
                  }`}
                />

                <svg
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span className="relative z-10">VIEW BRIEF</span>

                {/* Tactical corners */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Inline variant - compact button
  return (
    <a
      href="https://certifications.sba.gov/bucket/documents/100656_entity_id/QMGUKY66AD53_capability_statement_02232026_U9sg.pdf?Expires=1772912626&Signature=kecbme3WVNhECKK9QviDVRsXouk~XpBhUMQBtJSkRWbxX-mfLJYiguSYKM0-Ayr0HNiaOYQ6Vm297T6uBEdw8K~Kqdj9OhwxXJTNNLQx-UrfRiJpVlpMXkVNXOkW1EUCRwwpxNguqrpIuXw7zW6g2iuvkhKEYTvX2hi8Demeub-7Y4OKqAudhmiKc4HGARgLS7d7yA4UHkrEMCUbA-h6cMHmDU5yxfmkZh~DJuCiCm9rjuB3BunikRNHbdaCVzN8Vffku-4DGv4M~k8uE4zj6n7dc26uJeENaXrTf2CPvcJy950hURl1ud1zYcKzW3b-hY1kABWqFgmEcqLc1wyT3Q__&Key-Pair-Id=K1PLRK6QK6OJKS"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300 relative overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scan line effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/20 to-transparent transition-transform duration-700 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}
      />

      <svg
        className="w-4 h-4 relative z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      <span className="relative z-10">VIEW BRIEF</span>

      {/* Tactical corners */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}
