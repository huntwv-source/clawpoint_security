# Feature: Blog with Password-Protected CMS

The following plan should be complete, but validate documentation and codebase patterns before implementing. Pay special attention to imports, existing CSS utility classes, and Tailwind v4 syntax already in use.

## Feature Description

A two-part blog system for Clawpoint Security Collective:
1. **Public blog** (`/blog`, `/blog/[slug]`) — scrollable post list and dynamic per-post pages, not in navigation, matching the site's tactical dark-green aesthetic.
2. **Admin CMS** (`/admin/login`, `/admin/blog`, `/admin/blog/new`) — password-protected dashboard to create and delete posts, with headline, markdown body, and file attachments. Password stored as a bcrypt hash in an environment variable — no database needed for auth.

## User Story

As the site admin, I want a private CMS to write, manage, and delete blog posts so that I can publish content without touching code.

As a site visitor, I want to browse blog posts and read them on individual pages so I can engage with Clawpoint's published content.

## Problem Statement

There is no content publishing system on the site. New articles and announcements require code changes and deploys. The admin needs a no-code writing interface that is gated but free to operate.

## Solution Statement

Use Supabase (free tier) as the database and file-storage backend. Protect the admin area with iron-session (encrypted HTTP-only cookie) and a bcrypt-hashed password stored in an env var. Blog posts are markdown, rendered publicly with react-markdown. Attachments are uploaded to Supabase Storage.

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: High  
**Primary Systems Affected**: Routing (new pages), Root layout (conditional nav/footer), Middleware (auth guard), API layer (CRUD + auth endpoints)  
**Dependencies to install**:
- `iron-session` — encrypted cookie session (free, no external service)
- `bcryptjs` + `@types/bcryptjs` — password hashing (pure JS, no native build)
- `@supabase/supabase-js` — database + file storage client
- `react-markdown` — render markdown safely in public pages
- `remark-gfm` — GitHub Flavored Markdown (tables, strikethrough, etc.)

---

## CONTEXT REFERENCES

### Relevant Codebase Files — READ THESE BEFORE IMPLEMENTING

- `app/layout.tsx` (lines 98–122) — Root layout renders `<Navigation />` and `<Footer />` for every route. Admin pages must NOT show these. Solution: replace direct rendering with a `<ConditionalLayout>` client wrapper that reads `usePathname()`.
- `components/Navigation.tsx` (lines 9–16) — `navigationLinks` array. Blog must NOT be added here.
- `app/globals.css` (lines 1–32) — CSS custom properties: `--tactical-green`, `--night-vision`, `--tactical-green-dark`, `--tactical-green-light`, `--forest-depth-*`. All new components must use these.
- `app/globals.css` (lines 36–74) — Utility classes: `.heading-h2`, `.heading-h3`, `.body-regular`, `.label-text`, `.stalk-in`, `.emerge-from-forest`. Mirror these in new pages.
- `app/globals.css` (lines 113–118) — `.tactical-grid` background pattern used in sections.
- `app/globals.css` (lines 742–769) — `.credential-shine` hover sweep effect. Reuse on admin cards.
- `app/about/page.tsx` — Reference for full page layout pattern: hero → section with `max-w-7xl mx-auto`, section labels (`MISSION-01` style), `stalk-in` animation usage, `border-[var(--tactical-green-dark)]` borders.
- `components/DownloadBrief.tsx` — Reference for button pattern: `border-2 border-[var(--tactical-green)]`, hover states, scan-line animation on hover, tactical corner decorations.
- `components/Footer.tsx` — Reference for tactical corner decorations pattern and section structure.
- `app/api/contact/route.ts` — API route pattern: `NextRequest` / `NextResponse`, try/catch, env var access via `process.env`, JSON response shape. Mirror this for all new API routes.

### New Files to Create

