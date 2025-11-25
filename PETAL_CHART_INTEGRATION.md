# Petal Chart Integration Plan for deed.guru

## Executive Summary

This document outlines the complete integration plan for replacing deed.guru's current 10-axis RadarChart with the proprietary 8-petal PetalChart visualization system. The new system provides a more sophisticated, visually distinctive analysis that better represents property investment quality through a lotus-inspired design.

---

## 1. Architecture Overview

### Current State (deed.guru)
- **Visualization**: 10-axis RadarChart using d3-scale
- **Scoring**: 0-10 per axis, 100 total points
- **Categories**: Market, Rent Growth, CoC, IRR, Value-Add, Scale, DSCR, Location, Exit Cap, Resilience
- **Grading**: A+ to F based on total score
- **File**: `src/lib/components/RadarChart.svelte`

### Target State (PetalChart)
- **Visualization**: 8-petal lotus chart with SVG bezier curves
- **Scoring**: 0-8 per petal, 64 total points
- **Categories**: cashflow, appreciation, financing, location, condition, tenancy, liquidity, compliance
- **Grading**: Bloom status (Fully Bloomed, Near Bloom, Blooming, Late Bloom, Budding)
- **Special Features**: Golden glow effects, Guardian verification ring, confidence indicators, sub-criteria system

---

## 2. Scoring System Mapping

### 2.1 Category Consolidation (10 → 8)

| Current deed.guru (10) | New PetalChart (8) | Mapping Logic |
|------------------------|-------------------|---------------|
| Cash-on-Cash (CoC) | **cashflow** | Direct mapping |
| IRR Projection | **cashflow** | Combined with CoC |
| DSCR | **financing** | Direct mapping |
| Rent Growth | **appreciation** | Direct mapping |
| Exit Cap Compression | **appreciation** | Combined with rent growth |
| Market Momentum | **location** | Market component |
| Submarket Score | **location** | Combined into location |
| Value-Add Potential | **condition** | Direct mapping |
| Scale (Units) | **tenancy** | Operational scale |
| Economic Resilience | **compliance** | Risk assessment |
| - | **liquidity** | NEW: Exit strategy assessment |

### 2.2 Score Conversion Formula

```typescript
// Convert 0-10 scale to 0-8 scale
function convertScore(score10: number): number {
  return Math.round((score10 / 10) * 8);
}

// Convert total score (0-100 to 0-64)
function convertTotalScore(score100: number): number {
  return Math.round((score100 / 100) * 64);
}
```

### 2.3 Bloom Status Thresholds

| Bloom Status | Score Range | Previous Grade Equivalent |
|-------------|-------------|---------------------------|
| Fully Bloomed | 64 (perfect) | A+ (100) |
| Near Bloom | 60-63 | A (94-99) |
| Blooming | 48-59 | A- to B+ (75-93) |
| Late Bloom | 32-47 | B to C (50-74) |
| Budding | 0-31 | D to F (0-49) |

---

## 3. File Structure & Migration

### 3.1 New Files to Create

```
src/lib/
├── components/
│   └── petal-chart/
│       ├── PetalChart.svelte          # Main component
│       ├── PetalTooltip.svelte        # Hover tooltip
│       ├── BloomStatus.svelte         # Status badge component
│       └── index.ts                   # Barrel export
├── types/
│   ├── petal-chart.types.ts           # Core types
│   └── scoring.types.ts               # Scoring & sub-criteria
├── utils/
│   └── petal-chart.utils.ts           # Helper functions
└── stores/
    └── petal-scoring.store.ts         # Reactive scoring state
```

### 3.2 Files to Modify

| File | Changes |
|------|---------|
| `src/lib/components/RadarChart.svelte` | Deprecate (keep for comparison mode) |
| `src/routes/(marketing)/+page.svelte` | Replace RadarChart with PetalChart |
| `src/routes/(app)/workspace/+page.svelte` | Add PetalChart visualization |
| `src/routes/(app)/portfolio/deals/+page.svelte` | Replace deal cards with petal scores |
| `src/lib/server/db/schema.ts` | Add petal_scores column to properties |
| `supabase/migrations/` | Add migration for petal scoring data |

