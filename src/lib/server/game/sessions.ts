/**
 * Game Session Management Utilities
 * Functions for managing active game sessions
 */

import { db } from '../db/index';
import {
	gameSessions,
	gameNotifications,
	type GameSession,
	type NewGameSession,
	type NewGameNotification,
} from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Start a new game session
 */
export async function startGameSession(
	playerId: string,
	mode: 'sandbox' | 'academy' | 'trading-floor',
	options: {
		timeLimit?: number;
		challengeId?: string;
	} = {}
): Promise<GameSession> {
	const sessionData: NewGameSession = {
		id: `session-${playerId}-${Date.now()}`,
		playerId,
		mode,
		currentChallengeId: options.challengeId || null,
		score: 0,
		streak: 0,
		timeRemaining: options.timeLimit,
		status: 'active',
		startedAt: new Date(),
	};

	await db.insert(gameSessions).values(sessionData);

	const result = await db
		.select()
		.from(gameSessions)
		.where(eq(gameSessions.id, sessionData.id))
		.limit(1);

	return result[0];
}

/**
 * Get active game session for a player
 */
export async function getActiveSession(playerId: string): Promise<GameSession | null> {
	const result = await db
		.select()
		.from(gameSessions)
		.where(and(eq(gameSessions.playerId, playerId), eq(gameSessions.status, 'active')))
		.orderBy(desc(gameSessions.startedAt))
		.limit(1);

	return result.length > 0 ? result[0] : null;
}

/**
 * Update game session
 */
export async function updateGameSession(
	sessionId: string,
	updates: {
		score?: number;
		streak?: number;
		timeRemaining?: number;
		currentChallengeId?: string | null;
		status?: 'active' | 'paused' | 'completed' | 'abandoned';
	}
): Promise<void> {
	const updateData: any = { ...updates, updatedAt: new Date() };

	if (updates.status && ['completed', 'abandoned'].includes(updates.status)) {
		updateData.endedAt = new Date();
	}

	await db.update(gameSessions).set(updateData).where(eq(gameSessions.id, sessionId));
}

/**
 * End a game session
 */
export async function endGameSession(
	sessionId: string,
	status: 'completed' | 'abandoned' = 'completed'
): Promise<void> {
	await db
		.update(gameSessions)
		.set({
			status,
			endedAt: new Date(),
			updatedAt: new Date(),
		})
		.where(eq(gameSessions.id, sessionId));
}

/**
 * Get session history for a player
 */
export async function getSessionHistory(playerId: string, limit: number = 20): Promise<GameSession[]> {
	const sessions = await db
		.select()
		.from(gameSessions)
		.where(eq(gameSessions.playerId, playerId))
		.orderBy(desc(gameSessions.startedAt))
		.limit(limit);

	return sessions;
}

/**
 * Get session statistics for a player
 */
export async function getSessionStats(playerId: string) {
	const sessions = await db
		.select()
		.from(gameSessions)
		.where(eq(gameSessions.playerId, playerId));

	const totalSessions = sessions.length;
	const completedSessions = sessions.filter((s) => s.status === 'completed').length;
	const averageScore = sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length : 0;
	const highestScore = sessions.length > 0 ? Math.max(...sessions.map((s) => s.score)) : 0;
	const highestStreak = sessions.length > 0 ? Math.max(...sessions.map((s) => s.streak)) : 0;

	// Stats by mode
	const modeStats = {
		sandbox: {
			sessions: sessions.filter((s) => s.mode === 'sandbox').length,
			avgScore:
				sessions.filter((s) => s.mode === 'sandbox').reduce((sum, s) => sum + s.score, 0) /
					sessions.filter((s) => s.mode === 'sandbox').length || 0,
		},
		academy: {
			sessions: sessions.filter((s) => s.mode === 'academy').length,
			avgScore:
				sessions.filter((s) => s.mode === 'academy').reduce((sum, s) => sum + s.score, 0) /
					sessions.filter((s) => s.mode === 'academy').length || 0,
		},
		'trading-floor': {
			sessions: sessions.filter((s) => s.mode === 'trading-floor').length,
			avgScore:
				sessions.filter((s) => s.mode === 'trading-floor').reduce((sum, s) => sum + s.score, 0) /
					sessions.filter((s) => s.mode === 'trading-floor').length || 0,
		},
	};

	return {
		totalSessions,
		completedSessions,
		averageScore: Math.round(averageScore),
		highestScore,
		highestStreak,
		modeStats,
	};
}

/**
 * Create a game notification
 */
export async function createNotification(
	playerId: string,
	type: 'achievement' | 'reward' | 'challenge' | 'tournament' | 'social',
	title: string,
	message: string,
	options: {
		referenceType?: 'badge' | 'tournament' | 'challenge';
		referenceId?: string;
	} = {}
): Promise<void> {
	const notificationData: NewGameNotification = {
		id: `notif-${playerId}-${Date.now()}`,
		playerId,
		type,
		title,
		message,
		referenceType: options.referenceType || null,
		referenceId: options.referenceId || null,
		read: false,
		createdAt: new Date(),
	};

	await db.insert(gameNotifications).values(notificationData);
}

/**
 * Get player notifications
 */
export async function getPlayerNotifications(
	playerId: string,
	options: {
		unreadOnly?: boolean;
		limit?: number;
	} = {}
) {
	let query = db.select().from(gameNotifications).where(eq(gameNotifications.playerId, playerId));

	if (options.unreadOnly) {
		query = query.where(eq(gameNotifications.read, false));
	}

	const notifications = await query
		.orderBy(desc(gameNotifications.createdAt))
		.limit(options.limit || 50);

	return notifications;
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
	await db.update(gameNotifications).set({ read: true }).where(eq(gameNotifications.id, notificationId));
}

/**
 * Mark all notifications as read for a player
 */
export async function markAllNotificationsRead(playerId: string): Promise<void> {
	await db
		.update(gameNotifications)
		.set({ read: true })
		.where(and(eq(gameNotifications.playerId, playerId), eq(gameNotifications.read, false)));
}

/**
 * Delete old notifications (cleanup utility)
 */
export async function deleteOldNotifications(daysOld: number = 30): Promise<number> {
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - daysOld);

	const result = await db
		.delete(gameNotifications)
		.where(and(eq(gameNotifications.read, true), lte(gameNotifications.createdAt, cutoffDate)));

	return result.rowCount || 0;
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(playerId: string): Promise<number> {
	const notifications = await db
		.select()
		.from(gameNotifications)
		.where(and(eq(gameNotifications.playerId, playerId), eq(gameNotifications.read, false)));

	return notifications.length;
}
