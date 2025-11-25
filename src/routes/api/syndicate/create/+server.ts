import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUser } from '$lib/server/auth/supabase';
import { db } from '$lib/server/db';
import { syndications, properties } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createSyndicationToken, type TokenConfig } from '$lib/server/hedera/token';

export const POST: RequestHandler = async (event) => {
	try {
		// Require authentication
		const user = await getUser(event);
		if (!user) {
			throw error(401, 'Authentication required');
		}

		// Check if user has syndicate tier
		// TODO: Uncomment for production
		// if (user.subscription_tier !== 'syndicate') {
		// 	throw error(403, 'Syndicate tier subscription required');
		// }

		const body = await event.request.json();
		const {
			propertyId,
			totalRaiseUSD,
			minInvestmentUSD,
			maxInvestmentUSD,
			targetCloseDate,
			regulationType,
			accreditedOnly
		} = body;

		// Validate property exists and belongs to user
		const property = await db.query.properties.findFirst({
			where: eq(properties.id, propertyId)
		});

		if (!property) {
			throw error(404, 'Property not found');
		}

		if (property.userId !== user.id) {
			throw error(403, 'You do not own this property');
		}

		// Generate token configuration
		const tokenSymbol = generateTokenSymbol(property.name);
		const tokenName = `deed.guru ${property.name} Syndicate`;
		const totalTokens = Math.floor(totalRaiseUSD * 1000); // $1 = 1000 tokens (0.001 per token)
		const decimals = 6; // Micro-shares

		const tokenConfig: TokenConfig = {
			name: tokenName,
			symbol: tokenSymbol,
			initialSupply: totalTokens,
			decimals,
			memo: `Property: ${property.name} | Raise: $${totalRaiseUSD.toLocaleString()}`
		};

		// Create token on Hedera
		console.log('Creating Hedera token for syndication...');
		const { tokenId, transactionId, explorerUrl } = await createSyndicationToken(tokenConfig);

		// Create syndication record in database
		const syndicationId = crypto.randomUUID();
		const newSyndication = await db.insert(syndications).values({
			id: syndicationId,
			propertyId,
			creatorUserId: user.id,
			hederaTokenId: tokenId,
			tokenName,
			tokenSymbol,
			totalTokens,
			decimals,
			totalRaiseUSD: totalRaiseUSD.toString(),
			minInvestmentUSD: minInvestmentUSD.toString(),
			maxInvestmentUSD: maxInvestmentUSD?.toString(),
			targetCloseDate: targetCloseDate ? new Date(targetCloseDate) : null,
			status: 'active',
			regulationType: regulationType || 'reg_d',
			accreditedOnly: accreditedOnly !== false,
			explorerUrl,
			amountRaisedUSD: '0',
			investorCount: 0
		}).returning();

		return json({
			success: true,
			syndication: newSyndication[0],
			hedera: {
				tokenId,
				transactionId,
				explorerUrl
			},
			message: `Syndication created successfully! Token ID: ${tokenId}`
		});
	} catch (err) {
		console.error('Syndication creation error:', err);
		if (err instanceof Error) {
			throw error(500, err.message);
		}
		throw error(500, 'Failed to create syndication');
	}
};

/**
 * Generate token symbol from property name
 * Example: "Austin Tech Towers" -> "ATTdeed.guru"
 */
function generateTokenSymbol(propertyName: string): string {
	const words = propertyName
		.split(' ')
		.filter(word => word.length > 2)
		.slice(0, 3);

	const initials = words.map(word => word[0].toUpperCase()).join('');
	return `${initials}deed.guru`.slice(0, 8); // Max 8 chars for Hedera
}