```
components/
  ConditionalLayout.tsx             # Client wrapper: hides nav+footer on /admin/* routes

lib/
  session.ts                        # iron-session config (cookieName, password, ttl)
  supabase.ts                       # Supabase anon client (public reads)
  supabase-admin.ts                 # Supabase service-role client (admin writes)
  slugify.ts                        # title → url-safe slug utility

middleware.ts                       # Route guard: redirect /admin/* to /admin/login if no session

app/
  admin/
    login/
      page.tsx                      # Login form — password field → POST /api/auth/login
    blog/
      page.tsx                      # CMS dashboard — list all posts, delete with confirm
      new/
        page.tsx                    # Write new post form (title, body, attachments)
  blog/
    page.tsx                        # Public post list
    [slug]/
      page.tsx                      # Individual post (dynamic, server component)

  api/
    auth/
      login/
        route.ts                    # POST: bcrypt compare → set iron-session cookie
      logout/
        route.ts                    # POST: destroy session
      session/
        route.ts                    # GET: return { isLoggedIn } for client-side checks
    posts/
      route.ts                      # GET: list posts (admin sees all; public filtered by published)
                                    # POST: create post
      [id]/
        route.ts                    # DELETE: delete post + its attachments
    attachments/
      route.ts                      # POST: upload file to Supabase Storage → return URL
      [id]/
        route.ts                    # DELETE: remove attachment record + Storage file
```

### Relevant Documentation — READ BEFORE IMPLEMENTING

- [iron-session v8 README](https://github.com/vvo/iron-session#readme) — Pay attention to `getIronSession(req, res, options)` signature and the difference between API route usage vs middleware usage. In middleware you pass `(request, response)` directly.
- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript/introduction) — Use `createClient` from `@supabase/supabase-js`. For public reads use the anon key; for admin writes use the service role key (server-side only, never exposed to client).
- [Supabase Storage Docs](https://supabase.com/docs/reference/javascript/storage-from-upload) — `supabase.storage.from('attachments').upload(path, file)` then `supabase.storage.from('attachments').getPublicUrl(path)`.
- [react-markdown](https://github.com/remarkjs/react-markdown) — `<ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>`. Works as a server component in Next.js 14+ when imported without `'use client'`.
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme) — `bcryptjs.compareSync(plaintext, hash)`. For setup: `bcryptjs.hashSync('yourpassword', 12)` — run once in a Node script to generate the env var value.
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) — `middleware.ts` must live at the project root (next to `app/`). Export `config.matcher` to scope it.

---

## Patterns to Follow

### Naming Conventions
- Files: `kebab-case` for directories, `PascalCase.tsx` for components, `camelCase.ts` for lib files
- CSS: use existing CSS custom properties (`var(--night-vision)`) and existing utility classes (`.stalk-in`, `.emerge-from-forest`) — do not add new ones unless truly needed

### Button Pattern (from `DownloadBrief.tsx:42-75`)
```tsx
<button className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[var(--tactical-green)] bg-black hover:bg-[var(--tactical-green-dark)] hover:border-[var(--night-vision)] text-white font-mono font-bold text-sm tracking-wider transition-all duration-300 relative overflow-hidden">
  {/* scan-line sweep */}
  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[var(--night-vision)]/20 to-transparent transition-transform duration-700 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} />
  <span className="relative z-10">LABEL</span>
  {/* tactical corners */}
  <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
  <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--night-vision)] opacity-0 group-hover:opacity-100 transition-opacity" />
</button>
```

### Card / Border Pattern (from `about/page.tsx:231-243`)
```tsx
<div className="border-2 border-[var(--tactical-green-dark)] bg-black/60 backdrop-blur-sm p-6 hover:border-[var(--night-vision)] transition-all duration-500">
```

### API Route Pattern (from `app/api/contact/route.ts`)
```ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // ... validate ...
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Section Label Pattern (from `about/page.tsx:93-95`)
```tsx
<div className="flex items-center gap-4 mb-4">
  <div className="w-12 h-px bg-[var(--tactical-green)]" />
  <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">SECTION-01</span>
</div>
```

### Tailwind v4 Note
This project uses **Tailwind v4** (`@import "tailwindcss"` in globals.css, `@tailwindcss/postcss` in devDeps). Custom colors are registered via `@theme inline` in globals.css and are available as `text-night-vision`, `bg-tactical-green`, etc. (without `var()` wrapper in Tailwind classes). Both forms work — existing pages mix both. Match the style of the file you're editing.

---

## SUPABASE SETUP (do this before writing any code)

### 1. Create Supabase project (free tier at supabase.com)

### 2. Run this SQL in the Supabase SQL Editor:

```sql
-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Attachments table
CREATE TABLE attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: public can read published posts only
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_published" ON posts FOR SELECT USING (published = true);

