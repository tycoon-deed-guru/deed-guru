# MCP + MLS Live Hunt Integration - Bloom Petal Scoring

## What We Built

A **real-time deal hunting machine** powered by AI and MLS data, using the **8-Petal Bloom scoring methodology** for property investment analysis.

### The Feature Stack:

- **MCP (Model Context Protocol)** - AI-native data access layer
- **Live MLS Search** - Query multifamily deals across sunbelt markets
- **AI Execution Agent** - Claude/GPT-4 powered deal analysis
- **8-Petal Bloom Scoring** - Comprehensive property assessment
- **Beautiful UI** - Tabbed interface with petal chart visualization

---

## Architecture

```
User Query: "Find 200+ unit deals in Orlando"
    |
[LiveHunt.svelte] -> Natural Language Input
    |
[/api/hunt] -> API Endpoint
    |
[agent.ts] -> AI Agent (Claude 3.5 Sonnet or GPT-4)
    |
[mls-tools.ts] -> MLS Data Search + Bloom Metrics
    |
[calculateBloomScore()] -> 8-Petal Scoring
    |
[UI] -> Results with Petal Charts
```

### File Structure:

```
src/
├── lib/
│   ├── types.ts                          # Bloom scoring system
│   ├── types/
│   │   └── petal-chart.types.ts          # Petal categories & types
│   ├── components/
│   │   ├── LiveHunt.svelte               # Live hunt UI component
│   │   └── PetalChart.svelte             # 8-petal visualization
│   └── server/
│       └── mcp/
│           ├── mls-tools.ts              # MLS search & Bloom metrics
│           ├── agent.ts                  # AI execution engine
│           └── skills/
│               └── hunt-and-score-deals.ts # Deal hunting skill
├── routes/
│   ├── +page.svelte                      # Main dashboard with tabs
│   └── api/
│       └── hunt/
│           └── +server.ts                # Hunt API endpoint
```

---

## 8-Petal Bloom Scoring System

The Bloom scoring system uses a lotus flower metaphor with **8 petals**, each scored **0-8**, for a maximum total of **64 points**.

### Petal Arrangement (Clockwise from 12:00)

```
              LOCATION (12:00)
                    *
       CONDITION         TENANCY
           \               /
                 [center]
           /               \
      LIQUIDITY         COMPLIANCE

      APPRECIATION       FINANCING
           \               /
                    *
             CASHFLOW (6:00)
```

### Zone Strategy

| Zone | Position | Petals | Purpose |
|------|----------|--------|---------|
| **Quality Crown** | Top | Location, Condition, Tenancy | Fundamentals that drive value |
| **Risk Balance** | Sides | Liquidity, Compliance | Exit risk counterweights |
| **Returns** | Bottom | Cashflow, Appreciation, Financing | The "bottom line" |

### Sub-Criteria (5 per petal, 40 total)

Each petal has 5 weighted sub-criteria:

#### CASHFLOW (Income Generation)
| Sub-Criteria | Weight | Description |
|--------------|--------|-------------|
| Cap Rate | 30% | Net operating income / purchase price |
| Cash-on-Cash Return | 25% | Annual cash flow / total cash invested |
| Rent Growth Potential | 20% | Expected annual rent increase |
| Expense Ratio | 15% | Operating expenses / gross income |
| Vacancy Rate | 10% | Historical vacancy percentage |

#### APPRECIATION (Long-term Value Growth)
| Sub-Criteria | Weight | Description |
|--------------|--------|-------------|
| Market Trend | 30% | Historical and projected price growth |
| Neighborhood Development | 25% | Upcoming infrastructure and amenities |
| Supply/Demand Balance | 20% | Housing supply vs. demand dynamics |
| Economic Drivers | 15% | Job growth, major employers |
| Comparable Sales | 10% | Recent similar property sales |

#### FINANCING (Loan Availability & Terms)
| Sub-Criteria | Weight | Description |
|--------------|--------|-------------|
| Interest Rate | 30% | Current loan interest rate |
| LTV Ratio | 25% | Loan-to-value ratio available |
| Loan Terms | 20% | Amortization, prepayment flexibility |
| Qualification Ease | 15% | DSCR, income requirements |
| Refinance Options | 10% | Future refinancing potential |

#### LOCATION (Geographic Appeal)
| Sub-Criteria | Weight | Description |
|--------------|--------|-------------|
| Walk Score | 20% | Walkability and transit access |
| School Quality | 20% | Nearby school ratings |
| Safety/Crime Rate | 20% | Neighborhood safety metrics |
| Amenities Access | 20% | Shopping, dining, entertainment |
| Commute/Transit | 20% | Access to employment centers |

