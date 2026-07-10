'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('AUTHENTICATION FAILED — check your credentials')
      setLoading(false)
    } else {
      router.push('/admin/blog')
      router.refresh()
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4 relative">
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center stalk-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-[var(--tactical-green)]" />
            <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">SYSTEM ACCESS</span>
            <div className="w-12 h-px bg-[var(--tactical-green)]" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-wider">AUTHENTICATION</h1>
          <p className="text-gray-300 font-mono text-xs mt-2 tracking-wider">CLAWPOINT SECURITY COLLECTIVE</p>
        </div>

        {/* Card */}
        <div className="credential-shine border border-[var(--tactical-green)] bg-black/80 p-8 stalk-in" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--night-vision)]/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--night-vision)]/40" />

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[var(--night-vision)] font-mono text-xs tracking-widest mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-transparent border-b border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 outline-none transition-colors duration-300 placeholder:text-white/30"
                placeholder="operator@clawpoint.security"
              />
            </div>

            <div>
              <label className="block text-[var(--night-vision)] font-mono text-xs tracking-widest mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent border-b border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 pr-10 outline-none transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-0 bottom-2 text-gray-400 hover:text-[var(--night-vision)] transition-colors duration-200 font-mono text-xs tracking-wider"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 font-mono text-xs tracking-wider">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">{loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/admin/forgot-password"
              className="text-gray-400 font-mono text-xs hover:text-[var(--night-vision)] transition-colors duration-300 tracking-wider"
            >
              FORGOT PASSWORD
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