-- RLS: public can read attachments
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_attachments" ON attachments FOR SELECT USING (true);
```

### 3. Create Storage bucket
In Supabase dashboard → Storage → New bucket → name: `attachments`, public: true.

### 4. Generate password hash (run once in terminal)
```bash
node -e "const b = require('bcryptjs'); console.log(b.hashSync('YOUR_CHOSEN_PASSWORD', 12));"
```
Copy the output — this is `ADMIN_PASSWORD_HASH`.

### 5. Environment variables to add to `.env.local` AND Vercel project settings:
```
ADMIN_PASSWORD_HASH=<bcrypt hash from step 4>
SESSION_SECRET=<random 32+ character string — use: openssl rand -base64 32>
NEXT_PUBLIC_SUPABASE_URL=<from Supabase project settings>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase project settings>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase project settings — never expose to client>
```

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation (lib + middleware + layout fix)
Set up session config, Supabase clients, slugify util, middleware guard, and fix the root layout so admin routes don't show nav/footer.

### Phase 2: Auth API + Login Page
Build the login/logout API routes, then the `/admin/login` page.

### Phase 3: Posts API
CRUD API routes for posts and attachments.

### Phase 4: Admin CMS Pages
Dashboard (list + delete) and new-post form.

### Phase 5: Public Blog Pages
`/blog` list page and `/blog/[slug]` dynamic post page.

---

## STEP-BY-STEP TASKS

---

### INSTALL dependencies

```bash
cd clawpoint-site
npm install iron-session bcryptjs @supabase/supabase-js react-markdown remark-gfm
npm install --save-dev @types/bcryptjs
```

- **VALIDATE**: `npm ls iron-session bcryptjs @supabase/supabase-js react-markdown` shows installed versions

---

### CREATE `lib/session.ts`

```ts
import type { IronSessionOptions } from 'iron-session'

export interface SessionData {
  isLoggedIn: boolean
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'clawpoint-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
  },
}
```

- **GOTCHA**: `SESSION_SECRET` must be 32+ characters. iron-session will throw at runtime if it's too short.
- **VALIDATE**: `npx tsc --noEmit` passes

---

### CREATE `lib/supabase.ts` (public/anon client)

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

- **VALIDATE**: `npx tsc --noEmit` passes

---

### CREATE `lib/supabase-admin.ts` (service role client — server only)

```ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

- **GOTCHA**: Never import `supabase-admin.ts` in any client component or file with `'use client'`. Service role key bypasses RLS.
- **VALIDATE**: `npx tsc --noEmit` passes

---

### CREATE `lib/slugify.ts`

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

- **VALIDATE**: `npx tsc --noEmit` passes

---

### CREATE `middleware.ts` (project root, next to `app/`)

