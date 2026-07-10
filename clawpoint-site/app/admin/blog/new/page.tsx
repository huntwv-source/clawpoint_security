import Link from 'next/link'
import PostForm from '@/components/admin/PostForm'

export default function NewPostPage() {
  return (
    <div className="bg-black min-h-screen relative">
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">NEW INTEL</span>
            </div>
            <h1 className="heading-h2 text-white">WRITE POST</h1>
          </div>
          <Link href="/admin/blog" className="text-gray-500 font-mono text-xs hover:text-[var(--night-vision)] transition-colors tracking-wider">
            ← BACK
          </Link>
        </div>

        <PostForm />
      </div>
    </div>
  )
}
