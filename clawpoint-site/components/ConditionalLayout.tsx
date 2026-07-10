'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/auth')

  return (
    <>
      {!isAdmin && <Navigation />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}
