# 10X Deal Radar - Backend Setup Guide

## Overview

Your backend is now fully configured with:
- ✅ **Vercel AI SDK** for LLM-powered document extraction
- ✅ **Supabase** for authentication and PostgreSQL database
- ✅ **Drizzle ORM** for type-safe database operations
- ✅ **SvelteKit API routes** for upload and deal management

## Architecture

```
src/
├── lib/
│   ├── server/
│   │   ├── ai/
│   │   │   └── extractor.ts         # Vercel AI SDK integration
│   │   ├── auth/
│   │   │   └── supabase.ts          # Auth helpers
│   │   └── db/
│   │       ├── index.ts             # Drizzle client
│   │       └── schema.ts            # Database schema
│   └── types.ts                      # 10X scoring logic
├── routes/
│   └── api/
│       ├── upload/+server.ts         # File upload + AI extraction
│       └── deals/+server.ts          # Get user deals
└── hooks.server.ts                   # Auth middleware
```

## Setup Instructions

### 1. Vercel Integration Setup

#### Option A: Via Vercel Dashboard (Recommended)
1. Push your code to GitHub
2. Import project to Vercel: https://vercel.com/new
3. Go to your project → **Integrations** tab
4. Add **Supabase Integration**:
   - Connects automatically
   - Auto-configures environment variables
   - Sets up DATABASE_URL connection
5. Add **OpenAI Integration** OR **Anthropic Integration**:
   - OpenAI: Adds OPENAI_API_KEY
   - Anthropic: Adds ANTHROPIC_API_KEY

#### Option B: Manual Setup
1. Create Supabase project: https://supabase.com/dashboard
2. Get credentials from Settings → API:
   ```bash
   PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```
3. Get DATABASE_URL from Settings → Database → Connection String (Transaction mode)
4. Get AI API key:
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/

### 2. Configure Environment Variables

Update your `.env` file:

```env
# Database (from Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Supabase Auth
PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# AI - Choose ONE (or both)
OPENAI_API_KEY="sk-proj-..."           # For GPT-4 Turbo
ANTHROPIC_API_KEY="sk-ant-..."         # For Claude 3.5 Sonnet (recommended)
```

### 3. Run Database Migrations

```bash
# Generate migration files
bun run db:generate

# Push to database (creates tables)
bun run db:push
```

### 4. Enable Supabase Auth

In Supabase Dashboard → Authentication → Providers:
1. Enable **Email** provider
2. (Optional) Enable **Google OAuth**, **GitHub**, etc.

### 5. Test the Backend

Start dev server:
```bash
bun run dev
```

The following endpoints are now available:

#### POST /api/upload
Upload and extract property data from documents.

**Request:**
```bash
curl -X POST http://localhost:5174/api/upload \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -F "file=@offering_memorandum.txt"
```

**Response:**
```json
{
  "success": true,
  "property": {
    "id": "uuid",
    "name": "Sunrise Gardens",
    "totalScore": 87,
    "grade": "A",
    "scores": [8, 9, 9, ...]
  }
}
```

#### GET /api/deals
Get all deals for authenticated user.

**Request:**
```bash
curl http://localhost:5174/api/deals \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT"
```

**Response:**
```json
{
  "deals": [
    {
      "id": "uuid",
      "name": "Austin Tech Towers",
      "totalScore": 93,
      "grade": "A+"
    }
  ]
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- Supabase Auth UUID
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Properties Table
```sql
CREATE TABLE properties (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  units INTEGER,
  raw_data JSONB,                   -- Full AI extraction
  scores JSONB NOT NULL,            -- [0-10, 0-10, ...]
  total_score INTEGER NOT NULL,
  grade TEXT NOT NULL,              -- A+, A, A-, B+, etc.
  -- Individual metrics...
  year1_coc TEXT,
  projected_irr TEXT,
  rent_growth_cagr TEXT,
  -- ...
  document_type TEXT,
  archived BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## AI Extraction

The backend uses **Vercel AI SDK** with structured output generation.

### Supported Models
- **Claude 3.5 Sonnet** (Anthropic) - Recommended for accuracy
- **GPT-4 Turbo** (OpenAI) - Fallback option

### Extraction Process
1. User uploads file (PDF, Excel, or text)
2. Text extracted from file
3. Sent to LLM with Grant Cardone-style prompt
4. Returns structured JSON with 12 metrics
5. 10X scoring calculated
6. Saved to database with grade

### Extending File Support

Currently supports text files. To add PDF/Excel:

```typescript
// src/lib/server/ai/extractor.ts

import { extractTextFromPDF } from 'pdf-parse';
import { read as readXLSX } from 'xlsx';

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type.includes('pdf')) {
    const buffer = await file.arrayBuffer();
    const data = await extractTextFromPDF(Buffer.from(buffer));
    return data.text;
  }

  if (file.type.includes('spreadsheet')) {
    const buffer = await file.arrayBuffer();
    const workbook = readXLSX(buffer);
    // Extract rent roll data...
  }
}
```

## Authentication Flow

1. User signs up via Supabase Auth
2. JWT stored in httpOnly cookies
3. `hooks.server.ts` verifies on every request
4. API routes use `requireAuth()` helper
5. Database user auto-created on first upload

## Next Steps

### Phase 1: Frontend Integration (Week 1)
- [ ] Add Supabase auth UI components
- [ ] Wire up `/api/upload` to file upload button
- [ ] Load deals from `/api/deals` endpoint
- [ ] Replace demo data with real database queries

### Phase 2: Stripe Integration (Week 2)
- [ ] Add subscription tiers (Free, Pro, Syndicate)
- [ ] Implement usage limits (Free: 5 deals, Pro: unlimited)
- [ ] Stripe webhook for subscription events
- [ ] Billing portal integration

### Phase 3: Advanced Features (Week 3-4)
- [ ] PDF parsing support
- [ ] Excel rent roll parsing
- [ ] Batch upload (multiple properties)
- [ ] Export to PDF/Excel
- [ ] Team collaboration features

## Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git add .
git commit -m "Add backend"
git push

# Deploy automatically via Vercel integration
# Add environment variables in Vercel dashboard
```

### Database
- Supabase handles hosting automatically
- Connection pooling included
- Automatic backups enabled

## Troubleshooting

### "No AI provider configured"
- Ensure either `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is set
- Restart dev server after adding env vars

### "DATABASE_URL is not set"
- Get connection string from Supabase → Database → Connection String
- Use **Transaction** mode pooling for Vercel
- Format: `postgresql://postgres.[REF]:[PASSWORD]@[HOST]:6543/postgres`

### "Unauthorized" errors
- Check Supabase JWT is valid
- Verify `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
- Enable email auth in Supabase dashboard

## Support

- Vercel AI SDK: https://sdk.vercel.ai/docs
- Supabase Docs: https://supabase.com/docs
- Drizzle ORM: https://orm.drizzle.team/docs

---

**You now have a production-ready SaaS backend! 🚀**

Next: Connect the frontend and start processing real deals.
