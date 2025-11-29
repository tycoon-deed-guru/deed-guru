// Petal Chart Components - Core
export { default as PetalChart } from './PetalChart.svelte';
export { default as BloomStatus } from './BloomStatus.svelte';
export { default as PetalScoreCard } from './PetalScoreCard.svelte';
export { default as SubCriteriaPanel } from './SubCriteriaPanel.svelte';
export { default as PetalDetailModal } from './PetalDetailModal.svelte';
export { default as PropertyScoringDetails } from './PropertyScoringDetails.svelte';

// Petal Chart Components - DESIGN.md Ecosystem
export { default as WeightingProfileSelector } from './WeightingProfileSelector.svelte';
export { default as PetalScoringInput } from './PetalScoringInput.svelte';
export { default as BloomScoreCard } from './BloomScoreCard.svelte';
export { default as AutoInsights } from './AutoInsights.svelte';
export { default as HistoryChart } from './HistoryChart.svelte';
export { default as PetalLegend } from './PetalLegend.svelte';

// Re-export types for convenience
export type {
	PetalDataPoint,
	PetalCategory,
	BloomStatus as BloomStatusType,
	BloomStatusInfo,
	PetalChartConfig
} from '$lib/types/petal-chart.types';

// Re-export HistoryChart type
export type { ScoreHistoryEntry } from './HistoryChart.svelte';

export {
	PETAL_ORDER,
	PETAL_LABELS,
	PETAL_DESCRIPTIONS,
	getBloomStatus,
	convertAxisToPetalScores,
	createPetalDataPoints
} from '$lib/types/petal-chart.types';

// Re-export scoring types
export type {
	SubCriteria,
	SubCriteriaDefinition,
	PetalScoring,
	PetalDimension,
	MeasurementType,
	WeightingProfile,
	WeightingProfileType,
	AutoInsight
} from '$lib/types/scoring.types';

export {
	WEIGHTING_PROFILES,
	PETAL_SUB_CRITERIA,
	PETAL_DIMENSIONS,
	SCORE_INTERPRETATIONS,
	generateInsights,
	calculateWeightedBloomScore,
	calculatePetalScore,
	calculateScoreFromRaw,
	calculateInternalScore, // legacy alias
	normalizeScore,
	internalToDisplayScore, // legacy alias
	createPetalScoringFromRaw,
	calculateDimensionScores,
	getScoreInterpretation,
	scoringToPetalData,
	getWeightingProfile
} from '$lib/types/scoring.types';

// Re-export utility functions
export {
	calculateOverallScore,
	calculateBloomScore,
	calculateBloomPercentage,
	formatScore,
	getScoreColor,
	getPetalColor,
	hasGoldenGlow,
	convertScore10to8,
	convertScore8to10,
	convertTotalScore100to64,
	convertTotalScore64to100,
	getGradeFromBloomScore,
	createDefaultPetalData,
	validatePetalData,
	getCategoryIcon,
	sortPetalsByScore,
	getTopPetals,
	getBottomPetals
} from '$lib/utils/petal-chart.utils';
