import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { slugify } from '@/lib/slugify'
import { generateExcerpt } from '@/lib/excerpt'
import DOMPurify from 'isomorphic-dompurify'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const q = searchParams.get('q')
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('posts')
      .select(
        'id, title, slug, excerpt, hero_image_url, published, created_at, updated_at, author_id, category_id, categories(id, name, slug)',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') {
        query = query.or(`author_id.eq.${user.id},published.eq.true`)
      }
      // Admin: no filter — sees everything
    } else {
      query = query.eq('published', true)
    }

    if (category) {
      const { data: cat } = await supabaseAdmin.from('categories').select('id').eq('slug', category).single()
      if (cat) query = query.eq('category_id', cat.id)
    }

    if (tag) {
      const { data: tagData } = await supabaseAdmin.from('tags').select('id').eq('slug', tag).single()
      if (tagData) {
        const { data: postIds } = await supabaseAdmin.from('post_tags').select('post_id').eq('tag_id', tagData.id)
        const ids = postIds?.map(r => r.post_id) ?? []
        query = query.in('id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])
      }
    }

    if (q) {
      query = query.ilike('title', `%${q}%`)
    }

    const { data, error, count } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ posts: data, total: count, page, limit })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, body: rawBody, excerpt, hero_image_url, category_id, published, seo_title, seo_description, tag_ids } = body

    if (!title || !rawBody) return NextResponse.json({ error: 'Title and body required' }, { status: 400 })

    const cleanBody = DOMPurify.sanitize(rawBody)
    const finalExcerpt = excerpt || generateExcerpt(cleanBody)
    const slug = slugify(title)

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title,
        slug,
        body: cleanBody,
        excerpt: finalExcerpt,
        hero_image_url: hero_image_url || null,
        category_id: category_id || null,
        published: published ?? false,
        seo_title: seo_title || null,
        seo_description: seo_description || null,
        author_id: user.id,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (tag_ids?.length) {
      await supabaseAdmin
        .from('post_tags')
        .insert(tag_ids.map((tag_id: string) => ({ post_id: post.id, tag_id })))
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