---

## 4. Implementation Phases

### Phase 1: Core Component Migration (Day 1-2)

**Tasks:**
1. Copy and adapt `PetalChart.svelte` from petal-chart project
2. Create type definitions in `src/lib/types/`
3. Create utility functions in `src/lib/utils/`
4. Adapt color scheme to deed.guru brand (golden primary #c8ab37)

**Key Adaptations:**
```typescript
// Adapt colors to deed.guru brand
const getPetalColor = (score: number): string => {
  if (score >= 7) return '#c8ab37';      // Golden (brand primary)
  if (score >= 5) return '#e8d68a';      // Light gold
  if (score >= 3) return '#86efac';      // Light green
  return '#22c55e';                       // Green
};
```

### Phase 2: Data Model Updates (Day 2-3)

**Tasks:**
1. Add petal scoring columns to properties table
2. Create migration script for existing data
3. Update Drizzle schema
4. Create score conversion utility

**Schema Changes:**
```typescript
// Add to properties table
petalScores: jsonb('petal_scores'), // Array of 8 petal scores
bloomScore: integer('bloom_score'), // 0-64 total
bloomStatus: text('bloom_status'),  // Bloom status label
petalConfidence: real('petal_confidence'), // 0-1 data confidence
petalCompleteness: real('petal_completeness'), // 0-1 data completeness
```

**Migration SQL:**
```sql
ALTER TABLE properties
ADD COLUMN petal_scores JSONB,
ADD COLUMN bloom_score INTEGER,
ADD COLUMN bloom_status TEXT,
ADD COLUMN petal_confidence REAL DEFAULT 0.5,
ADD COLUMN petal_completeness REAL DEFAULT 0.5;

-- Convert existing scores
UPDATE properties SET
  petal_scores = convert_to_petal_scores(scores),
  bloom_score = ROUND((total_score::float / 100) * 64),
  bloom_status = get_bloom_status(ROUND((total_score::float / 100) * 64));
```

### Phase 3: UI Integration (Day 3-4)

**Tasks:**
1. Replace RadarChart on marketing page
2. Add PetalChart to workspace page
3. Create PetalScoreCard component for deal cards
4. Add bloom status badges to pipeline views

**Component Placements:**
- **Marketing Page**: Hero section petal chart demo
- **Workspace**: Property analysis with interactive petals
- **Portfolio/Deals**: Mini petal charts in deal cards
- **Property Detail**: Full petal chart with sub-criteria breakdown

### Phase 4: Sub-Criteria System (Day 4-5)

**Tasks:**
1. Implement sub-criteria definitions (5 per petal, 40 total)
2. Create sub-criteria input form for manual scoring
3. Add weighting profiles (equal, income-focus, growth-focus, etc.)
4. Implement `generateInsights()` for auto-generated property analysis

**Sub-Criteria Structure:**
```typescript
const PETAL_SUB_CRITERIA: Record<PetalCategory, SubCriteria[]> = {
  cashflow: [
    { id: 'cf-1', name: 'Cap Rate', weight: 0.25 },
    { id: 'cf-2', name: 'Cash-on-Cash Return', weight: 0.25 },
    { id: 'cf-3', name: 'Net Operating Income', weight: 0.20 },
    { id: 'cf-4', name: 'Expense Ratio', weight: 0.15 },
    { id: 'cf-5', name: 'Revenue Stability', weight: 0.15 },
  ],
  // ... other categories
};
```

### Phase 5: Guardian Integration (Day 5-6)

**Tasks:**
1. Add Guardian verification ring (data provenance on Hedera)
2. Implement confidence scoring from AI extraction
3. Add completeness indicators per petal
4. Create sparkle overlay for max scores

**Guardian Ring Implementation:**
```svelte
<!-- Guardian Verification Ring -->
{#if showGuardianRing}
  <circle
    cx={centerX}
    cy={centerY}
    r={maxRadius + 20}
    fill="none"
    stroke="#c8ab37"
    stroke-width="2"
    stroke-dasharray={`${completeness * circumference} ${(1 - completeness) * circumference}`}
    opacity="0.6"
  />
{/if}
```

### Phase 6: Polish & Documentation (Day 6-7)

**Tasks:**
1. Add animations (petal growth, score transitions)
2. Implement dark mode support
3. Add accessibility features (ARIA labels, keyboard nav)
4. Update CLAUDE.md with petal chart documentation
5. Create storybook stories for component testing

---

## 5. Component API Design

### PetalChart.svelte Props

```typescript
interface PetalChartProps {
  // Required
  data: PetalDataPoint[];

  // Sizing
  size?: number;              // Default: 400
  minCenterRadius?: number;   // Default: 30
  maxCenterRadius?: number;   // Default: 50
  maxPetalLength?: number;    // Default: 120

  // Display Options
  showLabels?: boolean;       // Default: true
  showValues?: boolean;       // Default: true
  showTooltips?: boolean;     // Default: true
  showGuardianRing?: boolean; // Default: true

  // Interactivity
  interactive?: boolean;      // Default: true
  onPetalClick?: (petal: PetalDataPoint) => void;
  onPetalHover?: (petal: PetalDataPoint | null) => void;

  // Effects
  enableGlow?: boolean;       // Default: true (golden glow for max scores)
  enableSparkle?: boolean;    // Default: true (sparkle for score=8)
  animateOnLoad?: boolean;    // Default: true

  // Comparison Mode
  comparisonData?: PetalDataPoint[];
  showComparison?: boolean;
}
```

### PetalDataPoint Interface

```typescript
interface PetalDataPoint {
  id: string;
  label: string;
  score: number;           // 0-8 scale
  confidence: number;      // 0-1 scale
  completeness: number;    // 0-1 scale
  trend: 'up' | 'down' | 'stable';
  category: PetalCategory;
  description?: string;
  subScores?: SubCriteriaScore[];
}
```

---

## 6. Visual Design Specifications

### Color Palette

```scss
// deed.guru Petal Colors
$petal-gold: #c8ab37;       // Score 7-8 (Excellent)
$petal-light-gold: #e8d68a; // Score 5-6 (Good)
$petal-light-green: #86efac;// Score 3-4 (Fair)
$petal-green: #22c55e;      // Score 1-2 (Needs Work)
$petal-gray: #9ca3af;       // Score 0 (No Data)

// Effects
$glow-gold: rgba(200, 171, 55, 0.4);
$guardian-ring: #c8ab37;
$sparkle: #ffffff;
```

### Petal Geometry

```typescript
// Lotus petal path (bezier curves)
function createPetalPath(
  centerX: number,
  centerY: number,
  angle: number,
  petalLength: number,
  petalWidth: number
): string {
  const tipX = centerX + petalLength * Math.cos(angle);
  const tipY = centerY + petalLength * Math.sin(angle);

  // Control points for bezier curves
  const cp1Distance = petalLength * 0.4;
  const cp2Distance = petalLength * 0.8;

  return `
    M ${centerX} ${centerY}
    Q ${centerX + cp1Distance * Math.cos(angle - 0.3)}
      ${centerY + cp1Distance * Math.sin(angle - 0.3)}
      ${tipX} ${tipY}
    Q ${centerX + cp1Distance * Math.cos(angle + 0.3)}
      ${centerY + cp1Distance * Math.sin(angle + 0.3)}
      ${centerX} ${centerY}
    Z
  `;
}
```

---

## 7. Testing Strategy

### Unit Tests

```typescript
// petal-chart.utils.test.ts
describe('PetalChart Utils', () => {
  test('convertScore converts 10-scale to 8-scale', () => {
    expect(convertScore(10)).toBe(8);
    expect(convertScore(5)).toBe(4);
    expect(convertScore(0)).toBe(0);
  });

  test('getBloomStatus returns correct status', () => {
    expect(getBloomStatus(64)).toBe('Fully Bloomed');
    expect(getBloomStatus(60)).toBe('Near Bloom');
    expect(getBloomStatus(48)).toBe('Blooming');
  });

  test('calculateWeightedScore applies weights correctly', () => {
    const scores = [8, 6, 4, 2, 8, 6, 4, 2];
    const weights = WEIGHTING_PROFILES['income-focus'];
    expect(calculateWeightedScore(scores, weights)).toBeCloseTo(5.2);
  });
});
```

### Visual Regression Tests

```typescript
// petal-chart.visual.test.ts
describe('PetalChart Visual', () => {
  test('renders 8 petals correctly', async () => {
    const { container } = render(PetalChart, { data: mockData });
    const petals = container.querySelectorAll('.petal');
    expect(petals.length).toBe(8);
  });

  test('applies golden glow for max scores', async () => {
    const data = [{ ...mockPetal, score: 8 }];
    const { container } = render(PetalChart, { data });
    expect(container.querySelector('.golden-glow')).toBeTruthy();
  });
});
```

---

## 8. Migration Checklist

### Pre-Migration
- [ ] Backup current RadarChart component
- [ ] Document all current RadarChart usage locations
- [ ] Create feature flag for gradual rollout
- [ ] Set up A/B testing infrastructure

### Migration Steps
- [ ] Copy type definitions from petal-chart project
- [ ] Copy utility functions and adapt to deed.guru
- [ ] Copy main PetalChart.svelte and adapt colors
- [ ] Create BloomStatus component
- [ ] Update database schema with petal columns
- [ ] Create data migration script
- [ ] Replace RadarChart on marketing page
- [ ] Add PetalChart to workspace
- [ ] Update deal cards with petal scores
- [ ] Add sub-criteria forms for manual input

### Post-Migration
- [ ] Run visual regression tests
- [ ] Performance testing (render time < 100ms)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Update documentation
- [ ] Remove deprecated RadarChart (after verification)

---

## 9. Risk Mitigation

### Data Migration Risks
- **Risk**: Existing score data loss
- **Mitigation**: Keep original `scores` column, add new `petal_scores` alongside

### Performance Risks
- **Risk**: SVG rendering performance on mobile
- **Mitigation**: Use CSS transforms, limit filter effects on mobile

### User Experience Risks
- **Risk**: Users confused by new scoring system
- **Mitigation**: Add "What is Bloom Score?" tooltip, provide comparison mode

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Render Performance | < 100ms | Lighthouse |
| User Engagement | +20% time on page | Analytics |
| Conversion Rate | +15% trial signups | A/B test |
| User Satisfaction | 4.5+ rating | Feedback survey |
| Accessibility | WCAG 2.1 AA | Automated audit |

---

## 11. Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Core Component | 2 days | None |
| Phase 2: Data Model | 1.5 days | Phase 1 |
| Phase 3: UI Integration | 1.5 days | Phase 1, 2 |
| Phase 4: Sub-Criteria | 2 days | Phase 3 |
| Phase 5: Guardian Ring | 1 day | Phase 3 |
| Phase 6: Polish | 1 day | All phases |

**Total Estimated Time: 7-10 days**

---

## 12. Next Steps

1. **Review & Approve Plan** - Stakeholder sign-off
2. **Set Up Feature Branch** - `feature/petal-chart-integration`
3. **Begin Phase 1** - Copy core component files
4. **Daily Standups** - Track progress and blockers
5. **Incremental Deployment** - Feature flag rollout

---

*Document created: 2025-11-23*
*Last updated: 2025-11-23*
*Author: Claude Code Assistant*
