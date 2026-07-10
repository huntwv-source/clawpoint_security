import Link from 'next/link'
import { notFound } from 'next/navigation'
import PostForm from '@/components/admin/PostForm'
import { supabaseAdmin } from '@/lib/supabase/admin'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: post, error } = await supabaseAdmin
    .from('posts')
    .select('*, post_tags(tag_id)')
    .eq('id', id)
    .single()

  if (error || !post) notFound()

  const initialData = {
    id: post.id,
    title: post.title,
    body: post.body,
    excerpt: post.excerpt ?? '',
    hero_image_url: post.hero_image_url ?? '',
    category_id: post.category_id ?? '',
    published: post.published,
    seo_title: post.seo_title ?? '',
    seo_description: post.seo_description ?? '',
    tag_ids: post.post_tags?.map((pt: { tag_id: string }) => pt.tag_id) ?? [],
  }

  return (
    <div className="bg-black min-h-screen relative">
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">EDIT INTEL</span>
            </div>
            <h1 className="heading-h2 text-white">EDIT POST</h1>
          </div>
          <Link href="/admin/blog" className="text-gray-400 font-mono text-xs hover:text-[var(--night-vision)] transition-colors tracking-wider">
            ← BACK
          </Link>
        </div>

        <PostForm initialData={initialData} />
      </div>
    </div>
  )
}
