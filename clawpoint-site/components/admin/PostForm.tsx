'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import AttachmentUploader, { PendingFile } from './AttachmentUploader'

const Editor = dynamic(() => import('./Editor'), { ssr: false })

interface Category { id: string; name: string }
interface Tag { id: string; name: string }

interface PostData {
  id?: string
  title?: string
  body?: string
  excerpt?: string
  hero_image_url?: string
  category_id?: string
  published?: boolean
  seo_title?: string
  seo_description?: string
  tag_ids?: string[]
}

const LABEL = 'block text-[var(--night-vision)] font-mono text-xs tracking-widest mb-2'
const INPUT = 'w-full bg-transparent border-b border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 outline-none transition-colors duration-300 placeholder:text-white/30'

export default function PostForm({ initialData }: { initialData?: PostData }) {
  const isEdit = !!initialData?.id
  const router = useRouter()

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [body, setBody] = useState(initialData?.body ?? '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [heroImageUrl, setHeroImageUrl] = useState(initialData?.hero_image_url ?? '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? '')
  const [published, setPublished] = useState(initialData?.published ?? false)
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description ?? '')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tag_ids ?? [])

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories ?? []))
    fetch('/api/tags').then(r => r.json()).then(d => setTags(d.tags ?? []))
  }, [])

  const uploadHeroImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/images/upload', { method: 'POST', body: formData })
    const { url } = await res.json()
    return url ?? ''
  }

  const handleBodyChange = useCallback((html: string) => setBody(html), [])

  const handleSubmit = async (publishNow: boolean) => {
    if (!title.trim()) { setStatus('HEADLINE IS REQUIRED'); return }
    if (!body.trim() || body === '<p></p>') { setStatus('BODY IS REQUIRED'); return }

    setSaving(true)
    setStatus(isEdit ? 'SAVING...' : 'CREATING POST...')

    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit ? `/api/posts/${initialData!.id}` : '/api/posts'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        body,
        excerpt: excerpt || undefined,
        hero_image_url: heroImageUrl || undefined,
        category_id: categoryId || undefined,
        published: publishNow,
        seo_title: seoTitle || undefined,
        seo_description: seoDescription || undefined,
        tag_ids: selectedTagIds,
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      setStatus(`ERROR: ${json.error}`)
      setSaving(false)
      return
    }

    const postId = isEdit ? initialData!.id! : json.post.id

    if (pendingFiles.length) {
      setStatus('UPLOADING ATTACHMENTS...')
      for (const { file } of pendingFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('postId', postId)
        await fetch('/api/attachments', { method: 'POST', body: formData })
      }
    }

    router.push('/admin/blog')
    router.refresh()
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  return (
    <div className="space-y-8">

      {/* Title */}
      <div>
        <label className={LABEL}>HEADLINE *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={INPUT}
          placeholder="Post title..."
        />
      </div>

      {/* Category + Tags */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={LABEL}>CATEGORY</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full bg-black border border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 px-3 outline-none transition-colors"
          >
            <option value="">— Select category —</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL}>TAGS</label>
          {tags.length === 0 ? (
            <p className="text-white/60 font-mono text-xs">No tags yet — create some in Supabase or they&apos;ll appear after first use.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-2 py-1 font-mono text-xs border transition-all duration-200 ${
                    selectedTagIds.includes(tag.id)
                      ? 'border-[var(--night-vision)] text-[var(--night-vision)]'
                      : 'border-[var(--tactical-green)] text-gray-400 hover:border-[var(--night-vision)]'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero image */}
      <div>
        <label className={LABEL}>HERO IMAGE (optional)</label>
        <input
          type="file"
          accept="image/*"
          className="text-white/60 font-mono text-xs file:mr-3 file:py-1 file:px-3 file:border file:border-[var(--tactical-green)] file:bg-black file:text-gray-400 file:font-mono file:text-xs file:cursor-pointer"
          onChange={async e => {
            const file = e.target.files?.[0]
            if (file) {
              setStatus('UPLOADING HERO IMAGE...')
              const url = await uploadHeroImage(file)
              setHeroImageUrl(url)
              setStatus('')
            }
          }}
        />
        {heroImageUrl && (
          <p className="mt-2 text-[var(--night-vision)] font-mono text-xs truncate">✓ {heroImageUrl}</p>
        )}
      </div>

      {/* Body editor */}
      <div>
        <label className={LABEL}>BODY *</label>
        <Editor content={body} onChange={handleBodyChange} />
      </div>

      {/* Excerpt */}
      <div>
        <label className={LABEL}>EXCERPT <span className="text-gray-600 normal-case tracking-normal">(optional — auto-generated if blank)</span></label>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={3}
          placeholder="Short summary shown on the blog list page..."
          className="w-full bg-transparent border border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm p-3 outline-none transition-colors resize-none placeholder:text-white/30"
        />
      </div>

      {/* SEO fields */}
      <div className="border border-[var(--tactical-green)] p-6 space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-8 h-px bg-[var(--tactical-green)]" />
          <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">SEO OVERRIDE</span>
        </div>
        <div>
          <label className={LABEL}>SEO TITLE <span className="text-gray-600 normal-case tracking-normal">(falls back to headline)</span></label>
          <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>SEO DESCRIPTION <span className="text-gray-600 normal-case tracking-normal">(falls back to excerpt)</span></label>
          <textarea
            value={seoDescription}
            onChange={e => setSeoDescription(e.target.value)}
            rows={2}
            className="w-full bg-transparent border border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm p-3 outline-none transition-colors resize-none"
          />
        </div>
      </div>

      {/* Attachments */}
      <div>
        <label className={LABEL}>ATTACHMENTS</label>
        <AttachmentUploader pendingFiles={pendingFiles} onPendingFilesChange={setPendingFiles} />
      </div>

      {/* Status */}
      {status && (
        <p className={`font-mono text-xs tracking-wider ${status.startsWith('ERROR') ? 'text-red-400' : 'text-[var(--night-vision)]'}`}>
          {status}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--tactical-green)]">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSubmit(false)}
          className="px-6 py-3 border border-[var(--tactical-green)] text-gray-400 font-mono text-sm hover:border-[var(--night-vision)] hover:text-white transition-all duration-300 disabled:opacity-50"
        >
          SAVE DRAFT
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSubmit(true)}
          className="px-8 py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">{saving ? status || 'SAVING...' : 'PUBLISH'}</span>
        </button>
      </div>
    </div>
  )
}
