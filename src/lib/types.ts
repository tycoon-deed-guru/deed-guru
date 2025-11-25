// src/lib/types.ts
// Bloom Petal Scoring System - 8 petals, each scored 0-8, max 64 total

import type { PetalCategory, BloomStatusInfo } from './types/petal-chart.types';
import { PETAL_ORDER, getBloomStatus } from './types/petal-chart.types';

// Sub-criteria structure for each petal
export interface SubCriteria {
	name: string;
	weight: number; // 0-1, weights sum to 1.0 per petal
	score: number;  // 0-8
}

// Property with 8-petal sub-criteria scoring
export type Property = {
	id: string;
	name: string;
	address: string;
	units: number;
	uploadedAt: Date;

	// CASHFLOW sub-criteria (weights sum to 1.0)
	capRate: number;              // 30% weight
	cashOnCash: number;           // 25% weight
	rentGrowthPotential: number;  // 20% weight
	expenseRatio: number;         // 15% weight
	vacancyRate: number;          // 10% weight

	// APPRECIATION sub-criteria
	marketTrend: number;              // 30% weight
	neighborhoodDevelopment: number;  // 25% weight
	supplyDemandBalance: number;      // 20% weight
	economicDrivers: number;          // 15% weight
	comparableSales: number;          // 10% weight

	// FINANCING sub-criteria
	interestRate: number;         // 30% weight
	ltvRatio: number;             // 25% weight
	loanTerms: number;            // 20% weight
	qualificationEase: number;    // 15% weight
	refinanceOptions: number;     // 10% weight

	// LOCATION sub-criteria (equal weights 20% each)
	walkScore: number;
	schoolQuality: number;
	safetyScore: number;
	amenitiesAccess: number;
	commuteTransit: number;

	// CONDITION sub-criteria
	structuralIntegrity: number;  // 25% weight
	majorSystems: number;         // 25% weight
	cosmeticCondition: number;    // 20% weight
	deferredMaintenance: number;  // 20% weight
	energyEfficiency: number;     // 10% weight

	// TENANCY sub-criteria
	occupancyRate: number;        // 25% weight
	tenantQuality: number;        // 25% weight
	leaseTerms: number;           // 20% weight
	turnoverRate: number;         // 15% weight
	rentRollStrength: number;     // 15% weight

	// LIQUIDITY sub-criteria
	daysOnMarket: number;          // 30% weight
	buyerPoolDepth: number;        // 25% weight
	financingAvailability: number; // 20% weight
	marketActivity: number;        // 15% weight
	priceStability: number;        // 10% weight

	// COMPLIANCE sub-criteria
	permitsCurrent: number;       // 25% weight
	zoningCompliance: number;     // 25% weight
	codeViolations: number;       // 20% weight
	environmentalIssues: number;  // 15% weight
	hoaRegulations: number;       // 15% weight
};

// Score a single sub-criteria on 0-8 scale
export const scoreSubCriteria = (value: number, thresholds: number[]): number => {
	// thresholds array has 8 values for scores 1-8, value < thresholds[0] = 0
	for (let i = thresholds.length - 1; i >= 0; i--) {
		if (value >= thresholds[i]) return i + 1;
	}
	return 0;
};

// Calculate weighted petal score (0-8)
export const calculatePetalScore = (subScores: number[], weights: number[]): number => {
	let weighted = 0;
	for (let i = 0; i < subScores.length; i++) {
		weighted += subScores[i] * (weights[i] || 0);
	}
	// Round to 1 decimal place
	return Math.round(weighted * 10) / 10;
};

// Calculate Bloom scores for all 8 petals (in PETAL_ORDER)
export const calculateBloomScore = (p: Property): number[] => {
	// LOCATION (index 0) - Equal weights 20% each
	const locationScore = calculatePetalScore(
		[p.walkScore, p.schoolQuality, p.safetyScore, p.amenitiesAccess, p.commuteTransit],
		[0.2, 0.2, 0.2, 0.2, 0.2]
	);

	// TENANCY (index 1)
	const tenancyScore = calculatePetalScore(
		[p.occupancyRate, p.tenantQuality, p.leaseTerms, p.turnoverRate, p.rentRollStrength],
		[0.25, 0.25, 0.20, 0.15, 0.15]
	);

	// COMPLIANCE (index 2)
	const complianceScore = calculatePetalScore(
		[p.permitsCurrent, p.zoningCompliance, p.codeViolations, p.environmentalIssues, p.hoaRegulations],
		[0.25, 0.25, 0.20, 0.15, 0.15]
	);

	// FINANCING (index 3)
	const financingScore = calculatePetalScore(
		[p.interestRate, p.ltvRatio, p.loanTerms, p.qualificationEase, p.refinanceOptions],
		[0.30, 0.25, 0.20, 0.15, 0.10]
	);

	// CASHFLOW (index 4)
	const cashflowScore = calculatePetalScore(
		[p.capRate, p.cashOnCash, p.rentGrowthPotential, p.expenseRatio, p.vacancyRate],
		[0.30, 0.25, 0.20, 0.15, 0.10]
	);

	// APPRECIATION (index 5)
	const appreciationScore = calculatePetalScore(
		[p.marketTrend, p.neighborhoodDevelopment, p.supplyDemandBalance, p.economicDrivers, p.comparableSales],
		[0.30, 0.25, 0.20, 0.15, 0.10]
	);

	// LIQUIDITY (index 6)
	const liquidityScore = calculatePetalScore(
		[p.daysOnMarket, p.buyerPoolDepth, p.financingAvailability, p.marketActivity, p.priceStability],
		[0.30, 0.25, 0.20, 0.15, 0.10]
	);

	// CONDITION (index 7)
	const conditionScore = calculatePetalScore(
		[p.structuralIntegrity, p.majorSystems, p.cosmeticCondition, p.deferredMaintenance, p.energyEfficiency],
		[0.25, 0.25, 0.20, 0.20, 0.10]
	);

	// Return in PETAL_ORDER: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
	return [
		locationScore,
		tenancyScore,
		complianceScore,
		financingScore,
		cashflowScore,
		appreciationScore,
		liquidityScore,
		conditionScore
	];
};

// Sum all petal scores (max 64)
export const totalScore = (scores: number[]): number =>
	Math.round(scores.reduce((a, b) => a + b, 0) * 10) / 10;

// Get Bloom status and grade from total score (0-64)
export const bloomGrade = (total: number): BloomStatusInfo => getBloomStatus(total);

// Legacy letterGrade function (maps to Bloom status)
export const letterGrade = (total: number): { grade: string; color: string } => {
	const status = getBloomStatus(total);
	// Map Bloom status to letter-like grades
	switch (status.status) {
		case 'fully-bloomed': return { grade: 'A+', color: 'text-green-600' };
		case 'near-bloom': return { grade: 'A', color: 'text-green-500' };
		case 'blooming': return { grade: 'B+', color: 'text-yellow-600' };
		case 'late-bloom': return { grade: 'B', color: 'text-orange-500' };
		case 'budding': return { grade: 'C', color: 'text-orange-600' };
		default: return { grade: 'F', color: 'text-red-600' };
	}
};

// Normalized score (0-100) for reports
export const normalizedScore = (total: number): number =>
	Math.round((total / 64) * 100);
