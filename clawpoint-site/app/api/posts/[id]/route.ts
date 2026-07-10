import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateExcerpt } from '@/lib/excerpt'
import DOMPurify from 'isomorphic-dompurify'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*, categories(*), post_tags(tag_id, tags(*)), attachments(*)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ post: data })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'

    if (!isAdmin) {
      const { data: post } = await supabaseAdmin.from('posts').select('author_id').eq('id', id).single()
      if (post?.author_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, body: rawBody, excerpt, hero_image_url, category_id, published, seo_title, seo_description, tag_ids } = body

    const cleanBody = rawBody ? DOMPurify.sanitize(rawBody) : undefined
    const finalExcerpt = excerpt || (cleanBody ? generateExcerpt(cleanBody) : undefined)

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({
        ...(title !== undefined && { title }),
        ...(cleanBody !== undefined && { body: cleanBody }),
        ...(finalExcerpt !== undefined && { excerpt: finalExcerpt }),
        ...(hero_image_url !== undefined && { hero_image_url: hero_image_url || null }),
        ...(category_id !== undefined && { category_id: category_id || null }),
        ...(published !== undefined && { published }),
        ...(seo_title !== undefined && { seo_title: seo_title || null }),
        ...(seo_description !== undefined && { seo_description: seo_description || null }),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (tag_ids !== undefined) {
      await supabaseAdmin.from('post_tags').delete().eq('post_id', id)
      if (tag_ids.length) {
        await supabaseAdmin
          .from('post_tags')
          .insert(tag_ids.map((tag_id: string) => ({ post_id: id, tag_id })))
      }
    }

    return NextResponse.json({ post: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Remove attachment files from Storage before DB delete
    const { data: attachments } = await supabaseAdmin
      .from('attachments')
      .select('file_url')
      .eq('post_id', id)

    if (attachments?.length) {
      const paths = attachments
        .map(a => {
          try {
            return new URL(a.file_url).pathname.split('/object/public/media/')[1]
          } catch {
            return null
          }
        })
        .filter(Boolean) as string[]
      if (paths.length) await supabaseAdmin.storage.from('media').remove(paths)
    }

    const { error } = await supabaseAdmin.from('posts').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
