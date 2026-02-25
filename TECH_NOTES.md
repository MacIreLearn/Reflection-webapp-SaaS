# TECH_NOTES.md — Reflection App

**Date:** February 25, 2026  
**Author:** Aravind Kumar Balasubramaniam  
**Stack:** Next.js 14 (App Router), Prisma, PostgreSQL (Supabase), Stripe, Vercel

---

## Key File Locations

| Feature | File Path |
|---------|-----------|
| **Create Entry** | `webapp/src/app/api/entries/route.ts` → `POST` handler |
| **Update Entry** | `webapp/src/app/api/entries/[id]/route.ts` → `PATCH` handler |
| **Delete Entry** | `webapp/src/app/api/entries/[id]/route.ts` → `DELETE` handler |
| **Share Token Generation** | `webapp/src/app/api/entries/[id]/share/route.ts` → `POST` (uses `uuid.v4()`) |
| **Revoke Share** | `webapp/src/app/api/entries/[id]/share/route.ts` → `DELETE` |
| **Insights Queries** | `webapp/src/app/api/insights/route.ts` → aggregates mood trends, streaks, top tags |
| **Insights UI** | `webapp/src/app/insights/page.tsx` → Recharts visualizations |
| **Shared Entry View** | `webapp/src/app/shared/[token]/page.tsx` |
| **Auth Helper** | `webapp/src/lib/auth.ts` → `getAuthUser()` |
| **Database Schema** | `webapp/prisma/schema.prisma` |

---

## Architectural Choices & Trade-offs (48-Hour Hackathon)

### 1. **Next.js App Router API Routes over Server Actions**
- **Choice:** Used traditional API route handlers (`route.ts`) instead of Server Actions.
- **Why:** More explicit request/response control; easier debugging; familiar REST patterns.
- **Trade-off:** Slightly more boilerplate than Server Actions, but clearer separation of concerns.

### 2. **Supabase Auth + Prisma for Data**
- **Choice:** Supabase handles authentication; Prisma handles all database operations.
- **Why:** Supabase provides instant auth with social logins; Prisma gives type-safe queries and migrations.
- **Trade-off:** Two systems to manage, but each excels at its job. Auth sync handled in `getAuthUser()` which auto-creates User records.

### 3. **UUID-based Share Tokens**
- **Choice:** Simple `uuid.v4()` for share tokens stored in `SharedEntry` table.
- **Why:** Fast to implement, unguessable, stateless lookups.
- **Trade-off:** No expiration by default (could add `expiresAt` field later). Revocation is soft-delete (`isActive: false`).

### 4. **Client-Side Insights Aggregation**
- **Choice:** Insights computed in API route by fetching all user entries and aggregating in JS.
- **Why:** Simple implementation; works well for personal journals (typically <1000 entries).
- **Trade-off:** Won't scale to millions of entries. Future: move aggregations to SQL window functions or materialized views.

### 5. **Streak Calculation**
- **Choice:** Linear scan from most recent entry backwards checking consecutive days.
- **Why:** Correct and easy to understand.
- **Trade-off:** O(n) where n = entries. Acceptable for personal use; could cache in Redis for high-volume.

### 6. **PostgreSQL Array for Tags**
- **Choice:** `tags String[]` in Prisma schema (native PostgreSQL array).
- **Why:** Simple queries, no join table needed, supports `@>` array contains.
- **Trade-off:** Harder to get tag analytics across users (would need a separate Tag table for that).

### 7. **No Separate Draft Table**
- **Choice:** `isDraft: Boolean` field on `JournalEntry` rather than separate drafts table.
- **Why:** Simpler schema; one entry = one record.
- **Trade-off:** Must always filter by `isDraft` in queries for published entries.

### 8. **Vercel + Supabase Serverless**
- **Choice:** Fully serverless deployment.
- **Why:** Zero ops, instant deploys, free tier for hackathon.
- **Trade-off:** Cold starts possible; no persistent connections (using Prisma connection pooling via `directUrl`).

---

## Server Actions

Server Actions replace client-side `fetch()` for form mutations, providing:
- Built-in CSRF protection
- Progressive enhancement (works without JS)
- Type-safe with Zod validation
- Automatic `revalidatePath()` for cache invalidation

**Files:**
- `src/lib/actions/newsletter.ts` - Newsletter subscription with Stripe integration
- `src/lib/actions/entries.ts` - Create/update/delete journal entries

**Usage in components:**
```tsx
import { useActionState } from "react";
import { subscribeAction } from "@/lib/actions/newsletter";

const [state, formAction, pending] = useActionState(subscribeAction, initialState);
return <form action={formAction}>...</form>;
```

---

## Rate Limiting

In-memory rate limiter for public endpoints (for production, use Redis/Upstash):

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/subscribe | 5 req | 1 min |
| /api/unsubscribe | 30 req | 1 min |
| /api/stripe/webhook | 100 req | 1 min |

**Implementation:** `src/lib/rate-limit.ts`

---

## Background Jobs (Vercel Cron)

Daily reminder emails via Vercel Cron + Resend:

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 9 * * *"
  }]
}
```

**Flow:**
1. Cron triggers at 9:00 UTC daily
2. Queries users without today's entry
3. Filters by user's preferred `reminderTime`
4. Sends personalized email via Resend API

**Security:** Protected by `CRON_SECRET` bearer token (set in Vercel env vars).

---

## What I'd Improve with More Time

1. **Add expiration to share tokens** — `expiresAt` field with automatic cleanup
2. **Server-side pagination** — insights API should paginate for large datasets
3. **Optimistic UI updates** — currently full refetch after mutations
4. **E2E tests** — Playwright tests for critical flows
5. **Rate limiting** — protect API endpoints from abuse
6. **Background jobs** — email reminders via Vercel Cron or similar

---

## Middleware & Auth Flow

```
middleware.ts
    ↓
updateSession() — refreshes Supabase session cookie on every request
    ↓
getAuthUser() — called in each protected API route
    ↓
Returns null → 401 Unauthorized
Returns user → query with userId filter
```

**Row-Level Security (RLS)**: Supabase RLS policies enforce that users can only SELECT/INSERT/UPDATE/DELETE their own rows. Even if API code had a bug, RLS provides defense-in-depth.

**Data Encryption**:
- At rest: Supabase PostgreSQL uses AES-256 encryption for storage
- In transit: All connections use TLS 1.2+
- No column-level encryption (would add latency for a journaling app)

---

## Quick Start

```bash
cd webapp
pnpm install
cp .env.example .env.local  # Fill in Supabase + Stripe keys
pnpm prisma migrate dev
pnpm dev
```
