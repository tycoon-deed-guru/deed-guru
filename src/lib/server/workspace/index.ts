/**
 * Workspace Management Utilities
 * Functions for managing workspace sessions, chat history, and documents
 */

import { db } from '../db/index';
import {
	workspaceSessions,
	chatHistory,
	documentUploads,
	dataSourceConnections,
	properties,
	type WorkspaceSession,
	type NewWorkspaceSession,
	type NewChatMessage,
	type NewDocumentUpload,
	type NewDataSourceConnection,
} from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';

// ============================================================================
// WORKSPACE SESSIONS
// ============================================================================

/**
 * Get or create workspace session for a property
 */
export async function getOrCreateWorkspaceSession(
	userId: string,
	propertyId: string
): Promise<WorkspaceSession> {
	// Check if session exists
	const existing = await db
		.select()
		.from(workspaceSessions)
		.where(
			and(
				eq(workspaceSessions.userId, userId),
				eq(workspaceSessions.propertyId, propertyId)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		return existing[0];
	}

	// Get property to set default assumptions
	const property = await db
		.select()
		.from(properties)
		.where(eq(properties.id, propertyId))
		.limit(1);

	// Create default assumptions
	const defaultAssumptions = {
		purchasePrice: 48500000,
		downPaymentPercent: 25,
		interestRate: 5.2,
		loanTerm: 30,
		rentGrowth: 5.0,
		expenseGrowth: 3.0,
		exitCapRate: 5.5,
		holdPeriod: 5,
	};

	// Create default sub-criteria values
	const defaultSubCriteria = {
		cashflow: {
			'noi-yield': 6.8,
			'cash-on-cash': 7.2,
			'occupancy-rate': 94,
			'expense-ratio': 38,
			'rent-collection': 97,
			'break-even-ratio': 72,
		},
		appreciation: {
			'market-price-growth': 6.5,
			'supply-pipeline': 0.7,
			'population-job-growth': 3.8,
			'forced-appreciation': 22,
			'rent-growth-trend': 5.5,
		},
		financing: {
			dscr: 1.52,
			ltv: 58,
			'interest-rate-spread': -0.2,
			'prepayment-flexibility': 7,
			'maturity-profile': 8,
		},
		location: {
			'walk-transit-score': 85,
			'economic-drivers': 8,
			'school-quality': 7,
			'crime-index': 65,
			'submarket-performance': 8,
			'zoning-upside': 6,
		},
		condition: {
			'effective-age': 8,
			'building-class': 7,
			'recent-capex': 12000,
			'deferred-maintenance': 4,
			'systems-condition': 15,
		},
		tenancy: {
			'tenant-credit': 75,
			walt: 5.2,
			'rollover-risk': 18,
			'rent-vs-market': 98,
			'tenant-diversity': 22,
		},
		liquidity: {
			'asset-class-liquidity': 8,
			'transaction-velocity': 7,
			'buyer-pool-depth': 8,
			'tokenized-secondary': 6,
			'hold-period-flexibility': 8,
		},
		compliance: {
			'title-survey': true,
			environmental: true,
			'zoning-permits': true,
			'insurance-coverage': true,
			'guardian-verification': 8,
		},
	};

	// Create new session
	const sessionData: NewWorkspaceSession = {
		id: `ws-${userId}-${propertyId}`,
		userId,
		propertyId,
		assumptions: defaultAssumptions,
		subCriteriaValues: defaultSubCriteria,
		selectedAnalysisType: 'petal',
		terminalOpen: true,
		terminalHeight: 250,
	};

	await db.insert(workspaceSessions).values(sessionData);

	const created = await db
		.select()
		.from(workspaceSessions)
		.where(eq(workspaceSessions.id, sessionData.id))
		.limit(1);

	return created[0];
}

/**
 * Update workspace session
 */
export async function updateWorkspaceSession(
	sessionId: string,
	updates: {
		assumptions?: any;
		subCriteriaValues?: any;
		selectedAnalysisType?: string;
		terminalOpen?: boolean;
		terminalHeight?: number;
	}
): Promise<void> {
	await db
		.update(workspaceSessions)
		.set({
			...updates,
			updatedAt: new Date(),
		})
		.where(eq(workspaceSessions.id, sessionId));
}

/**
 * Delete workspace session
 */
export async function deleteWorkspaceSession(sessionId: string): Promise<void> {
	await db.delete(workspaceSessions).where(eq(workspaceSessions.id, sessionId));
}

// ============================================================================
// CHAT HISTORY
// ============================================================================

/**
 * Add chat message to session
 */
export async function addChatMessage(
	sessionId: string,
	userId: string,
	role: 'user' | 'assistant',
	content: string,
	metadata?: any
): Promise<void> {
	const messageData: NewChatMessage = {
		id: `msg-${sessionId}-${Date.now()}`,
		sessionId,
		userId,
		role,
		content,
		metadata,
	};

	await db.insert(chatHistory).values(messageData);
}

/**
 * Get chat history for a session
 */
export async function getChatHistory(sessionId: string, limit: number = 50) {
	const messages = await db
		.select()
		.from(chatHistory)
		.where(eq(chatHistory.sessionId, sessionId))
		.orderBy(chatHistory.createdAt)
		.limit(limit);

	return messages;
}

/**
 * Clear chat history for a session
 */
export async function clearChatHistory(sessionId: string): Promise<void> {
	await db.delete(chatHistory).where(eq(chatHistory.sessionId, sessionId));
}

// ============================================================================
// DOCUMENT UPLOADS
// ============================================================================

/**
 * Create document upload record
 */
export async function createDocumentUpload(
	userId: string,
	propertyId: string | null,
	file: {
		filename: string;
		fileSize: number;
		fileType: string;
		mimeType: string;
		storageUrl: string;
		storageBucket: string;
		storagePath: string;
	}
): Promise<string> {
	const uploadData: NewDocumentUpload = {
		id: `doc-${userId}-${Date.now()}`,
		userId,
		propertyId,
		...file,
		status: 'uploaded',
	};

	await db.insert(documentUploads).values(uploadData);
	return uploadData.id;
}

/**
 * Get documents for a property
 */
export async function getPropertyDocuments(propertyId: string) {
	const documents = await db
		.select()
		.from(documentUploads)
		.where(eq(documentUploads.propertyId, propertyId))
		.orderBy(desc(documentUploads.uploadedAt));

	return documents;
}

/**
 * Get documents for a user
 */
export async function getUserDocuments(userId: string, limit: number = 20) {
	const documents = await db
		.select()
		.from(documentUploads)
		.where(eq(documentUploads.userId, userId))
		.orderBy(desc(documentUploads.uploadedAt))
		.limit(limit);

	return documents;
}

/**
 * Update document processing status
 */
export async function updateDocumentStatus(
	documentId: string,
	status: 'uploaded' | 'processing' | 'processed' | 'failed',
	extractedData?: any
): Promise<void> {
	const updates: any = {
		status,
	};

	if (status === 'processed') {
		updates.processedAt = new Date();
	}

	if (extractedData) {
		updates.extractedData = extractedData;
	}

	await db.update(documentUploads).set(updates).where(eq(documentUploads.id, documentId));
}

/**
 * Delete document
 */
export async function deleteDocument(documentId: string): Promise<void> {
	await db.delete(documentUploads).where(eq(documentUploads.id, documentId));
}

// ============================================================================
// DATA SOURCE CONNECTIONS
// ============================================================================

/**
 * Create data source connection
 */
export async function createDataSourceConnection(
	userId: string,
	sourceType: string,
	sourceName: string,
	credentials?: any
): Promise<string> {
	const connectionData: NewDataSourceConnection = {
		id: `ds-${userId}-${sourceType}-${Date.now()}`,
		userId,
		sourceType,
		sourceName,
		status: 'connected',
		credentials: credentials ? JSON.stringify(credentials) : null,
	};

	await db.insert(dataSourceConnections).values(connectionData);
	return connectionData.id;
}

/**
 * Get data source connections for a user
 */
export async function getDataSourceConnections(userId: string) {
	const connections = await db
		.select()
		.from(dataSourceConnections)
		.where(eq(dataSourceConnections.userId, userId))
		.orderBy(desc(dataSourceConnections.connectedAt));

	return connections;
}

/**
 * Update data source sync status
 */
export async function updateDataSourceSync(
	connectionId: string,
	syncStats?: any
): Promise<void> {
	await db
		.update(dataSourceConnections)
		.set({
			lastSyncAt: new Date(),
			syncStats,
			updatedAt: new Date(),
		})
		.where(eq(dataSourceConnections.id, connectionId));
}

/**
 * Update data source status
 */
export async function updateDataSourceStatus(
	connectionId: string,
	status: 'connected' | 'disconnected' | 'error'
): Promise<void> {
	await db
		.update(dataSourceConnections)
		.set({
			status,
			updatedAt: new Date(),
		})
		.where(eq(dataSourceConnections.id, connectionId));
}

/**
 * Delete data source connection
 */
export async function deleteDataSourceConnection(connectionId: string): Promise<void> {
	await db.delete(dataSourceConnections).where(eq(dataSourceConnections.id, connectionId));
}
