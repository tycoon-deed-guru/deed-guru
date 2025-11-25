/**
 * SKILL: Hunt and Score Multifamily Deals
 *
 * This skill searches for multifamily properties and scores them using
 * the 8-petal Bloom scoring methodology.
 *
 * Usage:
 *   import { huntAndScoreDeals } from './skills/hunt-and-score-deals';
 *
 *   const results = await huntAndScoreDeals({
 *     city: 'Austin',
 *     state: 'TX',
 *     minUnits: 200,
 *     minScore: 50  // Minimum Bloom score (default 50 = Blooming)
 *   });
 */

import * as mls from '../servers/mls';
import { calculateBloomScore, totalScore, normalizedScore } from '$lib/types';
import type { Property } from '$lib/types';
import type { BloomMetrics } from '../mls-tools';
import { PETAL_ORDER, PETAL_LABELS, getBloomStatus, type BloomStatus } from '$lib/types/petal-chart.types';

export interface HuntAndScoreInput {
	city: string;
	state: string;
	minUnits?: number;
	maxPrice?: number;
	minScore?: number; // Minimum Bloom score out of 64 (default 50 = Blooming)
}

export interface ScoredDeal {
	mlsId: string;
	name: string;
	address: string;
	city: string;
	state: string;
	units: number;
	price: number;
	capRate: number;
	// 8 petal scores in PETAL_ORDER
	petalScores: {
		petal: string;
		label: string;
		score: number;
	}[];
	totalScore: number;       // 0-64 raw
	normalizedScore: number;  // 0-100
	bloomStatus: BloomStatus;
	bloomLabel: string;
	bloomEmoji: string;
	bloomColor: string;
	// All 40 sub-criteria metrics
	metrics: BloomMetrics;
}

/**
 * Search MLS for properties and score using 8-petal Bloom methodology
 */
export async function huntAndScoreDeals(input: HuntAndScoreInput): Promise<ScoredDeal[]> {
	// Step 1: Search MLS (context-efficient - only loads what we need)
	const deals = await mls.searchMultifamilyDeals({
		city: input.city,
		state: input.state,
		minUnits: input.minUnits || 100,
		maxPrice: input.maxPrice,
	});

	console.log(`Found ${deals.length} properties in ${input.city}, ${input.state}`);

	// Step 2: Process in code execution environment (no token waste)
	const scoredDeals: ScoredDeal[] = [];

	for (const deal of deals) {
		// Estimate Bloom metrics for all 40 sub-criteria
		const metrics = await mls.estimateMarketMetrics(deal);

		// Create property object for scoring
		const propertyForScoring: Property = {
			id: deal.mlsId,
			name: deal.name,
			address: deal.address,
			units: deal.units,
			uploadedAt: new Date(),
			...metrics,
		};

		// Calculate 8-petal Bloom scores
		const scores = calculateBloomScore(propertyForScoring);
		const total = totalScore(scores);
		const normalized = normalizedScore(total);
		const bloomInfo = getBloomStatus(total);

		// Build petal scores array with labels
		const petalScores = PETAL_ORDER.map((petal, index) => ({
			petal,
			label: PETAL_LABELS[petal],
			score: scores[index],
		}));

		// Default minimum is 50 (Blooming status)
		const minScore = input.minScore ?? 50;

		// Only include if meets minimum score threshold
		if (total >= minScore) {
			scoredDeals.push({
				mlsId: deal.mlsId,
				name: deal.name,
				address: deal.address,
				city: deal.city,
				state: deal.state,
				units: deal.units,
				price: deal.price,
				capRate: deal.capRate,
				petalScores,
				totalScore: total,
				normalizedScore: normalized,
				bloomStatus: bloomInfo.status,
				bloomLabel: bloomInfo.label,
				bloomEmoji: bloomInfo.emoji,
				bloomColor: bloomInfo.color,
				metrics,
			});
		}
	}

	// Sort by score (highest first)
	scoredDeals.sort((a, b) => b.totalScore - a.totalScore);

	console.log(`${scoredDeals.length} deals meet minimum Bloom score of ${input.minScore ?? 50}/64`);

	// Only the filtered, sorted results flow back through context
	return scoredDeals;
}
