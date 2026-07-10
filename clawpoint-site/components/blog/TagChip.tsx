import Link from 'next/link'

export default function TagChip({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/blog/tag/${slug}`}
      className="inline-block text-white/70 font-mono text-xs hover:text-[var(--night-vision)] transition-colors duration-200"
    >
      #{name}
    </Link>
  )
}
