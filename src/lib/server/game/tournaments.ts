/**
 * Tournament Management Utilities
 * Functions for managing tournaments and competitions
 */

import { db } from '../db/index';
import {
	tournaments,
	tournamentParticipants,
	gameSessions,
	type Tournament,
	type NewTournamentParticipant,
} from '../db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

/**
 * Get active tournaments
 */
export async function getActiveTournaments(): Promise<Tournament[]> {
	const now = new Date();

	const activeTournaments = await db
		.select()
		.from(tournaments)
		.where(and(eq(tournaments.status, 'active'), lte(tournaments.startAt, now), gte(tournaments.endAt, now)))
		.orderBy(tournaments.endAt);

	return activeTournaments;
}

/**
 * Get upcoming tournaments
 */
export async function getUpcomingTournaments(): Promise<Tournament[]> {
	const now = new Date();

	const upcomingTournaments = await db
		.select()
		.from(tournaments)
		.where(and(eq(tournaments.status, 'upcoming'), gte(tournaments.startAt, now)))
		.orderBy(tournaments.startAt);

	return upcomingTournaments;
}

/**
 * Get tournament by ID
 */
export async function getTournament(tournamentId: string): Promise<Tournament | null> {
	const result = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId)).limit(1);

	return result.length > 0 ? result[0] : null;
}

/**
 * Join a tournament
 */
export async function joinTournament(
	tournamentId: string,
	playerId: string
): Promise<{ success: boolean; error?: string }> {
	const tournament = await getTournament(tournamentId);

	if (!tournament) {
		return { success: false, error: 'Tournament not found' };
	}

	// Check if tournament is active
	if (tournament.status !== 'active') {
		return { success: false, error: 'Tournament is not active' };
	}

	// Check if tournament is full
	if (tournament.maxParticipants && tournament.participantCount >= tournament.maxParticipants) {
		return { success: false, error: 'Tournament is full' };
	}

	// Check if already joined
	const existing = await db
		.select()
		.from(tournamentParticipants)
		.where(
			and(
				eq(tournamentParticipants.tournamentId, tournamentId),
				eq(tournamentParticipants.playerId, playerId)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		return { success: false, error: 'Already joined this tournament' };
	}

	// Create participant entry
	const participantData: NewTournamentParticipant = {
		id: `tp-${tournamentId}-${playerId}`,
		tournamentId,
		playerId,
		score: 0,
		rank: null,
		prizesWon: 0,
		joinedAt: new Date(),
	};

	await db.insert(tournamentParticipants).values(participantData);

	// Update participant count
	await db
		.update(tournaments)
		.set({
			participantCount: tournament.participantCount + 1,
		})
		.where(eq(tournaments.id, tournamentId));

	return { success: true };
}

/**
 * Get tournament leaderboard
 */
export async function getTournamentLeaderboard(tournamentId: string, limit: number = 100) {
	const leaderboard = await db
		.select()
		.from(tournamentParticipants)
		.where(eq(tournamentParticipants.tournamentId, tournamentId))
		.orderBy(desc(tournamentParticipants.score))
		.limit(limit);

	return leaderboard;
}

/**
 * Update tournament participant score
 */
export async function updateTournamentScore(
	tournamentId: string,
	playerId: string,
	score: number
): Promise<void> {
	await db
		.update(tournamentParticipants)
		.set({
			score,
		})
		.where(
			and(
				eq(tournamentParticipants.tournamentId, tournamentId),
				eq(tournamentParticipants.playerId, playerId)
			)
		);

	// Recalculate rankings
	await recalculateTournamentRankings(tournamentId);
}

/**
 * Recalculate tournament rankings
 */
async function recalculateTournamentRankings(tournamentId: string): Promise<void> {
	// Get all participants sorted by score
	const participants = await db
		.select()
		.from(tournamentParticipants)
		.where(eq(tournamentParticipants.tournamentId, tournamentId))
		.orderBy(desc(tournamentParticipants.score));

	// Update ranks
	for (let i = 0; i < participants.length; i++) {
		await db
			.update(tournamentParticipants)
			.set({
				rank: i + 1,
			})
			.where(eq(tournamentParticipants.id, participants[i].id));
	}
}

/**
 * Complete a tournament and distribute prizes
 */
export async function completeTournament(tournamentId: string): Promise<void> {
	const tournament = await getTournament(tournamentId);
	if (!tournament) throw new Error('Tournament not found');

	// Mark tournament as completed
	await db
		.update(tournaments)
		.set({
			status: 'completed',
		})
		.where(eq(tournaments.id, tournamentId));

	// Get final leaderboard
	const leaderboard = await getTournamentLeaderboard(tournamentId);

	// Distribute prizes (simple distribution: top 10% get prizes)
	const prizeCount = Math.max(1, Math.floor(leaderboard.length * 0.1));
	const prizePerWinner = Math.floor(tournament.prizePool / prizeCount);

	for (let i = 0; i < Math.min(prizeCount, leaderboard.length); i++) {
		await db
			.update(tournamentParticipants)
			.set({
				prizesWon: prizePerWinner,
				completedAt: new Date(),
			})
			.where(eq(tournamentParticipants.id, leaderboard[i].id));

		// TODO: Add prizes to player's token balance
		// await addPlayerTokens(leaderboard[i].playerId, prizePerWinner, 0);
	}
}

/**
 * Get player's tournament history
 */
export async function getPlayerTournaments(playerId: string) {
	const playerTournaments = await db
		.select({
			tournament: tournaments,
			participation: tournamentParticipants,
		})
		.from(tournamentParticipants)
		.innerJoin(tournaments, eq(tournamentParticipants.tournamentId, tournaments.id))
		.where(eq(tournamentParticipants.playerId, playerId))
		.orderBy(desc(tournaments.startAt));

	return playerTournaments;
}

/**
 * Check if player is in a tournament
 */
export async function isPlayerInTournament(tournamentId: string, playerId: string): Promise<boolean> {
	const result = await db
		.select()
		.from(tournamentParticipants)
		.where(
			and(
				eq(tournamentParticipants.tournamentId, tournamentId),
				eq(tournamentParticipants.playerId, playerId)
			)
		)
		.limit(1);

	return result.length > 0;
}
