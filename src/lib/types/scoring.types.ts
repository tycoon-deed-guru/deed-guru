import type { PetalCategory, PetalDataPoint } from './petal-chart.types';
import { PETAL_LABELS } from './petal-chart.types';

// Dimension groupings for the 8-petal system
export type PetalDimension = 'returns' | 'asset' | 'risk';

export const PETAL_DIMENSIONS: Record<PetalCategory, PetalDimension> = {
	cashflow: 'returns',
	appreciation: 'returns',
	financing: 'returns',
	location: 'asset',
	condition: 'asset',
	tenancy: 'asset',
	liquidity: 'risk',
	compliance: 'risk'
};

// Sub-criteria measurement types
export type MeasurementType = 'percentage' | 'ratio' | 'years' | 'score' | 'boolean' | 'currency';

// Sub-criteria for each petal category
export interface SubCriteria {
	id: string;
	label: string;
	score: number; // 1-8 scale (same as petal scores)
	weight: number; // relative weight within the petal (should sum to 1.0)
	description?: string;
	measurementType?: MeasurementType;
	rawValue?: number | boolean | string; // actual measured value
	benchmark?: { low: number; mid: number; high: number }; // scoring thresholds
}

// Extended sub-criteria definition with measurement details
export interface SubCriteriaDefinition {
	id: string;
	label: string;
	weight: number;
	description: string;
	measurementType: MeasurementType;
	howToMeasure: string;
	benchmark: { low: number; mid: number; high: number };
	invertScale?: boolean; // true if lower raw value = higher score (e.g., expense ratio)
}

// Petal with sub-criteria breakdown
export interface PetalScoring {
	category: PetalCategory;
	label: string;
	subCriteria: SubCriteria[];
	notes: string;
	trend: 'up' | 'down' | 'stable';
	confidence: number; // 0-1 scale
}

// Weighting profile types
export type WeightingProfileType =
	| 'equal'
	| 'income-focus'
	| 'growth-focus'
	| 'value-add'
	| 'conservative'
	| 'custom';

export interface WeightingProfile {
	id: WeightingProfileType;
	name: string;
	description: string;
	weights: Record<PetalCategory, number>; // weights should sum to 1.0
}

// Property with full scoring data
export interface ScoredProperty {
	id: string;
	name: string;
	address: string;
	city: string;
	country: string;
	lng: number;
	lat: number;
	petals: PetalScoring[];
	weightingProfile: WeightingProfileType;
	customWeights?: Record<PetalCategory, number>;
	createdAt: Date;
	updatedAt: Date;
	history: ScoreHistoryEntry[];
}

// Historical score entry
export interface ScoreHistoryEntry {
	date: Date;
	bloomScore: number;
	petalScores: Record<PetalCategory, number>;
}

// Bloom status thresholds (out of 100)
export type BloomStatusLabel = 'FULLY BLOOMED' | 'BLOOMING' | 'BUDDING' | 'SPROUTING' | 'WILTING';

export interface BloomStatusThreshold {
	label: BloomStatusLabel;
	color: string;
	minScore: number;
	icon: string;
}

export const BLOOM_STATUS_THRESHOLDS: BloomStatusThreshold[] = [
	{ label: 'FULLY BLOOMED', color: '#B8860B', minScore: 90, icon: '🌸' },
	{ label: 'BLOOMING', color: '#CFA874', minScore: 75, icon: '🌷' },
	{ label: 'BUDDING', color: '#E8DCC4', minScore: 60, icon: '🌱' },
	{ label: 'SPROUTING', color: '#86efac', minScore: 40, icon: '🌿' },
	{ label: 'WILTING', color: '#22c55e', minScore: 0, icon: '🥀' }
];

export function getBloomStatusInfo(score: number): BloomStatusThreshold {
	for (const status of BLOOM_STATUS_THRESHOLDS) {
		if (score >= status.minScore) {
			return status;
		}
	}
	return BLOOM_STATUS_THRESHOLDS[BLOOM_STATUS_THRESHOLDS.length - 1];
}

