import Link from 'next/link'

export default function CategoryBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/blog/category/${slug}`}
      className="inline-block px-2 py-0.5 border border-[var(--tactical-green)] text-[var(--night-vision)] font-mono text-xs tracking-wider hover:bg-[var(--tactical-green-dark)] transition-all duration-200"
    >
      {name.toUpperCase()}
    </Link>
  )
}
