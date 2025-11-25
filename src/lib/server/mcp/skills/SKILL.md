# Hunt and Score Deals Skill

## Purpose
Search multifamily properties across sunbelt markets and score them using Grant Cardone's 10X methodology.

## When to Use
- User asks to find deals in a specific market
- Need to compare multiple properties
- Want only deals above a certain quality threshold

## Example Usage

```typescript
import { huntAndScoreDeals } from './skills/hunt-and-score-deals';

// Find high-quality deals in Austin
const results = await huntAndScoreDeals({
  city: 'Austin',
  state: 'TX',
  minUnits: 200,
  maxPrice: 150_000_000,
  minScore: 80  // Only A- or better
});

console.log(`Found ${results.length} excellent deals`);
results.forEach(deal => {
  console.log(`${deal.name}: ${deal.totalScore}/100 (${deal.grade})`);
});
```

## Benefits
- **Context Efficient**: Processes all data in execution environment
- **Progressive**: Only loads MLS tools when needed
- **Filtered**: Returns only qualifying deals (saves tokens)
- **Reusable**: Same logic for any market search

## Parameters
- `city` (required): City name (e.g., "Austin", "Orlando")
- `state` (required): 2-letter state code
- `minUnits` (optional): Minimum unit count (default: 100)
- `maxPrice` (optional): Maximum purchase price
- `minScore` (optional): Minimum 10X score (default: 75)

## Returns
Array of scored deals with:
- Basic info (name, address, units, price)
- 10X scores (array of 10 scores, total, grade)
- Market metrics (IRR, CoC, rent growth, etc.)

## Token Savings
Traditional approach: ~150,000 tokens (all MLS data + intermediate results)
This skill: ~2,000 tokens (only filtered results)
**Savings: 98.7%**
