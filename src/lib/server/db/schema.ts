import { pgTable, text, timestamp, jsonb, integer, boolean, numeric, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - integrates with Supabase Auth
export const users = pgTable('users', {
	id: text('id').primaryKey(), // Supabase Auth UUID
	email: text('email').unique().notNull(),
	stripeCustomerId: text('stripe_customer_id'),
	subscriptionTier: text('subscription_tier').default('free'), // free | pro | syndicate
	subscriptionStatus: text('subscription_status').default('inactive'), // active | inactive | canceled
	hederaAccountId: text('hedera_account_id'), // Hedera wallet address
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Properties/Deals table
export const properties = pgTable('properties', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	// Basic Info
	name: text('name').notNull(),
	address: text('address'),
	units: integer('units'),

	// Raw extracted data from AI (all 40 sub-criteria)
	rawData: jsonb('raw_data'), // Full JSON from AI extraction

	// 8-Petal Bloom Scoring System
	scores: jsonb('scores').notNull(), // Array of 8 petal scores [0-8, 0-8, ...] in PETAL_ORDER
	totalScore: integer('total_score').notNull(), // Sum of all petal scores (0-64)
	grade: text('grade').notNull(), // Letter grade: A+, A, B+, B, C, F

	// Metadata
	documentType: text('document_type'), // 'om' | 'rent_roll' | 'manual'
	archived: boolean('archived').default(false),
	uploadedAt: timestamp('uploaded_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Syndications table - tokenized deals on Hedera
export const syndications = pgTable('syndications', {
	id: text('id').primaryKey(),
	propertyId: text('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
	creatorUserId: text('creator_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	// Hedera Token Details
	hederaTokenId: text('hedera_token_id').notNull().unique(), // e.g., "0.0.123456"
	tokenName: text('token_name').notNull(),
	tokenSymbol: text('token_symbol').notNull(),
	totalTokens: integer('total_tokens').notNull(), // Total supply
	decimals: integer('decimals').default(6),

	// Syndication Terms
	totalRaiseUSD: numeric('total_raise_usd', { precision: 15, scale: 2 }).notNull(),
	minInvestmentUSD: numeric('min_investment_usd', { precision: 15, scale: 2 }).notNull(),
	maxInvestmentUSD: numeric('max_investment_usd', { precision: 15, scale: 2 }),
	targetCloseDate: timestamp('target_close_date'),

	// Status
	status: text('status').default('draft'), // draft | active | funded | closed | cancelled
	amountRaisedUSD: numeric('amount_raised_usd', { precision: 15, scale: 2 }).default('0'),
	investorCount: integer('investor_count').default(0),

	// Legal & Compliance
	regulationType: text('regulation_type'), // reg_d | reg_a | reg_s
	accreditedOnly: boolean('accredited_only').default(true),
	documentUrl: text('document_url'), // PPM, operating agreement, etc.

	// Metadata
	explorerUrl: text('explorer_url'), // Hedera HashScan link
	supplyKeyEncrypted: text('supply_key_encrypted'), // Encrypted private key for minting
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Investments table - tracks who invested in what
export const investments = pgTable('investments', {
	id: text('id').primaryKey(),
	syndicationId: text('syndication_id').references(() => syndications.id, { onDelete: 'cascade' }).notNull(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	// Investment Details
	amountUSD: numeric('amount_usd', { precision: 15, scale: 2 }).notNull(),
	tokenAmount: integer('token_amount').notNull(), // Number of tokens purchased
	ownershipPercentage: numeric('ownership_percentage', { precision: 5, scale: 3 }), // e.g., 2.500%

	// Hedera Transaction
	hederaTransactionId: text('hedera_transaction_id'), // TX hash on Hedera
	investorHederaAccount: text('investor_hedera_account').notNull(),

	// Status
	status: text('status').default('pending'), // pending | completed | failed | refunded
	paymentMethod: text('payment_method'), // crypto | fiat | wire

	// Compliance
	accreditationVerified: boolean('accreditation_verified').default(false),
	kycCompleted: boolean('kyc_completed').default(false),

	// Metadata
	investedAt: timestamp('invested_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Deals table - extended properties with pipeline stage management
export const deals = pgTable('deals', {
	id: text('id').primaryKey(),
	propertyId: text('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	// Deal Pipeline Stage
	stage: text('stage').default('sourced'), // sourced | analyzing | underwriting | loi | due_diligence | ready_to_close | closed | passed

	// Financial Details
	askingPrice: numeric('asking_price', { precision: 15, scale: 2 }),
	pricePerUnit: numeric('price_per_unit', { precision: 12, scale: 2 }),
	capRate: real('cap_rate'),

	// Notes & Activity
	notes: text('notes'),

	// Timing
	daysInStage: integer('days_in_stage').default(0),
	addedAt: timestamp('added_at').defaultNow(),
	stageChangedAt: timestamp('stage_changed_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Markets table - available markets for property search
export const markets = pgTable('markets', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(), // e.g., "austin", "phoenix"
	state: text('state').notNull(),

	// Market Statistics
	medianRent: integer('median_rent'),
	rentGrowth: real('rent_growth'), // percentage
	occupancy: real('occupancy'), // percentage
	popGrowth: real('pop_growth'), // percentage
	jobGrowth: real('job_growth'), // percentage
	totalInventory: integer('total_inventory'),

	// Market Score
	marketScore: integer('market_score'), // 0-100
	trend: text('trend'), // up | down | stable

	// Metadata
	isActive: boolean('is_active').default(true),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Submarkets table
export const submarkets = pgTable('submarkets', {
	id: text('id').primaryKey(),
	marketId: text('market_id').references(() => markets.id, { onDelete: 'cascade' }).notNull(),
	name: text('name').notNull(),

	// Submarket Statistics
	medianRent: integer('median_rent'),
	occupancy: real('occupancy'),
	inventory: integer('inventory'),
	trend: text('trend'), // up | down | stable

	updatedAt: timestamp('updated_at').defaultNow(),
});

// Saved Searches table
export const savedSearches = pgTable('saved_searches', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	name: text('name').notNull(),
	query: text('query'), // Natural language query
	filters: jsonb('filters'), // Structured filters

	// Alert Settings
	alertsEnabled: boolean('alerts_enabled').default(false),
	alertFrequency: text('alert_frequency').default('daily'), // daily | weekly | instant
	lastAlertSent: timestamp('last_alert_sent'),

	// Statistics
	matchCount: integer('match_count').default(0),
	newMatches: integer('new_matches').default(0),
	lastRun: timestamp('last_run'),

	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Watching list - properties user is watching
export const watchlist = pgTable('watchlist', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	propertyId: text('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),

	// Watch Settings
	priceAlerts: boolean('price_alerts').default(true),
	statusAlerts: boolean('status_alerts').default(true),
	notes: text('notes'),

	// Price Tracking
	initialPrice: numeric('initial_price', { precision: 15, scale: 2 }),
	currentPrice: numeric('current_price', { precision: 15, scale: 2 }),
	priceChange: real('price_change'), // percentage

	addedAt: timestamp('added_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Teams table
export const teams = pgTable('teams', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	ownerId: text('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	// Team Settings
	maxMembers: integer('max_members').default(5),

	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Team Members table
export const teamMembers = pgTable('team_members', {
	id: text('id').primaryKey(),
	teamId: text('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	role: text('role').default('member'), // owner | admin | member | viewer
	displayName: text('display_name'),

	// Stats
	dealsAnalyzed: integer('deals_analyzed').default(0),
	investmentsSourced: integer('investments_sourced').default(0),

	joinedAt: timestamp('joined_at').defaultNow(),
	lastActiveAt: timestamp('last_active_at').defaultNow(),
});

// Team Activity Feed
export const teamActivities = pgTable('team_activities', {
	id: text('id').primaryKey(),
	teamId: text('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	activityType: text('activity_type').notNull(), // deal_added | deal_updated | comment | stage_change
	entityType: text('entity_type'), // deal | property | syndication
	entityId: text('entity_id'),
	description: text('description'),

	createdAt: timestamp('created_at').defaultNow(),
});

// Archived Deals
export const archivedDeals = pgTable('archived_deals', {
	id: text('id').primaryKey(),
	propertyId: text('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	reason: text('reason'), // pricing | competition | market | timing | financing | other
	notes: text('notes'),

	// Snapshot at archive time
	askingPrice: numeric('asking_price', { precision: 15, scale: 2 }),
	score: integer('score'),
	grade: text('grade'),

	archivedAt: timestamp('archived_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	properties: many(properties),
	createdSyndications: many(syndications, { relationName: 'creator' }),
	investments: many(investments),
	deals: many(deals),
	savedSearches: many(savedSearches),
	watchlist: many(watchlist),
	teamMemberships: many(teamMembers),
	ownedTeams: many(teams),
	archivedDeals: many(archivedDeals),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
	user: one(users, {
		fields: [properties.userId],
		references: [users.id],
	}),
	syndications: many(syndications),
}));

export const syndicationsRelations = relations(syndications, ({ one, many }) => ({
	property: one(properties, {
		fields: [syndications.propertyId],
		references: [properties.id],
	}),
	creator: one(users, {
		fields: [syndications.creatorUserId],
		references: [users.id],
	}),
	investments: many(investments),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
	syndication: one(syndications, {
		fields: [investments.syndicationId],
		references: [syndications.id],
	}),
	user: one(users, {
		fields: [investments.userId],
		references: [users.id],
	}),
}));

export const dealsRelations = relations(deals, ({ one }) => ({
	property: one(properties, {
		fields: [deals.propertyId],
		references: [properties.id],
	}),
	user: one(users, {
		fields: [deals.userId],
		references: [users.id],
	}),
}));

export const marketsRelations = relations(markets, ({ many }) => ({
	submarkets: many(submarkets),
}));

export const submarketsRelations = relations(submarkets, ({ one }) => ({
	market: one(markets, {
		fields: [submarkets.marketId],
		references: [markets.id],
	}),
}));

export const savedSearchesRelations = relations(savedSearches, ({ one }) => ({
	user: one(users, {
		fields: [savedSearches.userId],
		references: [users.id],
	}),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
	user: one(users, {
		fields: [watchlist.userId],
		references: [users.id],
	}),
	property: one(properties, {
		fields: [watchlist.propertyId],
		references: [properties.id],
	}),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
	owner: one(users, {
		fields: [teams.ownerId],
		references: [users.id],
	}),
	members: many(teamMembers),
	activities: many(teamActivities),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
	team: one(teams, {
		fields: [teamMembers.teamId],
		references: [teams.id],
	}),
	user: one(users, {
		fields: [teamMembers.userId],
		references: [users.id],
	}),
}));

export const teamActivitiesRelations = relations(teamActivities, ({ one }) => ({
	team: one(teams, {
		fields: [teamActivities.teamId],
		references: [teams.id],
	}),
	user: one(users, {
		fields: [teamActivities.userId],
		references: [users.id],
	}),
}));

export const archivedDealsRelations = relations(archivedDeals, ({ one }) => ({
	property: one(properties, {
		fields: [archivedDeals.propertyId],
		references: [properties.id],
	}),
	user: one(users, {
		fields: [archivedDeals.userId],
		references: [users.id],
	}),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Syndication = typeof syndications.$inferSelect;
export type NewSyndication = typeof syndications.$inferInsert;
export type Investment = typeof investments.$inferSelect;
export type NewInvestment = typeof investments.$inferInsert;
export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;
export type Market = typeof markets.$inferSelect;
export type NewMarket = typeof markets.$inferInsert;
export type Submarket = typeof submarkets.$inferSelect;
export type NewSubmarket = typeof submarkets.$inferInsert;
export type SavedSearch = typeof savedSearches.$inferSelect;
export type NewSavedSearch = typeof savedSearches.$inferInsert;
export type WatchlistItem = typeof watchlist.$inferSelect;
export type NewWatchlistItem = typeof watchlist.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type TeamActivity = typeof teamActivities.$inferSelect;
export type NewTeamActivity = typeof teamActivities.$inferInsert;
export type ArchivedDeal = typeof archivedDeals.$inferSelect;
export type NewArchivedDeal = typeof archivedDeals.$inferInsert;

// ============================================================================
// GAME TABLES - deed.guru Gamification System
// ============================================================================

// Players table - gamification profile for users
export const players = pgTable('players', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),

	// Profile
	username: text('username').notNull().unique(),
	tier: text('tier').default('novice'), // novice | intermediate | professional
	level: integer('level').default(1),
	xp: integer('xp').default(0),
	xpToNextLevel: integer('xp_to_next_level').default(1000),

	// Token Balances
	deedTokens: integer('deed_tokens').default(0),
	dguruTokens: integer('dguru_tokens').default(0),

	// Stats
	propertiesAnalyzed: integer('properties_analyzed').default(0),
	dealsCompleted: integer('deals_completed').default(0),
	accuracyScore: integer('accuracy_score').default(0), // 0-100
	streak: integer('streak').default(0),

	// Impact Metrics
	familiesHoused: integer('families_housed').default(0),
	affordableUnitsCreated: integer('affordable_units_created').default(0),
	communityScore: integer('community_score').default(0),

	// Titles & Customization
	currentTitle: text('current_title'),
	unlockedTitles: jsonb('unlocked_titles').default([]), // Array of title strings

	// Timestamps
	joinedAt: timestamp('joined_at').defaultNow(),
	lastActiveAt: timestamp('last_active_at').defaultNow(),
});

// City Gateways - Entry points to city challenges
export const cityGateways = pgTable('city_gateways', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	country: text('country').notNull(),
	region: text('region').notNull(), // americas | europe | middle-east | asia-pacific
	centerLng: real('center_lng').notNull(),
	centerLat: real('center_lat').notNull(),

	// Tier & Progression
	tier: text('tier').notNull(), // starter | intermediate | advanced | expert
	unlockLevel: integer('unlock_level').default(1),
	totalChallenges: integer('total_challenges').default(10),

	// Rewards
	totalDeedReward: integer('total_deed_reward').notNull(),
	totalXpReward: integer('total_xp_reward').notNull(),

	// Market Stats (static reference data)
	avgPrice: text('avg_price'),
	growthRate: text('growth_rate'),
	propertyCount: integer('property_count'),

	// Metadata
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Player City Progress - Tracks completion per city per player
export const playerCityProgress = pgTable('player_city_progress', {
	id: text('id').primaryKey(),
	playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),
	cityId: text('city_id').references(() => cityGateways.id, { onDelete: 'cascade' }).notNull(),

	completedChallenges: integer('completed_challenges').default(0),
	status: text('status').default('locked'), // locked | available | in-progress | completed

	// Timestamps
	unlockedAt: timestamp('unlocked_at'),
	completedAt: timestamp('completed_at'),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Badges - Achievements and badges
export const badges = pgTable('badges', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	icon: text('icon').notNull(), // emoji or icon identifier
	rarity: text('rarity').notNull(), // common | uncommon | rare | epic | legendary

	// Requirements
	requirementType: text('requirement_type'), // level | streak | properties | deals | accuracy
	requirementValue: integer('requirement_value'),

	// Metadata
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').defaultNow(),
});

// Player Badges - Junction table
export const playerBadges = pgTable('player_badges', {
	id: text('id').primaryKey(),
	playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),
	badgeId: text('badge_id').references(() => badges.id, { onDelete: 'cascade' }).notNull(),

	earnedAt: timestamp('earned_at').defaultNow(),
});

// Tournaments - Competitive events
export const tournaments = pgTable('tournaments', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	mode: text('mode').notNull(), // sandbox | academy | trading-floor

	// Timing
	startAt: timestamp('start_at').notNull(),
	endAt: timestamp('end_at').notNull(),

	// Entry & Prizes
	entryFee: integer('entry_fee').default(0), // $DEED
	prizePool: integer('prize_pool').notNull(), // $DEED
	maxParticipants: integer('max_participants'),

	// Status
	status: text('status').default('upcoming'), // upcoming | active | completed
	participantCount: integer('participant_count').default(0),

	// Metadata
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Tournament Participants - Who joined which tournament
export const tournamentParticipants = pgTable('tournament_participants', {
	id: text('id').primaryKey(),
	tournamentId: text('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }).notNull(),
	playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),

	score: integer('score').default(0),
	rank: integer('rank'),
	prizesWon: integer('prizes_won').default(0),

	joinedAt: timestamp('joined_at').defaultNow(),
	completedAt: timestamp('completed_at'),
});

// Game Challenges - Individual challenges/puzzles
export const gameChallenges = pgTable('game_challenges', {
	id: text('id').primaryKey(),
	cityId: text('city_id').references(() => cityGateways.id, { onDelete: 'cascade' }),

	// Challenge Info
	type: text('type').notNull(), // property-analysis | market-research | due-diligence | negotiation | syndication
	title: text('title').notNull(),
	description: text('description').notNull(),
	difficulty: text('difficulty').notNull(), // easy | medium | hard | expert

	// References
	propertyId: text('property_id').references(() => properties.id, { onDelete: 'set null' }),
	marketId: text('market_id').references(() => markets.id, { onDelete: 'set null' }),

	// Requirements
	minLevel: integer('min_level').default(1),
	timeLimit: integer('time_limit'), // seconds

	// Rewards
	deedReward: integer('deed_reward').notNull(),
	xpReward: integer('xp_reward').notNull(),
	badgeId: text('badge_id').references(() => badges.id, { onDelete: 'set null' }),

	// Metadata
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Player Challenge Progress - Tracks player progress on challenges
export const playerChallenges = pgTable('player_challenges', {
	id: text('id').primaryKey(),
	playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),
	challengeId: text('challenge_id').references(() => gameChallenges.id, { onDelete: 'cascade' }).notNull(),

	status: text('status').default('not-started'), // not-started | in-progress | completed | failed
	score: integer('score'),
	timeSpent: integer('time_spent'), // seconds
	attempts: integer('attempts').default(0),

	// Timestamps
	startedAt: timestamp('started_at'),
	completedAt: timestamp('completed_at'),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Game Sessions - Active gameplay sessions
export const gameSessions = pgTable('game_sessions', {
	id: text('id').primaryKey(),
	playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),

	mode: text('mode').notNull(), // sandbox | academy | trading-floor
	currentChallengeId: text('current_challenge_id').references(() => gameChallenges.id, { onDelete: 'set null' }),

	score: integer('score').default(0),
	streak: integer('streak').default(0),
	timeRemaining: integer('time_remaining'),

	// Status
	status: text('status').default('active'), // active | paused | completed | abandoned

	// Timestamps
	startedAt: timestamp('started_at').defaultNow(),
	endedAt: timestamp('ended_at'),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Leaderboard Entries - Daily/weekly/all-time rankings
export const leaderboardEntries = pgTable('leaderboard_entries', {
	id: text('id').primaryKey(),
	playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),

	// Leaderboard Type
	period: text('period').notNull(), // daily | weekly | monthly | all-time
	category: text('category').notNull(), // overall | accuracy | speed | properties | deals

	// Ranking
	rank: integer('rank').notNull(),
	score: integer('score').notNull(),
	previousRank: integer('previous_rank'),

	// Metadata
	periodStart: timestamp('period_start').notNull(),
	periodEnd: timestamp('period_end').notNull(),
	calculatedAt: timestamp('calculated_at').defaultNow(),
});

// Game Notifications - In-game notifications
export const gameNotifications = pgTable('game_notifications', {
	id: text('id').primaryKey(),
	playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),

	type: text('type').notNull(), // achievement | reward | challenge | tournament | social
	title: text('title').notNull(),
	message: text('message').notNull(),

	// Optional References
	referenceType: text('reference_type'), // badge | tournament | challenge
	referenceId: text('reference_id'),

	// Status
	read: boolean('read').default(false),

	// Timestamps
	createdAt: timestamp('created_at').defaultNow(),
});

// Crisis Scenarios - Special event scenarios
export const crisisScenarios = pgTable('crisis_scenarios', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	type: text('type').notNull(), // market-crash | natural-disaster | economic-downturn | regulatory-change
	severity: integer('severity').notNull(), // 1-5

	// Affected Areas
	affectedMarkets: jsonb('affected_markets').default([]), // Array of market IDs
	affectedCities: jsonb('affected_cities').default([]), // Array of city IDs

	// Timing
	duration: integer('duration').notNull(), // days
	objectives: jsonb('objectives').notNull(), // Array of objective strings

	// Rewards
	deedReward: integer('deed_reward').notNull(),
	xpReward: integer('xp_reward').notNull(),

	// Status
	status: text('status').default('inactive'), // inactive | active | completed
	startAt: timestamp('start_at'),
	endAt: timestamp('end_at'),

	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Player Crisis Progress - Tracks player progress on crisis scenarios
export const playerCrisisProgress = pgTable('player_crisis_progress', {
	id: text('id').primaryKey(),
	playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }).notNull(),
	crisisId: text('crisis_id').references(() => crisisScenarios.id, { onDelete: 'cascade' }).notNull(),

	objectivesCompleted: jsonb('objectives_completed').default([]), // Array of completed objective IDs
	score: integer('score').default(0),
	status: text('status').default('in-progress'), // in-progress | completed | failed

	startedAt: timestamp('started_at').defaultNow(),
	completedAt: timestamp('completed_at'),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// GAME RELATIONS
// ============================================================================

export const playersRelations = relations(players, ({ one, many }) => ({
	user: one(users, {
		fields: [players.userId],
		references: [users.id],
	}),
	cityProgress: many(playerCityProgress),
	badges: many(playerBadges),
	tournaments: many(tournamentParticipants),
	challenges: many(playerChallenges),
	sessions: many(gameSessions),
	leaderboardEntries: many(leaderboardEntries),
	notifications: many(gameNotifications),
	crisisProgress: many(playerCrisisProgress),
}));

export const cityGatewaysRelations = relations(cityGateways, ({ many }) => ({
	playerProgress: many(playerCityProgress),
	challenges: many(gameChallenges),
}));

export const playerCityProgressRelations = relations(playerCityProgress, ({ one }) => ({
	player: one(players, {
		fields: [playerCityProgress.playerId],
		references: [players.id],
	}),
	city: one(cityGateways, {
		fields: [playerCityProgress.cityId],
		references: [cityGateways.id],
	}),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
	playerBadges: many(playerBadges),
	challenges: many(gameChallenges),
}));

export const playerBadgesRelations = relations(playerBadges, ({ one }) => ({
	player: one(players, {
		fields: [playerBadges.playerId],
		references: [players.id],
	}),
	badge: one(badges, {
		fields: [playerBadges.badgeId],
		references: [badges.id],
	}),
}));

export const tournamentsRelations = relations(tournaments, ({ many }) => ({
	participants: many(tournamentParticipants),
}));

export const tournamentParticipantsRelations = relations(tournamentParticipants, ({ one }) => ({
	tournament: one(tournaments, {
		fields: [tournamentParticipants.tournamentId],
		references: [tournaments.id],
	}),
	player: one(players, {
		fields: [tournamentParticipants.playerId],
		references: [players.id],
	}),
}));

export const gameChallengesRelations = relations(gameChallenges, ({ one, many }) => ({
	city: one(cityGateways, {
		fields: [gameChallenges.cityId],
		references: [cityGateways.id],
	}),
	property: one(properties, {
		fields: [gameChallenges.propertyId],
		references: [properties.id],
	}),
	market: one(markets, {
		fields: [gameChallenges.marketId],
		references: [markets.id],
	}),
	badge: one(badges, {
		fields: [gameChallenges.badgeId],
		references: [badges.id],
	}),
	playerProgress: many(playerChallenges),
}));

export const playerChallengesRelations = relations(playerChallenges, ({ one }) => ({
	player: one(players, {
		fields: [playerChallenges.playerId],
		references: [players.id],
	}),
	challenge: one(gameChallenges, {
		fields: [playerChallenges.challengeId],
		references: [gameChallenges.id],
	}),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
	player: one(players, {
		fields: [gameSessions.playerId],
		references: [players.id],
	}),
	currentChallenge: one(gameChallenges, {
		fields: [gameSessions.currentChallengeId],
		references: [gameChallenges.id],
	}),
}));

export const leaderboardEntriesRelations = relations(leaderboardEntries, ({ one }) => ({
	player: one(players, {
		fields: [leaderboardEntries.playerId],
		references: [players.id],
	}),
}));

export const gameNotificationsRelations = relations(gameNotifications, ({ one }) => ({
	player: one(players, {
		fields: [gameNotifications.playerId],
		references: [players.id],
	}),
}));

export const crisisScenariosRelations = relations(crisisScenarios, ({ many }) => ({
	playerProgress: many(playerCrisisProgress),
}));

export const playerCrisisProgressRelations = relations(playerCrisisProgress, ({ one }) => ({
	player: one(players, {
		fields: [playerCrisisProgress.playerId],
		references: [players.id],
	}),
	crisis: one(crisisScenarios, {
		fields: [playerCrisisProgress.crisisId],
		references: [crisisScenarios.id],
	}),
}));

// ============================================================================
// GAME TYPE EXPORTS
// ============================================================================

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type CityGateway = typeof cityGateways.$inferSelect;
export type NewCityGateway = typeof cityGateways.$inferInsert;
export type PlayerCityProgress = typeof playerCityProgress.$inferSelect;
export type NewPlayerCityProgress = typeof playerCityProgress.$inferInsert;
export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
export type PlayerBadge = typeof playerBadges.$inferSelect;
export type NewPlayerBadge = typeof playerBadges.$inferInsert;
export type Tournament = typeof tournaments.$inferSelect;
export type NewTournament = typeof tournaments.$inferInsert;
export type TournamentParticipant = typeof tournamentParticipants.$inferSelect;
export type NewTournamentParticipant = typeof tournamentParticipants.$inferInsert;
export type GameChallenge = typeof gameChallenges.$inferSelect;
export type NewGameChallenge = typeof gameChallenges.$inferInsert;
export type PlayerChallenge = typeof playerChallenges.$inferSelect;
export type NewPlayerChallenge = typeof playerChallenges.$inferInsert;
export type GameSession = typeof gameSessions.$inferSelect;
export type NewGameSession = typeof gameSessions.$inferInsert;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboardEntries.$inferInsert;
export type GameNotification = typeof gameNotifications.$inferSelect;
export type NewGameNotification = typeof gameNotifications.$inferInsert;
export type CrisisScenario = typeof crisisScenarios.$inferSelect;
export type NewCrisisScenario = typeof crisisScenarios.$inferInsert;
export type PlayerCrisisProgress = typeof playerCrisisProgress.$inferSelect;
export type NewPlayerCrisisProgress = typeof playerCrisisProgress.$inferInsert;

// ============================================================================
// WORKSPACE TABLES - Property Analysis Workspace
// ============================================================================

// Workspace Sessions - Save workspace state per property per user
export const workspaceSessions = pgTable('workspace_sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	propertyId: text('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),

	// Underwriting Assumptions (editable by user)
	assumptions: jsonb('assumptions').notNull(), // { purchasePrice, downPaymentPercent, interestRate, etc. }

	// Sub-criteria values (editable by user)
	subCriteriaValues: jsonb('sub_criteria_values'), // Record<PetalCategory, Record<string, number | boolean>>

	// UI State
	selectedAnalysisType: text('selected_analysis_type').default('petal'), // petal | underwriting
	terminalOpen: boolean('terminal_open').default(true),
	terminalHeight: integer('terminal_height').default(250),

	// Timestamps
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Chat History - AI copilot conversations
export const chatHistory = pgTable('chat_history', {
	id: text('id').primaryKey(),
	sessionId: text('session_id').references(() => workspaceSessions.id, { onDelete: 'cascade' }).notNull(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	role: text('role').notNull(), // user | assistant
	content: text('content').notNull(),

	// Optional metadata
	metadata: jsonb('metadata'), // { model, tokens, etc. }

	createdAt: timestamp('created_at').defaultNow(),
});

// Document Uploads - Track uploaded documents per property
export const documentUploads = pgTable('document_uploads', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	propertyId: text('property_id').references(() => properties.id, { onDelete: 'cascade' }),

	// File Info
	filename: text('filename').notNull(),
	fileSize: integer('file_size').notNull(), // bytes
	fileType: text('file_type').notNull(), // pdf | xlsx | docx | etc.
	mimeType: text('mime_type').notNull(),

	// Storage
	storageUrl: text('storage_url').notNull(), // Supabase Storage URL or S3 URL
	storageBucket: text('storage_bucket').notNull(),
	storagePath: text('storage_path').notNull(),

	// Processing Status
	status: text('status').default('uploaded'), // uploaded | processing | processed | failed
	extractedData: jsonb('extracted_data'), // AI-extracted data from document

	// Timestamps
	uploadedAt: timestamp('uploaded_at').defaultNow(),
	processedAt: timestamp('processed_at'),
});

// Data Source Connections - Track connected data sources per user
export const dataSourceConnections = pgTable('data_source_connections', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

	// Source Info
	sourceType: text('source_type').notNull(), // mls | yardi | realpage | costar | custom
	sourceName: text('source_name').notNull(),

	// Connection Details
	status: text('status').default('connected'), // connected | disconnected | error
	credentials: text('credentials'), // Encrypted credentials (if applicable)
	apiKey: text('api_key'), // Encrypted API key (if applicable)

	// Sync Info
	lastSyncAt: timestamp('last_sync_at'),
	syncFrequency: text('sync_frequency').default('manual'), // manual | hourly | daily | weekly
	syncStats: jsonb('sync_stats'), // { recordsImported, lastSyncDuration, etc. }

	// Timestamps
	connectedAt: timestamp('connected_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// WORKSPACE RELATIONS
// ============================================================================

export const workspaceSessionsRelations = relations(workspaceSessions, ({ one, many }) => ({
	user: one(users, {
		fields: [workspaceSessions.userId],
		references: [users.id],
	}),
	property: one(properties, {
		fields: [workspaceSessions.propertyId],
		references: [properties.id],
	}),
	chatMessages: many(chatHistory),
}));

export const chatHistoryRelations = relations(chatHistory, ({ one }) => ({
	session: one(workspaceSessions, {
		fields: [chatHistory.sessionId],
		references: [workspaceSessions.id],
	}),
	user: one(users, {
		fields: [chatHistory.userId],
		references: [users.id],
	}),
}));

export const documentUploadsRelations = relations(documentUploads, ({ one }) => ({
	user: one(users, {
		fields: [documentUploads.userId],
		references: [users.id],
	}),
	property: one(properties, {
		fields: [documentUploads.propertyId],
		references: [properties.id],
	}),
}));

export const dataSourceConnectionsRelations = relations(dataSourceConnections, ({ one }) => ({
	user: one(users, {
		fields: [dataSourceConnections.userId],
		references: [users.id],
	}),
}));

// ============================================================================
// WORKSPACE TYPE EXPORTS
// ============================================================================

export type WorkspaceSession = typeof workspaceSessions.$inferSelect;
export type NewWorkspaceSession = typeof workspaceSessions.$inferInsert;
export type ChatMessage = typeof chatHistory.$inferSelect;
export type NewChatMessage = typeof chatHistory.$inferInsert;
export type DocumentUpload = typeof documentUploads.$inferSelect;
export type NewDocumentUpload = typeof documentUploads.$inferInsert;
export type DataSourceConnection = typeof dataSourceConnections.$inferSelect;
export type NewDataSourceConnection = typeof dataSourceConnections.$inferInsert;
