/**
 * Hedera Hashgraph Client Infrastructure
 *
 * Provides core utilities for connecting to Hedera network and executing transactions.
 * Supports both testnet (development) and mainnet (production).
 */

import {
	Client,
	AccountId,
	PrivateKey,
	TransactionReceiptQuery,
	type Transaction,
	type TransactionResponse,
	type TransactionReceipt
} from '@hashgraph/sdk';
import { env } from '$env/dynamic/private';

let client: Client | null = null;

/**
 * Initialize and return Hedera client
 * Singleton pattern to reuse connection
 */
export function initClient(): Client {
	if (client) return client;

	const network = env.HEDERA_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

	// Create client for selected network
	client = network === 'mainnet'
		? Client.forMainnet()
		: Client.forTestnet();

	// Set operator account (your SaaS backend account)
	if (env.HEDERA_ACCOUNT_ID && env.HEDERA_PRIVATE_KEY) {
		const myAccountId = AccountId.fromString(env.HEDERA_ACCOUNT_ID);
		const myPrivateKey = PrivateKey.fromStringED25519(env.HEDERA_PRIVATE_KEY);

		client.setOperator(myAccountId, myPrivateKey);
	} else {
		console.warn('Hedera credentials not configured. Using demo mode.');
	}

	return client;
}

/**
 * Execute transaction and wait for receipt
 * Handles error checking and provides detailed feedback
 */
export async function executeAndGetReceipt(
	tx: Transaction
): Promise<{ receipt: TransactionReceipt; transactionId: string }> {
	const client = initClient();

	// Execute transaction
	const txResponse: TransactionResponse = await tx.execute(client);
	const transactionId = txResponse.transactionId.toString();

	// Wait for consensus and get receipt
	const receipt = await new TransactionReceiptQuery()
		.setTransactionId(txResponse.transactionId)
		.execute(client);

	// Check status
	if (receipt.status.toString() !== 'SUCCESS') {
		throw new Error(
			`Hedera transaction failed: ${receipt.status.toString()} (TX: ${transactionId})`
		);
	}

	return { receipt, transactionId };
}

/**
 * Get current operator account ID
 */
export function getOperatorAccountId(): string {
	if (!env.HEDERA_ACCOUNT_ID) {
		throw new Error('HEDERA_ACCOUNT_ID not configured');
	}
	return env.HEDERA_ACCOUNT_ID;
}

/**
 * Close client connection (cleanup)
 */
export function closeClient(): void {
	if (client) {
		client.close();
		client = null;
	}
}

/**
 * Network configuration details
 */
export function getNetworkInfo() {
	return {
		network: env.HEDERA_NETWORK || 'testnet',
		operatorAccountId: env.HEDERA_ACCOUNT_ID || 'not-configured',
		mirrorNodeUrl: env.HEDERA_NETWORK === 'mainnet'
			? 'https://mainnet.mirrornode.hedera.com'
			: 'https://testnet.mirrornode.hedera.com',
		explorerUrl: env.HEDERA_NETWORK === 'mainnet'
			? 'https://hashscan.io/mainnet'
			: 'https://hashscan.io/testnet'
	};
}