// Default weighting profiles
export const WEIGHTING_PROFILES: WeightingProfile[] = [
	{
		id: 'equal',
		name: 'Equal Weight',
		description: 'All petals weighted equally at 12.5% each',
		weights: {
			cashflow: 0.125,
			appreciation: 0.125,
			financing: 0.125,
			location: 0.125,
			condition: 0.125,
			tenancy: 0.125,
			liquidity: 0.125,
			compliance: 0.125
		}
	},
	{
		id: 'income-focus',
		name: 'Income Focus',
		description: 'Prioritizes cash flow and tenancy for passive income',
		weights: {
			cashflow: 0.25,
			appreciation: 0.08,
			financing: 0.12,
			location: 0.1,
			condition: 0.1,
			tenancy: 0.2,
			liquidity: 0.08,
			compliance: 0.07
		}
	},
	{
		id: 'growth-focus',
		name: 'Growth Focus',
		description: 'Emphasizes appreciation and location for long-term gains',
		weights: {
			cashflow: 0.08,
			appreciation: 0.25,
			financing: 0.1,
			location: 0.22,
			condition: 0.1,
			tenancy: 0.08,
			liquidity: 0.1,
			compliance: 0.07
		}
	},
	{
		id: 'value-add',
		name: 'Value-Add',
		description: 'Focuses on condition and location for renovation opportunities',
		weights: {
			cashflow: 0.1,
			appreciation: 0.15,
			financing: 0.12,
			location: 0.18,
			condition: 0.2,
			tenancy: 0.08,
			liquidity: 0.1,
			compliance: 0.07
		}
	},
	{
		id: 'conservative',
		name: 'Conservative',
		description: 'Balanced approach with emphasis on stability and compliance',
		weights: {
			cashflow: 0.15,
			appreciation: 0.1,
			financing: 0.12,
			location: 0.15,
			condition: 0.12,
			tenancy: 0.12,
			liquidity: 0.12,
			compliance: 0.12
		}
	},
	{
		id: 'custom',
		name: 'Custom',
		description: 'Create your own weighting profile',
		weights: {
			cashflow: 0.125,
			appreciation: 0.125,
			financing: 0.125,
			location: 0.125,
			condition: 0.125,
			tenancy: 0.125,
			liquidity: 0.125,
			compliance: 0.125
		}
	}
];

// ============================================================================
// GUARDIAN-GRADE SUB-CRITERIA DEFINITIONS
// 8-Petal Sub-Criteria Bible for deed.guru
// Each petal has 5-7 specific, measurable sub-criteria
// ============================================================================