#### CONDITION (Physical State)
| Sub-Criteria | Weight | Description |
|--------------|--------|-------------|
| Structural Integrity | 25% | Foundation, roof, walls |
| Major Systems | 25% | HVAC, plumbing, electrical age |
| Cosmetic Condition | 20% | Paint, flooring, fixtures |
| Deferred Maintenance | 20% | Outstanding repairs needed |
| Energy Efficiency | 10% | Insulation, windows, appliances |

#### TENANCY (Occupancy & Lease Quality)
| Sub-Criteria | Weight | Description |
|--------------|--------|-------------|
| Occupancy Rate | 25% | Current occupancy percentage |
| Tenant Quality | 25% | Payment history, stability |
| Lease Terms | 20% | Lease length, rent escalations |
| Turnover Rate | 15% | Historical tenant retention |
| Rent Roll Strength | 15% | Below/at/above market rents |

#### LIQUIDITY (Exit Ease)
| Sub-Criteria | Weight | Description |
|--------------|--------|-------------|
| Days on Market | 30% | Average time to sell in area |
| Buyer Pool Depth | 25% | Number of potential buyers |
| Financing Availability | 20% | Ease of buyer financing |
| Market Activity | 15% | Transaction volume trends |
| Price Stability | 10% | Frequency of price reductions |

#### COMPLIANCE (Legal & Regulatory)
| Sub-Criteria | Weight | Description |
|--------------|--------|-------------|
| Permits Current | 25% | All permits up to date |
| Zoning Compliance | 25% | Current use matches zoning |
| Code Violations | 20% | Outstanding violations |
| Environmental Issues | 15% | Hazmat, flood zone, etc. |
| HOA/Regulations | 15% | Rental restrictions, rules |

### Bloom Status Thresholds

| Status | Score (0-64) | Normalized (0-100) | Description |
|--------|--------------|-------------------|-------------|
| **Fully Bloomed** | >= 64 | 100% | All petals maxed |
| **Near Bloom** | >= 60 | 93.75% | Excellent investment |
| **Blooming** | >= 50 | 78.1% | Strong performer |
| **Late Bloom** | >= 40 | 62.5% | Developing potential |
| **Budding** | < 40 | < 62.5% | Needs improvement |

---

## How to Use

### 1. Start the App
```bash
bun run dev
# Open http://localhost:5173/
```

### 2. Navigate to Live Hunt Tab
Click **"Live Hunt"** in the main dashboard

### 3. Enter Your Query
**Natural Language Examples:**
- "Find 200+ unit deals in Orlando, FL"
- "Search Austin for 300+ unit value-add properties"
- "Show me Class A deals in Phoenix with 250+ units"
- "Find high cash flow multifamily in Nashville"

### 4. Click "Hunt Deals"
The AI agent will:
1. Parse your natural language query
2. Search MLS data across sunbelt markets
3. Score each property using 8-Petal Bloom methodology
4. Return deals meeting minimum Bloom score (default: 50 = Blooming)

### 5. Review Results
- **Bloom Status badges** (Fully Bloomed, Near Bloom, Blooming, Late Bloom, Budding)
- **Petal scores** for each of the 8 categories
- **Total score** out of 64 (with normalized 0-100%)
- **Key metrics** (price, cap rate, units, all 40 sub-criteria)
- **Interactive petal charts**

---

## Sunbelt Markets Included (Demo Data)

| Market | Properties | Avg Units | Avg Cap Rate |
|--------|-----------|-----------|--------------|
| **Orlando, FL** | 2 | 362 | 6.5% |
| **Austin, TX** | 2 | 450 | 5.95% |
| **Phoenix, AZ** | 2 | 253 | 7.05% |
| **Nashville, TN** | 1 | 340 | 6.4% |
| **Jacksonville, FL** | 1 | 275 | 7.5% |

---

## Configuration

### Required Environment Variables:

```bash
# AI Provider (choose ONE)
ANTHROPIC_API_KEY="sk-ant-..."    # Claude 3.5 Sonnet (recommended)
OPENAI_API_KEY="sk-proj-..."      # GPT-4 Turbo (fallback)
```

### Optional (for production):

```bash
# Real MLS Data Sources
HELLODATA_API_KEY="..."           # HelloData market trends (recommended for MVP)
RESO_API_KEY="..."                # RESO Web API 2.0
CORELOGIC_API_KEY="..."           # CoreLogic Trestle
```

---

## Production Deployment

### Phase 1: Current (Demo Mode)
- Simulated MLS data (6 properties across 5 markets)
- AI-powered natural language queries
- 8-Petal Bloom scoring automation
- Petal chart visualization
- Full TypeScript types

