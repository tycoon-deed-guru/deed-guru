import { callMCPTool } from '../../client';
import type { MLSDeal } from '../../mls-tools';

export interface SearchMultifamilyDealsInput {
	city: string;
	state: string;
	minUnits?: number;
	maxPrice?: number;
}

/**
 * Search live multifamily apartment deals (100+ units) across sunbelt markets.
 *
 * Supports major markets including:
 * - Austin, TX
 * - Orlando, FL
 * - Phoenix, AZ
 * - Nashville, TN
 * - Jacksonville, FL
 * - And 20+ more sunbelt cities
 *
 * @param input - Search parameters
 * @returns Array of matching multifamily deals with financials
 */
export async function searchMultifamilyDeals(
	input: SearchMultifamilyDealsInput
): Promise<MLSDeal[]> {
	return callMCPTool<MLSDeal[]>('mls__search_multifamily_deals', input);
}