// Sub-criteria definitions for each petal (Guardian-grade)
export const PETAL_SUB_CRITERIA: Record<PetalCategory, SubCriteriaDefinition[]> = {
	// ═══════════════════════════════════════════════════════════════════════════
	// RETURNS DIMENSION
	// ═══════════════════════════════════════════════════════════════════════════

	// 1. CASHFLOW 🌸
	cashflow: [
		{
			id: 'noi-yield',
			label: 'NOI Yield (Unlevered)',
			weight: 0.30,
			description: 'Net Operating Income divided by Property Value or Cost',
			measurementType: 'percentage',
			howToMeasure: 'NOI ÷ Property Value or Cost',
			benchmark: { low: 4, mid: 6, high: 9 }
		},
		{
			id: 'cash-on-cash',
			label: 'Cash-on-Cash Return (Levered)',
			weight: 0.25,
			description: 'Annual cashflow after debt service divided by total equity invested',
			measurementType: 'percentage',
			howToMeasure: 'Annual Cashflow after Debt ÷ Total Equity',
			benchmark: { low: 3, mid: 6, high: 9 }
		},
		{
			id: 'occupancy-rate',
			label: 'Occupancy Rate',
			weight: 0.15,
			description: 'Trailing 12-month physical and economic occupancy',
			measurementType: 'percentage',
			howToMeasure: 'Economic occupancy (collected rent ÷ potential rent)',
			benchmark: { low: 80, mid: 90, high: 95 }
		},
		{
			id: 'expense-ratio',
			label: 'Operating Expense Ratio',
			weight: 0.10,
			description: 'Operating expenses as percentage of effective gross income (lower is better)',
			measurementType: 'percentage',
			howToMeasure: 'OpEx ÷ Effective Gross Income',
			benchmark: { low: 55, mid: 45, high: 35 },
			invertScale: true
		},
		{
			id: 'rent-collection',
			label: 'Rent Collection Rate',
			weight: 0.10,
			description: 'Percentage of billed rent actually collected over last 12 months',
			measurementType: 'percentage',
			howToMeasure: 'Collected ÷ Billed (last 12m)',
			benchmark: { low: 90, mid: 95, high: 98 }
		},
		{
			id: 'break-even-ratio',
			label: 'Break-even Ratio',
			weight: 0.10,
			description: 'Operating expenses plus debt service as percentage of EGI (lower is better)',
			measurementType: 'percentage',
			howToMeasure: '(OpEx + Debt Service) ÷ EGI',
			benchmark: { low: 90, mid: 80, high: 70 },
			invertScale: true
		}
	],

	// 2. APPRECIATION 🌸
	appreciation: [
		{
			id: 'market-price-growth',
			label: 'Market Price Growth',
			weight: 0.25,
			description: '3-5 year historical CAGR of $/sqft or $/unit in submarket',
			measurementType: 'percentage',
			howToMeasure: 'Local MLS / CoStar data - historical CAGR',
			benchmark: { low: 2, mid: 5, high: 8 }
		},
		{
			id: 'supply-pipeline',
			label: 'Supply Pipeline vs Demand',
			weight: 0.20,
			description: 'New units under construction relative to annual absorption',
			measurementType: 'ratio',
			howToMeasure: 'New units under construction ÷ annual absorption (last 3 yrs)',
			benchmark: { low: 1.5, mid: 1.0, high: 0.5 },
			invertScale: true
		},
		{
			id: 'population-job-growth',
			label: 'Population & Job Growth',
			weight: 0.20,
			description: 'MSA or submarket population and employment forecasts',
			measurementType: 'percentage',
			howToMeasure: 'Projected annual growth rate (next 5 yrs)',
			benchmark: { low: 1, mid: 2, high: 4 }
		},
		{
			id: 'forced-appreciation',
			label: 'Forced Appreciation Upside',
			weight: 0.20,
			description: 'Remaining value-add potential relative to current value gap',
			measurementType: 'percentage',
			howToMeasure: 'Remaining value-add budget ÷ current value gap',
			benchmark: { low: 5, mid: 15, high: 30 }
		},
		{
			id: 'rent-growth-trend',
			label: 'Rent Growth Trend',
			weight: 0.15,
			description: 'Actual market rent CAGR over last 3-5 years',
			measurementType: 'percentage',
			howToMeasure: 'Market rent CAGR last 3-5 yrs',
			benchmark: { low: 2, mid: 4, high: 7 }
		}
	],

	// 3. FINANCING 🌸
	financing: [
		{
			id: 'dscr',
			label: 'Debt Service Coverage Ratio',
			weight: 0.25,
			description: 'NOI divided by annual debt service',
			measurementType: 'ratio',
			howToMeasure: 'NOI ÷ Annual Debt Service',
			benchmark: { low: 1.15, mid: 1.35, high: 1.8 }
		},
		{
			id: 'ltv',
			label: 'Loan-to-Value (LTV)',
			weight: 0.25,
			description: 'Current loan balance relative to realistic current value (lower is better)',
			measurementType: 'percentage',
			howToMeasure: 'Current loan balance ÷ current realistic value',
			benchmark: { low: 80, mid: 65, high: 55 },
			invertScale: true
		},
		{
			id: 'interest-rate-spread',
			label: 'Interest Rate vs Market',
			weight: 0.20,
			description: 'Current rate compared to prevailing commercial rates',
			measurementType: 'percentage',
			howToMeasure: 'Current rate vs prevailing 5/7/10-yr commercial rates',
			benchmark: { low: 1.0, mid: 0, high: -0.5 },
			invertScale: true
		},
		{
			id: 'prepayment-flexibility',
			label: 'Prepayment & Assumability',
			weight: 0.15,
			description: 'Prepayment penalties and loan assumability terms',
			measurementType: 'score',
			howToMeasure: 'No or low prepay + assumable = high score',
			benchmark: { low: 3, mid: 5, high: 8 }
		},
		{
			id: 'maturity-profile',
			label: 'Maturity & Extension Options',
			weight: 0.15,
			description: 'Years to maturity plus available extensions',
			measurementType: 'years',
			howToMeasure: 'Years to maturity + extensions available',
			benchmark: { low: 2, mid: 5, high: 10 }
		}
	],

	// ═══════════════════════════════════════════════════════════════════════════
	// ASSET DIMENSION
	// ═══════════════════════════════════════════════════════════════════════════

	// 4. LOCATION 🌸
	location: [
		{
			id: 'walk-transit-score',
			label: 'Walk Score / Transit Score',
			weight: 0.20,
			description: 'Walkability and public transit accessibility',
			measurementType: 'score',
			howToMeasure: 'Walkscore.com or equivalent (0-100)',
			benchmark: { low: 40, mid: 70, high: 90 }
		},
		{
			id: 'economic-drivers',
			label: 'Economic Drivers Proximity',
			weight: 0.20,
			description: 'Distance to major employers, universities, hospitals',
			measurementType: 'score',
			howToMeasure: 'Proximity score to major economic anchors',
			benchmark: { low: 3, mid: 6, high: 9 }
		},
		{
			id: 'school-quality',
			label: 'School Quality',
			weight: 0.15,
			description: 'Quality of nearby schools (residential properties)',
			measurementType: 'score',
			howToMeasure: 'GreatSchools rating or state percentile',
			benchmark: { low: 4, mid: 7, high: 9 }
		},
		{
			id: 'crime-index',
			label: 'Crime Index',
			weight: 0.15,
			description: 'Crime rate relative to national/MSA average (lower is better)',
			measurementType: 'score',
			howToMeasure: 'Crime index vs national/MSA average',
			benchmark: { low: 150, mid: 100, high: 50 },
			invertScale: true
		},
		{
			id: 'submarket-performance',
			label: 'Submarket vs MSA Performance',
			weight: 0.15,
			description: 'Vacancy and rent trends relative to broader market',
			measurementType: 'score',
			howToMeasure: 'Submarket vacancy & rent trend vs MSA',
			benchmark: { low: 3, mid: 6, high: 9 }
		},
		{
			id: 'zoning-upside',
			label: 'Zoning / Entitlement Upside',
			weight: 0.15,
			description: 'Ability to add units, change use, or redevelop',
			measurementType: 'score',
			howToMeasure: 'Potential for rezoning, additional units, or use change',
			benchmark: { low: 2, mid: 5, high: 8 }
		}
	],

	// 5. CONDITION 🌸
	condition: [
		{
			id: 'effective-age',
			label: 'Effective Age / Remaining Life',
			weight: 0.25,
			description: 'Adjusted age considering renovations vs typical lifespan',
			measurementType: 'years',
			howToMeasure: '(Chronological age – renovations) vs typical lifespan',
			benchmark: { low: 30, mid: 15, high: 5 },
			invertScale: true
		},
		{
			id: 'building-class',
			label: 'Building Class',
			weight: 0.20,
			description: 'True A/B/C classification (not sponsor marketing)',
			measurementType: 'score',
			howToMeasure: 'Objective building class assessment',
			benchmark: { low: 3, mid: 6, high: 9 }
		},
		{
			id: 'recent-capex',
			label: 'Recent CapEx History',
			weight: 0.20,
			description: 'Capital expenditures per unit/sqft over last 3-5 years',
			measurementType: 'currency',
			howToMeasure: '$ spent per unit/sqft last 3-5 yrs',
			benchmark: { low: 1000, mid: 5000, high: 15000 }
		},
		{
			id: 'deferred-maintenance',
			label: 'Deferred Maintenance',
			weight: 0.20,
			description: 'Third-party PCA estimate relative to current value (lower is better)',
			measurementType: 'percentage',
			howToMeasure: 'Third-party PCA $ ÷ current value',
			benchmark: { low: 15, mid: 8, high: 2 },
			invertScale: true
		},
		{
			id: 'systems-condition',
			label: 'Major Systems Condition',
			weight: 0.15,
			description: 'Remaining useful life of HVAC, roof, elevators, plumbing',
			measurementType: 'years',
			howToMeasure: 'Years remaining on major systems (weighted avg)',
			benchmark: { low: 5, mid: 12, high: 20 }
		}
	],

	// 6. TENANCY 🌸
	tenancy: [
		{
			id: 'tenant-credit',
			label: 'Tenant Credit Quality',
			weight: 0.30,
			description: 'Percentage of rent from investment-grade or strong regional tenants',
			measurementType: 'percentage',
			howToMeasure: '% of rent from investment-grade or strong regional tenants',
			benchmark: { low: 20, mid: 50, high: 90 }
		},
		{
			id: 'walt',
			label: 'Weighted Avg Lease Term (WALT)',
			weight: 0.25,
			description: 'Weighted average remaining lease term in years',
			measurementType: 'years',
			howToMeasure: 'WALT in years',
			benchmark: { low: 2, mid: 4, high: 7 }
		},
		{
			id: 'rollover-risk',
			label: 'Lease Rollover Risk (36m)',
			weight: 0.20,
			description: 'Percentage of rent rolling over in next 36 months (lower is better)',
			measurementType: 'percentage',
			howToMeasure: '% of rent rolling in next 36 months',
			benchmark: { low: 50, mid: 30, high: 10 },
			invertScale: true
		},
		{
			id: 'rent-vs-market',
			label: 'In-Place Rent vs Market',
			weight: 0.15,
			description: 'Current rents relative to market rates',
			measurementType: 'percentage',
			howToMeasure: 'In-place rent ÷ current market rent',
			benchmark: { low: 85, mid: 95, high: 105 }
		},
		{
			id: 'tenant-diversity',
			label: 'Tenant Diversity',
			weight: 0.10,
			description: 'Concentration risk - percentage from top tenant (lower is better)',
			measurementType: 'percentage',
			howToMeasure: 'Herfindahl index or % from top tenant',
			benchmark: { low: 50, mid: 30, high: 15 },
			invertScale: true
		}
	],

	// ═══════════════════════════════════════════════════════════════════════════
	// RISK DIMENSION
	// ═══════════════════════════════════════════════════════════════════════════

	// 7. LIQUIDITY 🌸
	liquidity: [
		{
			id: 'asset-class-liquidity',
			label: 'Asset Class Liquidity',
			weight: 0.30,
			description: 'Inherent liquidity of asset type (MF/Industrial highest, Hotels/Land lowest)',
			measurementType: 'score',
			howToMeasure: 'Multifamily & industrial = highest; hotels & land = lowest',
			benchmark: { low: 3, mid: 6, high: 9 }
		},
		{
			id: 'transaction-velocity',
			label: 'Transaction Velocity',
			weight: 0.25,
			description: 'Days on market and sales volume in submarket',
			measurementType: 'score',
			howToMeasure: 'Days on market & sales volume last 24m',
			benchmark: { low: 3, mid: 6, high: 9 }
		},
		{
			id: 'buyer-pool-depth',
			label: 'Buyer Pool Depth',
			weight: 0.20,
			description: 'Breadth of potential buyers (local, national, institutional)',
			measurementType: 'score',
			howToMeasure: 'Local + national + institutional interest level',
			benchmark: { low: 3, mid: 6, high: 9 }
		},
		{
			id: 'tokenized-secondary',
			label: 'Tokenized Secondary Market',
			weight: 0.15,
			description: 'Historical trading volume on deed.guru for similar assets',
			measurementType: 'score',
			howToMeasure: 'deed.guru historical trading volume for similar assets',
			benchmark: { low: 2, mid: 5, high: 8 }
		},
		{
			id: 'hold-period-flexibility',
			label: 'Hold Period Flexibility',
			weight: 0.10,
			description: 'Absence of forced sale triggers (loan maturity, franchise expiration)',
			measurementType: 'score',
			howToMeasure: 'No major loan maturity or franchise expiration forcing sale',
			benchmark: { low: 3, mid: 6, high: 9 }
		}
	],

	// 8. COMPLIANCE 🌸
	compliance: [
		{
			id: 'title-survey',
			label: 'Title & Survey',
			weight: 0.25,
			description: 'Clean title report with no material exceptions',
			measurementType: 'boolean',
			howToMeasure: 'Clean title report, no exceptions',
			benchmark: { low: 0, mid: 0.5, high: 1 }
		},
		{
			id: 'environmental',
			label: 'Environmental (Phase I ESA)',
			weight: 0.25,
			description: 'No Recognized Environmental Conditions',
			measurementType: 'boolean',
			howToMeasure: 'Phase I ESA - no RECs',
			benchmark: { low: 0, mid: 0.5, high: 1 }
		},
		{
			id: 'zoning-permits',
			label: 'Zoning & Permits',
			weight: 0.20,
			description: 'Current use fully conforming to zoning and permits',
			measurementType: 'boolean',
			howToMeasure: 'Current use fully conforming',
			benchmark: { low: 0, mid: 0.5, high: 1 }
		},
		{
			id: 'insurance-coverage',
			label: 'Insurance Coverage',
			weight: 0.15,
			description: 'Full replacement cost coverage without major exclusions',
			measurementType: 'boolean',
			howToMeasure: 'Full replacement cost, no major exclusions',
			benchmark: { low: 0, mid: 0.5, high: 1 }
		},
		{
			id: 'guardian-verification',
			label: 'Guardian Verification',
			weight: 0.15,
			description: 'Full Guardian audit completed and clean',
			measurementType: 'score',
			howToMeasure: 'Guardian verification status (0-10)',
			benchmark: { low: 3, mid: 6, high: 9 }
		}
	]
};

