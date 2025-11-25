/**
 * Player Management Utilities
 * Functions for managing player profiles, progress, and stats
 */

import { db } from '../db/index';
import {
	players,
	playerCityProgress,
	playerBadges,
	badges,
	cityGateways,
	type Player,
	type NewPlayer,
	type PlayerCityProgress,
	type NewPlayerCityProgress,
} from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Get or create player profile for a user
 */
export async function getOrCreatePlayer(userId: string, username?: string): Promise<Player> {
	// Check if player exists
	const existingPlayers = await db
		.select()
		.from(players)
		.where(eq(players.userId, userId))
		.limit(1);

	if (existingPlayers.length > 0) {
		return existingPlayers[0];
	}

	// Create new player
	const playerId = `player-${userId}`;
	const newPlayer: NewPlayer = {
		id: playerId,
		userId,
		username: username || `Player_${userId.slice(0, 8)}`,
		tier: 'novice',
		level: 1,
		xp: 0,
		xpToNextLevel: 1000,
		deedTokens: 0,
		dguruTokens: 0,
		propertiesAnalyzed: 0,
		dealsCompleted: 0,
		accuracyScore: 0,
		streak: 0,
		familiesHoused: 0,
		affordableUnitsCreated: 0,
		communityScore: 0,
		currentTitle: null,
		unlockedTitles: [],
	};

	await db.insert(players).values(newPlayer);

	// Unlock starter cities
	await unlockStarterCities(playerId);

	// Return newly created player
	const createdPlayers = await db
		.select()
		.from(players)
		.where(eq(players.id, playerId))
		.limit(1);

	return createdPlayers[0];
}

/**
 * Get player by ID
 */
export async function getPlayer(playerId: string): Promise<Player | null> {
	const result = await db.select().from(players).where(eq(players.id, playerId)).limit(1);
	return result.length > 0 ? result[0] : null;
}

/**
 * Get player by user ID
 */
export async function getPlayerByUserId(userId: string): Promise<Player | null> {
	const result = await db.select().from(players).where(eq(players.userId, userId)).limit(1);
	return result.length > 0 ? result[0] : null;
}

/**
 * Unlock starter cities for a new player
 */
async function unlockStarterCities(playerId: string): Promise<void> {
	// Get starter tier cities
	const starterCities = await db
		.select()
		.from(cityGateways)
		.where(eq(cityGateways.tier, 'starter'));

	// Create progress entries for each starter city
	for (const city of starterCities) {
		const progressData: NewPlayerCityProgress = {
			id: `progress-${playerId}-${city.id}`,
			playerId,
			cityId: city.id,
			completedChallenges: 0,
			status: 'available',
			unlockedAt: new Date(),
		};

		await db.insert(playerCityProgress).values(progressData).onConflictDoNothing();
	}
}

/**
 * Get cities with player progress
 */
export async function getCitiesWithProgress(playerId: string) {
	const cities = await db
		.select({
			city: cityGateways,
			progress: playerCityProgress,
		})
		.from(cityGateways)
		.leftJoin(
			playerCityProgress,
			and(
				eq(playerCityProgress.cityId, cityGateways.id),
				eq(playerCityProgress.playerId, playerId)
			)
		)
		.orderBy(cityGateways.unlockLevel);

	return cities.map((row) => ({
		...row.city,
		completedChallenges: row.progress?.completedChallenges || 0,
		status: row.progress?.status || 'locked',
	}));
}

/**
 * Update player XP and check for level up
 */
export async function addPlayerXP(
	playerId: string,
	xpToAdd: number
): Promise<{ leveled: boolean; newLevel?: number; unlockedCities?: string[] }> {
	const player = await getPlayer(playerId);
	if (!player) throw new Error('Player not found');

	let newXP = player.xp + xpToAdd;
	let newLevel = player.level;
	let leveled = false;
	const unlockedCities: string[] = [];

	// Check for level ups
	while (newXP >= player.xpToNextLevel) {
		newXP -= player.xpToNextLevel;
		newLevel++;
		leveled = true;
	}

	// Calculate XP to next level (increases with each level)
	const xpToNextLevel = calculateXPForNextLevel(newLevel);

	// Update player
	await db
		.update(players)
		.set({
			xp: newXP,
			level: newLevel,
			xpToNextLevel,
			lastActiveAt: new Date(),
		})
		.where(eq(players.id, playerId));

	// If leveled up, check for newly unlocked cities
	if (leveled) {
		const newlyUnlocked = await unlockCitiesByLevel(playerId, newLevel);
		unlockedCities.push(...newlyUnlocked);

		// Update tier based on level
		const newTier = calculatePlayerTier(newLevel);
		if (newTier !== player.tier) {
			await db.update(players).set({ tier: newTier }).where(eq(players.id, playerId));
		}
	}

	return { leveled, newLevel: leveled ? newLevel : undefined, unlockedCities };
}

