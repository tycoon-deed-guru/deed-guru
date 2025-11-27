import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { properties } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import {
	getOrCreateWorkspaceSession,
	getChatHistory,
	getPropertyDocuments,
	getDataSourceConnections,
} from '$lib/server/workspace';

export const load: PageServerLoad = async ({ locals, url }) => {
	// Get authenticated user
	const session = locals.session;
	if (!session?.user) {
		throw redirect(303, '/login');
	}

	const userId = session.user.id;

	// Get property ID from query params (default to first property)
	const propertyId = url.searchParams.get('property') || 'prop-austin-tech-towers';

	// Load property data
	const propertyData = await db
		.select()
		.from(properties)
		.where(eq(properties.id, propertyId))
		.limit(1);

	if (propertyData.length === 0) {
		throw redirect(303, '/dashboard');
	}

	const property = propertyData[0];

	// Get or create workspace session
	const workspaceSession = await getOrCreateWorkspaceSession(userId, propertyId);

	// Load chat history
	const chatMessages = await getChatHistory(workspaceSession.id);

	// Load uploaded documents
	const documents = await getPropertyDocuments(propertyId);

	// Load data source connections
	const dataSources = await getDataSourceConnections(userId);

	// Get all user properties for selector
	const allProperties = await db
		.select({
			id: properties.id,
			name: properties.name,
			address: properties.address,
			totalScore: properties.totalScore,
			grade: properties.grade,
		})
		.from(properties)
		.where(eq(properties.userId, userId));

	return {
		property,
		workspaceSession,
		chatMessages: chatMessages.map((msg) => ({
			role: msg.role as 'user' | 'assistant',
			content: msg.content,
			createdAt: msg.createdAt,
		})),
		documents: documents.map((doc) => ({
			id: doc.id,
			name: doc.filename,
			size: formatFileSize(doc.fileSize),
			date: doc.uploadedAt ? formatDate(doc.uploadedAt) : 'Unknown',
			status: doc.status,
		})),
		dataSources: dataSources.map((ds) => ({
			id: ds.id,
			name: ds.sourceName,
			type: ds.sourceType,
			status: ds.status,
			lastSync: ds.lastSyncAt ? formatTimeAgo(ds.lastSyncAt) : 'Never',
			stats: ds.syncStats,
		})),
		allProperties: allProperties.map((p) => ({
			id: p.id,
			name: p.name,
			address: p.address,
			score: p.totalScore,
			grade: p.grade,
		})),
	};
};

// Helper functions
function formatFileSize(bytes: number): string {
	if (bytes >= 1000000) {
		return `${(bytes / 1000000).toFixed(1)} MB`;
	}
	return `${(bytes / 1000).toFixed(0)} KB`;
}

function formatDate(date: Date): string {
	const now = new Date();
	const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 7) return `${diffDays} days ago`;

	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTimeAgo(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 1) return 'just now';
	if (diffMins === 1) return '1m ago';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours === 1) return '1h ago';
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays === 1) return '1d ago';
	return `${diffDays}d ago`;
}
