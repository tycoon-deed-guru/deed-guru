/**
 * Code Execution Agent for MCP
 *
 * This agent writes TypeScript code to interact with MCP servers,
 * enabling context-efficient tool usage through progressive disclosure
 * and in-environment data processing.
 */

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { env } from '$env/dynamic/private';
import { huntAndScoreDeals, type HuntAndScoreInput, type ScoredDeal } from './skills/hunt-and-score-deals';

const CODE_EXECUTION_PROMPT = `You are an expert TypeScript developer working with the Model Context Protocol (MCP).

CRITICAL: You write CODE to interact with MCP servers, NOT direct tool calls.

# Available MCP Servers (via filesystem)

## ./servers/mls/
Tools for searching multifamily real estate:
- searchMultifamilyDeals(input): Search properties
- estimateMarketMetrics(deal): Get market data

## ./skills/
Reusable functions:
- huntAndScoreDeals(input): Search + score in one call (RECOMMENDED)

# Code Execution Benefits

1. **Progressive Disclosure**: Only import tools you need
2. **Context Efficiency**: Process data in execution environment
3. **Reusable Skills**: Use pre-built functions
4. **Privacy**: Sensitive data stays in execution environment

# Example: Efficient Deal Hunt

GOOD (Code Execution - 2K tokens):
\`\`\`typescript
import { huntAndScoreDeals } from './skills/hunt-and-score-deals';

// All filtering happens in execution environment
const deals = await huntAndScoreDeals({
  city: 'Austin',
  state: 'TX',
  minUnits: 200,
  minScore: 80
});

// Only log summary
console.log(\`Found \${deals.length} excellent deals\`);
console.log(deals.slice(0, 3)); // Show top 3
\`\`\`

BAD (Direct Tool Calls - 150K tokens):
- Load all MLS tool definitions upfront
- Pass all results through context
- No filtering before model sees data

# Your Task

When a user asks to find deals:
1. Use the huntAndScoreDeals skill (most efficient)
2. Filter/transform results in code
3. Return only relevant data

Remember: You're a developer writing code, not making API calls.`;

export interface HuntQuery {
	city: string;
	state: string;
	minUnits?: number;
	maxPrice?: number;
	minScore?: number;
}

export type { ScoredDeal };

/**
 * Execute a deal hunt using code execution pattern
 */
export async function executeDealHunt(query: HuntQuery): Promise<ScoredDeal[]> {
	// Choose model
	const model = env.ANTHROPIC_API_KEY
		? anthropic('claude-3-5-sonnet-20241022')
		: env.OPENAI_API_KEY
		? openai('gpt-4-turbo')
		: null;

	if (!model) {
		throw new Error('No AI provider configured');
	}

	try {
		// In production, this would use an actual code execution environment
		// For now, we directly call the skill (simulating code execution)
		console.log('Executing hunt with code execution pattern...');
		console.log('Query:', query);

		// The agent would write code like:
		// ```typescript
		// import { huntAndScoreDeals } from './skills/hunt-and-score-deals';
		// const deals = await huntAndScoreDeals({ city: 'Austin', state: 'TX', minUnits: 200 });
		// console.log(`Found ${deals.length} deals`);
		// return deals;
		// ```

		// Execute the skill (simulating code execution environment)
		const results = await huntAndScoreDeals({
			city: query.city,
			state: query.state,
			minUnits: query.minUnits || 100,
			maxPrice: query.maxPrice,
			minScore: query.minScore || 75,
		});

		// AI analysis of results (optional - adds intelligence)
		if (results.length > 0 && env.ANTHROPIC_API_KEY) {
			const topDeals = results.slice(0, 3);
			const dealSummary = topDeals
				.map((d) => `${d.name}: ${d.units} units, $${(d.price / 1e6).toFixed(1)}M, ${d.totalScore}/100 (${d.grade})`)
				.join('\n');

			const { text: analysis } = await generateText({
				model,
				prompt: `Grant Cardone's top analyst found these deals in ${query.city}, ${query.state}:

${dealSummary}

In 2-3 sentences, explain why the top deal is a deed.guru opportunity. Focus on cash flow, forced appreciation, and market dominance.`,
				maxTokens: 200,
			});

			console.log('AI Analysis:', analysis);
		}

		return results;
	} catch (error) {
		console.error('Hunt execution failed:', error);
		throw error;
	}
}

/**
 * Parse natural language query and execute hunt
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

	// Parse query to structured parameters
	const { text } = await generateText({
		model,
		prompt: `${CODE_EXECUTION_PROMPT}

Parse this real estate query into hunt parameters: "${query}"

Return ONLY valid JSON (no markdown, no explanation):
{
  "city": "CityName",
  "state": "XX",
  "minUnits": 100,
  "maxPrice": 100000000,
  "minScore": 75
}

Supported cities: Austin, Orlando, Phoenix, Nashville, Jacksonville, Scottsdale
State must be 2-letter code (TX, FL, AZ, TN)`,
		maxTokens: 150,
	});

	try {
		const params = JSON.parse(text.trim()) as HuntQuery;
		return await executeDealHunt(params);
	} catch (error) {
		console.error('Failed to parse query:', text);
		throw new Error('Could not understand search query. Try: "Find 200+ unit deals in Austin, TX"');
	}
}

/**
 * Token usage comparison
 */
export function getTokenSavings() {
	return {
		traditionalApproach: {
			toolDefinitions: 50_000, // All MLS tools loaded upfront
			intermediateResults: 100_000, // Full dataset through context
			total: 150_000,
		},
		codeExecutionApproach: {
			skillImport: 500, // Only load huntAndScoreDeals
			filteredResults: 1_500, // Only qualifying deals
			total: 2_000,
		},
		savings: {
			tokens: 148_000,
			percentage: 98.7,
			costReduction: '~$0.45 per hunt (at GPT-4 pricing)',
		},
	};
}