// Legacy alias for backward compatibility
export const PETAL_SUB_CRITERIA_LEGACY: Record<PetalCategory, Omit<SubCriteria, 'score'>[]> = {
	cashflow: PETAL_SUB_CRITERIA.cashflow.map((c) => ({
		id: c.id,
		label: c.label,
		weight: c.weight,
		description: c.description
	})),
	appreciation: PETAL_SUB_CRITERIA.appreciation.map((c) => ({
		id: c.id,
		label: c.label,
		weight: c.weight,
		description: c.description
	})),
	financing: PETAL_SUB_CRITERIA.financing.map((c) => ({
		id: c.id,
		label: c.label,
		weight: c.weight,
		description: c.description
	})),
	location: PETAL_SUB_CRITERIA.location.map((c) => ({
		id: c.id,
		label: c.label,
		weight: c.weight,
		description: c.description
	})),
	condition: PETAL_SUB_CRITERIA.condition.map((c) => ({
		id: c.id,
		label: c.label,
		weight: c.weight,
		description: c.description
	})),
	tenancy: PETAL_SUB_CRITERIA.tenancy.map((c) => ({
		id: c.id,
		label: c.label,
		weight: c.weight,
		description: c.description
	})),
	liquidity: PETAL_SUB_CRITERIA.liquidity.map((c) => ({
		id: c.id,
		label: c.label,
		weight: c.weight,
		description: c.description
	})),
	compliance: PETAL_SUB_CRITERIA.compliance.map((c) => ({
		id: c.id,
		label: c.label,
		weight: c.weight,
		description: c.description
	}))
};

