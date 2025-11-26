# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

deed.guru is a real estate tokenization platform built on Hedera Guardian. It uses AI to analyze properties with an 8-Petal Bloom scoring methodology (40 sub-criteria across 8 categories), tokenizes assets via Hedera Token Service (HTS), and enables capital raising through dual-token ICO ($PROP + $DEAL).

## Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5 (runes), Tailwind CSS 4, shadcn-svelte (bits-ui)
- **Backend**: Vercel AI SDK (Claude 3.5 Sonnet, GPT-4), Supabase (PostgreSQL + Auth), Drizzle ORM
- **Blockchain**: Hedera Hashgraph (@hashgraph/sdk), HashConnect, Guardian Framework
- **Testing**: Vitest (unit), Playwright (E2E), Storybook (components)

## Common Commands

```bash
# Development
bun run dev              # Start dev server at http://localhost:5173

# Database
bun run db:push          # Push schema to database
bun run db:generate      # Generate migrations
bun run db:studio        # Open Drizzle Studio GUI

# Testing
bun run test:unit        # Run Vitest (interactive)
bun run test:unit -- --run  # Run Vitest once
bun run test:e2e         # Run Playwright E2E tests

# Code Quality
bun run check            # TypeScript + Svelte type checking
bun run lint             # Prettier + ESLint
bun run format           # Auto-format with Prettier

# Build
bun run build            # Production build
bun run preview          # Preview production build

# Storybook
bun run storybook        # Component stories at :6006
```

## Architecture

### Route Groups
- `(marketing)/` - Public pages (landing, pricing, signup) - no auth required
- `(app)/` - Authenticated app (dashboard, workspace, portfolio, marketplace, team)
- `(auth)/` - Auth routes (login, register)
- `api/` - Server endpoints (guardian, tokenize, syndicate)

### Key Server Modules

| Path | Purpose |
|------|---------|
| `src/lib/server/db/schema.ts` | Drizzle ORM schema (users, properties, syndications, investments, deals, markets, teams) |
| `src/lib/server/ai/extractor.ts` | AI property extraction using Vercel AI SDK with Zod schemas |
| `src/lib/server/hedera/client.ts` | Hedera SDK initialization (testnet/mainnet) |
| `src/lib/server/hedera/token.ts` | HTS token creation and minting |
| `src/lib/server/auth/supabase.ts` | Supabase Auth server client |

### Key Frontend Components

| Path | Purpose |
|------|---------|
| `src/lib/components/petal-chart/PetalChart.svelte` | 8-petal Bloom property scoring visualization |
| `src/lib/components/app-sidebar.svelte` | Main navigation sidebar |
| `src/lib/components/ui/` | shadcn-svelte component library |

### Data Flow
1. Frontend pages call SvelteKit API routes
2. Server functions process with AI extraction or database queries
3. Drizzle ORM handles PostgreSQL via Supabase
4. Hedera SDK executes blockchain transactions for tokenization

## Scoring System

Properties are scored using the 8-Petal Bloom methodology:
- 8 Petals: CASHFLOW, APPRECIATION, FINANCING, LOCATION, CONDITION, TENANCY, LIQUIDITY, COMPLIANCE
- Each petal has 5 sub-criteria, scored 0-8 (40 total metrics)
- Petal scores are weighted averages of sub-criteria
- Total score: 0-64 (sum of 8 petal scores)
- Grades: A+ (≥60), A (≥55), B+ (≥50), B (≥45), C (≥35), F (<35)
- See [DESIGN.md](DESIGN.md) for complete scoring details

## Database Schema

Main tables in `src/lib/server/db/schema.ts`:

- **users** - Supabase Auth users with Stripe/Hedera IDs
- **properties** - Properties with AI-extracted data and 8-petal Bloom scores
- **deals** - Pipeline stages (sourced → analyzing → underwriting → LOI → due diligence → closed)
- **syndications** - Tokenized deals with HTS token details
- **investments** - Token purchases with Hedera transaction tracking
- **markets/submarkets** - Market data for property search
- **teams/teamMembers/teamActivities** - Team collaboration

## Environment Variables

Required in `.env`:
```env
DATABASE_URL="postgres://..."
PUBLIC_SUPABASE_URL="https://..."
PUBLIC_SUPABASE_ANON_KEY="..."
ANTHROPIC_API_KEY="sk-ant-..."
HEDERA_NETWORK="testnet"
HEDERA_ACCOUNT_ID="0.0...."
HEDERA_PRIVATE_KEY="..."
```

## Styling

- Uses Tailwind CSS 4 with `@theme` directive for CSS variables
- Theme colors defined in `src/routes/layout.css` (light/dark mode)
- Primary color: `#c8ab37` (gold)
- Container widths configured in `src/app.css`

## Svelte 5 Patterns

This project uses Svelte 5 runes:
- `$state()` for reactive state
- `$derived()` for computed values
- `$props()` for component props
- `{@render children()}` for slot content
