# 30-Day SEO Execution Plan — SiteBotGPT

**Website:** https://www.sitebotgpt.com  
**Product:** AI chatbot / site assistant SaaS  
**Hosting:** Vercel (Next.js)  
**Target:** Early-stage SEO traction (impressions → clicks)  
**Status:** Technical SEO fixed (GSC verified, sitemap live, redirects fixed)

---

## Goals

- Get Google indexing stable
- Start impressions for non-branded keywords
- Build SEO foundation for long-term growth
- No spam, no black-hat tactics

---

## Week 1 — Indexing & Trust Foundation

### Objective
Stabilize indexing, fix any coverage issues, and strengthen the homepage as the main SEO asset.

### Specific actions
1. **Audit Google Search Console**
   - Review **Indexing** report: valid, errors, excluded.
   - Review **Coverage** (Pages): fix any "Excluded" or "Error" issues.
   - Note **Performance**: initial impressions/clicks (baseline).
2. **Validate sitemap quality**
   - Ensure only public, indexable pages (no `/dashboard`, `/login`, `/api`).
   - Confirm `lastmod` values are set (static pages and `/learn/*` from file mtime).
   - Sitemap URL: `https://www.sitebotgpt.com/sitemap.xml`
3. **Optimize homepage for SEO**
   - H1 targets primary keyword (e.g. "AI chatbot for website" / "AI chatbot for website and customer support").
   - 300–500 words of clear value proposition above the fold / in first sections.
   - Internal links to `/pricing`, `/features`, `/demo`, `/learn/*`, `/docs`.
4. **Finalize robots.txt and canonical consistency**
   - `robots.txt`: Allow `/`, disallow `/dashboard`, `/api`, `/login`; reference sitemap.
   - Every key page has a self-referencing canonical URL.
5. **Request indexing for top 5 pages**
   - In GSC: URL Inspection → enter URL → "Request indexing" for:
     - `/` (homepage)
     - `/pricing`
     - `/demo`
     - `/learn/what-is-a-website-chatbot` (or top learn page)
     - `/docs` or `/contact`

### Pages to create or optimize
- **Optimize:** `/` (homepage) — H1, value-proposition copy, internal links.

### How to measure success in GSC
- **Indexing:** "Valid" count stable or increasing; "Excluded" / "Error" reduced or explained.
- **Performance:** Any non-zero impressions for the site (baseline).
- **URL Inspection:** No critical issues for the 5 requested URLs.

---

## Week 2 — Core Pages Optimization (Money Pages)

### Objective
Optimize key conversion and category pages for intent and crawlability; improve internal linking.

### Specific actions
1. **Optimize core pages**
   - **`/pricing`:** SEO title and meta description focused on intent (e.g. "AI chatbot pricing", "free and paid plans"). Add FAQ schema for pricing FAQs.
   - **`/features`:** Dedicated features page with H1 "SiteBotGPT Features" (or "AI Chatbot Features for Your Website"), clear benefit-led copy, internal links to pricing, demo, learn.
   - **`/use-cases` (or equivalent):** Page listing use cases (support, lead capture, SaaS, e‑commerce, EdTech, agencies) with short descriptions and links to `/learn`, `/pricing`, `/demo`.
2. **SEO titles and meta descriptions**
   - Focus on intent and clarity; avoid keyword stuffing. Keep titles ~50–60 chars, descriptions ~155–160 chars.
3. **Internal linking**
   - Footer: add links to `/features`, `/use-cases`, and key `/learn` articles.
   - Homepage: contextual links to `/features`, `/use-cases`, `/pricing`, `/learn`.
4. **FAQ schema**
   - Add FAQPage structured data on `/pricing` (and `/features` if you add an FAQ section).
5. **Monitor GSC**
   - Track impressions and CTR for `/pricing`, `/features`, `/use-cases` (once live).

### Pages to create or optimize
- **Optimize:** `/pricing` (metadata already present; add FAQ schema).
- **Create:** `/features` (dedicated page).
- **Create:** `/use-cases` (use cases hub).

### How to measure success in GSC
- **Performance:** Impressions for `/pricing`, `/features`, `/use-cases` (after indexing).
- **Indexing:** New pages show as "Valid" within ~1–2 weeks.
- **CTR:** Use as baseline for Week 4 CTR improvements.

---

## Week 3 — Content for Discovery (Non-Branded Traffic)

### Objective
Create 3–5 SEO landing pages or blog posts targeting non-branded keywords; tie them into the site with internal links and sitemap.

### Keyword focus
- AI chatbot for website
- Website chatbot software
- AI customer support chatbot

