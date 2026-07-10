# Feature: Blog + CMS Full Implementation

Read the PRD at `.agents/prd-blog-feature.md` before starting. Validate every file path and import before writing code.

## Feature Description

A two-surface blog system: a public-facing blog at `/blog` with pagination, category/tag filtering, and per-post pages; and a password-protected CMS at `/admin` where invited users with roles (admin or author) can write, edit, draft, and delete posts using a WYSIWYG editor with image and file attachment support. Full SEO and AI-crawler optimization is included.

## User Stories

- As an admin, I want to log in with email + password so I can manage all blog content
- As an author, I want to write and publish posts in a WYSIWYG editor so I can contribute without knowing HTML
- As a visitor, I want to browse and read posts so I can engage with CSC's content
- As an AI system, I want structured metadata so I can accurately represent CSC's content

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: High  
**Primary Systems Affected**: Routing, Layout, Middleware, API layer, Supabase DB + Storage  
**Dependencies**: `@supabase/supabase-js`, `@supabase/ssr`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `isomorphic-dompurify`

---

## CONTEXT REFERENCES

### Codebase Files — READ BEFORE IMPLEMENTING

- `app/layout.tsx` (lines 98–122) — Root layout renders `<Navigation />` and `<Footer />` directly. Replace with `<ConditionalLayout>`.
- `app/globals.css` (lines 1–32) — CSS custom properties: `--tactical-green`, `--night-vision`, `--tactical-green-dark`, `--tactical-green-light`. Available in Tailwind v4 as `text-night-vision`, `bg-tactical-green`, etc.
- `app/globals.css` (lines 36–74) — Utility classes to reuse: `.heading-h2`, `.heading-h3`, `.body-regular`, `.label-text`, `.stalk-in`, `.emerge-from-forest`, `.tactical-grid`, `.credential-shine`.
- `app/globals.css` (lines 742–769) — `.credential-shine` hover sweep pattern for admin cards.
- `app/about/page.tsx` (lines 83–100) — Full page layout reference: `bg-black relative min-h-screen`, `pt-24` for nav clearance, section label pattern.
- `app/about/page.tsx` (lines 231–243) — Card border pattern: `border-2 border-[var(--tactical-green-dark)] bg-black/60 backdrop-blur-sm hover:border-[var(--night-vision)]`.
- `components/DownloadBrief.tsx` (lines 42–75) — Button pattern with scan-line sweep, tactical corners. Mirror exactly.
- `components/Navigation.tsx` (lines 9–16) — `navigationLinks` array. **Do NOT add blog to this array.**
- `app/api/contact/route.ts` — API route pattern: `NextRequest`/`NextResponse`, try/catch, JSON responses.
- `next.config.ts` — Currently empty config. Must add `images.remotePatterns` for Supabase Storage.
- `tsconfig.json` — `@/*` maps to `./` (project root = `clawpoint-site/`).

### New Files to Create

```
middleware.ts                                    # Supabase Auth guard — project root
app/
  auth/callback/route.ts                         # Supabase email confirmation handler
  sitemap.ts                                     # Auto-generated sitemap
  blog/
    page.tsx                                     # Public post list
    [slug]/page.tsx                              # Individual post
    category/[slug]/page.tsx                     # Category filtered list
    tag/[slug]/page.tsx                          # Tag filtered list
    feed.xml/route.ts                            # RSS 2.0 feed
  admin/
    login/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
    blog/
      page.tsx                                   # CMS dashboard
      new/page.tsx                               # Create post
      [id]/edit/page.tsx                         # Edit post
  api/
    posts/route.ts
    posts/[id]/route.ts
    categories/route.ts
    tags/route.ts
    attachments/route.ts
    attachments/[id]/route.ts
    images/upload/route.ts
components/
  ConditionalLayout.tsx
  blog/
    PostCard.tsx
    PostBody.tsx
    TagChip.tsx
    CategoryBadge.tsx
    CopyLinkButton.tsx
    BlogSearch.tsx
    Pagination.tsx
  admin/
    Editor.tsx
    PostForm.tsx
    AttachmentUploader.tsx
    DeleteConfirm.tsx
lib/
  supabase/
    client.ts                                    # Browser client
    server.ts                                    # Server client
    admin.ts                                     # Service role client
  slugify.ts
  excerpt.ts
  rss.ts
public/
  llms.txt
```

### Relevant Documentation

- [@supabase/ssr Next.js guide](https://supabase.com/docs/guides/auth/server-side/nextjs) — **Read this first.** Exact cookie adapter pattern for middleware and server components.
- [TipTap getting started](https://tiptap.dev/docs/editor/getting-started/install/react) — React setup, extensions, `getHTML()`.
- [TipTap Image extension](https://tiptap.dev/docs/editor/extensions/nodes/image) — `addImage()` command, custom upload handler.
- [Next.js sitemap.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — `MetadataRoute.Sitemap` return type.
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — Dynamic OG tags per post.
- [isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify) — Server-safe HTML sanitization.

---

## PATTERNS TO FOLLOW

### Tailwind v4 Note
Project uses `@import "tailwindcss"` — **no `tailwind.config.js`**. Custom colors registered in `@theme inline` block in `globals.css`. Use either `text-night-vision` (Tailwind token) or `text-[var(--night-vision)]` (CSS var). Match whatever form the file you're editing uses. Opacity modifier: `bg-black/60` not `bg-opacity-60`.

### Button Pattern
```tsx
<button
  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300 relative overflow-hidden group"
>
  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/20 to-transparent transition-transform duration-700 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} />
  <span className="relative z-10">LABEL</span>
  <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
  <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
</button>
```

### Section Label Pattern
```tsx
<div className="flex items-center gap-4 mb-4">
  <div className="w-12 h-px bg-[var(--tactical-green)]" />
  <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">SECTION-01</span>
</div>
```

### API Route Pattern
```ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Role Check in API Routes
```ts
const supabase = await createClient() // from lib/supabase/server.ts
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
const isAdmin = profile?.role === 'admin'
```

---

## STEP-BY-STEP TASKS

---

### TASK 1 — INSTALL dependencies

```bash
cd clawpoint-site
npm install @supabase/supabase-js @supabase/ssr @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder isomorphic-dompurify
npm install --save-dev @types/isomorphic-dompurify
```

- **VALIDATE**: `npm ls @supabase/ssr @tiptap/react isomorphic-dompurify` — all show installed

---

### TASK 2 — UPDATE `next.config.ts`

Add Supabase Storage to allowed image domains:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oafgnmlapaizjvuffljf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
```

- **GOTCHA**: Without this, `<Image>` with Supabase Storage URLs throws a runtime error.
- **VALIDATE**: `npx tsc --noEmit`

---

### TASK 3 — CREATE `lib/supabase/client.ts`

Browser-side Supabase client (used in client components):

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- **VALIDATE**: `npx tsc --noEmit`

---

### TASK 4 — CREATE `lib/supabase/server.ts`

Server-side Supabase client (used in server components and API routes). Reads session from cookies:

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component — cookie setting ignored
          }
        },
      },
    }
  )
}
```

- **GOTCHA**: `cookies()` is async in Next.js 15/16 — always `await` it.
- **VALIDATE**: `npx tsc --noEmit`

---

### TASK 5 — CREATE `lib/supabase/admin.ts`

Service-role client for Storage uploads and admin-only DB operations. **Never import this in client components.**

```ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