```ts
import { getIronSession } from 'iron-session'
import { NextRequest, NextResponse } from 'next/server'
import { SessionData, sessionOptions } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const response = NextResponse.next()
    const session = await getIronSession<SessionData>(request, response, sessionOptions)
    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- **GOTCHA**: `middleware.ts` must be at the project root — same level as `app/`, not inside `app/`.
- **VALIDATE**: `npm run dev` starts without errors; visiting `/admin/blog` redirects to `/admin/login`

---

### UPDATE `app/layout.tsx` — replace inline Navigation/Footer with ConditionalLayout

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

Also add import at top: `import ConditionalLayout from '@/components/ConditionalLayout'`
Remove the existing `Navigation` and `Footer` imports from `app/layout.tsx`.

---

### CREATE `components/ConditionalLayout.tsx`

```tsx
'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import Footer from './Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navigation />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}
```

- **PATTERN**: Mirrors `Navigation.tsx:6` `usePathname()` usage
- **VALIDATE**: Homepage still shows nav + footer; visiting `/admin/login` shows neither

---

### CREATE `app/api/auth/login/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import bcrypt from 'bcryptjs'
import { SessionData, sessionOptions } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const hash = process.env.ADMIN_PASSWORD_HASH
    if (!hash) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 500 })
    }

    const valid = bcrypt.compareSync(password, hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    const session = await getIronSession<SessionData>(request, response, sessionOptions)
    session.isLoggedIn = true
    await session.save()
    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- **PATTERN**: Mirror `app/api/contact/route.ts` try/catch shape
- **GOTCHA**: `bcrypt.compareSync` is synchronous — fine for single admin use. Do NOT use the async version unless you await it.
- **VALIDATE**: `curl -X POST http://localhost:3000/api/auth/login -H 'Content-Type: application/json' -d '{"password":"wrongpassword"}'` returns 401

---

### CREATE `app/api/auth/logout/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/lib/session'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  const session = await getIronSession<SessionData>(request, response, sessionOptions)
  session.destroy()
  return response
}
```

---

### CREATE `app/api/posts/route.ts` (GET list + POST create)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { slugify } from '@/lib/slugify'
import { SessionData, sessionOptions } from '@/lib/session'

// GET: public → published only; admin (with session) → all
export async function GET(request: NextRequest) {
  const response = NextResponse.next()
  const session = await getIronSession<SessionData>(request, response, sessionOptions)
  const client = session.isLoggedIn ? supabaseAdmin : supabase

  const { data, error } = await client
    .from('posts')
    .select('id, title, slug, body, published, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ posts: data })
}

// POST: create new post — admin only (middleware protects /admin routes, this is an API route so check session)
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const session = await getIronSession<SessionData>(request, response, sessionOptions)
    if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, body, published = true } = await request.json()
    if (!title || !body) return NextResponse.json({ error: 'Title and body required' }, { status: 400 })

    const slug = slugify(title)

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({ title, slug, body, published })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ post: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

### CREATE `app/api/posts/[id]/route.ts` (DELETE)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { SessionData, sessionOptions } from '@/lib/session'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = NextResponse.next()
    const session = await getIronSession<SessionData>(request, response, sessionOptions)
    if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Cascade delete handles attachments table (via FK ON DELETE CASCADE)
    // But we must also remove files from Storage manually
    const { data: attachments } = await supabaseAdmin
      .from('attachments')
      .select('file_url')
      .eq('post_id', params.id)

    if (attachments?.length) {
      const paths = attachments.map(a => {
        const url = new URL(a.file_url)
        return url.pathname.split('/attachments/')[1]
      })
      await supabaseAdmin.storage.from('attachments').remove(paths)
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

### CREATE `app/api/attachments/route.ts` (POST: upload file)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { SessionData, sessionOptions } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const tmpRes = NextResponse.next()
    const session = await getIronSession<SessionData>(request, tmpRes, sessionOptions)
    if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const postId = formData.get('postId') as string

    if (!file || !postId) return NextResponse.json({ error: 'file and postId required' }, { status: 400 })

    const ext = file.name.split('.').pop()
    const path = `${postId}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('attachments')
      .upload(path, buffer, { contentType: file.type })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

    const { data: { publicUrl } } = supabaseAdmin.storage.from('attachments').getPublicUrl(path)

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

### CREATE `app/admin/login/page.tsx`

- `'use client'` component
- Single password `<input type="password">` field
- On submit: `POST /api/auth/login` → on success `router.push('/admin/blog')`
- Show "INVALID PASSWORD" error message in `text-[var(--night-vision)]` red-style (use `text-red-400` for error states since no error color is in the design system)
- Style: full-screen dark bg, centered card with `.credential-shine` class, tactical border, `stalk-in` animation, section label "AUTHENTICATION", logo at top
- Do NOT import Navigation or Footer — they won't render here anyway (ConditionalLayout handles it)

---

### CREATE `app/admin/blog/page.tsx` — CMS Dashboard

- `'use client'` component
- On mount: fetch `GET /api/posts` (returns all posts because session cookie is sent automatically)
- Render each post as a card: title, date, body excerpt, delete button
- Delete flow: click DELETE → show inline confirmation: "CONFIRM DELETE? [YES] [CANCEL]" — on YES: `DELETE /api/posts/{id}` → remove from local state
- "NEW POST" button → `router.push('/admin/blog/new')`
- "LOG OUT" button → `POST /api/auth/logout` → `router.push('/admin/login')`
- Admin header bar: logo text + "INTEL MANAGEMENT" label + logout button
- **PATTERN**: Cards mirror `about/page.tsx:231` article pattern with `.credential-shine` and `hover:border-[var(--night-vision)]`

---

### CREATE `app/admin/blog/new/page.tsx` — Write Post