// ============================================================================
// SCORING CALCULATION FUNCTIONS
// All scores use 1-8 scale throughout (no internal conversion needed)
// ============================================================================

/**
 * Calculate score (1-8) from raw value using benchmarks
 * Handles both normal and inverted scales
 *
 * Scoring rubric:
 * - Score 1-2: Poor/Critical (below low benchmark)
 * - Score 3-4: Below Average/Fair (between low and mid)
 * - Score 5-6: Average/Good (around mid benchmark)
 * - Score 7-8: Very Good/Excellent (at or above high benchmark)
 */
export function calculateScoreFromRaw(
	rawValue: number,
	benchmark: { low: number; mid: number; high: number },
	invertScale: boolean = false
): number {
	if (invertScale) {
		// For inverted scales (lower raw value = higher score)
		// e.g., expense ratio: 55% = low score (1-2), 35% = high score (7-8)
		if (rawValue >= benchmark.low) return 1; // Worst
		if (rawValue <= benchmark.high) return 8; // Best
		if (rawValue <= benchmark.mid) {
			// Between mid and high (good range: 5-8)
			const range = benchmark.mid - benchmark.high;
			const position = benchmark.mid - rawValue;
			return 5 + (position / range) * 3;
		} else {
			// Between low and mid (poor range: 1-5)
			const range = benchmark.low - benchmark.mid;
			const position = benchmark.low - rawValue;
			return 1 + (position / range) * 4;
		}
	} else {
		// Normal scale (higher raw value = higher score)
		if (rawValue <= benchmark.low) return 1; // Worst
		if (rawValue >= benchmark.high) return 8; // Best
		if (rawValue >= benchmark.mid) {
			// Between mid and high (good range: 5-8)
			const range = benchmark.high - benchmark.mid;
			const position = rawValue - benchmark.mid;
			return 5 + (position / range) * 3;
		} else {
			// Between low and mid (poor range: 1-5)
			const range = benchmark.mid - benchmark.low;
			const position = rawValue - benchmark.low;
			return 1 + (position / range) * 4;
		}
	}
}

