import type { PetalDataPoint, PetalCategory } from '$lib/types/petal-chart.types';
import { PETAL_ORDER, PETAL_LABELS } from '$lib/types/petal-chart.types';

/**
 * Calculate overall score from petal data (weighted by confidence)
 */
export function calculateOverallScore(data: PetalDataPoint[]): number {
	if (!data || data.length === 0) return 0;

	// Weighted average based on confidence
	const totalWeight = data.reduce((sum, d) => sum + d.confidence, 0);
	if (totalWeight === 0) return 0;

	const weightedSum = data.reduce((sum, d) => sum + d.score * d.confidence, 0);
	return weightedSum / totalWeight;
}

/**
 * Calculate total bloom score (sum of all petal scores, max 64)
 */
export function calculateBloomScore(data: PetalDataPoint[]): number {
	if (!data || data.length === 0) return 0;
	return data.reduce((sum, d) => sum + d.score, 0);
}

/**
 * Calculate bloom percentage (0-100)
 */
export function calculateBloomPercentage(data: PetalDataPoint[]): number {
	const bloomScore = calculateBloomScore(data);
	return Math.round((bloomScore / 64) * 100);
}

/**
 * Format score for display
 */
export function formatScore(score: number): string {
	return score.toFixed(1);
}

/**
 * Get score color based on value (0-8 scale)
 * Color gradient: gold (7-8 mature), ivory (5-6 mid), light green (3-4), green (1-2 budding)
 * Natural progression: green (new/budding) -> ivory (developing) -> gold (mature/developed)
 */
export function getScoreColor(score: number): string {
	if (score >= 8) return '#B8860B'; // dark goldenrod - mature
	if (score >= 6) return '#CFA874'; // gold - well developed
	if (score >= 4) return '#E8DCC4'; // warm ivory - developing
	return '#22c55e'; // green - budding/new
}

/**
 * Get trend glow color
 */
export function getTrendGlowColor(trend: 'up' | 'down' | 'stable'): string {
	switch (trend) {
		case 'up':
			return 'rgba(34, 197, 94, 0.5)'; // green glow
		case 'down':
			return 'rgba(239, 68, 68, 0.5)'; // red glow
		case 'stable':
		default:
			return 'rgba(59, 130, 246, 0.3)'; // subtle blue glow
	}
}

/**
 * Helper to interpolate between two hex colors
 */
export function interpolateColor(color1: string, color2: string, t: number): string {
	const r1 = parseInt(color1.slice(1, 3), 16);
	const g1 = parseInt(color1.slice(3, 5), 16);
	const b1 = parseInt(color1.slice(5, 7), 16);
	const r2 = parseInt(color2.slice(1, 3), 16);
	const g2 = parseInt(color2.slice(3, 5), 16);
	const b2 = parseInt(color2.slice(5, 7), 16);
	const r = Math.round(r1 + (r2 - r1) * t);
	const g = Math.round(g1 + (g2 - g1) * t);
	const b = Math.round(b1 + (b2 - b1) * t);
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Get petal color based on score (0-8 scale)
 * Color gradient: gold (7-8 mature), ivory (5-6 mid), light green (3-4), green (1-2 budding)
 * Natural progression: green (new/budding) -> ivory (developing) -> gold (mature/developed)
 */
export function getPetalColor(score: number): string {
	if (score >= 7) {
		// Rich gold gradient (7-8) - mature/fully developed
		const t = (score - 7) / 1;
		return interpolateColor('#CFA874', '#B8860B', t); // Gold to dark goldenrod
	} else if (score >= 5) {
		// Ivory/cream gradient (5-6) - mid development
		const t = (score - 5) / 2;
		return interpolateColor('#F5F5DC', '#E8DCC4', t); // Beige to warm ivory
	} else if (score >= 3) {
		// Light green gradient (3-4) - early development
		const t = (score - 3) / 2;
		return interpolateColor('#86efac', '#bbf7d0', t); // Green-300 to green-200
	} else {
		// Fresh green gradient (1-2) - budding/new
		const t = Math.max(0, score - 1) / 2;
		return interpolateColor('#22c55e', '#4ade80', t); // Green-500 to green-400
	}
}

/**
 * Check if score qualifies for golden glow effect
 */
export function hasGoldenGlow(score: number): boolean {
	return score >= 8;
}

/**
 * Convert 10-scale score to 8-scale
 */
export function convertScore10to8(score10: number): number {
	return Math.round((score10 / 10) * 8 * 10) / 10;
}

/**
 * Convert 8-scale score to 10-scale
 */
export function convertScore8to10(score8: number): number {
	return Math.round((score8 / 8) * 10 * 10) / 10;
}

/**
 * Convert total score from 100-scale to 64-scale
 */
export function convertTotalScore100to64(score100: number): number {
	return Math.round((score100 / 100) * 64);
}

/**
 * Convert total score from 64-scale to 100-scale
 */
export function convertTotalScore64to100(score64: number): number {
	return Math.round((score64 / 64) * 100);
}

/**
 * Get grade letter from bloom score (0-64)
 */
export function getGradeFromBloomScore(bloomScore: number): string {
	const percentage = (bloomScore / 64) * 100;
	if (percentage >= 97) return 'A+';
	if (percentage >= 93) return 'A';
	if (percentage >= 90) return 'A-';
	if (percentage >= 87) return 'B+';
	if (percentage >= 83) return 'B';
	if (percentage >= 80) return 'B-';
	if (percentage >= 77) return 'C+';
	if (percentage >= 73) return 'C';
	if (percentage >= 70) return 'C-';
	if (percentage >= 67) return 'D+';
	if (percentage >= 63) return 'D';
	if (percentage >= 60) return 'D-';
	return 'F';
}

/**
 * Create default petal data points with zero scores
 */
export function createDefaultPetalData(): PetalDataPoint[] {
	return PETAL_ORDER.map((category) => ({
		id: category,
		label: PETAL_LABELS[category],
		score: 0,
		confidence: 0.5,
		completeness: 0,
		trend: 'stable' as const,
		category
	}));
}

/**
 * Validate petal data array
 */
export function validatePetalData(data: PetalDataPoint[]): boolean {
	if (!data || data.length !== 8) return false;
	return data.every(
		(d) =>
			typeof d.score === 'number' &&
			d.score >= 0 &&
			d.score <= 8 &&
			typeof d.confidence === 'number' &&
			d.confidence >= 0 &&
			d.confidence <= 1 &&
			typeof d.completeness === 'number' &&
			d.completeness >= 0 &&
			d.completeness <= 1
	);
}

/**
 * Get category icon (for UI display)
 */
export function getCategoryIcon(category: PetalCategory): string {
	const icons: Record<PetalCategory, string> = {
		cashflow: '💰',
		appreciation: '📈',
		financing: '🏦',
		location: '📍',
		condition: '🔧',
		tenancy: '👥',
		liquidity: '💧',
		compliance: '📋'
	};
	return icons[category] ?? '📊';
}

/**
 * Sort petals by score (descending)
 */
export function sortPetalsByScore(data: PetalDataPoint[]): PetalDataPoint[] {
	return [...data].sort((a, b) => b.score - a.score);
}

/**
 * Get top N performing petals
 */
export function getTopPetals(data: PetalDataPoint[], n: number = 3): PetalDataPoint[] {
	return sortPetalsByScore(data).slice(0, n);
}

/**
 * Get bottom N performing petals (areas for improvement)
 */
export function getBottomPetals(data: PetalDataPoint[], n: number = 3): PetalDataPoint[] {
	return sortPetalsByScore(data).slice(-n).reverse();
}