### Specific actions
1. **Keyword alignment**
   - Map existing `/learn` articles to the above (e.g. "What is a website chatbot?", "What is an AI customer support chatbot?").
   - Identify gaps: e.g. "Website chatbot software: what to look for", "AI chatbot for website — guide", "Best AI customer support chatbot features".
2. **Create 3–5 SEO landing pages or blog posts**
   - Format: Problem → solution; 800–1,200 words each.
   - One clear H1 per page; H2/H3 hierarchy; internal links to `/pricing`, `/features`, `/demo`, other `/learn` articles.
   - Publish under `/learn/<slug>` (e.g. `website-chatbot-software.md`, `ai-chatbot-for-website-guide.md`).
3. **Internal links**
   - From homepage and `/features` / `/use-cases`: link to new learn articles.
   - From new articles: link back to pricing, features, and related learn posts.
4. **Sitemap**
   - `/learn/*` is already included via dynamic sitemap; new markdown files will get `lastmod` from file mtime. No extra sitemap resubmission needed (avoid resubmitting repeatedly).
5. **Request indexing**
   - In GSC, request indexing for each new article URL (once live).

### Pages to create or optimize
- **Create:** 3–5 new `/learn/<slug>` articles (see `docs/learn/*.md` and content plan in `docs/CONTENT-PLAN-LLM-SEO.md`).

### How to measure success in GSC
- **Performance:** Impressions for new URLs (and for queries containing target keywords).
- **Indexing:** New pages in "Valid" state.
- **Success threshold:** Any non-zero impressions for non-branded queries = success; early clicks = bonus.

---

## Week 4 — Authority & CTR Improvement

### Objective
Improve CTR for pages that already get impressions; add comparison content and strengthen internal links; plan the next 60 days.

### Specific actions
1. **Analyze GSC Performance**
   - Filter by "Impressions" (e.g. sort by impressions, then look at CTR).
   - Identify pages with decent impressions but low CTR.
2. **Rewrite titles and meta descriptions for low-CTR pages**
   - Make titles more specific and benefit-led; meta descriptions more action-oriented or curiosity-driven. A/B-style thinking; no clickbait.
3. **Comparison page (if applicable)**
   - Create a page such as "SiteBotGPT vs alternatives" or "SiteBotGPT vs other AI chatbots" — factual, comparison table or bullets, internal links to pricing and features.
4. **Strengthen internal links**
   - Ensure every key page (home, pricing, features, use-cases, learn articles) has at least 2–3 contextual internal links from other key pages.
   - Review footer and nav: include features, use-cases, and top learn articles.
5. **Prepare next 60-day content roadmap**
   - List 4–8 article topics from `docs/CONTENT-PLAN-LLM-SEO.md` (or new ideas) with target keywords and publish order. Document in `docs/SEO-60-DAY-CONTENT-ROADMAP.md` (or similar).

### Pages to create or optimize
- **Optimize:** Any page with impressions but low CTR (titles/descriptions).
- **Create:** `/compare` or `/vs-alternatives` (comparison page).
- **Document:** 60-day content roadmap.

### How to measure success in GSC
- **CTR:** Week-over-week CTR improvement for previously low-CTR pages.
- **Impressions:** Continued growth or stability.
- **Indexed pages:** Count stable or increasing.

---

## Measurement Summary

| Metric | Where | Success threshold |
|--------|--------|--------------------|
| Impressions | GSC → Performance | Growth week-over-week; any non-zero = early success |
| Indexed pages | GSC → Indexing | Stable or increasing |
| CTR | GSC → Performance | Improvement after title/meta tweaks (Week 4) |
| Non-branded impressions | GSC → Performance (filter by query) | Any non-branded impressions = success; early clicks = bonus |

---

## Do not

- Buy backlinks
- Use AI spam content (write for humans; use AI only as a drafting aid if needed)
- Change domain or URL structure
- Resubmit sitemap repeatedly (submit once after meaningful changes if needed)

---

## Quick reference — Top URLs to request indexing (Week 1)

1. `https://www.sitebotgpt.com/`
2. `https://www.sitebotgpt.com/pricing`
3. `https://www.sitebotgpt.com/demo`
4. `https://www.sitebotgpt.com/learn/what-is-a-website-chatbot`
5. `https://www.sitebotgpt.com/docs` or `https://www.sitebotgpt.com/contact`

After Week 2: add `https://www.sitebotgpt.com/features` and `https://www.sitebotgpt.com/use-cases`.  
After Week 3: request indexing for each new `/learn/*` URL (e.g. `/learn/website-chatbot-software`, `/learn/ai-chatbot-for-website-guide`, `/learn/how-to-choose-ai-customer-support-chatbot`).  
After Week 4: request indexing for `https://www.sitebotgpt.com/compare`.
