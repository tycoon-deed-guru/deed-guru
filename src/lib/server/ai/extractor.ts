import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { env } from '$env/dynamic/private';

// Schema for extracted property data - 8 Petal Bloom System (40 sub-criteria)
const PropertyDataSchema = z.object({
	name: z.string().describe('Property name'),
	address: z.string().describe('Full property address'),
	units: z.number().describe('Number of units'),

	// CASHFLOW (5 sub-criteria)
	capRate: z.number().min(0).max(8).describe('Cap Rate score (0-8): Net operating income / purchase price'),
	cashOnCash: z.number().min(0).max(8).describe('Cash-on-Cash Return score (0-8): Annual cash flow / total cash invested'),
	rentGrowthPotential: z.number().min(0).max(8).describe('Rent Growth Potential score (0-8): Expected annual rent increase'),
	expenseRatio: z.number().min(0).max(8).describe('Expense Ratio score (0-8): Operating expenses / gross income (inverted: lower is better)'),
	vacancyRate: z.number().min(0).max(8).describe('Vacancy Rate score (0-8): Historical vacancy percentage (inverted: lower is better)'),

	// APPRECIATION (5 sub-criteria)
	marketTrend: z.number().min(0).max(8).describe('Market Trend score (0-8): Historical and projected price growth'),
	neighborhoodDevelopment: z.number().min(0).max(8).describe('Neighborhood Development score (0-8): Upcoming infrastructure and amenities'),
	supplyDemandBalance: z.number().min(0).max(8).describe('Supply/Demand Balance score (0-8): Housing supply vs demand dynamics'),
	economicDrivers: z.number().min(0).max(8).describe('Economic Drivers score (0-8): Job growth, major employers'),
	comparableSales: z.number().min(0).max(8).describe('Comparable Sales score (0-8): Recent similar property sales trends'),

	// FINANCING (5 sub-criteria)
	interestRate: z.number().min(0).max(8).describe('Interest Rate score (0-8): Current loan interest rate quality'),
	ltvRatio: z.number().min(0).max(8).describe('LTV Ratio score (0-8): Loan-to-value ratio availability'),
	loanTerms: z.number().min(0).max(8).describe('Loan Terms score (0-8): Amortization, prepayment flexibility'),
	qualificationEase: z.number().min(0).max(8).describe('Qualification Ease score (0-8): DSCR, income requirements'),
	refinanceOptions: z.number().min(0).max(8).describe('Refinance Options score (0-8): Future refinancing potential'),

	// LOCATION (5 sub-criteria - equal weights)
	walkScore: z.number().min(0).max(8).describe('Walk Score (0-8): Walkability and transit access'),
	schoolQuality: z.number().min(0).max(8).describe('School Quality score (0-8): Nearby school ratings'),
	safetyScore: z.number().min(0).max(8).describe('Safety Score (0-8): Neighborhood safety metrics'),
	amenitiesAccess: z.number().min(0).max(8).describe('Amenities Access score (0-8): Shopping, dining, entertainment'),
	commuteTransit: z.number().min(0).max(8).describe('Commute/Transit score (0-8): Access to employment centers'),

	// CONDITION (5 sub-criteria)
	structuralIntegrity: z.number().min(0).max(8).describe('Structural Integrity score (0-8): Foundation, roof, walls'),
	majorSystems: z.number().min(0).max(8).describe('Major Systems score (0-8): HVAC, plumbing, electrical age and condition'),
	cosmeticCondition: z.number().min(0).max(8).describe('Cosmetic Condition score (0-8): Paint, flooring, fixtures'),
	deferredMaintenance: z.number().min(0).max(8).describe('Deferred Maintenance score (0-8): Outstanding repairs needed (inverted: less is better)'),
	energyEfficiency: z.number().min(0).max(8).describe('Energy Efficiency score (0-8): Insulation, windows, appliances'),

	// TENANCY (5 sub-criteria)
	occupancyRate: z.number().min(0).max(8).describe('Occupancy Rate score (0-8): Current occupancy percentage'),
	tenantQuality: z.number().min(0).max(8).describe('Tenant Quality score (0-8): Payment history, stability'),
	leaseTerms: z.number().min(0).max(8).describe('Lease Terms score (0-8): Lease length, rent escalations'),
	turnoverRate: z.number().min(0).max(8).describe('Turnover Rate score (0-8): Historical tenant retention (inverted: lower turnover is better)'),
	rentRollStrength: z.number().min(0).max(8).describe('Rent Roll Strength score (0-8): Below/at/above market rents'),

	// LIQUIDITY (5 sub-criteria)
	daysOnMarket: z.number().min(0).max(8).describe('Days on Market score (0-8): Average time to sell in area (inverted: faster is better)'),
	buyerPoolDepth: z.number().min(0).max(8).describe('Buyer Pool Depth score (0-8): Number of potential buyers'),
	financingAvailability: z.number().min(0).max(8).describe('Financing Availability score (0-8): Ease of buyer financing'),
	marketActivity: z.number().min(0).max(8).describe('Market Activity score (0-8): Transaction volume trends'),
	priceStability: z.number().min(0).max(8).describe('Price Stability score (0-8): Frequency of price reductions (inverted: fewer reductions is better)'),

	// COMPLIANCE (5 sub-criteria)
	permitsCurrent: z.number().min(0).max(8).describe('Permits Current score (0-8): All permits up to date'),
	zoningCompliance: z.number().min(0).max(8).describe('Zoning Compliance score (0-8): Current use matches zoning'),
	codeViolations: z.number().min(0).max(8).describe('Code Violations score (0-8): Outstanding violations (inverted: fewer is better)'),
	environmentalIssues: z.number().min(0).max(8).describe('Environmental Issues score (0-8): Hazmat, flood zone, etc (inverted: fewer issues is better)'),
	hoaRegulations: z.number().min(0).max(8).describe('HOA/Regulations score (0-8): Rental restrictions, rules (inverted: fewer restrictions is better)'),
});

