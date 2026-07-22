'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [tokenError, setTokenError] = useState('')
  const router = useRouter()

  // Parse URL hash and verify invite token on mount
  useEffect(() => {
    const verifyInvite = async () => {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      const type = params.get('type')
      const email = params.get('email')

      if (!accessToken || type !== 'invite') {
        setTokenError('No valid invitation found.')
        return
      }

      if (!email) {
        setTokenError('Invalid invitation: email not found.')
        return
      }

      const supabase = createClient()

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: accessToken,
          type: 'invite',
        })

        if (error) {
          setTokenError('Invalid or expired invitation. Please request a new invite.')
          return
        }

        if (data?.user?.email) {
          setUserEmail(data.user.email)
          setIsValidToken(true)
        }
      } catch {
        setTokenError('Failed to verify invitation. Please try again.')
      }
    }

    verifyInvite()
  }, [])

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

  // Show error state if no valid token
  if (tokenError) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4 relative">
        <div className="tactical-grid absolute inset-0 opacity-5" />
        <div className="relative z-10 w-full max-w-sm">
          <div className="credential-shine border border-[var(--tactical-green)] bg-black/80 p-8 stalk-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">INVITATION ERROR</span>
            </div>
            <p className="text-red-400 font-mono text-sm mb-6">{tokenError}</p>
            <Link
              href="/admin/login"
              className="inline-block w-full text-center py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300"
            >
              GO TO LOGIN
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while verifying token
  if (!isValidToken) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4 relative">
        <div className="tactical-grid absolute inset-0 opacity-5" />
        <div className="relative z-10 w-full max-w-sm">
          <div className="credential-shine border border-[var(--tactical-green)] bg-black/80 p-8 stalk-in">
            <p className="text-white font-mono text-sm">VERIFYING INVITATION...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show sign-up form
  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4 relative">
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="credential-shine border border-[var(--tactical-green)] bg-black/80 p-8 stalk-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[var(--tactical-green)]" />
            <span className="text-[var(--night-vision)] font-mono text-xs tracking-widest">USER REGISTRATION</span>
          </div>
          <h1 className="text-lg font-bold text-white font-mono tracking-wider mb-2">COMPLETE SIGNUP</h1>
          <p className="text-gray-300 font-mono text-xs mb-6">Set your password to activate your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[var(--night-vision)] font-mono text-xs tracking-widest mb-2">
                EMAIL
              </label>
              <p className="text-white font-mono text-sm py-2">{userEmail}</p>
            </div>

            <div>
              <label className="block text-[var(--night-vision)] font-mono text-xs tracking-widest mb-2">
                NEW PASSWORD
              </label>
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
              <label className="block text-[var(--night-vision)] font-mono text-xs tracking-widest mb-2">
                CONFIRM PASSWORD
              </label>
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
              {loading ? 'COMPLETING SIGNUP...' : 'ACTIVATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="text-gray-400 font-mono text-xs hover:text-[var(--night-vision)] transition-colors duration-300 tracking-wider"
            >
              ALREADY HAVE AN ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
