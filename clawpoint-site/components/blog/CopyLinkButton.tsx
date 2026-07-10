'use client'

import { useState } from 'react'

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--tactical-green)] hover:border-[var(--night-vision)] text-white hover:text-[var(--night-vision)] font-mono text-xs tracking-wider transition-all duration-300"
    >
      {copied ? '✓ LINK COPIED' : '⎘ COPY LINK'}
    </button>
  )
}
