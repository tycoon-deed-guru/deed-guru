# Petal Chart Design & Scoring System

A comprehensive guide to the lotus flower visualization for property investment scoring.

---

## Overview

Petal Chart visualizes property investment scores using a lotus flower metaphor. Properties are scored across **8 categories ("petals")**, each scoring **0-8**, totaling up to **64 for a "Fully Bloomed" property**.

---

## Petal Arrangement

The 8 petals are arranged clockwise from 12 o'clock in three strategic zones:

```
              LOCATION (12:00)
                    ●
       CONDITION         TENANCY
           ↖               ↗
                 [center]
           ↙               ↘
      LIQUIDITY         COMPLIANCE

      APPRECIATION       FINANCING
           ↘               ↙
                    ●
             CASHFLOW (6:00)
```

### Zone Strategy

| Zone | Position | Petals | Purpose |
|------|----------|--------|---------|
| **Quality Crown** | Top | Location, Condition, Tenancy | Fundamentals that drive value |
| **Risk Balance** | Sides | Liquidity, Compliance | Exit risk counterweights |
| **Returns** | Bottom | Cashflow, Appreciation, Financing | The "bottom line" |

---

## Scoring System

### Per-Petal Structure

Each petal has **5 weighted sub-criteria** scored on a **0-8 scale**:

```
Petal Score = Σ(SubCriteria[i].score × SubCriteria[i].weight)
```

### Sub-Criteria by Petal

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

*Note: Location uniquely uses equal weights across all criteria.*

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

---

## Weighting Profiles

Profiles adjust petal importance based on investment strategy:

| Profile | Cashflow | Appreciation | Financing | Location | Condition | Tenancy | Liquidity | Compliance |
|---------|----------|--------------|-----------|----------|-----------|---------|-----------|------------|
| **Equal** | 12.5% | 12.5% | 12.5% | 12.5% | 12.5% | 12.5% | 12.5% | 12.5% |
| **Income Focus** | 25% | 8% | 12% | 10% | 10% | 20% | 8% | 7% |
| **Growth Focus** | 8% | 25% | 10% | 22% | 10% | 8% | 10% | 7% |
| **Value-Add** | 10% | 15% | 12% | 18% | 20% | 8% | 10% | 7% |
| **Conservative** | 15% | 10% | 12% | 15% | 12% | 12% | 12% | 12% |
| **Custom** | User-defined weights |

---

## Bloom Status

### Thresholds (0-64 Raw Score)

| Status | Score | Percentage | Description |
|--------|-------|------------|-------------|
| **Fully Bloomed** | ≥ 64 | 100% | All petals maxed |
| **Near Bloom** | ≥ 60 | 93.75% | Excellent investment |
| **Blooming** | ≥ 50 | 78.1% | Strong performer |
| **Late Bloom** | ≥ 40 | 62.5% | Developing potential |
| **Budding** | < 40 | < 62.5% | Needs improvement |

### Normalized Scale (0-100)

Used in reports and insights:

| Status | Score | Icon | Color |
|--------|-------|------|-------|
| **Fully Bloomed** | ≥ 90 | 🌸 | Dark Gold #B8860B |
| **Blooming** | ≥ 75 | 🌷 | Gold #CFA874 |
| **Budding** | ≥ 60 | 🌱 | Cream #E8DCC4 |
| **Sprouting** | ≥ 40 | 🌿 | Light Green #86efac |
| **Wilting** | < 40 | 🥀 | Green #22c55e |

---

## Visual Design

### Color Progression

Petals progress from vibrant green (new) to gold (mature):

| Score Range | Stage | Gradient Colors |
|-------------|-------|-----------------|
| 7-8 | Mature | Gold #CFA874 → Dark Goldenrod #B8860B |
| 5-6 | Developing | Ivory #F5F5DC → Warm Beige #E8DCC4 |
| 3-4 | Early Growth | Light Green #86efac → #bbf7d0 |
| 0-2 | Budding | Fresh Green #22c55e → #4ade80 |

### Special Effects

| Effect | Trigger | Visual |
|--------|---------|--------|
| **Golden Glow** | Score = 8 (perfect) | Warm halo with shimmer |
| **Standard Glow** | Trend = up | Subtle blue glow |
| **Sparkle Overlay** | Score = 8 | Animated sparkle effect |
| **Pulse Animation** | Perfect petals | Brightness 1.0 → 1.15 → 1.0 |
| **Opacity** | Confidence level | 0.5 (low) → 1.0 (high) |

### Center Circle

The dynamic center reflects overall health:

- **Size**: 30px (low score) → 60px (high score)
- **Score Display**: Raw (X/64) + Percentage
- **Confidence Ring**: Gold dashed arc showing data confidence
- **Guardian Ring**: Blue-purple gradient showing completeness

---

## SVG Structure

### Petal Geometry

```
Base Points: 40% of center radius (natural overlap)
Widest Point: 60% of petal length
Width Formula: sin(angleStep/2) × wideRadius × 1.1
```

### Curvature Control Points

1. **Inner Arc (0-60%)**: Control points at 30% create rounded bulge
2. **Outer Arc (60-100%)**: Control points at 85% maintain width for rounded tip
3. **Base Closure**: Curves inward for natural center overlap

---

## Data Model

### Property Structure

```typescript
interface ScoredProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  lng: number;
  lat: number;
  petals: PetalScoring[];           // 8 petals with sub-criteria
  weightingProfile: WeightingProfileType;
  customWeights?: Record<PetalCategory, number>;
  createdAt: Date;
  updatedAt: Date;
  history: ScoreHistoryEntry[];     // Tracked when Δ ≥ 0.5
}
```

### Petal Metadata

Each petal tracks:

- **Score**: 0-8 (weighted average of sub-criteria)
- **Confidence**: 0-1 (data accuracy certainty)
- **Completeness**: 0-1 (% sub-criteria with scores > 0)
- **Trend**: 'up' | 'down' | 'stable'
- **Notes**: Free-text description

---

## Component Ecosystem

| Component | Purpose |
|-----------|---------|
| `PetalChart.svelte` | Main SVG visualization |
| `PetalScoringInput.svelte` | Sub-criteria scoring form |
| `PropertyMap.svelte` | Mapbox GL geographic view |
| `WeightingProfileSelector.svelte` | Profile selection UI |
| `BloomScoreCard.svelte` | Status summary card |
| `AutoInsights.svelte` | Strength/weakness analysis |
| `HistoryChart.svelte` | Score trend over time |
| `PetalLegend.svelte` | Category legend |

---

## Key Design Decisions

1. **8 Petals**: Covers all major investment factors without cognitive overload
2. **Clockwise from 12**: Natural Western reading direction
3. **Green → Gold**: Mirrors plant growth metaphor
4. **5 Sub-criteria**: Sufficient granularity, manageable complexity
5. **Dual Scales**: Raw (0-64) for charts, normalized (0-100) for reports
6. **SVG-based**: Scalable, interactive, efficient animations
7. **Confidence Opacity**: Visual encoding of data certainty