- **GOTCHA**: This bypasses ALL RLS. Only import in `app/api/` routes.
- **VALIDATE**: `npx tsc --noEmit`

---

### TASK 6 — CREATE `lib/slugify.ts`

```ts
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}
```

- **VALIDATE**: `npx tsc --noEmit`

---

### TASK 7 — CREATE `lib/excerpt.ts`

Strips TipTap HTML to plain text for excerpts and RSS:

```ts
export function generateExcerpt(html: string, maxLength = 200): string {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}
```

- **VALIDATE**: `npx tsc --noEmit`

---

### TASK 8 — CREATE `lib/rss.ts`

```ts
interface RssPost {
  title: string
  slug: string
  excerpt: string | null
  created_at: string
}

export function generateRss(posts: RssPost[], siteUrl: string): string {
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt ?? ''}]]></description>
    </item>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Clawpoint Security Collective</title>
    <link>${siteUrl}/blog</link>
    <description>Threat intelligence and cybersecurity insights from Clawpoint Security Collective</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
}
```

- **VALIDATE**: `npx tsc --noEmit`

---

### TASK 9 — CREATE `middleware.ts` (project root, next to `app/`)

Guards `/admin/*` routes and refreshes Supabase sessions:

```ts
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'
  const isForgotPage = pathname === '/admin/forgot-password'

  if (isAdminRoute && !isLoginPage && !isForgotPage && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}
```

- **GOTCHA**: `middleware.ts` must be at the project root (same level as `app/`), NOT inside `app/`.
- **GOTCHA**: Always return `supabaseResponse` (not a plain `NextResponse.next()`) so the refreshed session cookies are forwarded.
- **VALIDATE**: `npm run dev` → visit `/admin/blog` → should redirect to `/admin/login`

---

### TASK 10 — CREATE `app/auth/callback/route.ts`

Exchanges Supabase auth code for a session after email confirmation or password reset:

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin/blog'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`)
}
```

- **GOTCHA**: Supabase must have `http://localhost:3000/auth/callback` AND your production URL in Auth → URL Configuration → Redirect URLs. Do this in the Supabase dashboard before testing.
- **VALIDATE**: After setting redirect URLs, use "Forgot password" flow — clicking the email link should land on `/admin/blog` or `/admin/reset-password`

---

### TASK 11 — CREATE `components/ConditionalLayout.tsx`

```tsx
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
```

- **VALIDATE**: Homepage shows nav + footer; `/admin/login` shows neither

---

### TASK 12 — UPDATE `app/layout.tsx`

Replace the direct `<Navigation />` + `<main>` + `<Footer />` block with `<ConditionalLayout>`. Remove the Navigation and Footer imports.

**BEFORE (lines 108–118):**
```tsx
<Navigation />
<main className="min-h-screen">
  {children}
</main>
<Footer />
```

**AFTER:**
```tsx
<ConditionalLayout>{children}</ConditionalLayout>
```

Add at top: `import ConditionalLayout from '@/components/ConditionalLayout'`
Remove: `import Navigation from '@/components/Navigation'` and `import Footer from '@/components/Footer'`

- **PATTERN**: `app/layout.tsx:3–5` for existing import style
- **VALIDATE**: `npm run dev` — homepage renders correctly with nav and footer

---

### TASK 13 — ADD `.blog-body` styles to `app/globals.css`

Add after the closing `}` of the `@layer components` block (after line 74):

```css
/* Blog post body — styles TipTap HTML rendered on public pages */
.blog-body h1 { @apply text-3xl font-bold text-white font-mono mt-8 mb-4; }
.blog-body h2 { @apply text-2xl font-bold text-white font-mono mt-6 mb-3; }
.blog-body h3 { @apply text-xl font-bold text-white font-mono mt-5 mb-2; }
.blog-body p  { @apply text-gray-300 font-mono text-base leading-relaxed mb-4; }
.blog-body a  { @apply text-[var(--night-vision)] hover:underline; }
.blog-body ul { @apply list-disc list-inside text-gray-300 font-mono mb-4 space-y-1 pl-4; }
.blog-body ol { @apply list-decimal list-inside text-gray-300 font-mono mb-4 space-y-1 pl-4; }
.blog-body li { @apply text-gray-300 font-mono text-base; }
.blog-body strong { @apply text-white font-bold; }
.blog-body em { @apply italic text-gray-300; }
.blog-body code { @apply text-[var(--night-vision)] bg-black/60 px-1 py-0.5 text-sm font-mono rounded; }
.blog-body pre  { @apply bg-black/80 border border-[var(--tactical-green-dark)] p-4 overflow-x-auto mb-4 font-mono text-sm; }
.blog-body blockquote { @apply border-l-4 border-[var(--tactical-green)] pl-4 text-gray-400 italic font-mono mb-4; }
.blog-body hr { @apply border-[var(--tactical-green-dark)] my-6; }
.blog-body img { @apply max-w-full h-auto my-4; }
```

- **VALIDATE**: `npm run dev` — no CSS errors in console

---

### TASK 14 — CREATE `public/llms.txt`

```
# Clawpoint Security Collective

> Elite cybersecurity company specializing in mission assurance, threat intelligence, and cyber resilience for government and enterprise clients. SDVOSB certified.

## Blog

The /blog path contains published articles on cybersecurity strategy, threat intelligence, Zero Trust, mission-critical security operations, and company news.

## Pages

- /about — Company background, team, acquisition pathways (NAICS, UEI, CAGE, SDVOSB)
- /solutions — Cybersecurity service offerings
- /infinite-view — Infinite View threat intelligence product
- /contact — Contact and consultation scheduling

## Contact

CSC_growth@clawpointsecuritycollective.com
4833 Berewick Town Center Drive, Unit E, #277, Charlotte, NC 28278
```

- **VALIDATE**: Visit `http://localhost:3000/llms.txt` — file renders as plain text

---

### TASK 15 — SUPABASE DASHBOARD CONFIG (manual step)

In Supabase → Authentication → URL Configuration:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: Add `http://localhost:3000/**` and `https://clawpoint.security/**`

This is required before any email flows (password reset, invite confirmation) work.

---

### TASK 16 — CREATE `app/api/categories/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { slugify } from '@/lib/slugify'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ categories: data })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { name } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({ name, slug: slugify(name) })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ category: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- **VALIDATE**: `npx tsc --noEmit`

---

