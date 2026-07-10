import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/blog/PostCard'
import BlogSearch from '@/components/blog/BlogSearch'
import Pagination from '@/components/blog/Pagination'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Intel | Clawpoint Security Collective',
  description: 'Threat intelligence, cybersecurity strategy, and mission-critical insights from Clawpoint Security Collective.',
}

const LIMIT = 10

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>
}) {
  const { page: pageParam, category, tag, q } = await searchParams
  const page = parseInt(pageParam ?? '1')
  const offset = (page - 1) * LIMIT

  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('id, title, slug, excerpt, created_at, categories(name, slug), post_tags(tags(name, slug))', { count: 'exact' })
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + LIMIT - 1)

  if (category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (tag) {
    const { data: tagData } = await supabase.from('tags').select('id').eq('slug', tag).single()
    if (tagData) {
      const { data: ptRows } = await supabase.from('post_tags').select('post_id').eq('tag_id', tagData.id)
      const ids = ptRows?.map(r => r.post_id) ?? []
      query = query.in('id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])
    }
  }

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: posts, count } = await query
  const totalPages = Math.ceil((count ?? 0) / LIMIT)

  const { data: categories } = await supabase.from('categories').select('name, slug').order('name')

  return (
    <div className="bg-black min-h-screen pt-24 relative">
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 py-12">

        {/* Header */}
        <div className="mb-10 emerge-from-forest">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-[var(--tactical-green)]" />
            <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">INTELLIGENCE FEED</span>
          </div>
          <h1 className="heading-h2 text-white mb-2">INTEL</h1>
          <p className="text-white font-mono text-sm">Threat intelligence, strategy, and mission insights from Clawpoint Security Collective.</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <BlogSearch />
          </Suspense>
        </div>

        {/* Category filters */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <a
              href="/blog"
              className={`px-3 py-1 font-mono text-xs border transition-all duration-200 ${
                !category
                  ? 'border-[var(--night-vision)] text-[var(--night-vision)]'
                  : 'border-[var(--tactical-green)] text-white hover:border-[var(--night-vision)] hover:text-[var(--night-vision)]'
              }`}
            >
              ALL
            </a>
            {categories.map(cat => (
              <a
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className={`px-3 py-1 font-mono text-xs border transition-all duration-200 ${
                  category === cat.slug
                    ? 'border-[var(--night-vision)] text-[var(--night-vision)]'
                    : 'border-[var(--tactical-green)] text-white hover:border-[var(--night-vision)] hover:text-[var(--night-vision)]'
                }`}
              >
                {cat.name.toUpperCase()}
              </a>
            ))}
          </div>
        )}

        {/* Post list */}
        {!posts?.length ? (
          <div className="border border-[var(--tactical-green)] p-12 text-center">
            <p className="text-white font-mono text-sm tracking-wider">NO INTEL PUBLISHED</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post as any} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Suspense fallback={null}>
          <Pagination currentPage={page} totalPages={totalPages} />
        </Suspense>

      </div>
    </div>
  )
}