/**
 * Calculate XP required for next level
 */
function calculateXPForNextLevel(currentLevel: number): number {
	// Exponential scaling: 1000 * (1.15 ^ level)
	return Math.floor(1000 * Math.pow(1.15, currentLevel));
}

/**
 * Calculate player tier based on level
 */
function calculatePlayerTier(level: number): 'novice' | 'intermediate' | 'professional' {
	if (level >= 15) return 'professional';
	if (level >= 8) return 'intermediate';
	return 'novice';
}

/**
 * Unlock cities based on player level
 */
async function unlockCitiesByLevel(playerId: string, level: number): Promise<string[]> {
	// Get cities that should be unlocked at this level
	const citiesToUnlock = await db
		.select()
		.from(cityGateways)
		.where(eq(cityGateways.unlockLevel, level));

	const unlockedCityIds: string[] = [];

	for (const city of citiesToUnlock) {
		// Check if already unlocked
		const existing = await db
			.select()
			.from(playerCityProgress)
			.where(
				and(
					eq(playerCityProgress.playerId, playerId),
					eq(playerCityProgress.cityId, city.id)
				)
			)
			.limit(1);

		if (existing.length === 0) {
			// Unlock the city
			const progressData: NewPlayerCityProgress = {
				id: `progress-${playerId}-${city.id}`,
				playerId,
				cityId: city.id,
				completedChallenges: 0,
				status: 'available',
				unlockedAt: new Date(),
			};

			await db.insert(playerCityProgress).values(progressData);
			unlockedCityIds.push(city.id);
		}
	}

	return unlockedCityIds;
}

/**
 * Add tokens to player balance
 */
export async function addPlayerTokens(
	playerId: string,
	deedTokens: number = 0,
	dguruTokens: number = 0
): Promise<void> {
	const player = await getPlayer(playerId);
	if (!player) throw new Error('Player not found');

	await db
		.update(players)
		.set({
			deedTokens: player.deedTokens + deedTokens,
			dguruTokens: player.dguruTokens + dguruTokens,
			lastActiveAt: new Date(),
		})
		.where(eq(players.id, playerId));
}

/**
 * Update player stats after property analysis
 */
export async function recordPropertyAnalysis(
	playerId: string,
	options: {
		correct?: boolean;
		bloomScore?: number;
		familiesHoused?: number;
		affordableUnits?: number;
	} = {}
): Promise<void> {
	const player = await getPlayer(playerId);
	if (!player) throw new Error('Player not found');

	const updates: Partial<Player> = {
		propertiesAnalyzed: player.propertiesAnalyzed + 1,
		lastActiveAt: new Date(),
	};

	// Update streak
	if (options.correct !== undefined) {
		updates.streak = options.correct ? player.streak + 1 : 0;
	}

	// Update accuracy score (running average)
	if (options.correct !== undefined) {
		const totalAnalyses = player.propertiesAnalyzed + 1;
		const currentAccuracySum = player.accuracyScore * player.propertiesAnalyzed;
		const newAccuracyScore = options.correct ? 100 : 0;
		updates.accuracyScore = Math.round((currentAccuracySum + newAccuracyScore) / totalAnalyses);
	}

	// Update impact metrics
	if (options.familiesHoused) {
		updates.familiesHoused = player.familiesHoused + options.familiesHoused;
	}
	if (options.affordableUnits) {
		updates.affordableUnitsCreated = player.affordableUnitsCreated + options.affordableUnits;
	}

	// Update community score (derived from impact metrics)
	if (options.familiesHoused || options.affordableUnits) {
		updates.communityScore =
			(updates.familiesHoused || player.familiesHoused) * 10 +
			(updates.affordableUnitsCreated || player.affordableUnitsCreated) * 5;
	}

	await db.update(players).set(updates).where(eq(players.id, playerId));
}

