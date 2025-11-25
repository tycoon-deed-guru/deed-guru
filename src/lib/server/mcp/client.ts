/**
 * MCP Client - Core infrastructure for calling MCP tools from code
 * This enables agents to write code that calls tools instead of direct tool calls
 */

import { searchMultifamilyDeals, estimateMarketMetrics, type MLSDeal } from './mls-tools';

// Generic MCP tool caller that routes to appropriate server
export async function callMCPTool<T>(toolName: string, input: any): Promise<T> {
	// Parse server and tool from name (format: "server__tool_name")
	const [server, ...toolParts] = toolName.split('__');
	const tool = toolParts.join('_');

	switch (server) {
		case 'mls':
			return callMLSTool(tool, input) as Promise<T>;

		// Future servers can be added here:
		// case 'costar':
		//   return callCoStarTool(tool, input) as Promise<T>;
		// case 'yardi':
		//   return callYardiTool(tool, input) as Promise<T>;

		default:
			throw new Error(`Unknown MCP server: ${server}`);
	}
}

// MLS server tool router
async function callMLSTool(tool: string, input: any) {
	switch (tool) {
		case 'search_multifamily_deals':
			return await searchMultifamilyDeals(
				input.city,
				input.state,
				input.minUnits,
				input.maxPrice
			);

		case 'estimate_market_metrics':
			return estimateMarketMetrics(input.deal);

		default:
			throw new Error(`Unknown MLS tool: ${tool}`);
	}
}

// Search available tools (for progressive disclosure)
export interface ToolDefinition {
	name: string;
	description: string;
	server: string;
	inputSchema?: any;
	outputSchema?: any;
}

export async function searchTools(query: string, detailLevel: 'name' | 'description' | 'full' = 'description'): Promise<ToolDefinition[]> {
	const allTools: ToolDefinition[] = [
		{
			name: 'mls__search_multifamily_deals',
			description: 'Search live multifamily apartment deals (100+ units) across sunbelt markets',
			server: 'mls',
			inputSchema: {
				city: 'string',
				state: 'string (2-letter code)',
				minUnits: 'number (optional, default 100)',
				maxPrice: 'number (optional)',
			},
			outputSchema: 'MLSDeal[]',
		},
		{
			name: 'mls__estimate_market_metrics',
			description: 'Estimate market metrics for a property to enable deed.guru scoring',
			server: 'mls',
			inputSchema: {
				deal: 'MLSDeal',
			},
			outputSchema: 'MarketMetrics',
		},
	];

	// Filter by search query
	const filtered = allTools.filter((tool) =>
		tool.name.toLowerCase().includes(query.toLowerCase()) ||
		tool.description.toLowerCase().includes(query.toLowerCase()) ||
		tool.server.toLowerCase().includes(query.toLowerCase())
	);

	// Return appropriate detail level
	if (detailLevel === 'name') {
		return filtered.map((t) => ({ name: t.name, description: '', server: t.server }));
	} else if (detailLevel === 'description') {
		return filtered.map((t) => ({ name: t.name, description: t.description, server: t.server }));
	} else {
		return filtered;
	}
}
