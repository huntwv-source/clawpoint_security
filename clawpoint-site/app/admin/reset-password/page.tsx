'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('PASSWORDS DO NOT MATCH')
      return
    }
    if (password.length < 8) {
      setError('PASSWORD MUST BE AT LEAST 8 CHARACTERS')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message.toUpperCase())
      setLoading(false)
    } else {
      router.push('/admin/blog')
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4 relative">
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="credential-shine border border-[var(--tactical-green)] bg-black/80 p-8 stalk-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[var(--tactical-green)]" />
            <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">NEW CREDENTIALS</span>
          </div>
          <h1 className="text-lg font-bold text-white font-mono tracking-wider mb-6">SET NEW PASSWORD</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[var(--night-vision)] font-mono text-xs tracking-widest mb-2">NEW PASSWORD</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-transparent border-b border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 pr-10 outline-none transition-colors"
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

            <div>
              <label className="block text-[var(--night-vision)] font-mono text-xs tracking-widest mb-2">CONFIRM PASSWORD</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-transparent border-b border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 pr-10 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-0 bottom-2 text-gray-400 hover:text-[var(--night-vision)] transition-colors duration-200 font-mono text-xs tracking-wider"
                >
                  {showConfirm ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 font-mono text-xs tracking-wider">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all disabled:opacity-50"
            >
              {loading ? 'SAVING...' : 'SET PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
