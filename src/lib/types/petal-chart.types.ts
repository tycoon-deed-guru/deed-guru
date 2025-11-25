// Canonical deed.guru petal categories in clockwise order from 12 o'clock
// Following DESIGN.md: Location at top (12:00), Cashflow at bottom (6:00)
export type PetalCategory =
	| 'location'
	| 'tenancy'
	| 'compliance'
	| 'cashflow'
	| 'appreciation'
	| 'financing'
	| 'liquidity'
	| 'condition';

// Fixed order for the 8 petals - clockwise from 12 o'clock per DESIGN.md
// With 8 petals at 45° intervals: 12:00, 1:30, 3:00, 4:30, 6:00, 7:30, 9:00, 10:30
// Zone Strategy:
// - Quality Crown (top): Location, Condition, Tenancy - Fundamentals that drive value
// - Risk Balance (sides): Liquidity, Compliance - Exit risk counterweights
// - Returns (bottom): Cashflow, Appreciation, Financing - The "bottom line"
export const PETAL_ORDER: PetalCategory[] = [
	'location',    // 12:00 (index 0) - Quality Crown (top)
	'tenancy',     // 1:30  (index 1) - Quality Crown
	'compliance',  // 3:00  (index 2) - Risk Balance (right)
	'financing',   // 4:30  (index 3) - Returns
	'cashflow',    // 6:00  (index 4) - Returns (bottom) ← Cashflow at bottom!
	'appreciation',// 7:30  (index 5) - Returns
	'liquidity',   // 9:00  (index 6) - Risk Balance (left)
	'condition'    // 10:30 (index 7) - Quality Crown
];

// Display labels for each category
export const PETAL_LABELS: Record<PetalCategory, string> = {
	cashflow: 'Cashflow',
	appreciation: 'Appreciation',
	financing: 'Financing',
	location: 'Location',
	condition: 'Condition',
	tenancy: 'Tenancy',
	liquidity: 'Liquidity',
	compliance: 'Compliance'
};

// Descriptions for each category (for tooltips)
export const PETAL_DESCRIPTIONS: Record<PetalCategory, string> = {
	cashflow: 'Cap rate, CoC return, and revenue stability',
	appreciation: 'Market trends, rent growth, and value appreciation',
	financing: 'Loan terms, DSCR, and refinancing options',
	location: 'Walkability, schools, safety, and amenities',
	condition: 'Structure, systems, and deferred maintenance',
	tenancy: 'Occupancy, tenant quality, and lease terms',
	liquidity: 'Days on market, buyer pool, and exit options',
	compliance: 'Permits, zoning, and regulatory requirements'
};

export interface PetalDataPoint {
	id: string;
	label: string;
	score: number; // 0-8 scale, affects petal length (max 64 total)
	confidence: number; // 0-1 scale (shown as %), affects opacity
	completeness: number; // 0-1 scale, Guardian verification status
	trend: 'up' | 'down' | 'stable'; // affects glow effect
	color?: string;
	description?: string;
	category?: PetalCategory; // canonical category for color mapping
	dataCompleteness?: number; // legacy alias for completeness (as percentage)
}

// Bloom status based on total score (out of 64)
export type BloomStatus = 'fully-bloomed' | 'near-bloom' | 'blooming' | 'late-bloom' | 'budding';

export interface BloomStatusInfo {
	status: BloomStatus;
	label: string;
	emoji: string;
	color: string;
}

export function getBloomStatus(totalScore: number): BloomStatusInfo {
	if (totalScore >= 64) return { status: 'fully-bloomed', label: 'Fully Bloomed', emoji: '🌸', color: '#15803d' };
	if (totalScore >= 60) return { status: 'near-bloom', label: 'Near Bloom', emoji: '🌷', color: '#22c55e' };
	if (totalScore >= 50) return { status: 'blooming', label: 'Blooming', emoji: '🌻', color: '#CFA874' };
	if (totalScore >= 40) return { status: 'late-bloom', label: 'Late Bloom', emoji: '🌱', color: '#f59e0b' };
	return { status: 'budding', label: 'Budding', emoji: '🌿', color: '#f97316' };
}

export interface PetalChartConfig {
	size: number;
	minCenterRadius: number; // minimum center circle size
	maxCenterRadius: number; // maximum center circle size
	centerValue?: number; // 0-10 scale, controls center size (defaults to aggregate score)
	maxPetalLength: number;
	showLabels: boolean;
	showValues: boolean;
	showCenterValue: boolean; // show aggregate score in center
	interactive: boolean;
	enableGlow: boolean;
}

export type ScoreRating = {
	label: string;
	color: string;
};

// deed.guru 10X score axes (original system)
export const DEED_GURU_AXES = [
	'Market',
	'Rent Growth',
	'CoC',
	'IRR',
	'Value-Add',
	'Scale',
	'DSCR',
	'Location',
	'Exit Cap',
	'Resilience'
] as const;

export type DeedGuruAxis = (typeof DEED_GURU_AXES)[number];

// Mapping from 10-axis to 8-petal system
export const AXIS_TO_PETAL_MAP: Record<DeedGuruAxis, PetalCategory> = {
	'Market': 'location',
	'Rent Growth': 'appreciation',
	'CoC': 'cashflow',
	'IRR': 'cashflow',
	'Value-Add': 'condition',
	'Scale': 'tenancy',
	'DSCR': 'financing',
	'Location': 'location',
	'Exit Cap': 'appreciation',
	'Resilience': 'compliance'
};

// Convert 10-axis scores to 8-petal scores
export function convertAxisToPetalScores(axisScores: number[]): Record<PetalCategory, number> {
	const petalScores: Record<PetalCategory, { sum: number; count: number }> = {
		cashflow: { sum: 0, count: 0 },
		appreciation: { sum: 0, count: 0 },
		financing: { sum: 0, count: 0 },
		location: { sum: 0, count: 0 },
		condition: { sum: 0, count: 0 },
		tenancy: { sum: 0, count: 0 },
		liquidity: { sum: 0, count: 0 },
		compliance: { sum: 0, count: 0 }
	};

	// Map each axis score to its petal category
	DEED_GURU_AXES.forEach((axis, index) => {
		const score = axisScores[index] ?? 0;
		const category = AXIS_TO_PETAL_MAP[axis];
		petalScores[category].sum += score;
		petalScores[category].count += 1;
	});

	// Calculate averages and convert from 0-10 scale to 0-8 scale
	const result: Record<PetalCategory, number> = {} as Record<PetalCategory, number>;
	for (const category of PETAL_ORDER) {
		const { sum, count } = petalScores[category];
		const avgScore10 = count > 0 ? sum / count : 0;
		// Convert 0-10 scale to 0-8 scale
		result[category] = Math.round((avgScore10 / 10) * 8 * 10) / 10;
	}

	// Add default score for liquidity (not in original 10-axis)
	if (result.liquidity === 0) {
		result.liquidity = 5; // Default mid-score
	}

	return result;
}

// Create PetalDataPoint array from petal scores
export function createPetalDataPoints(
	scores: Record<PetalCategory, number>,
	options?: {
		confidence?: number;
		completeness?: number;
		trend?: 'up' | 'down' | 'stable';
	}
): PetalDataPoint[] {
	const { confidence = 0.85, completeness = 0.8, trend = 'stable' } = options ?? {};

	return PETAL_ORDER.map((category) => ({
		id: category,
		label: PETAL_LABELS[category],
		score: scores[category] ?? 0,
		confidence,
		completeness,
		trend,
		category,
		description: PETAL_DESCRIPTIONS[category]
	}));
}
