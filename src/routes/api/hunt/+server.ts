import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUser } from '$lib/server/auth/supabase';
import { huntWithNaturalLanguage, executeDealHunt, type HuntQuery } from '$lib/server/mcp/agent';

export const POST: RequestHandler = async (event) => {
	try {
		// Auth optional for demo, but recommended for production
		const user = await getUser(event);

		// TODO: Add rate limiting for free tier users
		// if (!user || user.subscription_tier === 'free') {
		//   // Limit to 5 hunts per day
		// }

		const body = await event.request.json();
		const { query, structured } = body;

		let deals;

		if (structured) {
			// Structured query (from advanced form)
			const params: HuntQuery = {
				city: structured.city,
				state: structured.state,
				minUnits: structured.minUnits || 100,
				maxPrice: structured.maxPrice,
				minScore: structured.minScore || 75,
			};
			deals = await executeDealHunt(params);
		} else if (query) {
			// Natural language query
			deals = await huntWithNaturalLanguage(query);
		} else {
			throw error(400, 'Must provide either "query" or "structured" parameters');
		}

		return json({
			success: true,
			deals,
			count: deals.length,
			message: deals.length === 0
				? 'No deals found matching your criteria'
				: `Found ${deals.length} properties scoring 75+ (B+ or better)`,
		});
	} catch (err) {
		console.error('Hunt error:', err);
		if (err instanceof Error) {
			throw error(500, err.message);
		}
		throw error(500, 'Failed to execute deal hunt');
	}
};