/**
 * Record deal completion
 */
export async function recordDealCompletion(playerId: string): Promise<void> {
	const player = await getPlayer(playerId);
	if (!player) throw new Error('Player not found');

	await db
		.update(players)
		.set({
			dealsCompleted: player.dealsCompleted + 1,
			lastActiveAt: new Date(),
		})
		.where(eq(players.id, playerId));
}

/**
 * Get player badges with details
 */
export async function getPlayerBadges(playerId: string) {
	const result = await db
		.select({
			badge: badges,
			earnedAt: playerBadges.earnedAt,
		})
		.from(playerBadges)
		.innerJoin(badges, eq(playerBadges.badgeId, badges.id))
		.where(eq(playerBadges.playerId, playerId))
		.orderBy(desc(playerBadges.earnedAt));

	return result;
}

/**
 * Check and award eligible badges
 */
export async function checkAndAwardBadges(playerId: string): Promise<string[]> {
	const player = await getPlayer(playerId);
	if (!player) throw new Error('Player not found');

	// Get all active badges
	const allBadges = await db.select().from(badges).where(eq(badges.isActive, true));

	// Get player's existing badges
	const existingBadges = await db
		.select()
		.from(playerBadges)
		.where(eq(playerBadges.playerId, playerId));

	const existingBadgeIds = new Set(existingBadges.map((pb) => pb.badgeId));
	const newlyAwardedBadges: string[] = [];

	// Check each badge
	for (const badge of allBadges) {
		// Skip if already earned
		if (existingBadgeIds.has(badge.id)) continue;

		// Check if player meets requirements
		let eligible = false;
		switch (badge.requirementType) {
			case 'level':
				eligible = player.level >= (badge.requirementValue || 0);
				break;
			case 'properties':
				eligible = player.propertiesAnalyzed >= (badge.requirementValue || 0);
				break;
			case 'deals':
				eligible = player.dealsCompleted >= (badge.requirementValue || 0);
				break;
			case 'streak':
				eligible = player.streak >= (badge.requirementValue || 0);
				break;
			case 'accuracy':
				eligible = player.accuracyScore >= (badge.requirementValue || 0);
				break;
		}

		// Award badge if eligible
		if (eligible) {
			await db.insert(playerBadges).values({
				id: `pb-${playerId}-${badge.id}`,
				playerId,
				badgeId: badge.id,
				earnedAt: new Date(),
			});
			newlyAwardedBadges.push(badge.id);
		}
	}

	return newlyAwardedBadges;
}

/**
 * Update city progress
 */
export async function updateCityProgress(
	playerId: string,
	cityId: string,
	challengesCompleted: number
): Promise<void> {
	// Get city to check total challenges
	const cities = await db.select().from(cityGateways).where(eq(cityGateways.id, cityId)).limit(1);

	if (cities.length === 0) throw new Error('City not found');

	const city = cities[0];
	const isComplete = challengesCompleted >= city.totalChallenges;

	await db
		.update(playerCityProgress)
		.set({
			completedChallenges: challengesCompleted,
			status: isComplete ? 'completed' : 'in-progress',
			completedAt: isComplete ? new Date() : undefined,
			updatedAt: new Date(),
		})
		.where(
			and(eq(playerCityProgress.playerId, playerId), eq(playerCityProgress.cityId, cityId))
		);
}

/**
 * Get player leaderboard ranking
 */
export async function getPlayerRanking(
	playerId: string,
	category: 'overall' | 'accuracy' | 'properties' | 'deals' = 'overall'
): Promise<{ rank: number; totalPlayers: number } | null> {
	const player = await getPlayer(playerId);
	if (!player) return null;

	// Determine sort field based on category
	let sortField: keyof Player;
	switch (category) {
		case 'accuracy':
			sortField = 'accuracyScore';
			break;
		case 'properties':
			sortField = 'propertiesAnalyzed';
			break;
		case 'deals':
			sortField = 'dealsCompleted';
			break;
		case 'overall':
		default:
			sortField = 'level';
			break;
	}

	// Get all players sorted by the category
	const allPlayers = await db.select().from(players).orderBy(desc(players[sortField]));

	// Find player's rank
	const rank = allPlayers.findIndex((p) => p.id === playerId) + 1;

	return {
		rank,
		totalPlayers: allPlayers.length,
	};
}
