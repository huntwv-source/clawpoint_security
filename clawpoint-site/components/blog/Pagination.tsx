'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-8 pt-10">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="font-mono text-xs text-white hover:text-[var(--night-vision)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors tracking-widest"
      >
        ← PREV
      </button>
      <span className="font-mono text-xs text-[var(--night-vision)] tracking-widest">
        PAGE {currentPage} OF {totalPages}
      </span>
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="font-mono text-xs text-white hover:text-[var(--night-vision)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors tracking-widest"
      >
        NEXT →
      </button>
    </div>
  )
}
