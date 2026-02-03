# Performance Checklist

Use this list to verify and maintain performance after changes.

## Initial Load & TTFB
- [ ] Root layout uses `next/font` (no Google Fonts CDN)
- [ ] Heavy below-the-fold components lazy-loaded with `next/dynamic` (e.g. ChatWidget, Footer, modals)
- [ ] Dashboard layout does not block on sequential auth + planUsage (use `Promise.all`)
- [ ] Static/metadata pages use default static rendering where possible

## JS Bundle
- [ ] `optimizePackageImports` in next.config for lucide-react and Radix
- [ ] Dynamic import for dashboard shell or heavy client trees where appropriate
- [ ] Tools/analytics/settings routes lazy-load heavy UI
- [ ] No unnecessary client boundaries (prefer server components)

## API & Backend
- [ ] Expensive reads cached (plan usage, bot lookup, embeddings, response cache)
- [ ] List endpoints paginated (chats, leads) with cursor or page/limit
- [ ] Chats API does not return full message history in list; load messages per chat or cap count
- [ ] Batch DB queries where possible; avoid N+1
- [ ] RAG: limit chunks fetched per bot (e.g. 500); do not load all chunks into memory

## Database
- [ ] Indexes on `userId`, `botId`, `createdAt` and composite `(botId, createdAt)` for Chat and Lead
- [ ] Prisma queries use `select` / projections; avoid `select: *` or full includes when not needed
- [ ] List queries use `take`/`skip` or cursor

## Assets & Fonts
- [ ] Images use `next/image` with appropriate `sizes`
- [ ] Image optimization enabled (default in Next.js)
- [ ] Prefer WebP/AVIF where applicable

## Network & Caching
- [ ] Cache-Control headers on API responses (e.g. short cache for list data, no-store for mutations)
- [ ] Static pages cached; ISR considered for public marketing pages
- [ ] Plan usage and bot list cached appropriately (e.g. unstable_cache 60s)

## Perceived Performance (UX)
- [ ] Skeleton loaders for dashboard, analytics, chats, settings
- [ ] Loading states on async actions (e.g. Export CSV)
- [ ] Optimistic UI where safe (e.g. toggle settings)
- [ ] Progressive rendering: show shell first, then stream or lazy-load content

## Metrics to Monitor
- First Contentful Paint < 1.5s
- TTFB < 300ms
- Lighthouse Performance > 85
- API response time < 200ms for list/read endpoints
- JS bundle size reduced vs baseline (e.g. −30% with dynamic imports)