### TASK 17 — CREATE `app/api/tags/route.ts`

Same pattern as categories. Any authenticated user can create tags (admins and authors need to tag posts):

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { slugify } from '@/lib/slugify'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tags').select('*').order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tags: data })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('tags')
      .insert({ name, slug: slugify(name) })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ tag: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

### TASK 18 — CREATE `app/api/posts/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { slugify } from '@/lib/slugify'
import { generateExcerpt } from '@/lib/excerpt'
import DOMPurify from 'isomorphic-dompurify'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const offset = (page - 1) * limit

    // Admin sees all; author sees own + published; anon sees published only
    let query = supabaseAdmin
      .from('posts')
      .select('id, title, slug, excerpt, hero_image_url, published, created_at, updated_at, author_id, categories(id, name, slug), profiles(full_name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') {
        // Author: own posts only (all statuses) + published posts from others
        query = query.or(`author_id.eq.${user.id},published.eq.true`)
      }
      // Admin: no filter, see everything
    } else {
      query = query.eq('published', true)
    }

    if (category) {
      const { data: cat } = await supabaseAdmin.from('categories').select('id').eq('slug', category).single()
      if (cat) query = query.eq('category_id', cat.id)
    }

    if (tag) {
      const { data: tagData } = await supabaseAdmin.from('tags').select('id').eq('slug', tag).single()
      if (tagData) {
        const { data: postIds } = await supabaseAdmin.from('post_tags').select('post_id').eq('tag_id', tagData.id)
        const ids = postIds?.map(r => r.post_id) ?? []
        query = query.in('id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])
      }
    }

    const { data, error, count } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ posts: data, total: count, page, limit })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, body: rawBody, excerpt, hero_image_url, category_id, published, seo_title, seo_description, tag_ids } = body

    if (!title || !rawBody) return NextResponse.json({ error: 'Title and body required' }, { status: 400 })

    const cleanBody = DOMPurify.sanitize(rawBody)
    const finalExcerpt = excerpt || generateExcerpt(cleanBody)
    const slug = slugify(title)

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({ title, slug, body: cleanBody, excerpt: finalExcerpt, hero_image_url, category_id, published: published ?? false, seo_title, seo_description, author_id: user.id })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (tag_ids?.length) {
      await supabaseAdmin.from('post_tags').insert(tag_ids.map((tag_id: string) => ({ post_id: post.id, tag_id })))
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

### TASK 19 — CREATE `app/api/posts/[id]/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import DOMPurify from 'isomorphic-dompurify'
import { generateExcerpt } from '@/lib/excerpt'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*, categories(*), post_tags(tag_id, tags(*))')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ post: data })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdmin = profile?.role === 'admin'

    // Authors can only edit their own posts
    if (!isAdmin) {
      const { data: post } = await supabaseAdmin.from('posts').select('author_id').eq('id', params.id).single()
      if (post?.author_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, body: rawBody, excerpt, hero_image_url, category_id, published, seo_title, seo_description, tag_ids } = body

    const cleanBody = rawBody ? DOMPurify.sanitize(rawBody) : undefined
    const finalExcerpt = excerpt || (cleanBody ? generateExcerpt(cleanBody) : undefined)

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({ title, body: cleanBody, excerpt: finalExcerpt, hero_image_url, category_id, published, seo_title, seo_description })
      .eq('id', params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (tag_ids !== undefined) {
      await supabaseAdmin.from('post_tags').delete().eq('post_id', params.id)
      if (tag_ids.length) {
        await supabaseAdmin.from('post_tags').insert(tag_ids.map((tag_id: string) => ({ post_id: params.id, tag_id })))
      }
    }

    return NextResponse.json({ post: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Delete Storage files for attachments
    const { data: attachments } = await supabaseAdmin.from('attachments').select('file_url').eq('post_id', params.id)
    if (attachments?.length) {
      const paths = attachments.map(a => {
        const url = new URL(a.file_url)
        return url.pathname.split('/object/public/media/')[1]
      }).filter(Boolean)
      if (paths.length) await supabaseAdmin.storage.from('media').remove(paths)
    }

    const { error } = await supabaseAdmin.from('posts').delete().eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

### TASK 20 — CREATE `app/api/attachments/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const postId = formData.get('postId') as string

    if (!file || !postId) return NextResponse.json({ error: 'file and postId required' }, { status: 400 })

    const ext = file.name.split('.').pop()
    const path = `attachments/${postId}/${Date.now()}-${file.name}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

    const { data: { publicUrl } } = supabaseAdmin.storage.from('media').getPublicUrl(path)

    const { data, error } = await supabaseAdmin
      .from('attachments')
      .insert({ post_id: postId, file_name: file.name, file_url: publicUrl, file_size: file.size, file_type: file.type })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ attachment: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

### TASK 21 — CREATE `app/api/attachments/[id]/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: attachment } = await supabaseAdmin.from('attachments').select('file_url, post_id').eq('id', params.id).single()
    if (!attachment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const storagePath = new URL(attachment.file_url).pathname.split('/object/public/media/')[1]
    if (storagePath) await supabaseAdmin.storage.from('media').remove([storagePath])

    await supabaseAdmin.from('attachments').delete().eq('id', params.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

### TASK 22 — CREATE `app/api/images/upload/route.ts`

For inline images inserted via TipTap editor:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'File required' }, { status: 400 })

    const path = `images/${user.id}/${Date.now()}.${file.name.split('.').pop()}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabaseAdmin.storage
      .from('media')
      .upload(path, buffer, { contentType: file.type })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabaseAdmin.storage.from('media').getPublicUrl(path)
    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

### TASK 23 — CREATE `components/admin/Editor.tsx`

TipTap WYSIWYG — client component only:

```tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useRef } from 'react'

interface EditorProps {
  content: string
  onChange: (html: string) => void
}

const TOOLBAR_BTN = 'px-2 py-1 font-mono text-xs border border-[var(--tactical-green-dark)] text-gray-400 hover:text-white hover:border-[var(--night-vision)] transition-all duration-200'
const TOOLBAR_BTN_ACTIVE = 'px-2 py-1 font-mono text-xs border border-[var(--night-vision)] text-[var(--night-vision)]'

export default function Editor({ content, onChange }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto my-4' } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[var(--night-vision)] hover:underline' } }),
      Placeholder.configure({ placeholder: 'Begin your intel report...' }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'blog-body min-h-[400px] p-4 text-white focus:outline-none' },
    },
  })

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/images/upload', { method: 'POST', body: formData })
    const { url } = await res.json()
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  if (!editor) return null

  return (
    <div className="border border-[var(--tactical-green-dark)] bg-black/60">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--tactical-green-dark)] bg-black/80">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}><em>I</em></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>H3</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>1. List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>" Quote</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>{`</>`}</button>
        <button type="button" onClick={() => {
          const url = window.prompt('Enter URL:')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }} className={editor.isActive('link') ? TOOLBAR_BTN_ACTIVE : TOOLBAR_BTN}>Link</button>
        <button type="button" onClick={() => fileInputRef.current?.click()}
          className={TOOLBAR_BTN}>Image</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={TOOLBAR_BTN}>—</button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file)
          e.target.value = ''
        }}
      />

      <EditorContent editor={editor} />
    </div>
  )
}
```

- **GOTCHA**: TipTap uses browser APIs — this MUST be `'use client'`. Never import in a server component.
- **VALIDATE**: `npm run dev` — import Editor in a test client component and verify it renders without errors

---

### TASK 24 — CREATE `components/admin/AttachmentUploader.tsx`

```tsx
'use client'

