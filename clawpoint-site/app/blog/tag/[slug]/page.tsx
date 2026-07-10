import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/blog/PostCard'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: tag } = await supabase.from('tags').select('name').eq('slug', slug).single()
  if (!tag) return { title: 'Not Found' }
  return {
    title: `#${tag.name} | Intel | Clawpoint Security Collective`,
    description: `Browse all articles tagged ${tag.name} from Clawpoint Security Collective.`,
  }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: tag } = await supabase.from('tags').select('*').eq('slug', slug).single()
  if (!tag) notFound()

  const { data: ptRows } = await supabase
    .from('post_tags')
    .select('post_id')
    .eq('tag_id', tag.id)

  const postIds = ptRows?.map(r => r.post_id) ?? []

  let posts: any[] = []
  if (postIds.length) {
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, created_at, categories(name, slug), post_tags(tags(name, slug))')
      .eq('published', true)
      .in('id', postIds)
      .order('created_at', { ascending: false })
    posts = data ?? []
  }

  return (
    <div className="bg-black min-h-screen pt-24 relative">
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 py-12">
        <Link
          href="/blog"
          className="inline-block text-white font-mono text-xs hover:text-[var(--night-vision)] transition-colors mb-8 tracking-wider"
        >
          ← ALL INTEL
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[var(--tactical-green)]" />
          <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">TAG</span>
        </div>
        <h1 className="heading-h2 text-white mb-8">#{tag.name}</h1>

        {!posts.length ? (
          <div className="border border-[var(--tactical-green)] p-12 text-center">
            <p className="text-white font-mono text-sm tracking-wider">NO INTEL WITH THIS TAG</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post as any} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
