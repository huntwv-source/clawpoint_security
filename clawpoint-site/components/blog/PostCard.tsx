'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CategoryBadge from './CategoryBadge'
import TagChip from './TagChip'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  created_at: string
  categories: { name: string; slug: string } | null
  post_tags: { tags: { name: string; slug: string } }[]
}

export default function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const router = useRouter()

  const date = new Date(post.created_at)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase()

  return (
    <article
      onClick={() => router.push(`/blog/${post.slug}`)}
      className="border border-[var(--tactical-green-dark)] bg-black/40 p-6 hover:border-[var(--night-vision)] transition-all duration-500 stalk-in group cursor-pointer"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="text-white/70 font-mono text-xs tracking-widest">{date}</span>
        {post.categories && (
          <span onClick={e => e.stopPropagation()}>
            <CategoryBadge name={post.categories.name} slug={post.categories.slug} />
          </span>
        )}
      </div>

      <h2 className="heading-h3 text-white mb-3 group-hover:text-[var(--night-vision)] transition-colors duration-300">
        {post.title}
      </h2>

      {post.excerpt && (
        <p className="text-white/80 font-mono text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
          {post.post_tags?.map(pt => (
            <TagChip key={pt.tags.slug} name={pt.tags.name} slug={pt.tags.slug} />
          ))}
        </div>
        <span className="text-[var(--night-vision)] font-mono text-xs tracking-wider shrink-0">
          READ INTEL →
        </span>
      </div>
    </article>
  )
}