// Legacy alias for backward compatibility
export const calculateInternalScore = calculateScoreFromRaw;

/**
 * Clamp and round score to 1-8 range
 */
export function normalizeScore(score: number): number {
	const clamped = Math.max(1, Math.min(8, score));
	return Math.round(clamped * 10) / 10; // Round to 1 decimal
}

// Legacy alias - now just normalizes since we use 1-8 directly
export function internalToDisplayScore(score: number): number {
	return normalizeScore(score);
}

/**
 * Calculate a petal's final score (1-8) from sub-criteria raw values
 */
export function calculatePetalScore(
	subCriteriaValues: Record<string, number | boolean>,
	category: PetalCategory
): { score: number; subScores: SubCriteria[] } {
	const definitions = PETAL_SUB_CRITERIA[category];
	const subScores: SubCriteria[] = [];
	let weightedSum = 0;

	for (const def of definitions) {
		const rawValue = subCriteriaValues[def.id];
		let score = 5; // Default mid-score (1-8 scale) if no value

		if (rawValue !== undefined) {
			if (def.measurementType === 'boolean') {
				// Boolean: true = 8 (excellent), false = 1 (critical)
				score = rawValue ? 8 : 1;
			} else if (typeof rawValue === 'number') {
				score = calculateScoreFromRaw(rawValue, def.benchmark, def.invertScale);
			}
		}

		// Ensure score is within 1-8 range
		score = normalizeScore(score);

		subScores.push({
			id: def.id,
			label: def.label,
			score,
			weight: def.weight,
			description: def.description,
			measurementType: def.measurementType,
			rawValue: rawValue as number | boolean | string,
			benchmark: def.benchmark
		});

		weightedSum += score * def.weight;
	}

	// Final petal score is weighted average, clamped to 1-8
	const finalScore = normalizeScore(weightedSum);

	return {
		score: finalScore,
		subScores
	};
}

