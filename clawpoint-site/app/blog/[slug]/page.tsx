import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PostBody from '@/components/blog/PostBody'
import CategoryBadge from '@/components/blog/CategoryBadge'
import TagChip from '@/components/blog/TagChip'
import CopyLinkButton from '@/components/blog/CopyLinkButton'
import PostCard from '@/components/blog/PostCard'

export const revalidate = 60

export async function generateStaticParams() {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.from('posts').select('slug').eq('published', true)
  return data?.map(p => ({ slug: p.slug })) ?? []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, seo_title, seo_description, excerpt, hero_image_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Not Found' }

  const title = post.seo_title || post.title
  const description = post.seo_description || post.excerpt || ''
  const image = post.hero_image_url || 'https://clawpoint.security/images/logo.png'

  return {
    title: `${title} | Clawpoint Security Collective`,
    description,
    openGraph: { title, description, images: [image], type: 'article' },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, categories(name, slug), post_tags(tags(name, slug)), attachments(*)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  // Related posts — same category, exclude current
  let related: any[] = []
  if (post.category_id) {
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, created_at, categories(name, slug), post_tags(tags(name, slug))')
      .eq('published', true)
      .eq('category_id', post.category_id)
      .neq('id', post.id)
      .limit(3)
    related = data ?? []
  }

  const date = new Date(post.created_at)
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seo_title || post.title,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Clawpoint Security Collective',
      url: 'https://clawpoint.security',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Clawpoint Security Collective',
      logo: { '@type': 'ImageObject', url: 'https://clawpoint.security/images/logo.png' },
    },
    description: post.seo_description || post.excerpt || '',
    image: post.hero_image_url || 'https://clawpoint.security/images/logo.png',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://clawpoint.security/blog/${post.slug}`,
    },
  }

  return (
    <div className="bg-black min-h-screen pt-24 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 py-12">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-white font-mono text-xs hover:text-[var(--night-vision)] transition-colors mb-8 tracking-wider"
        >
          ← RETURN TO INTEL
        </Link>

        {/* Hero image */}
        {post.hero_image_url && (
          <div className="relative w-full h-64 sm:h-80 mb-8 overflow-hidden">
            <Image
              src={post.hero_image_url}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        )}

        {/* Header */}
        <div className="mb-8 emerge-from-forest">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-[var(--tactical-green)]" />
            <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">
              {post.categories?.name?.toUpperCase() ?? 'INTEL'} // {date}
            </span>
          </div>
          <h1 className="heading-h2 text-white mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.categories && (
              <CategoryBadge name={post.categories.name} slug={post.categories.slug} />
            )}
            {post.post_tags?.map((pt: any) => (
              <TagChip key={pt.tags.slug} name={pt.tags.name} slug={pt.tags.slug} />
            ))}
          </div>
          <CopyLinkButton />
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--tactical-green-dark)] mb-8" />

        {/* Body */}
        <PostBody html={post.body} />

        {/* Attachments */}
        {post.attachments?.length > 0 && (
          <div className="mt-10 border-t border-[var(--tactical-green-dark)] pt-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">ATTACHMENTS</span>
            </div>
            <div className="space-y-2">
              {post.attachments.map((att: any) => (
                <a
                  key={att.id}
                  href={att.file_url}
                  download={att.file_name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 border border-[var(--tactical-green)] hover:border-[var(--night-vision)] transition-all duration-200 group"
                >
                  <span className="text-white font-mono text-sm group-hover:text-[var(--night-vision)] transition-colors truncate">
                    {att.file_name}
                  </span>
                  <div className="flex items-center gap-3 text-white font-mono text-xs shrink-0">
                    {att.file_size && <span>{(att.file_size / 1024).toFixed(0)} KB</span>}
                    <span>↓ DOWNLOAD</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-[var(--tactical-green-dark)] pt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">RELATED INTEL</span>
            </div>
            <div className="space-y-4">
              {related.map((p, i) => (
                <PostCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
