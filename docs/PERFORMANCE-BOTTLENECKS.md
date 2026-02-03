# Performance Bottlenecks & Optimizations

## Top 5 Slow Areas (Before Optimization)

### 1. RAG `retrieveContext` – Load All Chunks Into Memory
**Location:** `src/lib/rag.ts`  
**Issue:** `prisma.chunk.findMany({ where: { botId } })` loads every chunk for a bot (no `take`). Bots with thousands of chunks cause high memory use and slow response. Vector similarity is then computed in Node.js over all chunks.  
**Impact:** High TTFB and API response time for chat; risk of OOM on large knowledge bases.  
**Fix:** Limit chunks fetched (e.g. 500), add optional ordering; use projection (already using `select`). Consider a dedicated vector DB (e.g. Pinecone) for scale.

### 2. Dashboard Layout – Blocking Sequential Data
**Location:** `src/app/dashboard/layout.tsx`  
**Issue:** `auth()` then `getPlanUsage(session.user.id)` run sequentially on every dashboard request. Plan usage is cached 60s but layout still waits for both before rendering.  
**Impact:** Slower First Contentful Paint for all dashboard pages.  
**Fix:** Run `auth()` and `getPlanUsage()` in parallel with `Promise.all`. Use React Suspense/streaming where possible.

### 3. Chats API – No Pagination, Full Message Payload
**Location:** `src/app/api/bots/[botId]/chats/route.ts`  
**Issue:** Returns up to 50–100 chats with `include: { messages: { orderBy: createdAt } }` — every message for each chat. No cursor/offset pagination.  
**Impact:** Large JSON payloads, slow network and parse time; heavier DB load.  
**Fix:** Cursor-based pagination; return message count per chat and load messages on demand (e.g. by chatId) or limit message count per chat (e.g. last 20).

### 4. Dashboard Page – Redundant and Sequential Fetches
**Location:** `src/app/dashboard/page.tsx`  
**Issue:** Fetches bots (with _count, sources), then planUsage, then dynamic imports for `canViewLeads`/`canViewAnalytics`. Layout already fetches planUsage.  
**Impact:** Duplicate plan usage work (mitigated by cache), sequential waterfall.  
**Fix:** Rely on layout for planUsage where possible; parallelize bots + plan usage; use Suspense boundaries and loading skeletons.

### 5. Leads API & Analytics – No Pagination, Large Result Sets
**Location:** `src/app/api/leads/route.ts`, `src/app/api/bots/[botId]/analytics/route.ts`  
**Issue:** Leads API returns all leads with no `take`/`skip`. Analytics fetches 200 user messages and all usage logs for the window.  
**Impact:** Slow and heavy responses for accounts with many leads or messages.  
**Fix:** Add `page`/`limit` (or cursor) to leads; limit top-questions and usage log queries with explicit limits and projections.

---

## Additional Findings
- **Landing page:** ChatWidget already defers script load (requestIdleCallback). Good. Can be lazy-loaded as a component with `next/dynamic` to reduce initial JS.
- **Fonts:** Using `next/font` (Inter, Plus Jakarta Sans) with `display: swap` — good. No Google Fonts CDN.
- **Images:** Dashboard uses `next/image` for logo. Ensure all images use `next/image` and modern formats where possible.
- **Bots GET:** Returns full bot objects with `_count`. Consider projection for list views (id, name, createdAt, _count only).

---

## Metrics Targets (Post-Optimization)
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| TTFB | < 300ms |
| Lighthouse Performance | > 85 |
| JS bundle size | −30% (via dynamic imports, tree-shaking) |
| API response time | < 200ms (for list/read endpoints) |

---

## Before vs After (Summary)
- **Before:** Sequential dashboard data, unbounded RAG chunk load, chats/leads without pagination, full payloads, no skeleton UIs.
- **After:** Parallel data in dashboard page (bots + planUsage), RAG chunk limit (500), cursor/page pagination on chats and leads, reduced payloads (projections, last message only in list; full messages via GET /api/bots/[botId]/chats/[chatId]), skeleton loaders (analytics, dashboard), Cache-Control on API responses, lazy-loaded ChatWidget (client component), useCallback in dashboard shell, AVIF/WebP in next.config, composite DB indexes for Chat and Lead.

## Applying Database Indexes
After pulling these changes, run a migration to add the new indexes:
```bash
npx prisma migrate dev --name add_perf_indexes
```
This adds `@@index([botId, createdAt])` on Chat and Lead for efficient pagination.
