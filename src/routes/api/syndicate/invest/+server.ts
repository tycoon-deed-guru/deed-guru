import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUser } from '$lib/server/auth/supabase';
import { db } from '$lib/server/db';
import { syndications, investments, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import {
	transferTokensToInvestor,
	calculateTokenAmount,
	calculateOwnershipPercentage
} from '$lib/server/hedera/token';

export const POST: RequestHandler = async (event) => {
	try {
		// Require authentication
		const user = await getUser(event);
		if (!user) {
			throw error(401, 'Authentication required');
		}

		const body = await event.request.json();
		const { syndicationId, amountUSD, investorHederaAccount, paymentMethod } = body;

		// Validate input
		if (!amountUSD || amountUSD <= 0) {
			throw error(400, 'Invalid investment amount');
		}

		if (!investorHederaAccount) {
			throw error(400, 'Hedera wallet address required');
		}

		// Get syndication details
		const syndication = await db.query.syndications.findFirst({
			where: eq(syndications.id, syndicationId)
		});

		if (!syndication) {
			throw error(404, 'Syndication not found');
		}

		if (syndication.status !== 'active') {
			throw error(400, `Syndication is ${syndication.status}, not accepting investments`);
		}

		// Validate investment amount
		const minInvestment = parseFloat(syndication.minInvestmentUSD);
		const maxInvestment = syndication.maxInvestmentUSD
			? parseFloat(syndication.maxInvestmentUSD)
			: Infinity;

		if (amountUSD < minInvestment) {
			throw error(400, `Minimum investment is $${minInvestment.toLocaleString()}`);
		}

		if (amountUSD > maxInvestment) {
			throw error(400, `Maximum investment is $${maxInvestment.toLocaleString()}`);
		}

		// Check if syndication is fully funded
		const currentRaised = parseFloat(syndication.amountRaisedUSD);
		const totalRaise = parseFloat(syndication.totalRaiseUSD);
		const availableAmount = totalRaise - currentRaised;

		if (amountUSD > availableAmount) {
			throw error(
				400,
				`Only $${availableAmount.toLocaleString()} remaining in this syndication`
			);
		}

		// Calculate token amount
		const tokenAmount = calculateTokenAmount(amountUSD, totalRaise, syndication.totalTokens);
		const ownershipPercentage = calculateOwnershipPercentage(
			tokenAmount,
			syndication.totalTokens
		);

		// Create investment record (pending)
		const investmentId = crypto.randomUUID();
		const newInvestment = await db
			.insert(investments)
			.values({
				id: investmentId,
				syndicationId,
				userId: user.id,
				amountUSD: amountUSD.toString(),
				tokenAmount,
				ownershipPercentage: ownershipPercentage.toString(),
				investorHederaAccount,
				status: 'pending',
				paymentMethod: paymentMethod || 'crypto',
				accreditationVerified: false, // TODO: Implement verification
				kycCompleted: false // TODO: Implement KYC
			})
			.returning();

		// In production, this would:
		// 1. Wait for payment confirmation (webhook from payment processor)
		// 2. Verify KYC/accreditation
		// 3. Then transfer tokens
		//
		// For demo purposes, we'll simulate immediate transfer
		try {
			console.log(
				`Transferring ${tokenAmount} tokens to ${investorHederaAccount}...`
			);

			// Transfer tokens on Hedera
			const hederaTransactionId = await transferTokensToInvestor(
				syndication.hederaTokenId,
				investorHederaAccount,
				tokenAmount
			);

			// Update investment status
			await db
				.update(investments)
				.set({
					status: 'completed',
					hederaTransactionId,
					updatedAt: new Date()
				})
				.where(eq(investments.id, investmentId));

			// Update syndication totals
			const newAmountRaised = currentRaised + amountUSD;
			const newInvestorCount = syndication.investorCount + 1;
			const newStatus = newAmountRaised >= totalRaise ? 'funded' : 'active';

			await db
				.update(syndications)
				.set({
					amountRaisedUSD: newAmountRaised.toString(),
					investorCount: newInvestorCount,
					status: newStatus,
					updatedAt: new Date()
				})
				.where(eq(syndications.id, syndicationId));

			// Update user's Hedera account if not set
			if (!user.hedera_account_id) {
				await db
					.update(users)
					.set({ hederaAccountId: investorHederaAccount })
					.where(eq(users.id, user.id));
			}

			return json({
				success: true,
				investment: newInvestment[0],
				hedera: {
					transactionId: hederaTransactionId,
					tokenAmount,
					ownershipPercentage: ownershipPercentage.toFixed(3)
				},
				syndication: {
					amountRaised: newAmountRaised,
					percentFunded: ((newAmountRaised / totalRaise) * 100).toFixed(1),
					status: newStatus
				},
				message: `Investment successful! You now own ${ownershipPercentage.toFixed(3)}% of this property.`
			});
		} catch (hederaError) {
			// Hedera transfer failed, mark investment as failed
			await db
				.update(investments)
				.set({ status: 'failed' })
				.where(eq(investments.id, investmentId));

			throw error(500, `Token transfer failed: ${hederaError}`);
		}
	} catch (err) {
		console.error('Investment error:', err);
		if (err instanceof Error) {
			throw error(500, err.message);
		}
		throw error(500, 'Failed to process investment');
	}
};