- `'use client'` component
- Fields:
  - `HEADLINE` — `<input type="text">` styled like tactical input (border-b `border-[var(--tactical-green)]`, bg-transparent, text-white font-mono)
  - `BODY` — `<textarea>` full width, min 20 rows, monospaced — accepts Markdown
  - `ATTACHMENTS` — `<input type="file" multiple>` — on file select, show pending list; on submit, upload each file after post is created
- Submit flow:
  1. `POST /api/posts` with `{ title, body }` → get back `post.id` and `post.slug`
  2. For each pending attachment: `POST /api/attachments` with `FormData { file, postId }`
  3. On success: `router.push('/admin/blog')`
- Show loading state on submit button ("TRANSMITTING..." with `.cursor-blink` class)
- Back link → `/admin/blog`
- **GOTCHA**: File upload must happen after post creation since we need `postId` for the attachment record

---

### CREATE `app/blog/page.tsx` — Public Post List

- **Server component** (no `'use client'`)
- Fetch posts via Supabase client directly (not via API route — server components can call Supabase directly)
  ```ts
  import { supabase } from '@/lib/supabase'
  const { data: posts } = await supabase.from('posts').select('id, title, slug, body, created_at').eq('published', true).order('created_at', { ascending: false })
  ```
- Layout: `max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16` — centered with horizontal padding
- Each post shows as a card:
  - Section label style date: "INTEL // JUNE 29 2026"
  - Title: `.heading-h3 text-white`
  - Excerpt: first 200 chars of body, `text-gray-400 font-mono text-sm`
  - "READ INTEL →" link styled as tactical text button
- `pt-24` at top to clear the fixed navigation bar
- `.stalk-in` animation on each card with staggered `animationDelay`
- **Blog is NOT added to `navigationLinks` in Navigation.tsx**

---

### CREATE `app/blog/[slug]/page.tsx` — Individual Post

- **Server component**
- Fetch post by slug + its attachments:
  ```ts
  const { data: post } = await supabase.from('posts').select('*, attachments(*)').eq('slug', slug).eq('published', true).single()
  ```
- If not found: `notFound()` from `next/navigation`
- `generateStaticParams` — optional but recommended for performance:
  ```ts
  export async function generateStaticParams() {
    const { data } = await supabase.from('posts').select('slug').eq('published', true)
    return data?.map(p => ({ slug: p.slug })) ?? []
  }
  ```
