'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Navigation from './Navigation'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/auth')

  // Redirect to /admin/signup if invite token found in URL hash
  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const type = params.get('type')
    const accessToken = params.get('access_token')

    if (type === 'invite' && accessToken) {
      router.push(`/admin/signup${window.location.hash}`)
    }
  }, [router])

  return (
    <>
      {!isAdmin && <Navigation />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}
