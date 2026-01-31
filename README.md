# Project Atlas

AI Chatbot SaaS platform that turns websites and documents into intelligent customer support agents.

## Features

- **Multi-tenant SaaS**: Users manage multiple bots
- **Website scraping**: Crawl and index website content (respects robots.txt)
- **Document processing**: PDF, DOCX, TXT, MD
- **RAG system**: Chunking, embeddings (OpenAI), vector search
- **Embeddable widget**: One-line script to add chatbot to any site
- **Lead capture**: Capture visitor contact when AI is unsure
- **Analytics**: Chats, leads, top questions
- **Auth**: Email/password + Google OAuth (NextAuth)

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, Radix UI
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: MySQL
- **AI**: OpenAI (gpt-4o-mini, text-embedding-3-small)
- **Auth**: NextAuth.js v5

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8+
- OpenAI API key

### 1. Clone and install

```bash
git clone <repo>
cd okaigen
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in:

- `DATABASE_URL`: MySQL connection string (e.g. `mysql://user:pass@localhost:3306/atlas`)
- `OPENAI_API_KEY`: Your OpenAI API key
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL (e.g. `http://localhost:3000`)
- For Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### 3. Database setup

```bash
npx prisma db push
# or for migrations:
npx prisma migrate dev
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── auth/      # NextAuth, register
│   │   ├── bots/      # Bot CRUD, train, sources, chats, analytics
│   │   ├── chat/      # Widget chat endpoint
│   │   ├── embed/     # Widget info (greeting)
│   │   └── leads/     # Lead capture
│   ├── dashboard/     # Protected dashboard pages
│   ├── login/
│   ├── signup/
│   ├── pricing/
│   └── page.tsx       # Landing
├── components/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── openai.ts
│   ├── chunking.ts
│   ├── document-parser.ts
│   ├── embeddings.ts
│   ├── vector-search.ts
│   ├── rag.ts
│   ├── scraper.ts
│   └── rate-limit.ts
└── types/
public/
├── widget.js          # Embeddable chat widget
└── uploads/           # Uploaded documents (gitignored)
```

## Embedding the Widget

Add to your website:

```html
<script src="https://yourdomain.com/widget.js" data-bot="YOUR_BOT_PUBLIC_KEY" data-base="https://yourdomain.com"></script>
```

The public key is shown in the bot dashboard under "Embed code".

## Deployment (VPS)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Nginx, PM2, and MySQL setup.