/**
 * Create a full PetalScoring from raw sub-criteria values
 */
export function createPetalScoringFromRaw(
	category: PetalCategory,
	subCriteriaValues: Record<string, number | boolean>,
	options?: {
		notes?: string;
		trend?: 'up' | 'down' | 'stable';
		confidence?: number;
	}
): PetalScoring {
	const { subScores } = calculatePetalScore(subCriteriaValues, category);
	const { notes = '', trend = 'stable', confidence = 0.85 } = options ?? {};

	return {
		category,
		label: PETAL_LABELS[category],
		subCriteria: subScores,
		notes,
		trend,
		confidence
	};
}

/**
 * Score interpretation helpers
 */
export const SCORE_INTERPRETATIONS = {
	1: { label: 'Critical', color: '#dc2626', description: 'Severe issues requiring immediate attention' },
	2: { label: 'Poor', color: '#ea580c', description: 'Significant concerns that need addressing' },
	3: { label: 'Below Average', color: '#f59e0b', description: 'Notable weaknesses present' },
	4: { label: 'Fair', color: '#eab308', description: 'Acceptable but room for improvement' },
	5: { label: 'Average', color: '#84cc16', description: 'Meets basic expectations' },
	6: { label: 'Good', color: '#22c55e', description: 'Above average performance' },
	7: { label: 'Very Good', color: '#10b981', description: 'Strong performance in this area' },
	8: { label: 'Excellent', color: '#059669', description: 'Exceptional - top tier' }
} as const;

export function getScoreInterpretation(score: number): (typeof SCORE_INTERPRETATIONS)[keyof typeof SCORE_INTERPRETATIONS] {
	const roundedScore = Math.max(1, Math.min(8, Math.round(score))) as keyof typeof SCORE_INTERPRETATIONS;
	return SCORE_INTERPRETATIONS[roundedScore];
}

/**
 * Dimension summary - aggregate scores by dimension
 */
