/**
 * Hedera Token Service (HTS) Integration
 *
 * Enables fractional ownership tokenization of multifamily real estate deals.
 * Each token represents a fraction of equity in a syndicated property.
 */

import {
	TokenCreateTransaction,
	TokenMintTransaction,
	TokenTransferTransaction,
	TokenSupplyType,
	TokenType,
	PrivateKey,
	AccountId,
	TokenAssociateTransaction
} from '@hashgraph/sdk';
import { executeAndGetReceipt, initClient, getOperatorAccountId } from './client';

export interface TokenConfig {
	name: string; // e.g., "deed.guru Orlando Multifamily Syndicate"
	symbol: string; // e.g., "ORLdeed.guru"
	initialSupply: number; // e.g., 1_000_000 (1M shares)
	decimals: number; // 6 for micro-shares, 0 for whole shares
	treasuryAccountId?: string; // Defaults to operator account
	maxSupply?: number; // Optional cap
	memo?: string; // Deal details reference
}

export interface TokenCreationResult {
	tokenId: string;
	transactionId: string;
	explorerUrl: string;
}

/**
 * Create a fungible token for deal syndication
 *
 * Example: 1M tokens = 100% ownership, 1 token = 0.0001% equity
 * Minimum investment: 10,000 tokens = 1% equity = ~$100K for $10M property
 */
export async function createSyndicationToken(
	config: TokenConfig
): Promise<TokenCreationResult> {
	const client = initClient();
	const treasuryAccountId = config.treasuryAccountId || getOperatorAccountId();

	// Generate supply key for minting control
	const supplyKey = PrivateKey.generateED25519();

	const tx = await new TokenCreateTransaction()
		.setTokenName(config.name)
		.setTokenSymbol(config.symbol)
		.setInitialSupply(config.initialSupply)
		.setTreasuryAccountId(treasuryAccountId)
		.setTokenSupplyType(TokenSupplyType.Finite)
		.setTokenType(TokenType.FungibleCommon)
		.setDecimals(config.decimals)
		.setMaxSupply(config.maxSupply || config.initialSupply * 2) // Allow for future raises
		.setSupplyKey(supplyKey) // Control who can mint
		.setMemo(config.memo || 'Created via deed.guru Radar')
		.freezeWith(client);

	// Sign with operator key
	const signedTx = await tx.sign(supplyKey);

	const { receipt, transactionId } = await executeAndGetReceipt(signedTx);

	const tokenId = receipt.tokenId?.toString();
	if (!tokenId) {
		throw new Error('Token creation failed - no token ID in receipt');
	}

	const network = process.env.HEDERA_NETWORK || 'testnet';
	const explorerUrl = `https://hashscan.io/${network}/token/${tokenId}`;

	// Store supply key securely (TODO: Add to database encrypted)
	console.log(`Token created: ${tokenId}`);
	console.log(`Supply Key (STORE SECURELY): ${supplyKey.toStringRaw()}`);

	return {
		tokenId,
		transactionId,
		explorerUrl
	};
}

/**
 * Mint additional tokens to treasury
 *
 * Use when additional capital is raised or for vesting schedules
 */
export async function mintTokens(
	tokenId: string,
	amount: number,
	supplyKey: PrivateKey
): Promise<string> {
	const client = initClient();

	const tx = await new TokenMintTransaction()
		.setTokenId(tokenId)
		.setAmount(amount)
		.freezeWith(client);

	const signedTx = await tx.sign(supplyKey);
	const { transactionId } = await executeAndGetReceipt(signedTx);

	return transactionId;
}

/**
 * Transfer tokens from treasury to investor
 *
 * Called when investor purchases fractional ownership
 */
export async function transferTokensToInvestor(
	tokenId: string,
	investorAccountId: string,
	amount: number
): Promise<string> {
	const client = initClient();
	const treasuryAccountId = getOperatorAccountId();

	const tx = await new TokenTransferTransaction()
		.addTokenTransfer(tokenId, treasuryAccountId, -amount) // Deduct from treasury
		.addTokenTransfer(tokenId, investorAccountId, amount) // Credit investor
		.freezeWith(client);

	const { transactionId } = await executeAndGetReceipt(tx);

	return transactionId;
}

/**
 * Associate token with investor account
 *
 * REQUIRED before investor can receive tokens (Hedera safety feature)
 * Typically called from frontend via wallet
 */
export async function associateTokenWithAccount(
	tokenId: string,
	accountId: string,
	accountPrivateKey: PrivateKey
): Promise<string> {
	const client = initClient();

	const tx = await new TokenAssociateTransaction()
		.setAccountId(accountId)
		.setTokenIds([tokenId])
		.freezeWith(client);

	const signedTx = await tx.sign(accountPrivateKey);
	const { transactionId } = await executeAndGetReceipt(signedTx);

	return transactionId;
}

/**
 * Calculate token amount from USD investment
 *
 * Example: $50K investment in $10M deal with 1M tokens
 * = 50,000 tokens (5% ownership)
 */
export function calculateTokenAmount(
	investmentUSD: number,
	totalRaiseUSD: number,
	totalTokens: number
): number {
	return Math.floor((investmentUSD / totalRaiseUSD) * totalTokens);
}

/**
 * Calculate ownership percentage from tokens
 */
export function calculateOwnershipPercentage(
	tokenAmount: number,
	totalTokens: number
): number {
	return (tokenAmount / totalTokens) * 100;
}
