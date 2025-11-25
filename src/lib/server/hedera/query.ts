/**
 * Hedera Query Utilities
 *
 * Functions for querying token balances, transaction history, and account info
 * using Hedera Mirror Node REST API (faster and free vs consensus queries)
 */

import { AccountBalanceQuery, AccountId, TokenId } from '@hashgraph/sdk';
import { initClient, getNetworkInfo } from './client';

/**
 * Get token balance for an account using SDK
 * Uses consensus nodes (more reliable but slower)
 */
export async function getTokenBalance(
	accountId: string,
	tokenId: string
): Promise<string> {
	const client = initClient();

	const query = new AccountBalanceQuery()
		.setAccountId(AccountId.fromString(accountId));

	const balance = await query.execute(client);
	const tokenBalance = balance.tokens?.get(TokenId.fromString(tokenId));

	return tokenBalance?.toString() || '0';
}

/**
 * Get account HBAR balance
 */
export async function getHbarBalance(accountId: string): Promise<string> {
	const client = initClient();

	const query = new AccountBalanceQuery()
		.setAccountId(AccountId.fromString(accountId));

	const balance = await query.execute(client);
	return balance.hbars.toString();
}

/**
 * Mirror Node API - Get token info
 * Fast, free, REST-based queries
 */
export async function getTokenInfo(tokenId: string) {
	const { mirrorNodeUrl } = getNetworkInfo();
	const response = await fetch(`${mirrorNodeUrl}/api/v1/tokens/${tokenId}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch token info: ${response.statusText}`);
	}

	return await response.json();
}

/**
 * Get token balances for account via Mirror Node
 * Returns all tokens held by account
 */
export async function getAccountTokenBalances(accountId: string) {
	const { mirrorNodeUrl } = getNetworkInfo();
	const response = await fetch(
		`${mirrorNodeUrl}/api/v1/accounts/${accountId}/tokens?limit=100`
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch account tokens: ${response.statusText}`);
	}

	const data = await response.json();
	return data.tokens || [];
}

/**
 * Get transaction history for a token
 * Useful for audit trails and investor reporting
 */
export async function getTokenTransactions(
	tokenId: string,
	limit: number = 25
) {
	const { mirrorNodeUrl } = getNetworkInfo();
	const response = await fetch(
		`${mirrorNodeUrl}/api/v1/tokens/${tokenId}/transactions?limit=${limit}&order=desc`
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch transactions: ${response.statusText}`);
	}

	const data = await response.json();
	return data.transactions || [];
}

/**
 * Get account transaction history
 * Filter by specific token transfers
 */
export async function getAccountTransactions(
	accountId: string,
	limit: number = 25
) {
	const { mirrorNodeUrl } = getNetworkInfo();
	const response = await fetch(
		`${mirrorNodeUrl}/api/v1/transactions?account.id=${accountId}&limit=${limit}&order=desc`
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch account transactions: ${response.statusText}`);
	}

	const data = await response.json();
	return data.transactions || [];
}

/**
 * Get token holders (all accounts with balance > 0)
 * Useful for syndicate reporting
 */
export async function getTokenHolders(tokenId: string) {
	const { mirrorNodeUrl } = getNetworkInfo();
	const response = await fetch(
		`${mirrorNodeUrl}/api/v1/tokens/${tokenId}/balances?limit=1000`
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch token holders: ${response.statusText}`);
	}

	const data = await response.json();
	return data.balances || [];
}

/**
 * Format token amount with decimals
 * Example: 1000000 with decimals=6 -> "1.000000"
 */
export function formatTokenAmount(amount: number | string, decimals: number): string {
	const amountNum = typeof amount === 'string' ? parseInt(amount) : amount;
	const divisor = Math.pow(10, decimals);
	return (amountNum / divisor).toFixed(decimals);
}

/**
 * Parse formatted token amount to raw value
 * Example: "1.5" with decimals=6 -> 1500000
 */
export function parseTokenAmount(formatted: string, decimals: number): number {
	const multiplier = Math.pow(10, decimals);
	return Math.floor(parseFloat(formatted) * multiplier);
}