export type ExtractedPropertyData = z.infer<typeof PropertyDataSchema>;

const EXTRACTION_PROMPT = `You are an expert multifamily real estate analyst using the deed.guru 8-Petal Bloom scoring system.

Analyze this real estate offering memorandum or rent roll document and extract scores for ALL 40 sub-criteria (5 per petal × 8 petals).

**SCORING SCALE: 0-8 for each criterion**
- 8 = Excellent/Optimal
- 6-7 = Good/Above Average
- 4-5 = Average/Acceptable
- 2-3 = Below Average/Concerning
- 0-1 = Poor/Critical Issue

**8 PETALS (40 Sub-Criteria Total):**

**1. CASHFLOW** (Income Generation)
- Cap Rate: NOI / purchase price quality
- Cash-on-Cash Return: Annual cash flow / cash invested
- Rent Growth Potential: Expected annual rent increases
- Expense Ratio: Operating expenses / gross income (INVERTED: lower = higher score)
- Vacancy Rate: Historical vacancy % (INVERTED: lower = higher score)

**2. APPRECIATION** (Long-term Value Growth)
- Market Trend: Historical and projected price growth
- Neighborhood Development: Upcoming infrastructure/amenities
- Supply/Demand Balance: Housing supply vs demand dynamics
- Economic Drivers: Job growth, major employers
- Comparable Sales: Recent similar property sales trends

**3. FINANCING** (Loan Availability & Terms)
- Interest Rate: Loan interest rate quality
- LTV Ratio: Loan-to-value ratio availability
- Loan Terms: Amortization, prepayment flexibility
- Qualification Ease: DSCR, income requirements
- Refinance Options: Future refinancing potential

**4. LOCATION** (Geographic Appeal)
- Walk Score: Walkability and transit access
- School Quality: Nearby school ratings
- Safety Score: Neighborhood safety metrics
- Amenities Access: Shopping, dining, entertainment
- Commute/Transit: Access to employment centers

**5. CONDITION** (Physical State)
- Structural Integrity: Foundation, roof, walls
- Major Systems: HVAC, plumbing, electrical age
- Cosmetic Condition: Paint, flooring, fixtures
- Deferred Maintenance: Outstanding repairs (INVERTED: less = higher score)
- Energy Efficiency: Insulation, windows, appliances

**6. TENANCY** (Occupancy & Lease Quality)
- Occupancy Rate: Current occupancy %
- Tenant Quality: Payment history, stability
- Lease Terms: Lease length, rent escalations
- Turnover Rate: Tenant retention (INVERTED: lower turnover = higher score)
- Rent Roll Strength: Below/at/above market rents

**7. LIQUIDITY** (Exit Ease)
- Days on Market: Time to sell (INVERTED: faster = higher score)
- Buyer Pool Depth: Number of potential buyers
- Financing Availability: Ease of buyer financing
- Market Activity: Transaction volume trends
- Price Stability: Price reduction frequency (INVERTED: fewer = higher score)

**8. COMPLIANCE** (Legal & Regulatory)
- Permits Current: All permits up to date
- Zoning Compliance: Current use matches zoning
- Code Violations: Outstanding violations (INVERTED: fewer = higher score)
- Environmental Issues: Hazmat, flood zone (INVERTED: fewer = higher score)
- HOA/Regulations: Rental restrictions (INVERTED: fewer restrictions = higher score)

**EXTRACTION RULES:**
1. If a metric is explicitly stated, score based on industry benchmarks
2. If inferable from other data, estimate conservatively
3. For missing data, use conservative defaults (score of 5 = average)
4. For inverted scales, remember: BAD conditions = LOW score, GOOD conditions = HIGH score
5. Base subjective scores on: location quality, market position, condition descriptions, financial performance

**Default Conservative Scores (when data missing):**
- All metrics: 5 (average/neutral)
- Exception: Compliance items default to 6 (assume generally compliant)

Focus on accuracy and conservative estimates. When in doubt, score lower rather than higher.`;

/**
 * Extract property data from document text using Vercel AI SDK
 * Extracts all 40 sub-criteria for the 8-petal Bloom scoring system
 */
export async function extractPropertyData(documentText: string): Promise<ExtractedPropertyData> {
	// Choose model based on available API keys
	const model = env.ANTHROPIC_API_KEY
		? anthropic('claude-3-5-sonnet-20241022')
		: env.OPENAI_API_KEY
		? openai('gpt-4-turbo')
		: null;

	if (!model) {
		throw new Error('No AI provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in .env');
	}

	try {
		const { object } = await generateObject({
			model,
			schema: PropertyDataSchema,
			prompt: `${EXTRACTION_PROMPT}\n\n--- DOCUMENT TEXT ---\n${documentText.slice(0, 50000)}`,
			temperature: 0.1, // Low temperature for consistent extraction
		});

		return object;
	} catch (error) {
		console.error('AI extraction failed:', error);
		throw new Error(`Failed to extract property data: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

/**
 * Extract text from various file formats
 * For MVP, supports plain text. Extend with PDF/Excel parsers later.
 */
export async function extractTextFromFile(file: File): Promise<string> {
	const fileType = file.type;

	// Handle text files
	if (fileType.includes('text')) {
		return await file.text();
	}

	// For now, require text files
	// TODO: Add PDF parser (pdf-parse), Excel parser (xlsx)
	throw new Error('Only text files are currently supported. PDF and Excel support coming soon.');
}
