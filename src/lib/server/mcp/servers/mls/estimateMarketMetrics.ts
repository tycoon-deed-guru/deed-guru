import { callMCPTool } from '../../client';
import type { MLSDeal } from '../../mls-tools';

export interface MarketMetrics {
	year1CoC: number;
	projectedIRR: number;
	rentGrowthCAGR: number;
	popJobGrowth: number;
	valueAddPotential: number;
	dscr: number;
	submarketScore: number;
	exitCapCompressionBps: number;
	economicResilience: number;
}

/**
 * Estimate market metrics for a property to enable deed.guru scoring.
 *
 * Uses market data, property characteristics, and historical trends to estimate:
 * - Cash-on-cash returns
 * - IRR projections
 * - Rent growth forecasts
 * - Market strength indicators
 *
 * @param deal - The MLS deal to analyze
 * @returns Estimated metrics for deed.guru scoring
 */
export async function estimateMarketMetrics(deal: MLSDeal): Promise<MarketMetrics> {
	return callMCPTool<MarketMetrics>('mls__estimate_market_metrics', { deal });
}