### Phase 2: Real MLS Integration (2-4 weeks)

Replace `searchMultifamilyDeals()` in `mls-tools.ts` with real API:

#### Recommended: HelloData (~$200-500/mo)
```typescript
import axios from 'axios';

export async function searchMultifamilyDeals(
  city: string,
  state: string,
  minUnits: number
) {
  const response = await axios.get('https://api.hellodata.ai/v1/search', {
    params: {
      location: `${city}, ${state}`,
      property_type: 'multifamily',
      min_units: minUnits,
    },
    headers: { 'X-API-Key': process.env.HELLODATA_API_KEY },
  });

  return response.data.listings.map(transformToMLSDeal);
}
```

---

## API Response Format

### ScoredDeal Object

```typescript
interface ScoredDeal {
  mlsId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  units: number;
  price: number;
  capRate: number;

  // 8 petal scores
  petalScores: {
    petal: string;    // e.g., 'location', 'cashflow'
    label: string;    // e.g., 'Location', 'Cashflow'
    score: number;    // 0-8
  }[];

  totalScore: number;       // 0-64 raw
  normalizedScore: number;  // 0-100
  bloomStatus: BloomStatus; // 'fully-bloomed' | 'near-bloom' | etc.
  bloomLabel: string;       // 'Fully Bloomed', 'Near Bloom', etc.
  bloomEmoji: string;       // Petal emoji
  bloomColor: string;       // Tailwind color class

  // All 40 sub-criteria metrics
  metrics: BloomMetrics;
}
```

---

## Troubleshooting

### "No AI provider configured"
**Solution:** Set either `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in `.env`

### "No deals found"
**Causes:**
1. Query too restrictive (e.g., 500+ units in small market)
2. Market not in demo data (add to `sunbeltDeals` in `mls-tools.ts`)
3. minScore threshold too high (default 50)

**Solution:** Try broader queries like "Find deals in Orlando"

### Bloom scores seem low
**Cause:** Sub-criteria values need calibration for your market
**Solution:** Adjust thresholds in `estimateMarketMetrics()` in `mls-tools.ts`

---

## Completion Checklist

### Backend:
- [x] MCP tools infrastructure (`mls-tools.ts`)
- [x] 8-Petal Bloom metrics estimation
- [x] AI execution agent (`agent.ts`)
- [x] Hunt API endpoint (`/api/hunt`)
- [x] Natural language query parsing
- [x] Bloom auto-scoring integration
- [x] TypeScript type safety

### Frontend:
- [x] LiveHunt component with search UI
- [x] Tab navigation (My Deals vs Live Hunt)
- [x] Results grid with property cards
- [x] Petal chart visualization
- [x] Bloom status badges
- [x] Responsive design

### Ready for Production:
- [x] Vercel AI SDK integration
- [x] Supabase auth compatibility
- [x] Error handling
- [x] Loading states
- [ ] Real MLS API keys (when ready)
- [ ] Stripe tier gating (Phase 2)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/types.ts` | Property type with 40 sub-criteria, `calculateBloomScore()` |
| `src/lib/types/petal-chart.types.ts` | Petal categories, order, labels, `getBloomStatus()` |
| `src/lib/server/mcp/mls-tools.ts` | MLS search, `estimateMarketMetrics()` for 40 sub-criteria |
| `src/lib/server/mcp/skills/hunt-and-score-deals.ts` | Deal hunting skill with Bloom scoring |
| `src/lib/server/mcp/agent.ts` | AI execution engine |
| `src/routes/api/hunt/+server.ts` | Hunt API endpoint |

---

## Scoring Formulas

### Petal Score Calculation

```typescript
// Each petal score is weighted average of 5 sub-criteria
petalScore = sum(subCriteria[i].score * subCriteria[i].weight)

// Example: CASHFLOW petal
cashflowScore =
  capRate * 0.30 +
  cashOnCash * 0.25 +
  rentGrowthPotential * 0.20 +
  expenseRatio * 0.15 +
  vacancyRate * 0.10
```

### Total Score

```typescript
totalScore = sum(allPetalScores)  // Max 64
normalizedScore = (totalScore / 64) * 100  // 0-100%
```

---

## Next Steps

**Week 1:**
- Add "Save to My Deals" button functionality
- Connect to database for saved hunts

**Week 2:**
- Implement Stripe tier gating (free vs Pro)
- Add usage limits (5 hunts/day for free)

**Week 3:**
- Integrate real MLS API (HelloData recommended)
- Add 10+ markets (Dallas, Houston, Miami, etc.)

**Week 4:**
- Launch beta
- Collect feedback and iterate
