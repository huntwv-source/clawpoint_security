import { MetadataRoute } from 'next'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const SITE_URL = 'https://clawpoint.security'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [{ data: posts }, { data: categories }, { data: tags }] = await Promise.all([
    supabase.from('posts').select('slug, updated_at').eq('published', true),
    supabase.from('categories').select('slug'),
    supabase.from('tags').select('slug'),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/solutions`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/infinite-view`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), priority: 0.8 },
  ]

  return [
    ...staticPages,
    ...(posts ?? []).map(p => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      priority: 0.8,
    })),
    ...(categories ?? []).map(c => ({
      url: `${SITE_URL}/blog/category/${c.slug}`,
      lastModified: new Date(),
      priority: 0.5,
    })),
    ...(tags ?? []).map(t => ({
      url: `${SITE_URL}/blog/tag/${t.slug}`,
      lastModified: new Date(),
      priority: 0.4,
    })),
  ]
}
