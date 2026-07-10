import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: attachment } = await supabaseAdmin
      .from('attachments')
      .select('file_url')
      .eq('id', id)
      .single()

    if (!attachment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    try {
      const storagePath = new URL(attachment.file_url).pathname.split('/object/public/media/')[1]
      if (storagePath) await supabaseAdmin.storage.from('media').remove([storagePath])
    } catch {
      // Continue even if storage delete fails
    }

    await supabaseAdmin.from('attachments').delete().eq('id', id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
