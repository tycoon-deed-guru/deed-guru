# deed.guru - Real Estate Tokenization Platform Built on Hedera Guardian

> The "Cursor/Windsurf for Real Estate Developers" - AI-powered property tokenization on Hedera

**Transform real estate investing from illiquid syndications to tokenized, tradeable assets in minutes.**

![deed.guru](https://img.shields.io/badge/deed-guru-navy) ![SvelteKit](https://img.shields.io/badge/SvelteKit-2.0-orange) ![Hedera](https://img.shields.io/badge/Hedera-Guardian-green) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🚀 What is deed.guru?

A **full-stack tokenization platform** that adapts the **Hedera Guardian framework** for commercial real estate:

1. **Analyzes** properties using AI-powered 10X scoring methodology
2. **Tokenizes** real estate assets using Hedera Guardian policy workflows
3. **Raises Capital** via dual-token ICO ($PROP platform token + $DEAL property tokens)
4. **Creates Liquidity** through secondary markets for tokenized properties

**Result:** Democratize access to $11.4T commercial real estate market with instant liquidity, compliance automation, and global capital access.

---

## 🎯 Key Features

### Core Functionality

✅ **AI-Powered Analysis** - Upload property documents → Claude 3.5 Sonnet extracts metrics
✅ **10X Scoring Engine** - Scores properties 0-100 across 10 axes (A+ to F grading)
✅ **Workspace Collaboration** - Team-based deal analysis with shared workspaces
✅ **Market Intelligence** - Live market analysis for top multifamily markets
✅ **Portfolio Management** - Track deals from search to acquisition

### Hedera Guardian Integration (NEW! 🔥)

✅ **Guardian Policy Workflows** - Automated property tokenization workflows
✅ **Verifiable Credentials** - Property appraisals, title verification, investor accreditation
✅ **MRV Framework** - Monitor rental income, verify occupancy, track performance
✅ **HTS Token Issuance** - Create $PROP (platform) and $DEAL (property) tokens
✅ **Compliance-First** - Reg CF/Reg D compliant from day one
✅ **Enterprise-Grade** - Google, IBM, Boeing governed blockchain

### Dual-Token Economy

✅ **$PROP Token** - Platform governance, fee discounts, staking rewards
✅ **$DEAL Tokens** - Property-specific security tokens with dividend rights
✅ **ICO Infrastructure** - Raise capital without VC dilution
✅ **DEX Integration** - Trade tokens on Hedera-native DEXs

---

## 📊 Tech Stack

### Frontend
- **SvelteKit 2** - Modern meta-framework with Svelte 5 runes
- **shadcn-svelte** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety

### Backend
- **Vercel AI SDK** - Anthropic Claude 3.5 Sonnet & OpenAI GPT-4
- **Supabase** - PostgreSQL + Auth
- **Drizzle ORM** - Type-safe database queries

### Blockchain
- **Hedera Guardian** - Open-source tokenization framework
- **Hedera Hashgraph** - 10K TPS, 3-sec finality, <$0.0001 fees
- **Hedera Token Service (HTS)** - Native token creation
- **Hedera Consensus Service (HCS)** - Audit logging
- **IPFS** - Document storage

---

## 🏗️ Project Structure

```
deed-guru/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── app-sidebar.svelte         # Main navigation
│   │   │   ├── RadarChart.svelte          # 10X visualization
│   │   │   └── ui/                        # shadcn-svelte components
│   │   ├── server/
│   │   │   ├── db/
│   │   │   │   └── schema.ts              # Drizzle schema
│   │   │   ├── ai/
│   │   │   │   └── extractor.ts           # AI property extraction
│   │   │   └── hedera/
│   │   │       ├── guardian/              # Guardian integration
│   │   │       ├── client.ts              # Hedera SDK client
│   │   │       └── token.ts               # Token creation
│   │   └── types.ts                       # Property types & scoring
│   └── routes/
│       ├── (marketing)/                   # Landing, pricing, login
│       │   ├── +layout.svelte             # Marketing layout with logo
│       │   └── +page.svelte               # Home page
│       ├── (app)/
│       │   ├── dashboard/                 # Dashboard overview
│       │   ├── search/                    # Property search
│       │   ├── workspace/                 # AI copilot workspace
│       │   ├── portfolio/                 # Deal pipeline
│       │   ├── marketplace/               # Tokenized properties
│       │   └── team/                      # Team collaboration
│       └── api/
│           ├── guardian/                  # Guardian API routes
│           └── tokenize/                  # Tokenization endpoints
├── static/
│   └── images/
│       ├── deedguru.navy.svg              # Logo (light mode)
│       └── deedguru.gold.svg              # Logo (dark mode)
└── drizzle/                               # Database migrations
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** (or Bun 1.0+)
- **Supabase account** (free tier)
- **Hedera testnet account** (free 10,000 HBAR from [portal.hedera.com](https://portal.hedera.com))
- **AI API key** (Anthropic or OpenAI)
- **Hedera Guardian** (fork and deploy locally)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/deed-guru.git
cd deed-guru

# Install dependencies
bun install  # or npm install

# Copy environment variables
cp .env.example .env

# Configure .env (see below)
```

### Environment Variables

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgres://user:password@host:port/db-name"

# Supabase Auth
PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# AI - Vercel AI SDK
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-proj-..."

# Hedera Hashgraph
HEDERA_NETWORK="testnet"  # or "mainnet"
HEDERA_ACCOUNT_ID="0.0.YOUR_ACCOUNT_ID"
HEDERA_PRIVATE_KEY="YOUR_ED25519_PRIVATE_KEY_HEX"

# Hedera Guardian
GUARDIAN_API_URL="http://localhost:3000"
GUARDIAN_API_KEY="your-guardian-api-key"
```

### Database Setup

```bash
# Generate migrations
bun run db:generate

# Push to database
bun run db:push

# (Optional) Open Drizzle Studio
bun run db:studio
```

### Run Development Server

```bash
bun run dev
# Open http://localhost:5173
```

---

## 💼 Guardian Integration

### Property Tokenization Workflow

```typescript
// Guardian Policy: Property Tokenization

{
  "name": "deed.guru Property Tokenization Policy v1.0",
  "roles": [
    "STANDARD_REGISTRY",     // deed.guru platform
    "PROPERTY_SPONSOR",      // Property owner
    "APPRAISER",             // Issues appraisal VCs
    "INSPECTOR",             // Issues condition report VCs
    "TITLE_COMPANY",         // Issues title verification VCs
    "INVESTOR"               // Purchases $DEAL tokens
  ],
  "workflow": [
    {
      "step": 1,
      "action": "PROPERTY_SPONSOR_SUBMITS_APPLICATION",
      "documents": ["Property details", "Financial statements", "Rent roll"]
    },
    {
      "step": 2,
      "action": "APPRAISER_ISSUES_VC",
      "required_vc": "Property Appraisal VC"
    },
    {
      "step": 3,
      "action": "INSPECTOR_ISSUES_VC",
      "required_vc": "Property Condition Report VC"
    },
    {
      "step": 4,
      "action": "TITLE_COMPANY_ISSUES_VC",
      "required_vc": "Title Verification VC"
    },
    {
      "step": 5,
      "action": "STANDARD_REGISTRY_REVIEW",
      "approval_required": true
    },
    {
      "step": 6,
      "action": "MINT_DEAL_TOKEN",
      "hts_token_type": "NON_FUNGIBLE"
    },
    {
      "step": 7,
      "action": "INVESTOR_ONBOARDING",
      "required_vc": "Accredited Investor VC"
    },
    {
      "step": 8,
      "action": "TOKEN_DISTRIBUTION",
      "payment_accepted": ["USDC", "HBAR"]
    }
  ]
}
```

---

## 📈 Business Model

### Dual-Token ICO Strategy

**$PROP (Platform Governance Token)**
- **Supply:** 1B tokens (fixed)
- **Allocation:** 40% ICO, 30% Community, 20% Team, 10% Treasury
- **Utility:** Governance votes, fee discounts, staking rewards
- **Target Raise:** $50M-$100M

**$DEAL (Property Security Tokens)**
- **Type:** HTS Non-Fungible Tokens (NFTs)
- **Each Property:** Unique token collection
- **Benefits:** Rental income dividends, appreciation, voting rights
- **Compliance:** Reg CF/Reg D compliant

### Revenue Streams

1. **Platform Fees**
   - Property tokenization: 1-2% of raise
   - Secondary trading: 2% of transaction
   - Staking rewards from treasury

2. **Subscription Tiers**
   - Free: Basic analysis (5 properties/month)
   - Pro ($99/mo): Unlimited analysis + AI copilot
   - Enterprise ($999/mo): White-label + API access

3. **Grant Funding**
   - Hedera Foundation grant: $500K-$1M
   - Ecosystem development support

### Addressable Market

- **Commercial Real Estate:** $11.4T (U.S.)
- **Tokenization TAM:** $16T by 2030
- **Target Users:** 10M retail investors + 100K sponsors
- **3-Year Goal:** $10-20B valuation (Cursor fundraising model)

---

## 🔐 Security & Compliance

### Guardian Compliance Features
- **Policy-Based Workflows** - Automated compliance checks
- **Verifiable Credentials** - Cryptographically signed attestations
- **Audit Trail** - Immutable HCS logging
- **KYC/AML Integration** - Built-in investor verification
- **Reg CF/Reg D Support** - SEC-compliant token offerings

### Hedera Security
- **aBFT Consensus** - Asynchronous Byzantine Fault Tolerant
- **Governed by 39 Organizations** - Google, IBM, Boeing, LG, etc.
- **Carbon Negative** - ESG-friendly blockchain
- **<$0.0001 Fees** - 500x cheaper than Ethereum

---

## 🛣️ Roadmap

### Phase 1 (Completed ✅)
- [x] Core 10X scoring engine
- [x] Workspace with AI copilot
- [x] Team collaboration features
- [x] Market analysis tools
- [x] Portfolio pipeline management

### Phase 2 - Guardian Integration (Q1 2025)
- [ ] Fork Hedera Guardian repo
- [ ] Customize property tokenization policies
- [ ] Build verifiable credential schemas
- [ ] Deploy Guardian instance
- [ ] Tokenize first 2-3 pilot properties

### Phase 3 - ICO Launch (Q2 2025)
- [ ] $PROP token smart contracts
- [ ] Community building (10K Discord, 50K Twitter)
- [ ] Whitelist campaign (50K signups)
- [ ] Token Generation Event ($50M-$100M raise)

### Phase 4 - Scale (Q3-Q4 2025)
- [ ] Secondary marketplace (DEX integration)
- [ ] Automated dividend distribution
- [ ] Mobile app (iOS/Android)
- [ ] International expansion (Reg S)

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

### Development Setup

```bash
# Fork & clone
git clone https://github.com/yourusername/deed-guru.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes, commit
git commit -m "Add amazing feature"

# Push & create PR
git push origin feature/amazing-feature
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Hedera Foundation** - Guardian framework and blockchain infrastructure
- **Anthropic** - Claude 3.5 Sonnet AI
- **Vercel** - Deployment & AI SDK
- **Supabase** - Backend infrastructure
- **shadcn** - Component library

---

## 📞 Contact

- **Website:** [deed.guru](https://deed.guru)
- **Twitter:** [@deedguru](https://twitter.com/deedguru)
- **Email:** hello@deed.guru

---

**Built on Hedera Guardian by the deed.guru team** 🏠⛓️

*Tokenize your first property today.*
# deed-guru
# deed-guru
