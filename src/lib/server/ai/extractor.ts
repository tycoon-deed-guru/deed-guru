import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { env } from '$env/dynamic/private';

// Schema for extracted property data
const PropertyDataSchema = z.object({
	name: z.string().describe('Property name'),
	address: z.string().describe('Full property address'),
	units: z.number().describe('Number of units'),
	year1CoC: z.number().describe('Year 1 Cash-on-Cash return percentage'),
	projectedIRR: z.number().describe('Projected Internal Rate of Return percentage'),
	rentGrowthCAGR: z.number().describe('Rent growth CAGR percentage'),
	popJobGrowth: z.number().describe('Population and job growth percentage'),
	valueAddPotential: z.number().describe('Value-add potential equity gain in 5 years percentage'),
	dscr: z.number().describe('Debt Service Coverage Ratio'),
	submarketScore: z.number().min(1).max(10).describe('Submarket quality score 1-10'),
	exitCapCompressionBps: z.number().describe('Exit cap compression in basis points'),
	economicResilience: z.number().min(1).max(10).describe('Economic resilience score 1-10'),
});

export type ExtractedPropertyData = z.infer<typeof PropertyDataSchema>;

const EXTRACTION_PROMPT = `You are Grant Cardone's senior underwriting analyst with 20+ years experience in multifamily real estate.

Analyze this real estate offering memorandum or rent roll document and extract ONLY the following key metrics for the deed.guru Radar scoring system:

1. **Property Name** - The official property name
2. **Address** - Full address including city and state
3. **Units** - Total number of rental units
4. **Year 1 Cash-on-Cash (%)** - First year cash return on cash invested
5. **Projected IRR (%)** - Internal rate of return over hold period
6. **Rent Growth CAGR (%)** - Compound annual growth rate of rents
7. **Pop/Job Growth (%)** - Local market population and job growth
8. **Value-Add Potential (%)** - Equity gain potential through improvements over 5 years
9. **DSCR** - Debt Service Coverage Ratio (e.g., 1.25 = 125% coverage)
10. **Submarket Score (1-10)** - Quality of location/submarket (1=poor, 10=excellent)
11. **Exit Cap Compression (bps)** - Expected cap rate compression at exit in basis points
12. **Economic Resilience (1-10)** - Market's ability to withstand economic downturns (1=low, 10=high)

**EXTRACTION RULES:**
- If a metric is explicitly stated in the document, use that exact value
- If a metric can be reasonably inferred from other data, estimate conservatively
- For subjective scores (submarket, resilience), base on: location quality, tenant demographics, job diversity, historical performance
- If data is completely missing, use industry-conservative defaults:
  - Year 1 CoC: 6%
  - IRR: 15%
  - Rent Growth: 3%
  - Pop/Job Growth: 2%
  - Value-Add: 15%
  - DSCR: 1.25
  - Submarket: 5
  - Exit Cap Compression: 50 bps
  - Economic Resilience: 5

Be precise, conservative, and focus on Grant Cardone's investment criteria: strong cash flow, aggressive growth, and dominant market position.`;

/**
 * Extract property data from document text using Vercel AI SDK
 * Supports multiple LLM providers (OpenAI GPT-4, Claude 3.5 Sonnet)
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

	// Handle PDF (future implementation)
	if (fileType.includes('pdf')) {
		// TODO: Integrate pdf-parse or similar
		throw new Error('PDF parsing not yet implemented. Coming soon!');
	}

	// Handle Excel (future implementation)
	if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
		// TODO: Integrate xlsx parser
		throw new Error('Excel parsing not yet implemented. Coming soon!');
	}

	throw new Error(`Unsupported file type: ${fileType}`);
}
