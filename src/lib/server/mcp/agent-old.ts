import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { env } from '$env/dynamic/private';
import {
	searchMultifamilyDeals,
	estimateMarketMetrics,
	mlsSearchTool,
	type MLSDeal,
} from './mls-tools';
import { calculatedeed.guruScore, totalScore, letterGrade, type Property } from '$lib/types';

/**
 * deed.guru Hunter Agent
 * Uses Vercel AI SDK with function calling to search MLS and score deals
 */

export interface HuntQuery {
	city: string;
	state: string;
	minUnits?: number;
	maxPrice?: number;
	minScore?: number; // Minimum deed.guru score threshold (default 75 = B+)
}

export interface ScoredDeal extends MLSDeal {
	scores: number[];
	totalScore: number;
	grade: string;
	gradeColor: string;
	metrics: {
		year1CoC: number;
		projectedIRR: number;
		rentGrowthCAGR: number;
		popJobGrowth: number;
		valueAddPotential: number;
		dscr: number;
		submarketScore: number;
		exitCapCompressionBps: number;
		economicResilience: number;
	};
}

const CARDONE_HUNT_PROMPT = `You are Grant Cardone's top acquisition analyst with 25+ years experience in multifamily real estate. Your mission: Find ONLY deals that meet the deed.guru investment criteria.

SCORING RULES (out of 100 total):
- A+ (90-100): Dominant properties, massive cash flow, unstoppable markets
- A (85-89): Elite deals, strong fundamentals, top-tier locations
- A- (80-84): Excellent properties with minor optimization opportunities
- B+ (75-79): Very good deals worth considering
- B (70-74): Solid but not exceptional
- C (60-69): Pass unless major value-add play
- F (<60): HARD PASS - does not meet deed.guru standards

CARDONE'S deed.guru CRITERIA:
1. **Market Momentum** - Job/population growth 3%+ (sunbelt priority)
2. **Rent Growth** - CAGR 5%+ (inflation hedge)
3. **Cash Flow** - Year 1 CoC 7%+ (immediate returns)
4. **IRR** - 18%+ over 5-7 years (wealth multiplication)
5. **Value-Add** - 20%+ equity creation potential (forced appreciation)
6. **Scale** - 200+ units preferred (efficiency, easier exit)
7. **Debt Coverage** - DSCR 1.30+ (safety margin)
8. **Location** - A/B submarkets only (tenant quality)
9. **Exit Strategy** - Cap rate compression potential (market timing)
10. **Economic Resilience** - Diversified job base (recession-proof)

When searching deals, ONLY return properties scoring 75+ (B+ or better). Explain WHY each deal meets or exceeds these standards. Be ruthlessly selective - Grant Cardone says "NO" to 95% of deals.`;

/**
 * Execute a live deal hunt using AI + MLS tools
 */
export async function executeDealHunt(query: HuntQuery): Promise<ScoredDeal[]> {
	// Choose model based on available API keys
	const model = env.ANTHROPIC_API_KEY
		? anthropic('claude-3-5-sonnet-20241022')
		: env.OPENAI_API_KEY
		? openai('gpt-4-turbo')
		: null;

	if (!model) {
		throw new Error('No AI provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY');
	}

	try {
		// Step 1: Search MLS data
		const mlsDeals = await searchMultifamilyDeals(
			query.city,
			query.state,
			query.minUnits || 100,
			query.maxPrice
		);

		if (mlsDeals.length === 0) {
			return [];
		}

		// Step 2: Score each deal using deed.guru criteria
		const scoredDeals: ScoredDeal[] = mlsDeals.map((deal) => {
			const metrics = estimateMarketMetrics(deal);

			// Create temporary Property object for scoring
			const propertyForScoring: Partial<Property> & {
				year1CoC: number;
				projectedIRR: number;
				rentGrowthCAGR: number;
				popJobGrowth: number;
				valueAddPotential: number;
				dscr: number;
				submarketScore: number;
				exitCapCompressionBps: number;
				economicResilience: number;
				units: number;
				id: string;
				uploadedAt: Date;
			} = {
				id: deal.mlsId,
				units: deal.units,
				year1CoC: metrics.year1CoC,
				projectedIRR: metrics.projectedIRR,
				rentGrowthCAGR: metrics.rentGrowthCAGR,
				popJobGrowth: metrics.popJobGrowth,
				valueAddPotential: metrics.valueAddPotential,
				dscr: metrics.dscr,
				submarketScore: metrics.submarketScore,
				exitCapCompressionBps: metrics.exitCapCompressionBps,
				economicResilience: metrics.economicResilience,
				uploadedAt: new Date(),
			};

			const scores = calculatedeed.guruScore(propertyForScoring as Property);
			const total = totalScore(scores);
			const gradeInfo = letterGrade(total);

			return {
				...deal,
				scores,
				totalScore: total,
				grade: gradeInfo.grade,
				gradeColor: gradeInfo.color,
				metrics,
			};
		});

		// Step 3: Filter by minimum score threshold
		const minScore = query.minScore || 75; // Default B+ or better
		const qualifiedDeals = scoredDeals.filter((deal) => deal.totalScore >= minScore);

		// Step 4: Use AI to analyze and rank (optional - adds intelligence)
		if (qualifiedDeals.length > 0 && env.ANTHROPIC_API_KEY) {
			const dealSummary = qualifiedDeals
				.map(
					(d) =>
						`${d.name}: ${d.units} units, $${(d.price / 1e6).toFixed(1)}M, ${d.capRate}% cap, Score: ${d.totalScore}/100 (${d.grade})`
				)
				.join('\n');

			const { text } = await generateText({
				model,
				prompt: `${CARDONE_HUNT_PROMPT}\n\nI found these ${qualifiedDeals.length} deals in ${query.city}, ${query.state}:\n\n${dealSummary}\n\nRank them by deed.guru potential and explain the top 3 in Grant Cardone's voice (2-3 sentences each). Focus on cash flow, forced appreciation, and market dominance.`,
				maxTokens: 1000,
			});

			console.log('AI Analysis:', text);
		}

		// Sort by score (highest first)
		return qualifiedDeals.sort((a, b) => b.totalScore - a.totalScore);
	} catch (error) {
		console.error('Deal hunt failed:', error);
		throw new Error(`Failed to execute deal hunt: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

/**
 * Quick hunt with natural language query
 * Example: "Find me 300+ unit value-add deals in Florida under $100M"
 */
export async function huntWithNaturalLanguage(query: string): Promise<ScoredDeal[]> {
	const model = env.ANTHROPIC_API_KEY
		? anthropic('claude-3-5-sonnet-20241022')
		: env.OPENAI_API_KEY
		? openai('gpt-4-turbo')
		: null;

	if (!model) {
		throw new Error('No AI provider configured');
	}

	// Parse natural language to structured query
	const { text } = await generateText({
		model,
		prompt: `Extract search parameters from this real estate query: "${query}"

Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "city": "CityName",
  "state": "XX",
  "minUnits": 100,
  "maxPrice": 100000000,
  "minScore": 75
}

Rules:
- Use common cities: Orlando, Austin, Phoenix, Nashville, Jacksonville, Scottsdale
- State must be 2-letter code (FL, TX, AZ, TN)
- minUnits defaults to 100
- maxPrice optional (omit if not specified)
- minScore defaults to 75`,
		maxTokens: 200,
	});

	try {
		const params = JSON.parse(text.trim()) as HuntQuery;
		return await executeDealHunt(params);
	} catch (error) {
		console.error('Failed to parse query:', text);
		throw new Error('Could not understand your search query. Try: "Find 200+ unit deals in Austin, TX"');
	}
}
