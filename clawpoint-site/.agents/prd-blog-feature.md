# PRD: Clawpoint Security Collective — Blog Feature

**Version:** 1.1  
**Date:** 2026-07-05  
**Status:** Draft  

---

## 1. Executive Summary

Clawpoint Security Collective (CSC) requires a blog publishing system to establish thought leadership, distribute threat intelligence, and generate organic discovery from prospects, government agencies, and the broader cybersecurity community. The blog must operate without any recurring cost, integrate seamlessly with the existing Next.js 16 / Tailwind v4 codebase and tactical aesthetic, and be fully optimized for both traditional search engines and AI-powered discovery tools (LLMs, AI chatbots, AI search).

The system has two distinct surfaces: a **role-protected CMS** supporting multiple named users (Admins and Authors) who log in with email and password via Supabase Auth; and a **public-facing blog** at `/blog` that renders published posts with pagination, category/tag filtering, title search, related posts, and a copy-link share button. The blog is intentionally excluded from the main site navigation and will be linked from other pages on an as-needed basis.

**MVP Goal:** Ship a fully functional blog — CMS + public pages + SEO + AI optimization — in a single implementation pass, with zero paid infrastructure beyond what the site already uses.

---

## 2. Mission

**Product Mission:** Give Clawpoint Security Collective a credible, search-optimized content publishing platform that positions CSC as the apex intelligence in its domain and surfaces naturally to both human readers and AI systems.

**Core Principles:**

1. **Tactical aesthetic integrity** — Every page, form, and component must match the existing dark-green military design system without exception.
2. **SEO and AI-first content** — Every published post ships with structured metadata, JSON-LD schema, Open Graph tags, and sitemap inclusion automatically.
3. **Zero friction for the admin** — Writing and publishing a post should take under 5 minutes. The WYSIWYG editor removes any need to know markdown or HTML.
4. **No recurring cost** — All infrastructure (database, file storage, auth) uses free tiers of existing or new services.
5. **Content permanence** — Posts and their attachments must survive Vercel deploys. No filesystem-based storage.

---

## 3. Target Users

