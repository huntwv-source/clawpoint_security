import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateRss } from '@/lib/rss'

export async function GET() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, excerpt, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  const rss = generateRss(posts ?? [], 'https://clawpoint.security')

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
