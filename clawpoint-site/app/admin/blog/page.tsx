'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import DeleteConfirm from '@/components/admin/DeleteConfirm'

interface Post {
  id: string
  title: string
  published: boolean
  created_at: string
  categories: { name: string } | null
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/admin/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setIsAdmin(profile?.role === 'admin')

      const res = await fetch('/api/posts?limit=200')
      const json = await res.json()
      setPosts(json.posts ?? [])
      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleDelete = async (post: Post) => {
    setDeleting(true)
    await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
    setPosts(prev => prev.filter(p => p.id !== post.id))
    setConfirmDelete(null)
    setDeleting(false)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })

  return (
    <div className="bg-black min-h-screen relative">
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">INTEL MANAGEMENT</span>
            </div>
            <h1 className="heading-h2 text-white">CMS DASHBOARD</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/blog/new"
              className="px-6 py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300"
            >
              + NEW POST
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-3 border border-[var(--tactical-green)] text-white font-mono text-sm hover:border-[var(--night-vision)] hover:text-white transition-all duration-300"
            >
              LOG OUT
            </button>
          </div>
        </div>

        {/* Posts list */}
        {loading ? (
          <div className="text-gray-300 font-mono text-sm tracking-wider">LOADING INTEL...</div>
        ) : posts.length === 0 ? (
          <div className="border border-[var(--tactical-green)] p-12 text-center">
            <p className="text-gray-300 font-mono text-sm tracking-wider">NO INTEL PUBLISHED YET</p>
            <Link href="/admin/blog/new" className="inline-block mt-4 text-[var(--night-vision)] font-mono text-xs hover:underline">
              Write your first post →
            </Link>
          </div>
        ) : (
          <div className="border border-[var(--tactical-green)] divide-y divide-[var(--tactical-green-dark)]">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_160px_80px_100px_100px] gap-4 px-4 py-3 bg-black/60">
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">TITLE</span>
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">CATEGORY</span>
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">STATUS</span>
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">DATE</span>
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">ACTIONS</span>
            </div>

            {posts.map(post => (
              <div key={post.id}>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px_80px_100px_100px] gap-2 sm:gap-4 px-4 py-4 hover:bg-black/40 transition-colors">
                  <span className="text-white font-mono text-sm truncate">{post.title}</span>
                  <span className="text-gray-400 font-mono text-xs truncate hidden sm:block">{post.categories?.name ?? '—'}</span>
                  <span className={`font-mono text-xs font-bold ${post.published ? 'text-[var(--night-vision)]' : 'text-gray-500'}`}>
                    {post.published ? '● LIVE' : '○ DRAFT'}
                  </span>
                  <span className="text-white/60 font-mono text-xs">{formatDate(post.created_at)}</span>
                  <div className="flex gap-4">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-[var(--tactical-green-light)] font-mono text-xs hover:text-[var(--night-vision)] transition-colors"
                    >
                      EDIT
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => setConfirmDelete(post)}
                        className="text-red-400 font-mono text-xs hover:text-red-300 transition-colors"
                      >
                        DELETE
                      </button>
                    )}
                  </div>
                </div>

                {confirmDelete?.id === post.id && (
                  <DeleteConfirm
                    postTitle={post.title}
                    onConfirm={() => handleDelete(post)}
                    onCancel={() => setConfirmDelete(null)}
                    isDeleting={deleting}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