### User A: CMS Admin
- **Who:** Primary operator — manages all content, categories, tags, and other users' access. Sets user roles directly in the Supabase dashboard.
- **Technical comfort:** Comfortable with web UIs; not necessarily a developer
- **Needs:** Full control over all posts (including others'), category/tag management, ability to delete any post
- **Pain points:** Needs confidence that no one can publish unauthorized content or delete others' work without admin privileges

### User A2: CMS Author
- **Who:** Team member invited to contribute content — can write and edit their own posts
- **Technical comfort:** Comfortable with web UIs; not a developer
- **Needs:** Fast, intuitive post creation with WYSIWYG editing, image embedding, file attachments, draft saving, and simple publish/unpublish control
- **Pain points:** Would not write posts if forced to learn markdown or manage files manually

### User B: Prospects & Leads
- **Who:** Organizations evaluating CSC for cybersecurity services
- **Technical comfort:** Mixed — may be executives, procurement officers, or technical leads
- **Needs:** Credible, professional content that demonstrates CSC's expertise; easy to read on any device
- **Pain points:** Generic-looking blogs that don't signal domain authority

### User C: Government Agencies
- **Who:** Federal, state, or local government contacts considering CSC's SDVOSB-qualified services
- **Technical comfort:** Variable
- **Needs:** Formal, authoritative content — threat advisories, capability demonstrations, compliance-adjacent topics
- **Pain points:** Sites that don't surface in search or feel amateurish

### User D: Cybersecurity Community
- **Who:** Practitioners, researchers, peers
- **Technical comfort:** High
- **Needs:** Technically credible threat intel, thought leadership; content that gets shared in professional communities
- **Pain points:** Thin or marketing-only content

### User E: AI Systems (LLMs, AI Search)
- **Who:** ChatGPT, Perplexity, Google AI Overview, Bing Copilot, and other AI-powered discovery tools
- **Technical comfort:** N/A — machine reader
- **Needs:** Structured, parseable content with clear schema markup, an `/llms.txt` descriptor file, a clean sitemap, and semantic HTML
- **Pain points:** Missing or malformed structured data, no sitemap, JavaScript-only rendering

---

## 4. MVP Scope

### Core Functionality
- ✅ Supabase Auth — email + password login for multiple named users
- ✅ Role-based access: **Admin** (full control) and **Author** (own posts only) — roles set in Supabase `profiles` table
- ✅ Password reset flow via email ("forgot password")
- ✅ Admin CMS dashboard: Admins see all posts; Authors see only their own
- ✅ WYSIWYG rich text editor (TipTap) with bold, italic, headings, lists, links, inline images
- ✅ Post fields: title, body (rich text HTML), excerpt (custom or auto), hero image (optional), category, tags, SEO title override, SEO description override, slug (auto from title), published/draft toggle
- ✅ File attachments per post (all file types; separate download section on post page)
- ✅ Inline image upload within the WYSIWYG editor
- ✅ Save as draft without publishing
- ✅ Edit any published or draft post at any time
- ✅ Delete post with two-step confirmation (soft confirmation UI before destructive API call)
- ✅ Public `/blog` page: paginated post list with title+excerpt, date, category, tags
- ✅ Category and tag filtering on `/blog`
- ✅ Title-only search on `/blog`
- ✅ Public `/blog/[slug]` individual post page with full body, attachments section, related posts, back-to-list link
- ✅ Copy-link share button on individual post pages
- ✅ Auto-generated SEO metadata (title, description, OG tags) with per-post override fields
- ✅ JSON-LD Article schema on every post page
- ✅ `/llms.txt` file for AI crawler discovery
- ✅ Auto-generated `/sitemap.xml` including all published posts
- ✅ RSS feed at `/blog/feed.xml`
- ✅ Admin navigation does NOT appear in site nav (`navigationLinks` array unchanged)
- ✅ Session managed by Supabase Auth (JWT + refresh token via `@supabase/ssr`)
- ✅ Middleware guards all `/admin/*` routes — unauthenticated users redirected to `/admin/login`

### Out of Scope (Post-MVP)
- ❌ Scheduled publishing (future publish date/time)
- ❌ Comments section
- ❌ Email newsletter / subscriber management
- ❌ Post analytics / view counts
- ❌ Social share buttons beyond copy-link
- ❌ Full-body text search (only title search in MVP)
- ❌ Author profiles / headshots per post
- ❌ Post versioning / edit history
- ❌ Content import from other platforms
- ❌ Custom domain for blog (e.g., blog.clawpoint.security)
- ❌ Webhooks / CMS API for external consumers

---

## 5. User Stories

### Admin Stories

**AS-1:** As a CMS user, I want to log in with my email and password so that only invited team members can access the CMS.
> *Example: I navigate to `/admin/login`, type my email and password, and am redirected to the dashboard.*

**AS-1b:** As a CMS user, I want to reset my password via email so that I can regain access if I forget it.
> *Example: I click "FORGOT PASSWORD" on the login page, enter my email, and receive a reset link from Supabase.*

**AS-2:** As the site admin, I want to write a post in a WYSIWYG editor so that I don't need to know HTML or markdown.
> *Example: I click "NEW POST", type my headline, and use the toolbar to bold a phrase, add a heading, and paste in a link — just like writing in Google Docs.*

**AS-3:** As the site admin, I want to save a post as a draft so that I can finish writing it later before it goes public.
> *Example: I start writing a threat advisory, hit "SAVE DRAFT", and the post appears in the dashboard with a "DRAFT" badge. It is not visible on `/blog`.*

**AS-4:** As the site admin, I want to assign a category and tags to a post so that readers can find related content.
> *Example: I tag a post "Zero Trust" and assign it to the "Threat Intel" category before publishing.*

**AS-5:** As the site admin, I want to override the SEO title and description per post so that my content ranks better in search engines.
> *Example: The post title is "Why Legacy PAM Fails in DoD Environments" but I set a shorter SEO title optimized for a keyword.*

**AS-6:** As the site admin, I want to upload file attachments to a post so that readers can download supporting documents.
> *Example: I attach a PDF threat brief to a post. Readers see a "ATTACHMENTS" section at the bottom of the post page with a download link.*

**AS-7:** As the site admin, I want to delete a post with a confirmation step so that I don't accidentally remove published content.
> *Example: I click DELETE on a post → a confirmation prompt appears → I confirm → the post is removed from the database and the public blog.*

### Public Reader Stories

**PS-1:** As a prospect, I want to browse a list of blog posts so that I can understand CSC's areas of expertise.
> *Example: I visit `/blog` and see a paginated list of posts showing the headline, a short excerpt, the date, and its category.*

**PS-2:** As a government agency contact, I want to filter posts by category so that I can quickly find threat advisories relevant to my mission.
> *Example: I click "Threat Intel" on the `/blog` page and the list filters to show only posts in that category.*

**PS-3:** As a cybersecurity practitioner, I want to read a full post on its own page so that I can engage deeply with the content.
> *Example: I click a post title and land on `/blog/securing-nmci-environments` which renders the full post with rich formatting and a download link for the attached PDF.*

**PS-4:** As a reader, I want to copy the post link so that I can share it with a colleague.
> *Example: I click "COPY LINK" on a post page, the URL is copied to my clipboard, and a brief confirmation message appears.*

**PS-5:** As an AI system, I want to parse structured data and a site descriptor so that I can accurately represent CSC's blog content in AI-generated answers.
> *Example: Perplexity crawls `/blog/zero-trust-maturity` and reads the JSON-LD Article schema, the OG tags, and references `/llms.txt` to understand CSC's content authority.*

---

## 6. Core Architecture & Patterns

### High-Level Architecture

```
Browser
  └── Next.js 16 App Router (Vercel)
        ├── /blog/*              — Server Components, Supabase anon client (public reads)
        ├── /admin/*             — Client Components, Supabase Auth guard via middleware.ts
        ├── /auth/callback       — API Route, Supabase Auth email confirmation handler
        ├── /api/posts/*         — API Routes, Supabase server client (role-checked writes)
        ├── /api/attachments/*   — API Routes, Supabase Storage
        ├── /api/images/upload   — API Route, Supabase Storage (inline WYSIWYG images)
        ├── /blog/feed.xml       — API Route, RSS XML generation
        └── /sitemap.xml         — Next.js sitemap.ts (auto-generated)

Supabase (free tier)
  ├── Auth                  — email + password, JWT sessions, password reset emails
  ├── PostgreSQL DB         — profiles (roles), posts, categories, tags, post_tags, attachments
  └── Storage Bucket        — "media" (attachments + inline images)
```

### Directory Structure

```
clawpoint-site/
├── middleware.ts                          # Supabase Auth guard for /admin/*
├── app/
│   ├── sitemap.ts                         # Next.js sitemap generator
│   ├── auth/
│   │   └── callback/route.ts             # Supabase email confirmation handler
│   ├── blog/
│   │   ├── page.tsx                       # Public list (server component)
│   │   ├── [slug]/
│   │   │   └── page.tsx                   # Individual post (server component)
│   │   ├── category/
│   │   │   └── [slug]/page.tsx            # Posts filtered by category
│   │   ├── tag/
│   │   │   └── [slug]/page.tsx            # Posts filtered by tag
│   │   └── feed.xml/
│   │       └── route.ts                   # RSS feed API route
│   ├── admin/
│   │   ├── login/page.tsx                 # Login page — email + password (client)
│   │   ├── forgot-password/page.tsx       # Password reset request page (client)
│   │   ├── reset-password/page.tsx        # New password form after reset link (client)
│   │   └── blog/
│   │       ├── page.tsx                   # CMS dashboard (client component)
│   │       ├── new/page.tsx               # Create post (client component)
│   │       └── [id]/edit/page.tsx         # Edit post (client component)
│   └── api/
│       ├── posts/
│       │   ├── route.ts                   # GET list, POST create
│       │   └── [id]/route.ts              # GET one, PUT update, DELETE
│       ├── categories/route.ts            # GET list, POST create
│       ├── tags/route.ts                  # GET list, POST create
│       ├── attachments/
│       │   ├── route.ts                   # POST upload
│       │   └── [id]/route.ts              # DELETE
│       └── images/
│           └── upload/route.ts            # POST upload inline image (WYSIWYG)
├── components/
│   ├── ConditionalLayout.tsx              # Hides nav+footer on /admin/* routes
│   ├── blog/
│   │   ├── PostCard.tsx                   # Post list card component
│   │   ├── PostBody.tsx                   # Renders TipTap HTML safely
│   │   ├── TagChip.tsx                    # Tag pill component
│   │   ├── CategoryBadge.tsx              # Category label component
│   │   ├── BlogSearch.tsx                 # Title search input (client)
│   │   ├── Pagination.tsx                 # Page nav component (client)
│   │   └── CopyLinkButton.tsx             # Copy-link share button (client)
│   └── admin/
│       ├── Editor.tsx                     # TipTap WYSIWYG wrapper (client)
│       ├── PostForm.tsx                   # Shared create/edit form (client)
│       ├── AttachmentUploader.tsx         # File upload UI (client)
│       └── DeleteConfirm.tsx              # Two-step delete confirmation (client)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                      # Browser Supabase client (@supabase/ssr)
│   │   ├── server.ts                      # Server Supabase client (@supabase/ssr)
│   │   └── middleware.ts                  # Supabase middleware session refresher
│   ├── slugify.ts                         # title → url-safe slug
│   ├── excerpt.ts                         # HTML → plain text excerpt
│   └── rss.ts                             # RSS XML builder utility
└── public/
    └── llms.txt                           # AI crawler descriptor
```

### Key Design Patterns

- **Server Components for public pages:** `/blog/*` routes use Next.js server components and call Supabase directly — no client-side data fetching, no loading spinners, better SEO.
- **Client Components for admin:** All `/admin/*` pages are `'use client'` — they manage form state, WYSIWYG editor, and API calls.
- **Middleware auth guard:** `middleware.ts` uses `@supabase/ssr` to read the Supabase session cookie and redirects unauthenticated users away from all `/admin/*` routes (except `/admin/login`). Also refreshes expired tokens transparently.
- **Auth callback route:** `app/auth/callback/route.ts` handles the redirect after email confirmation and password reset — exchanges the code for a session and redirects to `/admin/blog` or `/admin/reset-password`.
- **ConditionalLayout:** Root layout wraps Navigation/Footer in a client component that reads `usePathname()` and hides both on `/admin/*`.
- **Role checking in API routes:** All write API routes create a Supabase server client, call `supabase.auth.getUser()` to verify the session, then query the `profiles` table to check the user's role before performing any operation.

---

## 7. Features

### 7.1 Admin CMS

#### Login Page (`/admin/login`)
- Email + password fields, submit button, "FORGOT PASSWORD" link
- On submit: `supabase.auth.signInWithPassword({ email, password })` → on success redirect to `/admin/blog`
- Wrong credentials: inline error "AUTHENTICATION FAILED"
- Matches tactical aesthetic: full-screen dark, centered panel, `credential-shine` border, `stalk-in` animation

#### Forgot Password (`/admin/forgot-password`)
- Email field + submit button
- On submit: `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/auth/callback?next=/admin/reset-password' })`
- Shows "TRANSMISSION SENT" confirmation regardless of whether email exists (security best practice)

#### Reset Password (`/admin/reset-password`)
- Reached via link in Supabase password reset email → `/auth/callback` exchanges code → redirected here with active session
- New password + confirm password fields
- On submit: `supabase.auth.updateUser({ password })` → redirect to `/admin/blog`

#### Dashboard (`/admin/blog`)
- Fetches all posts (drafts + published) ordered by `created_at DESC`
- Each post row shows: title, category, status badge (DRAFT / LIVE), date, EDIT and DELETE actions
- DRAFT posts have a dimmed/muted style; LIVE posts have `text-[var(--night-vision)]` status
- DELETE: click → inline confirmation row appears "CONFIRM DELETE — [YES] [CANCEL]" → YES calls `DELETE /api/posts/{id}` → post removed from list without page reload
- "NEW POST" button → `/admin/blog/new`
- "LOG OUT" button → `supabase.auth.signOut()` → redirect to `/admin/login`
- Dashboard respects role: Admins see all posts + author name column; Authors see only their own posts

#### Post Form — Create (`/admin/blog/new`) & Edit (`/admin/blog/[id]/edit`)
Shared `PostForm` component pre-populated with existing data on edit.

**Fields:**
| Field | Type | Notes |
|---|---|---|
| Title | Text input | Required; slug auto-generated |
| Category | Select dropdown | Required; pulls from `/api/categories` |
| Tags | Multi-select / tag input | Optional; pulls from `/api/tags`, allows creating new inline |
| Hero image | File upload | Optional; uploads to Supabase Storage on selection |
| Body | TipTap WYSIWYG | Required; supports inline image upload |
| Excerpt | Textarea | Optional; auto-generated from body if left blank |
| SEO Title | Text input | Optional; falls back to post title |
| SEO Description | Textarea | Optional; falls back to excerpt |
| Status | Toggle | DRAFT / PUBLISHED |
| Attachments | Multi-file upload | Optional; shows uploaded file list with delete |

**Save flow:**
1. `POST /api/posts` (create) or `PUT /api/posts/{id}` (update) with all fields
2. For each pending file attachment: `POST /api/attachments` with `FormData { file, postId }`
3. Hero image uploaded to Supabase Storage on file select (not on save)
4. Inline WYSIWYG images uploaded immediately on insertion via `/api/images/upload`
5. Redirect to `/admin/blog` on success

#### WYSIWYG Editor (TipTap)
Extensions: `StarterKit`, `Image` (with upload handler), `Link`, `Placeholder`

The editor stores content as HTML. Rendered on public pages inside `<PostBody>` which sanitizes HTML with `DOMPurify` before rendering to prevent XSS.

---

### 7.2 Public Blog

#### List Page (`/blog`)
- Server component; fetches published posts from Supabase (10 per page)
- Horizontal padding: `px-6 sm:px-8 lg:px-16 max-w-5xl mx-auto`
- `pt-24` to clear fixed navigation bar
- **Search bar** at top: title-only, client-side filtering of the current page results (no API call needed for title search at MVP scale)
- **Category filter chips:** row of category buttons; clicking one reloads page with `?category=slug` query param
- **Tag filter:** similar row below categories; `?tag=slug` query param
- **Pagination:** "PREV — PAGE 2 OF 5 — NEXT" style controls at the bottom
- **Empty state:** "NO INTEL PUBLISHED" with tactical styling
- Each `PostCard` shows: title, excerpt (~160 chars), date (formatted as "JUN 29 2026"), category badge, tag chips

#### Individual Post Page (`/blog/[slug]`)
- Server component; fetches post + attachments + related posts by slug
- `notFound()` if slug doesn't match a published post
- `generateStaticParams` for ISR (Incremental Static Regeneration) — revalidate every 60 seconds
- **Layout:** same centered container as list page
- **Hero image:** full-width if set, with `object-cover` and gradient overlay
- **Header:** section label (e.g., "THREAT INTEL // JUN 29 2026"), headline (`.heading-h2`), category badge, tag chips
- **Body:** `<PostBody>` renders sanitized TipTap HTML inside `.blog-body` CSS class
- **Copy link button:** client component; `navigator.clipboard.writeText(window.location.href)` → brief "LINK COPIED" confirmation
- **Attachments section:** if post has attachments, shows "ATTACHMENTS" section with file name, file type, file size, and download link for each
- **Related posts:** up to 3 posts sharing the same category, excluding current post; shown as compact `PostCard` components
- **Back to blog:** "← RETURN TO INTEL" link to `/blog`
- **JSON-LD schema:** inline `<script type="application/ld+json">` with `Article` schema (headline, datePublished, dateModified, author, publisher, image, description)

#### Category Pages (`/blog/category/[slug]`)
- Same layout as `/blog` list but pre-filtered to category; heading shows "CATEGORY: THREAT INTEL"

#### Tag Pages (`/blog/tag/[slug]`)
- Same layout as `/blog` list but pre-filtered to tag; heading shows "TAG: ZERO TRUST"

---

### 7.3 SEO & AI Optimization

#### Per-Post Metadata (Next.js `generateMetadata`)
```
title: seo_title || post.title | "Clawpoint Security Collective"
description: seo_description || excerpt
openGraph.title: same as title
openGraph.description: same as description
openGraph.image: hero_image_url || /images/logo.png
openGraph.type: "article"
openGraph.publishedTime: created_at
openGraph.modifiedTime: updated_at
openGraph.tags: [tags array]
```

#### JSON-LD Article Schema (every post page)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "datePublished": "...",
  "dateModified": "...",
  "author": { "@type": "Organization", "name": "Clawpoint Security Collective" },
  "publisher": { "@type": "Organization", "name": "Clawpoint Security Collective", "logo": "..." },
  "description": "...",
  "image": "...",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://clawpoint.security/blog/..." }
}
```

#### `/llms.txt`
A plain-text file in `public/llms.txt` describing the site for AI crawlers (per the emerging llms.txt standard):
```
# Clawpoint Security Collective

