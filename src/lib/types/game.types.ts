/**
 * Deed Guru Gamification Types
 * "Play Games, House Families"
 */

// Player tiers - 3-tier engagement model
export type PlayerTier = 'novice' | 'intermediate' | 'professional';

// Game modes
export type GameMode =
	| 'sandbox'      // Free play, learning environment
	| 'academy'      // Competitive, skill-building
	| 'trading-floor'; // High-stakes professional mode

// Game activity types
export type ActivityType =
	| 'property-analysis'
	| 'market-research'
	| 'due-diligence'
	| 'negotiation'
	| 'syndication'
	| 'crisis-response'
	| 'tutorial';

// Token types
export interface TokenBalance {
	deed: number;     // $DEED - gaming utility token
	dguru: number;    // $DGURU - equity/governance token
}

// Player profile
export interface PlayerProfile {
	id: string;
	username: string;
	tier: PlayerTier;
	level: number;
	xp: number;
	xpToNextLevel: number;
	tokens: TokenBalance;

	// Stats
	propertiesAnalyzed: number;
	dealsCompleted: number;
	accuracyScore: number;      // 0-100
	streak: number;             // Consecutive correct analyses

	// Impact metrics
	familiesHoused: number;
	affordableUnitsCreated: number;
	communityScore: number;

	// Achievements
	badges: Badge[];
	titles: string[];
	currentTitle: string;

	// Timestamps
	joinedAt: Date;
	lastActiveAt: Date;
}

// Badge/Achievement
export interface Badge {
	id: string;
	name: string;
	description: string;
	icon: string;
	earnedAt: Date;
	rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// Game map marker for properties
export interface GameMarker {
	id: string;
	lng: number;
	lat: number;
	type: 'property' | 'market' | 'opportunity' | 'crisis' | 'tournament';
	name: string;
	difficulty: 'easy' | 'medium' | 'hard' | 'expert';
	reward: {
		deed: number;
		xp: number;
	};
	timeLimit?: number;  // seconds
	status: 'available' | 'locked' | 'completed' | 'in-progress';
	bloomScore?: number; // 1-64 for properties
}

// Tournament/Competition
export interface Tournament {
	id: string;
	name: string;
	description: string;
	mode: GameMode;
	startAt: Date;
	endAt: Date;
	entryFee: number;  // $DEED
	prizePool: number; // $DEED
	participants: number;
	maxParticipants: number;
	status: 'upcoming' | 'active' | 'completed';
}

// Leaderboard entry
export interface LeaderboardEntry {
	rank: number;
	playerId: string;
	username: string;
	tier: PlayerTier;
	score: number;
	change: 'up' | 'down' | 'same';
}

// Game session state
export interface GameSession {
	mode: GameMode;
	currentChallenge?: GameChallenge;
	score: number;
	timeRemaining?: number;
	streak: number;
}

// Challenge/Puzzle
export interface GameChallenge {
	id: string;
	type: ActivityType;
	title: string;
	description: string;
	difficulty: 'easy' | 'medium' | 'hard' | 'expert';
	propertyId?: string;
	marketId?: string;
	timeLimit: number;
	reward: {
		deed: number;
		xp: number;
		badge?: string;
	};
}

// Crisis scenario for Crisis Campaigns mode
export interface CrisisScenario {
	id: string;
	name: string;
	description: string;
	type: 'market-crash' | 'natural-disaster' | 'economic-downturn' | 'regulatory-change';
	severity: 1 | 2 | 3 | 4 | 5;
	affectedMarkets: string[];
	duration: number; // days
	objectives: string[];
}

// HUD display data
export interface GameHUD {
	player: PlayerProfile;
	session: GameSession | null;
	activeTournaments: Tournament[];
	dailyChallenge?: GameChallenge;
	notifications: GameNotification[];
}

// In-game notification
export interface GameNotification {
	id: string;
	type: 'achievement' | 'reward' | 'challenge' | 'tournament' | 'social';
	title: string;
	message: string;
	timestamp: Date;
	read: boolean;
}

// City Gateway - Entry point to a city's challenges
export type CityTier = 'starter' | 'intermediate' | 'advanced' | 'expert';

export interface CityGateway {
	id: string;
	name: string;
	country: string;
	region: 'americas' | 'europe' | 'middle-east' | 'asia-pacific';
	center: [number, number];
	tier: CityTier;
	unlockLevel: number;
	totalChallenges: number;
	completedChallenges: number;
	rewards: {
		deed: number;
		xp: number;
	};
	marketStats: {
		avgPrice: string;
		growth: string;
		properties: number;
	};
	status: 'available' | 'locked' | 'completed';
}

// Map viewport state
export interface MapViewport {
	center: [number, number];
	zoom: number;
	pitch: number;
	bearing: number;
}

// Filter state for map
export interface MapFilters {
	showProperties: boolean;
	showOpportunities: boolean;
	showCrises: boolean;
	showTournaments: boolean;
	difficulty: ('easy' | 'medium' | 'hard' | 'expert')[];
	minReward: number;
}