import { useState } from 'react'

interface Attachment {
  id: string
  file_name: string
  file_url: string
  file_size: number | null
  file_type: string | null
}

interface PendingFile {
  file: File
  tempId: string
}

interface Props {
  postId?: string
  existingAttachments?: Attachment[]
  onAttachmentsChange?: (attachments: Attachment[]) => void
  pendingFiles: PendingFile[]
  onPendingFilesChange: (files: PendingFile[]) => void
}

export default function AttachmentUploader({ postId, existingAttachments = [], pendingFiles, onPendingFilesChange }: Props) {
  const [uploading, setUploading] = useState(false)

  const addFiles = (fileList: FileList) => {
    const newFiles: PendingFile[] = Array.from(fileList).map(file => ({
      file,
      tempId: crypto.randomUUID(),
    }))
    onPendingFilesChange([...pendingFiles, ...newFiles])
  }

  const removePending = (tempId: string) => {
    onPendingFilesChange(pendingFiles.filter(f => f.tempId !== tempId))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-center gap-3 px-4 py-6 border-2 border-dashed border-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] cursor-pointer transition-all duration-300 bg-black/40">
        <span className="text-gray-400 font-mono text-sm tracking-wider">+ ADD ATTACHMENTS</span>
        <input type="file" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
      </label>

      {pendingFiles.length > 0 && (
        <div className="space-y-2">
          <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">PENDING UPLOAD</span>
          {pendingFiles.map(({ file, tempId }) => (
            <div key={tempId} className="flex items-center justify-between px-3 py-2 border border-[var(--tactical-green-dark)] bg-black/40">
              <span className="font-mono text-xs text-gray-300 truncate">{file.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-gray-500">{formatSize(file.size)}</span>
                <button type="button" onClick={() => removePending(tempId)} className="text-red-400 font-mono text-xs hover:text-red-300">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### TASK 25 — CREATE `components/admin/DeleteConfirm.tsx`

```tsx
'use client'

interface Props {
  postTitle: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

export default function DeleteConfirm({ postTitle, onConfirm, onCancel, isDeleting }: Props) {
  return (
    <div className="border border-red-900/50 bg-red-950/20 px-4 py-3 flex items-center gap-4">
      <span className="font-mono text-xs text-red-400 flex-1">
        CONFIRM DELETE: <span className="text-white">{postTitle}</span>
      </span>
      <button
        onClick={onConfirm}
        disabled={isDeleting}
        className="px-3 py-1 border border-red-600 text-red-400 font-mono text-xs hover:bg-red-900/30 transition-all duration-200 disabled:opacity-50"
      >
        {isDeleting ? 'DELETING...' : 'CONFIRM'}
      </button>
      <button
        onClick={onCancel}
        className="px-3 py-1 border border-[var(--tactical-green-dark)] text-gray-400 font-mono text-xs hover:border-[var(--night-vision)] transition-all duration-200"
      >
        CANCEL
      </button>
    </div>
  )
}
```

---

### TASK 26 — CREATE `app/admin/login/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('AUTHENTICATION FAILED')
      setLoading(false)
    } else {
      router.push('/admin/blog')
      router.refresh()
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="tactical-grid absolute inset-0 opacity-5" />
      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center stalk-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-[var(--tactical-green)]" />
            <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">SYSTEM ACCESS</span>
            <div className="w-12 h-px bg-[var(--tactical-green)]" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-wider">AUTHENTICATION</h1>
        </div>

        {/* Card */}
        <div className="credential-shine border border-[var(--tactical-green-dark)] bg-black/80 p-8 stalk-in" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[var(--tactical-green-light)] font-mono text-xs tracking-widest mb-2">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 outline-none transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-[var(--tactical-green-light)] font-mono text-xs tracking-widest mb-2">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 outline-none transition-colors duration-300"
              />
            </div>

            {error && (
              <p className="text-red-400 font-mono text-xs tracking-wider">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin/forgot-password" className="text-gray-500 font-mono text-xs hover:text-[var(--night-vision)] transition-colors duration-300 tracking-wider">
              FORGOT PASSWORD
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### TASK 27 — CREATE `app/admin/forgot-password/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/admin/reset-password`,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="tactical-grid absolute inset-0 opacity-5" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="credential-shine border border-[var(--tactical-green-dark)] bg-black/80 p-8 stalk-in">
          {sent ? (
            <div className="text-center">
              <p className="text-[var(--night-vision)] font-mono text-sm tracking-wider mb-2">TRANSMISSION SENT</p>
              <p className="text-gray-400 font-mono text-xs">Check your email for a reset link.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h1 className="text-lg font-bold text-white font-mono tracking-wider mb-6">RESET PASSWORD</h1>
              <div>
                <label className="block text-[var(--tactical-green-light)] font-mono text-xs tracking-widest mb-2">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 outline-none transition-colors"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] text-white font-mono font-bold text-sm tracking-wider transition-all disabled:opacity-50">
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

### TASK 28 — CREATE `app/admin/reset-password/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/admin/blog') }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="tactical-grid absolute inset-0 opacity-5" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="credential-shine border border-[var(--tactical-green-dark)] bg-black/80 p-8 stalk-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-lg font-bold text-white font-mono tracking-wider mb-6">SET NEW PASSWORD</h1>
            <div>
              <label className="block text-[var(--tactical-green-light)] font-mono text-xs tracking-widest mb-2">NEW PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                className="w-full bg-transparent border-b border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[var(--tactical-green-light)] font-mono text-xs tracking-widest mb-2">CONFIRM PASSWORD</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={8}
                className="w-full bg-transparent border-b border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 outline-none transition-colors" />
            </div>
            {error && <p className="text-red-400 font-mono text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] text-white font-mono font-bold text-sm tracking-wider transition-all disabled:opacity-50">
              {loading ? 'SAVING...' : 'SET PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

---

### TASK 29 — CREATE `app/admin/blog/page.tsx` (CMS Dashboard)

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import DeleteConfirm from '@/components/admin/DeleteConfirm'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  created_at: string
  categories: { name: string } | null
  profiles: { full_name: string } | null
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/admin/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setIsAdmin(profile?.role === 'admin')
      const res = await fetch('/api/posts?limit=100')
      const json = await res.json()
      setPosts(json.posts ?? [])
      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
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

  return (
    <div className="bg-black min-h-screen">
      <div className="tactical-grid absolute inset-0 opacity-5" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">INTEL MANAGEMENT</span>
            </div>
            <h1 className="heading-h2 text-white">CMS DASHBOARD</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/blog/new"
              className="px-6 py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300">
              + NEW POST
            </Link>
            <button onClick={handleLogout}
              className="px-4 py-3 border border-[var(--tactical-green-dark)] text-gray-400 font-mono text-sm hover:border-[var(--night-vision)] hover:text-white transition-all duration-300">
              LOG OUT
            </button>
          </div>
        </div>

        {/* Posts table */}
        {loading ? (
          <div className="text-gray-500 font-mono text-sm">LOADING INTEL...</div>
        ) : posts.length === 0 ? (
          <div className="border border-[var(--tactical-green-dark)] p-12 text-center">
            <p className="text-gray-500 font-mono text-sm tracking-wider">NO INTEL PUBLISHED</p>
          </div>
        ) : (
          <div className="border border-[var(--tactical-green-dark)] divide-y divide-[var(--tactical-green-dark)]">
            {/* Table header */}
            <div className={`grid ${isAdmin ? 'grid-cols-[1fr_140px_100px_120px_100px]' : 'grid-cols-[1fr_140px_100px_120px_80px]'} gap-4 px-4 py-3 bg-black/60`}>
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">TITLE</span>
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">CATEGORY</span>
              {isAdmin && <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">AUTHOR</span>}
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">STATUS</span>
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">DATE</span>
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">ACTIONS</span>
            </div>

            {posts.map(post => (
              <div key={post.id}>
                <div className={`grid ${isAdmin ? 'grid-cols-[1fr_140px_100px_120px_100px]' : 'grid-cols-[1fr_140px_100px_120px_80px]'} gap-4 px-4 py-4 hover:bg-black/40 transition-colors items-center`}>
                  <span className="text-white font-mono text-sm truncate">{post.title}</span>
                  <span className="text-gray-400 font-mono text-xs truncate">{post.categories?.name ?? '—'}</span>
                  {isAdmin && <span className="text-gray-400 font-mono text-xs truncate">{post.profiles?.full_name ?? '—'}</span>}
                  <span className={`font-mono text-xs font-bold ${post.published ? 'text-[var(--night-vision)]' : 'text-gray-500'}`}>
                    {post.published ? '● LIVE' : '○ DRAFT'}
                  </span>
                  <span className="text-gray-500 font-mono text-xs">
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </span>
                  <div className="flex gap-3">
                    <Link href={`/admin/blog/${post.id}/edit`} className="text-[var(--tactical-green-light)] font-mono text-xs hover:text-[var(--night-vision)] transition-colors">EDIT</Link>
                    {isAdmin && (
                      <button onClick={() => setConfirmDelete(post)} className="text-red-400 font-mono text-xs hover:text-red-300 transition-colors">DELETE</button>
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
```

---

### TASK 30 — CREATE `components/admin/PostForm.tsx`

Shared form used by both new and edit pages:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Editor from './Editor'
import AttachmentUploader from './AttachmentUploader'

interface Category { id: string; name: string }
interface Tag { id: string; name: string }
interface Attachment { id: string; file_name: string; file_url: string; file_size: number | null; file_type: string | null }
interface PendingFile { file: File; tempId: string }

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
  attachments?: Attachment[]
}

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
    return url
  }

  const handleSubmit = async (e: React.FormEvent, publishNow?: boolean) => {
    e.preventDefault()
    setSaving(true)
    const finalPublished = publishNow !== undefined ? publishNow : published

    setStatus(isEdit ? 'SAVING...' : 'CREATING POST...')

    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit ? `/api/posts/${initialData!.id}` : '/api/posts'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, excerpt, hero_image_url: heroImageUrl, category_id: categoryId || null, published: finalPublished, seo_title: seoTitle, seo_description: seoDescription, tag_ids: selectedTagIds }),
    })

    const json = await res.json()
    if (!res.ok) { setStatus(`ERROR: ${json.error}`); setSaving(false); return }

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
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId])
  }

  const INPUT_CLASS = "w-full bg-transparent border-b border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 outline-none transition-colors duration-300"
  const LABEL_CLASS = "block text-[var(--tactical-green-light)] font-mono text-xs tracking-widest mb-2"

  return (
    <form className="space-y-8">
      {/* Title */}
      <div>
        <label className={LABEL_CLASS}>HEADLINE *</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className={INPUT_CLASS} placeholder="Post title..." />
      </div>

      {/* Category + Tags row */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={LABEL_CLASS}>CATEGORY</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
            className="w-full bg-black border border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm py-2 px-3 outline-none transition-colors">
            <option value="">— Select category —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS}>TAGS</label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button type="button" key={tag.id} onClick={() => toggleTag(tag.id)}
                className={`px-2 py-1 font-mono text-xs border transition-all duration-200 ${selectedTagIds.includes(tag.id) ? 'border-[var(--night-vision)] text-[var(--night-vision)]' : 'border-[var(--tactical-green-dark)] text-gray-400 hover:border-[var(--night-vision)]'}`}>
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div>
        <label className={LABEL_CLASS}>HERO IMAGE (optional)</label>
        <input type="file" accept="image/*" onChange={async e => {
          const file = e.target.files?.[0]
          if (file) { const url = await uploadHeroImage(file); setHeroImageUrl(url) }
        }} className="text-gray-400 font-mono text-xs" />
        {heroImageUrl && <p className="mt-2 text-[var(--night-vision)] font-mono text-xs truncate">✓ {heroImageUrl}</p>}
      </div>

      {/* Body */}
      <div>
        <label className={LABEL_CLASS}>BODY *</label>
        <Editor content={body} onChange={setBody} />
      </div>

      {/* Excerpt */}
      <div>
        <label className={LABEL_CLASS}>EXCERPT (optional — auto-generated if blank)</label>
        <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3}
          className="w-full bg-transparent border border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm p-3 outline-none transition-colors resize-none" />
      </div>

      {/* SEO fields */}
      <div className="border border-[var(--tactical-green-dark)] p-6 space-y-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-8 h-px bg-[var(--tactical-green)]" />
          <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">SEO OVERRIDE</span>
        </div>
        <div>
          <label className={LABEL_CLASS}>SEO TITLE</label>
          <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className={INPUT_CLASS} />
        </div>
        <div>
          <label className={LABEL_CLASS}>SEO DESCRIPTION</label>
          <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)} rows={2}
            className="w-full bg-transparent border border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm p-3 outline-none transition-colors resize-none" />
        </div>
      </div>

      {/* Attachments */}
      <div>
        <label className={LABEL_CLASS}>ATTACHMENTS</label>
        <AttachmentUploader postId={initialData?.id} pendingFiles={pendingFiles} onPendingFilesChange={setPendingFiles} />
      </div>

      {/* Status message */}
      {status && <p className="text-[var(--night-vision)] font-mono text-xs tracking-wider">{status}</p>}

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-[var(--tactical-green-dark)]">
        <button type="button" disabled={saving} onClick={e => handleSubmit(e, false)}
          className="px-6 py-3 border border-[var(--tactical-green-dark)] text-gray-400 font-mono text-sm hover:border-[var(--night-vision)] hover:text-white transition-all disabled:opacity-50">
          SAVE DRAFT
        </button>
        <button type="button" disabled={saving} onClick={e => handleSubmit(e, true)}
          className="px-8 py-3 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all disabled:opacity-50">
          {saving ? status || 'SAVING...' : 'PUBLISH'}
        </button>
      </div>
    </form>
  )
}
```

---

### TASK 31 — CREATE `app/admin/blog/new/page.tsx`

```tsx
import PostForm from '@/components/admin/PostForm'
import Link from 'next/link'

export default function NewPostPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="tactical-grid absolute inset-0 opacity-5" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">NEW INTEL</span>
            </div>
            <h1 className="heading-h2 text-white">WRITE POST</h1>
          </div>
          <Link href="/admin/blog" className="text-gray-500 font-mono text-xs hover:text-[var(--night-vision)] transition-colors">← BACK</Link>
        </div>
        <PostForm />
      </div>
    </div>
  )
}
```

---

### TASK 32 — CREATE `app/admin/blog/[id]/edit/page.tsx`

```tsx
import { createClient } from '@/lib/supabase/server'
import PostForm from '@/components/admin/PostForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?id=eq.${params.id}&select=*,post_tags(tag_id)`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}` },
    cache: 'no-store',
  })
  // Simpler: just call the API route
  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/posts/${params.id}`, { cache: 'no-store' })
  if (!apiRes.ok) notFound()
  const { post } = await apiRes.json()

  const initialData = {
    id: post.id,
    title: post.title,
    body: post.body,
    excerpt: post.excerpt,
    hero_image_url: post.hero_image_url,
    category_id: post.category_id,
    published: post.published,
    seo_title: post.seo_title,
    seo_description: post.seo_description,
    tag_ids: post.post_tags?.map((pt: { tag_id: string }) => pt.tag_id) ?? [],
    attachments: post.attachments ?? [],
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="tactical-grid absolute inset-0 opacity-5" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">EDIT INTEL</span>
            </div>
            <h1 className="heading-h2 text-white">EDIT POST</h1>
          </div>
          <Link href="/admin/blog" className="text-gray-500 font-mono text-xs hover:text-[var(--night-vision)] transition-colors">← BACK</Link>
        </div>
        <PostForm initialData={initialData} />
      </div>
    </div>
  )
}
```

- **GOTCHA**: The edit page fetches from the API route using an absolute URL. Add `NEXT_PUBLIC_SITE_URL=http://localhost:3000` to `.env.local` and `NEXT_PUBLIC_SITE_URL=https://clawpoint.security` to Vercel env vars.

---

### TASK 33 — CREATE `components/blog/CategoryBadge.tsx`

```tsx
import Link from 'next/link'

export default function CategoryBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Link href={`/blog/category/${slug}`}
      className="inline-block px-2 py-0.5 border border-[var(--tactical-green)] text-[var(--tactical-green-light)] font-mono text-xs tracking-wider hover:border-[var(--night-vision)] hover:text-[var(--night-vision)] transition-all duration-200">
      {name.toUpperCase()}
    </Link>
  )
}
```

---

### TASK 34 — CREATE `components/blog/TagChip.tsx`

```tsx
import Link from 'next/link'

export default function TagChip({ name, slug }: { name: string; slug: string }) {
  return (
    <Link href={`/blog/tag/${slug}`}
      className="inline-block px-2 py-0.5 text-gray-500 font-mono text-xs hover:text-[var(--night-vision)] transition-colors duration-200">
      #{name}
    </Link>
  )
}
```

---

### TASK 35 — CREATE `components/blog/PostCard.tsx`

```tsx
import Link from 'next/link'
import CategoryBadge from './CategoryBadge'
import TagChip from './TagChip'

interface Post {
  title: string
  slug: string
  excerpt: string | null
  created_at: string
  categories: { name: string; slug: string } | null
  post_tags: { tags: { name: string; slug: string } }[]
}

export default function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()

  return (
    <article
      className="border border-[var(--tactical-green-dark)] bg-black/40 p-6 hover:border-[var(--night-vision)] transition-all duration-500 stalk-in group"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">{date}</span>
        {post.categories && <CategoryBadge name={post.categories.name} slug={post.categories.slug} />}
      </div>

      <Link href={`/blog/${post.slug}`}>
        <h2 className="heading-h3 text-white mb-3 group-hover:text-[var(--night-vision)] transition-colors duration-300">{post.title}</h2>
      </Link>

      {post.excerpt && (
        <p className="text-gray-400 font-mono text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {post.post_tags?.map(pt => <TagChip key={pt.tags.slug} name={pt.tags.name} slug={pt.tags.slug} />)}
        </div>
        <Link href={`/blog/${post.slug}`} className="text-[var(--tactical-green-light)] font-mono text-xs hover:text-[var(--night-vision)] transition-colors duration-200 tracking-wider">
          READ INTEL →
        </Link>
      </div>
    </article>
  )
}
```

---

### TASK 36 — CREATE `components/blog/CopyLinkButton.tsx`

```tsx
'use client'

import { useState } from 'react'

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-gray-400 hover:text-white font-mono text-xs tracking-wider transition-all duration-300"
    >
      {copied ? '✓ LINK COPIED' : '⎘ COPY LINK'}
    </button>
  )
}
```

---

### TASK 37 — CREATE `components/blog/BlogSearch.tsx`

```tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function BlogSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (q) params.set('q', q)
    else params.delete('q')
    params.delete('page')
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="SEARCH INTEL..."
        className="flex-1 bg-black border border-[var(--tactical-green-dark)] focus:border-[var(--night-vision)] text-white font-mono text-sm px-4 py-2 outline-none transition-colors placeholder:text-gray-600"
      />
      <button type="submit"
        className="px-4 py-2 border border-[var(--tactical-green)] text-white font-mono text-xs hover:border-[var(--night-vision)] hover:bg-[var(--tactical-green-dark)] transition-all duration-200">
        SEARCH
      </button>
    </form>
  )
}
```

---

### TASK 38 — CREATE `components/blog/Pagination.tsx`

```tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-6 pt-8">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="font-mono text-xs text-gray-400 hover:text-[var(--night-vision)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors tracking-widest"
      >
        ← PREV
      </button>
      <span className="font-mono text-xs text-[var(--tactical-green-light)] tracking-widest">
        PAGE {currentPage} OF {totalPages}
      </span>
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="font-mono text-xs text-gray-400 hover:text-[var(--night-vision)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors tracking-widest"
      >
        NEXT →
      </button>
    </div>
  )
}
```

---

### TASK 39 — CREATE `components/blog/PostBody.tsx`

Renders stored (pre-sanitized) TipTap HTML on public pages:

```tsx
export default function PostBody({ html }: { html: string }) {
  return (
    <div
      className="blog-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

- **IMPORTANT**: This is a server component (no `'use client'`). HTML was sanitized with `isomorphic-dompurify` on write in the API route — it is safe to render directly. This ensures server-side rendering for SEO.

---

### TASK 40 — CREATE `app/blog/page.tsx` (Public list)

```tsx
import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/blog/PostCard'
import BlogSearch from '@/components/blog/BlogSearch'
import Pagination from '@/components/blog/Pagination'
import { Suspense } from 'react'

const LIMIT = 10

export const metadata = {
  title: 'Intel | Clawpoint Security Collective',
  description: 'Threat intelligence, cybersecurity strategy, and mission-critical insights from Clawpoint Security Collective.',
}

export default async function BlogPage({ searchParams }: { searchParams: { page?: string; category?: string; tag?: string; q?: string } }) {
  const supabase = await createClient()
  const page = parseInt(searchParams.page ?? '1')
  const offset = (page - 1) * LIMIT

  let query = supabase
    .from('posts')
    .select('id, title, slug, excerpt, created_at, categories(name, slug), post_tags(tags(name, slug))', { count: 'exact' })
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + LIMIT - 1)

  if (searchParams.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', searchParams.category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (searchParams.tag) {
    const { data: tag } = await supabase.from('tags').select('id').eq('slug', searchParams.tag).single()
    if (tag) {
      const { data: ptRows } = await supabase.from('post_tags').select('post_id').eq('tag_id', tag.id)
      const ids = ptRows?.map(r => r.post_id) ?? []
      query = query.in('id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])
    }
  }

  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`)
  }

  const { data: posts, count } = await query
  const totalPages = Math.ceil((count ?? 0) / LIMIT)

  const { data: categories } = await supabase.from('categories').select('name, slug').order('name')

  return (
    <div className="bg-black min-h-screen pt-24">
      <div className="tactical-grid absolute inset-0 opacity-5" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 py-12">

        {/* Header */}
        <div className="mb-10 emerge-from-forest">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-[var(--tactical-green)]" />
            <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">INTELLIGENCE FEED</span>
          </div>
          <h1 className="heading-h2 text-white mb-2">INTEL</h1>
          <p className="text-gray-400 font-mono text-sm">Threat intelligence, strategy, and mission insights.</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Suspense><BlogSearch /></Suspense>
        </div>

        {/* Category filters */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <a href="/blog" className={`px-3 py-1 font-mono text-xs border transition-all duration-200 ${!searchParams.category ? 'border-[var(--night-vision)] text-[var(--night-vision)]' : 'border-[var(--tactical-green-dark)] text-gray-400 hover:border-[var(--night-vision)]'}`}>
              ALL
            </a>
            {categories.map(cat => (
              <a key={cat.slug} href={`/blog?category=${cat.slug}`}
                className={`px-3 py-1 font-mono text-xs border transition-all duration-200 ${searchParams.category === cat.slug ? 'border-[var(--night-vision)] text-[var(--night-vision)]' : 'border-[var(--tactical-green-dark)] text-gray-400 hover:border-[var(--night-vision)]'}`}>
                {cat.name.toUpperCase()}
              </a>
            ))}
          </div>
        )}

        {/* Post list */}
        {!posts?.length ? (
          <div className="border border-[var(--tactical-green-dark)] p-12 text-center">
            <p className="text-gray-500 font-mono text-sm tracking-wider">NO INTEL PUBLISHED</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => <PostCard key={post.id} post={post as any} index={i} />)}
          </div>
        )}

        {/* Pagination */}
        <Suspense><Pagination currentPage={page} totalPages={totalPages} /></Suspense>
      </div>
    </div>
  )
}
```

---

### TASK 41 — CREATE `app/blog/[slug]/page.tsx` (Individual post)

```tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PostBody from '@/components/blog/PostBody'
import CategoryBadge from '@/components/blog/CategoryBadge'
import TagChip from '@/components/blog/TagChip'
import CopyLinkButton from '@/components/blog/CopyLinkButton'
import PostCard from '@/components/blog/PostCard'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data: post } = await supabase.from('posts').select('title, seo_title, seo_description, excerpt, hero_image_url').eq('slug', params.slug).eq('published', true).single()
  if (!post) return { title: 'Not Found' }

  const title = post.seo_title || post.title
  const description = post.seo_description || post.excerpt || ''
  const image = post.hero_image_url || 'https://clawpoint.security/images/logo.png'

  return {
    title: `${title} | Clawpoint Security Collective`,
    description,
    openGraph: { title, description, images: [image], type: 'article' },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('slug').eq('published', true)
  return data?.map(p => ({ slug: p.slug })) ?? []
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, categories(name, slug), post_tags(tags(name, slug)), attachments(*)')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  // Related posts (same category, exclude current)
  let related: any[] = []
  if (post.category_id) {
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, created_at, categories(name, slug), post_tags(tags(name, slug))')
      .eq('published', true)
      .eq('category_id', post.category_id)
      .neq('id', post.id)
      .limit(3)
    related = data ?? []
  }

  const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seo_title || post.title,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: 'Clawpoint Security Collective', url: 'https://clawpoint.security' },
    publisher: { '@type': 'Organization', name: 'Clawpoint Security Collective', logo: { '@type': 'ImageObject', url: 'https://clawpoint.security/images/logo.png' } },
    description: post.seo_description || post.excerpt || '',
    image: post.hero_image_url || 'https://clawpoint.security/images/logo.png',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://clawpoint.security/blog/${post.slug}` },
  }

  return (
    <div className="bg-black min-h-screen pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="tactical-grid absolute inset-0 opacity-5" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 py-12">

        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 font-mono text-xs hover:text-[var(--night-vision)] transition-colors mb-8 tracking-wider">
          ← RETURN TO INTEL
        </Link>

        {/* Hero image */}
        {post.hero_image_url && (
          <div className="relative w-full h-64 sm:h-80 mb-8 overflow-hidden">
            <Image src={post.hero_image_url} alt={post.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        )}

        {/* Header */}
        <div className="mb-8 emerge-from-forest">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-[var(--tactical-green)]" />
            <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">
              {post.categories?.name?.toUpperCase() ?? 'INTEL'} // {date}
            </span>
          </div>
          <h1 className="heading-h2 text-white mb-4">{post.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories && <CategoryBadge name={post.categories.name} slug={post.categories.slug} />}
            {post.post_tags?.map((pt: any) => <TagChip key={pt.tags.slug} name={pt.tags.name} slug={pt.tags.slug} />)}
          </div>
          <div className="flex items-center gap-4">
            <CopyLinkButton />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--tactical-green-dark)] mb-8" />

        {/* Body */}
        <PostBody html={post.body} />

        {/* Attachments */}
        {post.attachments?.length > 0 && (
          <div className="mt-10 border-t border-[var(--tactical-green-dark)] pt-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">ATTACHMENTS</span>
            </div>
            <div className="space-y-2">
              {post.attachments.map((att: any) => (
                <a key={att.id} href={att.file_url} download={att.file_name} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 border border-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] transition-all duration-200 group">
                  <span className="text-white font-mono text-sm group-hover:text-[var(--night-vision)] transition-colors">{att.file_name}</span>
                  <div className="flex items-center gap-3 text-gray-500 font-mono text-xs">
                    {att.file_size && <span>{(att.file_size / 1024).toFixed(0)} KB</span>}
                    <span>↓ DOWNLOAD</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-[var(--tactical-green-dark)] pt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">RELATED INTEL</span>
            </div>
            <div className="space-y-4">
              {related.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### TASK 42 — CREATE `app/blog/category/[slug]/page.tsx`

```tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PostCard from '@/components/blog/PostCard'
import Link from 'next/link'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: category } = await supabase.from('categories').select('*').eq('slug', params.slug).single()
  if (!category) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, created_at, categories(name, slug), post_tags(tags(name, slug))')
    .eq('published', true)
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-black min-h-screen pt-24">
      <div className="tactical-grid absolute inset-0 opacity-5" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 py-12">
        <Link href="/blog" className="text-gray-500 font-mono text-xs hover:text-[var(--night-vision)] transition-colors mb-8 inline-block tracking-wider">← ALL INTEL</Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[var(--tactical-green)]" />
          <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">CATEGORY</span>
        </div>
        <h1 className="heading-h2 text-white mb-8">{category.name.toUpperCase()}</h1>
        <div className="space-y-4">
          {posts?.map((post, i) => <PostCard key={post.id} post={post as any} index={i} />)}
        </div>
        {!posts?.length && <p className="text-gray-500 font-mono text-sm">NO INTEL IN THIS CATEGORY</p>}
      </div>
    </div>
  )
}
```

---

### TASK 43 — CREATE `app/blog/tag/[slug]/page.tsx`

Same pattern as category page but filters by tag. Replace `category` with `tag` and query via `post_tags` junction.

---

### TASK 44 — CREATE `app/sitemap.ts`

```ts
import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const SITE_URL = 'https://clawpoint.security'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: posts } = await supabase.from('posts').select('slug, updated_at').eq('published', true)
  const { data: categories } = await supabase.from('categories').select('slug')
  const { data: tags } = await supabase.from('tags').select('slug')

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/solutions`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/infinite-view`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), priority: 0.8 },
  ]

  return [
    ...staticPages,
    ...(posts ?? []).map(p => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.updated_at), priority: 0.8 })),
    ...(categories ?? []).map(c => ({ url: `${SITE_URL}/blog/category/${c.slug}`, lastModified: new Date(), priority: 0.5 })),
    ...(tags ?? []).map(t => ({ url: `${SITE_URL}/blog/tag/${t.slug}`, lastModified: new Date(), priority: 0.4 })),
  ]
}
```

---

### TASK 45 — CREATE `app/blog/feed.xml/route.ts`

```ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateRss } from '@/lib/rss'

export async function GET() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, excerpt, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  const rss = generateRss(posts ?? [], 'https://clawpoint.security')

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
```

---

### TASK 46 — ADD `NEXT_PUBLIC_SITE_URL` to `.env.local`

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Add `NEXT_PUBLIC_SITE_URL=https://clawpoint.security` to Vercel env vars.

---

## VALIDATION COMMANDS

### Level 1: Type check
```bash
npx tsc --noEmit
```

### Level 2: Lint
```bash
npm run lint
```

### Level 3: Build
```bash
npm run build
```
Must pass clean — Vercel deploys from build.

### Level 4: Manual smoke tests
```
1. npm run dev
2. Visit / — nav + footer visible ✓
3. Visit /admin/blog — redirects to /admin/login ✓
4. Log in with Supabase credentials — reaches /admin/blog ✓
5. Create a new post (publish) — appears in dashboard ✓
6. Visit /blog — post card visible ✓
7. Click post — /blog/[slug] renders body ✓
8. View page source — JSON-LD present, OG tags present ✓
9. Visit /blog/feed.xml — valid RSS XML ✓
10. Visit /sitemap.xml — post slug listed ✓
11. Visit /llms.txt — plain text renders ✓
12. Log out — redirected to /admin/login ✓
13. Visit /admin/blog — redirects to /admin/login ✓
```

---

## ACCEPTANCE CRITERIA

- [ ] `/admin/blog` redirects to `/admin/login` when not authenticated
- [ ] Login with email + password works; wrong credentials show error
- [ ] Forgot password sends reset email; reset link sets new password
- [ ] Dashboard shows all posts for admin, own posts for author
- [ ] New post form: title, body (WYSIWYG), category, tags, hero image, SEO fields, attachments
- [ ] Save draft: post is saved with `published = false`, not visible on `/blog`
- [ ] Publish: post appears on `/blog` immediately
- [ ] Edit post: changes saved and reflected on public page
- [ ] Delete (admin only): two-step confirmation, post removed
- [ ] `/blog` shows paginated list of published posts
- [ ] Category filter works; tag filter works; title search works
- [ ] `/blog/[slug]` renders WYSIWYG HTML, hero image, attachments, related posts
- [ ] Copy-link button copies URL to clipboard
- [ ] Each post page has JSON-LD Article schema in source
- [ ] Each post page has correct OG `title`, `description`, `image` in source
- [ ] `/sitemap.xml` includes all published post slugs
- [ ] `/blog/feed.xml` returns valid RSS 2.0
- [ ] `/llms.txt` renders as plain text
- [ ] Blog NOT listed in site navigation
- [ ] `npm run build` passes clean
- [ ] `npx tsc --noEmit` passes clean

---

## NOTES

**Edit page data fetching**: The `/admin/blog/[id]/edit` server component fetches via the API route using an absolute URL (`NEXT_PUBLIC_SITE_URL`). An alternative is importing `supabaseAdmin` directly — either works, but the API route approach keeps the auth check in one place.

**TipTap hydration**: TipTap uses browser APIs. If SSR hydration errors appear, wrap `<Editor>` in `dynamic(() => import(...), { ssr: false })`.

**Supabase redirect URLs**: Must add `http://localhost:3000/**` and `https://clawpoint.security/**` to Supabase Auth → URL Configuration before email flows work. Forgetting this causes silent failures on password reset.

**Confidence Score: 8/10** — Main risks are TipTap + React 19 hydration edge cases and the `@supabase/ssr` cookie adapter behavior in Next.js 16 middleware. Both have documented fallbacks in the risk section of the PRD.
