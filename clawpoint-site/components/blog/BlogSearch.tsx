'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function BlogSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (q) params.set('q', q)
    else params.delete('q')
    params.delete('page')
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="SEARCH INTEL..."
        className="flex-1 bg-black border border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm px-4 py-2 outline-none transition-colors placeholder:text-white/30"
      />
      <button
        type="submit"
        className="px-4 py-2 border border-[var(--tactical-green)] hover:border-[var(--night-vision)] hover:bg-[var(--tactical-green-dark)] text-white font-mono text-xs tracking-wider transition-all duration-200"
      >
        SEARCH
      </button>
    </form>
  )
}