export function calculateDimensionScores(petals: PetalScoring[]): Record<PetalDimension, number> {
	const dimensions: Record<PetalDimension, { sum: number; count: number }> = {
		returns: { sum: 0, count: 0 },
		asset: { sum: 0, count: 0 },
		risk: { sum: 0, count: 0 }
	};

	for (const petal of petals) {
		const dimension = PETAL_DIMENSIONS[petal.category];
		const petalScore = petal.subCriteria.reduce((sum, c) => sum + c.score * c.weight, 0);
		dimensions[dimension].sum += petalScore;
		dimensions[dimension].count += 1;
	}

	return {
		returns: dimensions.returns.count > 0 ? dimensions.returns.sum / dimensions.returns.count : 0,
		asset: dimensions.asset.count > 0 ? dimensions.asset.sum / dimensions.asset.count : 0,
		risk: dimensions.risk.count > 0 ? dimensions.risk.sum / dimensions.risk.count : 0
	};
}

// Auto-generated insights based on scores
export interface AutoInsight {
	type: 'strength' | 'weakness' | 'opportunity' | 'warning';
	category: PetalCategory;
	title: string;
	message: string;
	priority: number; // 1-5, higher = more important
}

export function generateInsights(petals: PetalScoring[]): AutoInsight[] {
	const insights: AutoInsight[] = [];

	for (const petal of petals) {
		const avgScore = petal.subCriteria.reduce((sum, c) => sum + c.score * c.weight, 0);

		// Strength: High scores (7+)
		if (avgScore >= 7) {
			insights.push({
				type: 'strength',
				category: petal.category,
				title: `Strong ${petal.label}`,
				message: `${petal.label} scores ${avgScore.toFixed(1)}/8 - a key strength of this property.`,
				priority: 4
			});
		}

		// Weakness: Low scores (<4)
		if (avgScore < 4) {
			insights.push({
				type: 'weakness',
				category: petal.category,
				title: `Weak ${petal.label}`,
				message: `${petal.label} scores only ${avgScore.toFixed(1)}/8 - consider carefully before investing.`,
				priority: 5
			});
		}

		// Opportunity: Rising trend with mid scores
		if (petal.trend === 'up' && avgScore >= 4 && avgScore < 7) {
			insights.push({
				type: 'opportunity',
				category: petal.category,
				title: `${petal.label} Improving`,
				message: `${petal.label} shows upward trend at ${avgScore.toFixed(1)}/8 - potential for growth.`,
				priority: 3
			});
		}

		// Warning: Declining trend
		if (petal.trend === 'down') {
			insights.push({
				type: 'warning',
				category: petal.category,
				title: `${petal.label} Declining`,
				message: `${petal.label} shows downward trend - monitor closely.`,
				priority: 4
			});
		}

		// Low confidence warning
		if (petal.confidence < 0.7) {
			insights.push({
				type: 'warning',
				category: petal.category,
				title: `Low Confidence: ${petal.label}`,
				message: `Only ${Math.round(petal.confidence * 100)}% confidence in ${petal.label} data - verify before deciding.`,
				priority: 2
			});
		}
	}

	// Sort by priority (highest first)
	return insights.sort((a, b) => b.priority - a.priority);
}

// Calculate weighted bloom score
export function calculateWeightedBloomScore(
	petals: PetalScoring[],
	weights: Record<PetalCategory, number>
): number {
	let weightedSum = 0;
	let totalWeight = 0;

	for (const petal of petals) {
		const petalScore = petal.subCriteria.reduce((sum, c) => sum + c.score * c.weight, 0);
		const weight = weights[petal.category] || 0.125;
		weightedSum += petalScore * weight;
		totalWeight += weight;
	}

	// Normalize to 0-100 scale (each petal is 0-8, so max is 8)
	const normalizedScore = (weightedSum / totalWeight / 8) * 100;
	return Math.round(normalizedScore * 10) / 10;
}

// Convert PetalScoring to PetalDataPoint for chart rendering
export function scoringToPetalData(petals: PetalScoring[]): PetalDataPoint[] {
	return petals.map((petal) => {
		const avgScore = petal.subCriteria.reduce((sum, c) => sum + c.score * c.weight, 0);
		return {
			id: petal.category,
			label: petal.label,
			score: avgScore,
			confidence: petal.confidence,
			completeness: petal.subCriteria.filter((c) => c.score > 0).length / petal.subCriteria.length,
			trend: petal.trend,
			category: petal.category,
			description: petal.notes
		};
	});
}

// Get weighting profile by ID
export function getWeightingProfile(id: WeightingProfileType): WeightingProfile {
	return WEIGHTING_PROFILES.find((p) => p.id === id) ?? WEIGHTING_PROFILES[0];
}
