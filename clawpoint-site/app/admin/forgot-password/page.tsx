'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/admin/reset-password`,
    })
    // Always show success — don't reveal whether email exists
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4 relative">
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="credential-shine border border-[var(--tactical-green)] bg-black/80 p-8 stalk-in">
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-[var(--night-vision)] font-mono text-sm tracking-wider">TRANSMISSION SENT</p>
              <p className="text-gray-400 font-mono text-xs leading-relaxed">
                If that email exists in the system, a reset link is on its way. Check your inbox.
              </p>
              <Link href="/admin/login" className="block text-gray-300 font-mono text-xs hover:text-[var(--night-vision)] transition-colors tracking-wider mt-4">
                ← BACK TO LOGIN
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-px bg-[var(--tactical-green)]" />
                  <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">RESET ACCESS</span>
                </div>
                <h1 className="text-lg font-bold text-white font-mono tracking-wider mb-1">FORGOT PASSWORD</h1>
                <p className="text-gray-300 font-mono text-xs">Enter your email to receive a reset link.</p>
              </div>

              <div>
                <label className="block text-[var(--night-vision)] font-mono text-xs tracking-widest mb-2">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-[var(--tactical-green)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all disabled:opacity-50"
              >
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
              </button>

              <div className="text-center">
                <Link href="/admin/login" className="text-gray-400 font-mono text-xs hover:text-[var(--night-vision)] transition-colors tracking-wider">
                  ← BACK TO LOGIN
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