> Elite cybersecurity company specializing in mission assurance, threat intelligence, and cyber resilience for government and enterprise clients. SDVOSB certified.

## Blog
The /blog path contains published articles on threat intelligence, cybersecurity strategy, Zero Trust, and mission-critical security operations.

## Contact
CSC_growth@clawpointsecuritycollective.com
```

#### `/sitemap.xml`
Generated via `app/sitemap.ts` using Next.js native sitemap API. Includes:
- All static pages (`/`, `/about`, `/solutions`, `/infinite-view`, `/contact`)
- All published blog posts (`/blog/[slug]`)
- All category pages (`/blog/category/[slug]`)
- All tag pages (`/blog/tag/[slug]`)
- Priority: `1.0` for homepage, `0.8` for posts, `0.5` for list/category/tag pages

#### RSS Feed (`/blog/feed.xml`)
- API route generating valid RSS 2.0 XML
- Includes: title, link, description, pubDate, category, content (sanitized HTML body excerpt)
- `Content-Type: application/rss+xml`

---

## 8. Technology Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.1.1 | App Router, already in use |
| Language | TypeScript | 5.9.3 | Already in use |
| Styling | Tailwind CSS | v4 | Already in use; `@import "tailwindcss"` syntax |
| Database | Supabase (PostgreSQL) | Latest | Free tier: 500MB DB |
| File Storage | Supabase Storage | Latest | Free tier: 1GB; bucket: "media" |
| Auth | Supabase Auth | Built-in | Email + password, JWT sessions, password reset — no extra library needed |
| Auth SSR helper | @supabase/ssr | Latest | Server-side session reading for Next.js App Router + middleware |
| Supabase client | @supabase/supabase-js | Latest | Browser + server clients |
| WYSIWYG editor | TipTap | v2 | MIT license; `@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-image` + `@tiptap/extension-link` |
| HTML sanitizer | DOMPurify | Latest | Sanitizes TipTap HTML before render |

**New dependencies to install:**
```bash
npm install @supabase/supabase-js @supabase/ssr @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder dompurify
npm install --save-dev @types/dompurify
```

---

## 9. Security & Configuration

### Authentication
- **Supabase Auth** handles all authentication — email + password, JWT issuance, session refresh, and password reset emails
- Sessions stored as HTTP-only cookies managed by `@supabase/ssr` — no custom session library needed
- `middleware.ts` uses `@supabase/ssr` `createServerClient` to read and refresh the session on every request to `/admin/*`
- `app/auth/callback/route.ts` handles Supabase's post-confirmation redirect (email verify + password reset)
- New users are invited via the Supabase dashboard (Authentication → Users → Invite); they receive an email and set their own password
- Roles (`admin` / `author`) are stored in the `profiles` table and set manually in the Supabase dashboard

### Authorization

| Action | Admin | Author | Anon |
|---|---|---|---|
| Read published posts | ✅ | ✅ | ✅ |
| Read own draft posts | ✅ | ✅ | ❌ |
| Read others' drafts | ✅ | ❌ | ❌ |
| Create posts | ✅ | ✅ | ❌ |
| Edit own posts | ✅ | ✅ | ❌ |
| Edit others' posts | ✅ | ❌ | ❌ |
| Delete any post | ✅ | ❌ | ❌ |
| Manage categories/tags | ✅ | ❌ | ❌ |

- Enforced at two layers: Supabase RLS policies (database level) + API route role checks (application level)
- Service-role key used only in server-side API routes for operations that need to bypass RLS (e.g., Storage uploads); never imported in client components

### Configuration — Environment Variables

| Variable | Where set | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` + Vercel | Supabase project URL — safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` + Vercel | Supabase publishable key — safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` + Vercel | Supabase secret key — server-side only, never in client |

All three are already set in `.env.local`. ✅

### Security Scope

**In scope:**
- XSS prevention: DOMPurify sanitization of TipTap HTML before rendering
- Session security: HTTP-only cookies via `@supabase/ssr`, `SameSite: lax`
- Role enforcement: RLS at DB level + role check in every write API route
- Secrets isolation: service-role key never exposed to browser

**Out of scope (not needed at this scale):**
- Rate limiting on login endpoint (Supabase has built-in abuse protection)
- IP allowlisting for admin
- Audit logging

---

## 10. API Specification

### Auth (handled by Supabase Auth SDK — no custom API routes needed)

| Action | Method | Notes |
|---|---|---|
| Sign in | `supabase.auth.signInWithPassword({ email, password })` | Called client-side in login page |
| Sign out | `supabase.auth.signOut()` | Called client-side in dashboard |
| Password reset request | `supabase.auth.resetPasswordForEmail(email, { redirectTo })` | Called client-side in forgot-password page |
| Update password | `supabase.auth.updateUser({ password })` | Called client-side in reset-password page |
| Get session (server) | `supabase.auth.getUser()` | Called in API routes via server client |
| Auth callback | `GET /auth/callback?code=...` | Supabase redirects here after email confirmation / password reset |

---

### Posts

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/api/posts` | No (filtered by RLS) | List posts; `?page=1&limit=10&category=slug&tag=slug&q=title` |
| POST | `/api/posts` | Yes | Create post |
| GET | `/api/posts/[id]` | Yes | Get single post (admin; includes drafts) |
| PUT | `/api/posts/[id]` | Yes | Update post |
| DELETE | `/api/posts/[id]` | Yes | Delete post + cascade attachments |

**Post object:**
```json
{
  "id": "uuid",
  "title": "Why Legacy PAM Fails in DoD Environments",
  "slug": "why-legacy-pam-fails-in-dod-environments",
  "body": "<p>Rich text HTML...</p>",
  "excerpt": "Short summary shown on list page...",
  "hero_image_url": "https://supabase.co/storage/...",
  "category_id": "uuid",
  "published": true,
  "seo_title": "Legacy PAM Failures in Defense | CSC",
  "seo_description": "Custom meta description...",
  "created_at": "2026-06-30T12:00:00Z",
  "updated_at": "2026-06-30T12:00:00Z"
}
```

---

### Categories & Tags

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/categories` | No | List all categories |
| POST | `/api/categories` | Yes | Create category `{ name }` |
| GET | `/api/tags` | No | List all tags |
| POST | `/api/tags` | Yes | Create tag `{ name }` |

---

### Attachments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/attachments` | Yes | Upload file; `FormData { file, postId }` |
| DELETE | `/api/attachments/[id]` | Yes | Delete attachment record + Storage file |

---

### Inline Image Upload (WYSIWYG)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/images/upload` | Yes | Upload image; `FormData { file }` → `{ url }` |

---

## 11. Database Schema

Already deployed to Supabase. ✅ Full schema in the Supabase SQL Editor history. Summary:

| Table | Purpose |
|---|---|
| `profiles` | Extends `auth.users` — stores `role` (admin/author), email, full_name. Auto-created on signup via trigger. |
| `categories` | Blog categories (seeded: Threat Intelligence, Thought Leadership, Company News, Case Studies) |
| `tags` | Free-form tags, created by admins inline during post writing |
| `posts` | Posts — title, slug, body (HTML), excerpt, hero_image_url, category_id, author_id, published, seo_title, seo_description |
| `post_tags` | Many-to-many junction between posts and tags |
| `attachments` | File attachments per post — file_name, file_url, file_size, file_type |

RLS is enabled on all tables. Key policies:
- Public (anon) can only read `published = true` posts
- Authors can read/create/edit their own posts
- Admins can read/edit/delete any post and manage categories/tags
- All authenticated users can read categories, tags, and profiles

---

## 12. Success Criteria

### MVP Success Definition
The blog is successful at MVP when: a post written in the CMS appears publicly at `/blog/[slug]` with correct metadata, is included in the sitemap, appears in the RSS feed, and passes Google's Rich Results Test for Article schema — all without any code changes.

### Functional Requirements
- ✅ Admin can log in and log out securely
- ✅ Admin can create a post with WYSIWYG body, hero image, category, tags, attachments, and SEO fields
- ✅ Admin can save as draft (not visible to public) or publish (visible immediately)
- ✅ Admin can edit any post after publishing
- ✅ Admin can delete a post with two-step confirmation
- ✅ Public `/blog` shows paginated list of published posts with category/tag chips and date
- ✅ Category and tag filter links work and produce filtered results
- ✅ Title search filters the visible post list
- ✅ Individual post pages render WYSIWYG HTML, hero image, attachments, and related posts
- ✅ Copy-link button copies the post URL to clipboard
- ✅ Each post page has correct OG metadata and JSON-LD Article schema
- ✅ `/sitemap.xml` includes all published posts
- ✅ `/blog/feed.xml` returns valid RSS 2.0
- ✅ `/llms.txt` exists and describes the site for AI crawlers
- ✅ Blog does not appear in the main site navigation
- ✅ `npm run build` passes with zero errors
- ✅ `npx tsc --noEmit` passes with zero errors

### Quality Indicators
- First Contentful Paint on `/blog` < 2s (server component, no client JS waterfall)
- Google Rich Results Test passes on any post URL
- No 404s in sitemap
- RSS feed validates at W3C RSS validator

---

## 13. Implementation Phases

### Phase 1: Foundation (Day 1)
**Goal:** Everything needed before writing a single page.

- ✅ Supabase project created, SQL schema deployed, `media` storage bucket created — **DONE**
- ✅ Admin account created in Supabase Auth, role set to `admin` in profiles table — **DONE**
- ✅ `.env.local` populated with Supabase URL, anon key, service role key — **DONE**
- ⬜ Install all new npm dependencies
- ⬜ Create `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`
- ⬜ Create `lib/slugify.ts`, `lib/excerpt.ts`, `lib/rss.ts`
- ⬜ Create `middleware.ts` (Supabase Auth guard for `/admin/*`)
- ⬜ Create `app/auth/callback/route.ts` (email confirmation + password reset handler)
- ⬜ Create `components/ConditionalLayout.tsx`
- ⬜ Update `app/layout.tsx` to use `ConditionalLayout`
- ⬜ Add `.blog-body` CSS utilities to `globals.css`
- ⬜ Create `public/llms.txt`
- ⬜ Set Supabase **Site URL** to `http://localhost:3000` and add production URL to **Redirect URLs** in Auth settings

**Validation:** Dev server starts, `/admin/blog` redirects to `/admin/login`, homepage still shows nav + footer.

---

### Phase 2: Auth Pages + Admin CMS (Day 2)
**Goal:** Admin can log in, reset password, write, edit, and delete posts.

- ⬜ `app/admin/login/page.tsx` (email + password, "FORGOT PASSWORD" link)
- ⬜ `app/admin/forgot-password/page.tsx`
- ⬜ `app/admin/reset-password/page.tsx`
- ⬜ `app/api/categories/route.ts` + `app/api/tags/route.ts`
- ✅ `app/api/posts/route.ts` (GET + POST)
- ✅ `app/api/posts/[id]/route.ts` (GET + PUT + DELETE)
- ✅ `app/api/attachments/route.ts` + `app/api/attachments/[id]/route.ts`
- ✅ `app/api/images/upload/route.ts`
- ✅ `components/admin/Editor.tsx` (TipTap WYSIWYG)
- ✅ `components/admin/PostForm.tsx`
- ✅ `components/admin/AttachmentUploader.tsx`
- ✅ `components/admin/DeleteConfirm.tsx`
- ✅ `app/admin/blog/page.tsx` (dashboard)
- ✅ `app/admin/blog/new/page.tsx`
- ✅ `app/admin/blog/[id]/edit/page.tsx`

**Validation:** Full create → publish → edit → delete flow works end-to-end. Draft posts not visible on public (not yet built, but verify via Supabase dashboard).

---

### Phase 3: Public Blog (Day 3)
**Goal:** All public-facing blog pages render correctly.

- ✅ `components/blog/PostCard.tsx`
- ✅ `components/blog/PostBody.tsx` (DOMPurify sanitization)
- ✅ `components/blog/TagChip.tsx`
- ✅ `components/blog/CategoryBadge.tsx`
- ✅ `components/blog/BlogSearch.tsx`
- ✅ `components/blog/Pagination.tsx`
- ✅ `components/blog/CopyLinkButton.tsx`
- ✅ `app/blog/page.tsx` (paginated list, search, category/tag filter)
- ✅ `app/blog/[slug]/page.tsx` (post page, JSON-LD, related posts, copy link, attachments)
- ✅ `app/blog/category/[slug]/page.tsx`
- ✅ `app/blog/tag/[slug]/page.tsx`
- ✅ `generateMetadata` on all public blog pages (OG tags, title, description)

**Validation:** Publish a post in CMS → appears on `/blog` → click through to post page → OG tags visible in page source → JSON-LD present in source.

---

### Phase 4: SEO & AI Layer (Day 4)
**Goal:** Full discoverability by search engines and AI systems.

- ✅ `app/sitemap.ts` (Next.js native, includes all published posts + category/tag pages)
- ✅ `app/blog/feed.xml/route.ts` (RSS 2.0)
- ✅ Verify `public/llms.txt` is accessible at `/llms.txt`
- ✅ Test `/sitemap.xml` — validate all post URLs return 200
- ✅ Test `/blog/feed.xml` — validate at W3C RSS validator
- ✅ Test JSON-LD on a post URL — validate at Google Rich Results Test
- ✅ `npm run build` — zero errors
- ✅ Commit + push + open PR

**Validation:** `npm run build` clean. Google Rich Results Test passes. RSS validator passes. All post URLs in sitemap return 200.

---

## 14. Future Considerations

- **Scheduled publishing:** Set a future `publish_at` datetime; a cron job (Vercel cron or Supabase edge function) flips `published = true` at the set time
- **User management UI:** `/admin/users` page for admins to promote/demote roles without touching Supabase dashboard
- **Post analytics:** Supabase edge function to increment a view counter per post visit, shown in dashboard
- **Full-text search:** Supabase's built-in `pg_trgm` or `to_tsvector` full-text search for body content
- **Email newsletter:** Capture subscriber emails; send a Resend email on new post publish (Resend already integrated in the codebase)
- **Comments:** Utterances (GitHub-based, free) or Supabase-native comments table
- **Content import:** Markdown file import from existing documents
- **Social share:** LinkedIn + X share buttons alongside the existing copy-link button
- **Post read time:** Auto-calculated from body word count, displayed on card and post page

---

## 15. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| TipTap + Next.js 16 / React 19 compatibility issues | Medium | TipTap v2 supports React 18+; test `@tiptap/react` import in a client component early in Phase 2. Fallback: use a controlled `<textarea>` with markdown and `react-markdown` for rendering. |
| `@supabase/ssr` cookie handling in Next.js 16 middleware | Medium | Next.js 16 / React 19 is very new. Verify `createServerClient` works in `middleware.ts` with the cookie adapter. If middleware session refresh breaks, fall back to checking session only in API routes. |
| Supabase Auth redirect URLs misconfigured | Low-Medium | Must add both `http://localhost:3000` and production URL to Supabase Auth → Redirect URLs before invite/reset emails work. Forgetting this causes "Invalid redirect URL" errors. |
| Supabase RLS misconfiguration exposing draft posts | Low-Medium | After implementation, verify with anon Supabase client (no auth): fetch posts and assert no `published = false` rows appear. |
| DOMPurify not running in Next.js server components | Medium | `PostBody` must be a client component (or use `isomorphic-dompurify`). TipTap HTML must never be rendered with `dangerouslySetInnerHTML` without sanitization. |

---

## 16. Appendix

### Related Documents
- `.agents/plans/blog-feature.md` — Initial implementation plan (superseded by this PRD)
- `CLAUDE.md` — Git workflow and commit conventions
- `app/globals.css` — Design token reference (CSS custom properties, utility classes)

### Key Dependencies
- [TipTap v2 Docs](https://tiptap.dev/docs/editor/introduction)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [@supabase/ssr — Next.js App Router guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Storage](https://supabase.com/docs/reference/javascript/storage-from-upload)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [llms.txt specification](https://llmstxt.org)
- [Schema.org Article](https://schema.org/Article)
- [W3C RSS Validator](https://validator.w3.org/feed/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
