# Startup Website Factory

A production-ready web application that generates unique, full multi-page startup websites with one click. Every generation is stored in PostgreSQL, compared against previous generations for uniqueness, and can be previewed, edited, and deployed to Render.

## Features

- **One-click generation** of complete startup websites (10 pages each)
- **Uniqueness system** comparing name, founder, tagline, features, FAQ, layout, images against all prior generations
- **Persistent memory** via PostgreSQL — previous generations influence future ones
- **Multi-page rendered sites**: Home, Features, How It Works, Pricing, About, Contact, FAQ, Privacy, Terms, 404
- **Unsplash integration** for section-relevant imagery
- **Mailgun integration** for contact/demo request forms
- **Modular regeneration** (name, founder, copy, layout, images, or full)
- **Edit essential fields** inline
- **Deploy to Render** with included `render.yaml` blueprint
- **Settings panel** for domain, Mailgun, and Render status tracking

## Tech Stack

- **Next.js 16** (App Router, Server Components, Route Handlers)
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** + **Prisma ORM**
- **Render** deployment

## Local Setup

### Prerequisites
- Node.js 20+
- PostgreSQL running locally (or a remote connection string)

### Steps

```bash
# Clone the repo
git clone https://github.com/bytepassperks/startup-website-factory.git
cd startup-website-factory

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and other keys

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Render Deployment

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** > **Blueprint**
4. Connect your GitHub repo
5. Render will detect `render.yaml` and provision:
   - A web service running the Next.js app
   - A PostgreSQL database
6. Set the required environment variables (UNSPLASH_ACCESS_KEY, MAILGUN_*, etc.)
7. Deploy

## Mailgun Setup

1. Create a [Mailgun](https://www.mailgun.com) account
2. Add and verify your sending domain
3. Set these environment variables:
   - `MAILGUN_API_KEY` — Your Mailgun API key
   - `MAILGUN_DOMAIN` — Your verified sending domain
   - `MAILGUN_FROM_EMAIL` — The "from" email address
   - `MAILGUN_TO_EMAIL` — Where contact form emails are delivered

## Architecture

```
src/
├── app/
│   ├── api/           # Route handlers (generate, generations, contact, settings, deploy, regenerate)
│   ├── edit/[id]/     # Edit page for a generation
│   ├── preview/[id]/  # Preview/details page
│   ├── settings/      # Domain + Mailgun + Render settings
│   └── site/[id]/     # Full rendered multi-page website
│       ├── features/
│       ├── how-it-works/
│       ├── pricing/
│       ├── about/
│       ├── contact/
│       ├── faq/
│       ├── privacy/
│       └── terms/
├── components/        # Shared UI components
├── lib/
│   ├── db.ts          # Prisma client singleton
│   ├── generator.ts   # Seed-based startup generation engine
│   ├── uniqueness.ts  # Similarity checker (string similarity, token overlap)
│   ├── unsplash.ts    # Unsplash image search
│   ├── mailgun.ts     # Mailgun email sending
│   ├── seed-random.ts # Deterministic seeded PRNG
│   ├── data-pools.ts  # Generation data pools (names, copy, templates)
│   └── site-data.ts   # Site data fetcher for rendered pages
└── generated/prisma/  # Generated Prisma client
```

### How Generation Works

1. A UUID seed drives a deterministic PRNG
2. The PRNG selects from large pools of names, categories, copy templates, palettes, layout variants, etc.
3. The new generation is compared against all prior non-archived generations
4. If similarity exceeds thresholds, the engine regenerates with a fresh seed (up to 5 attempts)
5. Unsplash images are fetched for section-relevant queries
6. Everything is persisted to PostgreSQL

### Uniqueness Scoring

Compares: startup name, founder name, domain, tagline, hero copy, feature overlap, FAQ overlap, layout variant reuse, section order, image queries. Uses normalized string similarity + Jaccard token overlap.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `APP_URL` | No | Public URL of the app |
| `UNSPLASH_ACCESS_KEY` | No | Unsplash API key for images |
| `MAILGUN_API_KEY` | No | Mailgun API key |
| `MAILGUN_DOMAIN` | No | Mailgun sending domain |
| `MAILGUN_FROM_EMAIL` | No | From email for contact forms |
| `MAILGUN_TO_EMAIL` | No | Destination for contact emails |
| `PAGEGRID_API_KEY` | No | PageGrid API key |
| `UNIQUENESS_NAME_THRESHOLD` | No | Name similarity threshold (default: 0.7) |
| `UNIQUENESS_COPY_THRESHOLD` | No | Copy similarity threshold (default: 0.6) |