- Layout: same centered container as list page
- Headline: `.heading-h2 text-white mb-4`
- Date: section label style
- Body: `<ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>` — wrap in a `prose`-style div (since Tailwind Typography isn't installed, add these manual markdown styles to `globals.css` — see below)
- Attachments: if `post.attachments.length > 0`, show "ATTACHMENTS" section with file name links and download attribute
- Back link: `← BACK TO INTEL` → `/blog`

### ADD markdown prose styles to `globals.css`

Add after the existing `@layer components` block:

```css
/* Blog markdown content */
.blog-body h1 { @apply text-3xl font-bold text-white font-mono mt-8 mb-4; }
.blog-body h2 { @apply text-2xl font-bold text-white font-mono mt-6 mb-3; }
.blog-body h3 { @apply text-xl font-bold text-white font-mono mt-5 mb-2; }
.blog-body p  { @apply text-gray-300 font-mono text-base leading-relaxed mb-4; }
.blog-body a  { @apply text-[var(--night-vision)] hover:underline; }
.blog-body ul { @apply list-disc list-inside text-gray-300 font-mono mb-4 space-y-1; }
.blog-body ol { @apply list-decimal list-inside text-gray-300 font-mono mb-4 space-y-1; }
.blog-body code { @apply text-[var(--night-vision)] bg-black/60 px-1 py-0.5 text-sm font-mono; }
.blog-body pre  { @apply bg-black/80 border border-[var(--tactical-green-dark)] p-4 overflow-x-auto mb-4; }
.blog-body blockquote { @apply border-l-4 border-[var(--tactical-green)] pl-4 text-gray-400 italic font-mono mb-4; }
.blog-body strong { @apply text-white font-bold; }
.blog-body hr { @apply border-[var(--tactical-green-dark)] my-6; }
```

Apply with `<div className="blog-body"><ReactMarkdown ...>{post.body}</ReactMarkdown></div>`

---

## TESTING STRATEGY

### Manual Admin Flow
1. Visit `/admin/blog` → should redirect to `/admin/login`
2. Enter wrong password → "INVALID PASSWORD" shown, stay on login
3. Enter correct password → redirect to `/admin/blog`
4. Create a post → appears in dashboard list and at `/blog`
5. Click post on `/blog` → individual post page renders markdown correctly
6. Delete post with confirmation → removed from list and 404 on `/blog/[slug]`
7. Log out → redirect to login; visiting `/admin/blog` redirects back to login
8. Refresh `/admin/blog` within 8 hours (session TTL) → stays logged in

### Edge Cases to Test
- Slug collision (two posts with same title) — Supabase UNIQUE constraint will reject; surface the error in the form
- Very long title → slug truncated at 80 chars
- No posts → `/blog` shows "NO INTEL AVAILABLE" empty state
- Direct URL `/blog/nonexistent-slug` → 404 page
- File upload with no post body → validate client-side before submitting

---

## VALIDATION COMMANDS

### Level 1: Type check
```bash
npx tsc --noEmit
```

### Level 2: Lint
```bash
npx eslint app/blog app/admin app/api/auth app/api/posts app/api/attachments lib/ components/ConditionalLayout.tsx middleware.ts
```

### Level 3: Dev server smoke test
```bash
npm run dev
# Then manually verify:
# - / (homepage) has nav + footer ✓
# - /admin/blog redirects to /admin/login ✓
# - /blog renders without errors ✓
```

### Level 4: Build check
```bash
npm run build
```
Vercel deploys from build — this must pass clean.

---

## ACCEPTANCE CRITERIA

- [ ] `/admin/blog` redirects to `/admin/login` when not authenticated
- [ ] Correct password sets session and redirects to dashboard
- [ ] Wrong password shows error, does not set session
- [ ] Dashboard lists all posts (published and unpublished)
- [ ] New post form saves title + body + uploads attachments → post appears in dashboard
- [ ] Delete button requires confirmation before calling DELETE API
- [ ] Logout destroys session and redirects to login
- [ ] Navigation bar does NOT appear on any `/admin/*` page
- [ ] Blog is NOT listed in the site navigation
- [ ] `/blog` shows all published posts centered with horizontal padding
- [ ] Clicking a post navigates to `/blog/[slug]` and renders the full markdown body
- [ ] `/blog/[slug]` for a non-existent slug returns the 404 page
- [ ] Attachments are listed on the post page as download links
- [ ] `npm run build` passes with no errors
- [ ] `npx tsc --noEmit` passes with no errors

---

## COMPLETION CHECKLIST

- [ ] All dependencies installed
- [ ] `.env.local` populated (ADMIN_PASSWORD_HASH, SESSION_SECRET, Supabase keys)
- [ ] Supabase project created, SQL schema applied, storage bucket created
- [ ] `middleware.ts` at project root (not inside `app/`)
- [ ] `ConditionalLayout.tsx` replaces inline Navigation/Footer in root layout
- [ ] All API routes created and tested with curl or Postman
- [ ] Admin login page works
- [ ] CMS dashboard lists, creates, and deletes posts
- [ ] Public `/blog` and `/blog/[slug]` render correctly
- [ ] `npm run build` passes
- [ ] Vercel env vars set (same 5 vars as `.env.local`)

---

## NOTES

**Why iron-session over NextAuth?** NextAuth requires an OAuth provider or database adapter for credentials flow in v5. For a single-admin use case with a hashed env var password, iron-session is simpler, smaller, and equally secure. No external service or database needed for auth.

**Why bcryptjs over bcrypt?** `bcrypt` requires native node bindings that can fail on Vercel's serverless runtime. `bcryptjs` is pure JS and works everywhere.

**Why Supabase over file-based storage?** Posts stored in JSON files on the filesystem wouldn't survive Vercel deploys (ephemeral filesystem). Supabase free tier (500MB DB, 1GB storage) is more than enough and survives deploys.

**Why not Tailwind Typography plugin?** The site uses Tailwind v4 which has different plugin syntax. Manual `.blog-body` CSS utilities are safer and match the existing globals.css approach.

**Confidence Score: 8.5/10** — The main risk is iron-session API surface in Next.js 16 / React 19 (very new). Verify the import path is `iron-session` (v8) not `iron-session/next`. If iron-session has issues, fallback plan is `jose` (JWT) for session management — same pattern but using JWT signed with `SESSION_SECRET`.
