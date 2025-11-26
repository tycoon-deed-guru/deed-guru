import { db } from './index';
import {
	users,
	properties,
	deals,
	markets,
	submarkets,
	savedSearches,
	watchlist,
	teams,
	teamMembers,
	teamActivities,
	archivedDeals,
	syndications,
	investments,
	cityGateways,
	badges,
	tournaments,
	players,
	playerCityProgress,
	playerBadges,
} from './schema';
import { eq } from 'drizzle-orm';

/**
 * Comprehensive seed script for deed.guru
 * Migrates all mock data into Supabase
 */

// Test user IDs (these should match Supabase Auth users)
const TEST_USER_ID = 'test-user-1';
const TEAM_MEMBER_IDS = {
	sarah: 'user-sarah-chen',
	mike: 'user-mike-johnson',
	emily: 'user-emily-davis',
	david: 'user-david-kim',
};

async function seedUsers() {
	console.log('🌱 Seeding users...');

	const usersData = [
		{
			id: TEST_USER_ID,
			email: 'test@deedguru.com',
			subscriptionTier: 'pro',
			subscriptionStatus: 'active',
		},
		{
			id: TEAM_MEMBER_IDS.sarah,
			email: 'sarah.chen@deedguru.com',
			subscriptionTier: 'pro',
			subscriptionStatus: 'active',
		},
		{
			id: TEAM_MEMBER_IDS.mike,
			email: 'mike.johnson@deedguru.com',
			subscriptionTier: 'pro',
			subscriptionStatus: 'active',
		},
		{
			id: TEAM_MEMBER_IDS.emily,
			email: 'emily.davis@deedguru.com',
			subscriptionTier: 'free',
			subscriptionStatus: 'active',
		},
		{
			id: TEAM_MEMBER_IDS.david,
			email: 'david.kim@deedguru.com',
			subscriptionTier: 'syndicate',
			subscriptionStatus: 'active',
		},
	];

	for (const user of usersData) {
		const existing = await db.select().from(users).where(eq(users.id, user.id));
		if (existing.length === 0) {
			await db.insert(users).values(user);
		}
	}

	console.log('✅ Users seeded');
}

async function seedMarkets() {
	console.log('🌱 Seeding markets...');

	const marketsData = [
		{
			id: 'market-austin',
			name: 'Austin',
			slug: 'austin',
			state: 'TX',
			medianRent: 1850,
			rentGrowth: 4.2,
			occupancy: 94.8,
			popGrowth: 3.2,
			jobGrowth: 4.8,
			totalInventory: 142000,
			marketScore: 92,
			trend: 'up',
		},
		{
			id: 'market-phoenix',
			name: 'Phoenix',
			slug: 'phoenix',
			state: 'AZ',
			medianRent: 1650,
			rentGrowth: 3.8,
			occupancy: 95.2,
			popGrowth: 2.8,
			jobGrowth: 4.1,
			totalInventory: 198000,
			marketScore: 88,
			trend: 'up',
		},
		{
			id: 'market-orlando',
			name: 'Orlando',
			slug: 'orlando',
			state: 'FL',
			medianRent: 1720,
			rentGrowth: 5.1,
			occupancy: 96.1,
			popGrowth: 2.4,
			jobGrowth: 3.9,
			totalInventory: 156000,
			marketScore: 85,
			trend: 'up',
		},
		{
			id: 'market-nashville',
			name: 'Nashville',
			slug: 'nashville',
			state: 'TN',
			medianRent: 1780,
			rentGrowth: 4.5,
			occupancy: 95.8,
			popGrowth: 2.1,
			jobGrowth: 3.6,
			totalInventory: 98000,
			marketScore: 87,
			trend: 'up',
		},
		{
			id: 'market-dallas',
			name: 'Dallas',
			slug: 'dallas',
			state: 'TX',
			medianRent: 1620,
			rentGrowth: 3.2,
			occupancy: 93.4,
			popGrowth: 2.5,
			jobGrowth: 3.8,
			totalInventory: 285000,
			marketScore: 84,
			trend: 'stable',
		},
		{
			id: 'market-denver',
			name: 'Denver',
			slug: 'denver',
			state: 'CO',
			medianRent: 1920,
			rentGrowth: 2.8,
			occupancy: 94.2,
			popGrowth: 1.8,
			jobGrowth: 2.9,
			totalInventory: 175000,
			marketScore: 82,
			trend: 'stable',
		},
		{
			id: 'market-tampa',
			name: 'Tampa',
			slug: 'tampa',
			state: 'FL',
			medianRent: 1680,
			rentGrowth: 4.8,
			occupancy: 95.5,
			popGrowth: 2.6,
			jobGrowth: 3.7,
			totalInventory: 132000,
			marketScore: 86,
			trend: 'up',
		},
		{
			id: 'market-atlanta',
			name: 'Atlanta',
			slug: 'atlanta',
			state: 'GA',
			medianRent: 1580,
			rentGrowth: 3.5,
			occupancy: 94.0,
			popGrowth: 1.9,
			jobGrowth: 3.2,
			totalInventory: 245000,
			marketScore: 83,
			trend: 'stable',
		},
	];

	for (const market of marketsData) {
		const existing = await db.select().from(markets).where(eq(markets.id, market.id));
		if (existing.length === 0) {
			await db.insert(markets).values(market);
		}
	}

	console.log('✅ Markets seeded');
}

async function seedSubmarkets() {
	console.log('🌱 Seeding submarkets...');

	const submarketsData = [
		// Austin submarkets
		{ id: 'sub-austin-domain', marketId: 'market-austin', name: 'Domain', medianRent: 2150, occupancy: 96.2, inventory: 4200, trend: 'up' },
		{ id: 'sub-austin-downtown', marketId: 'market-austin', name: 'Downtown', medianRent: 2450, occupancy: 94.8, inventory: 3800, trend: 'up' },
		{ id: 'sub-austin-east', marketId: 'market-austin', name: 'East Austin', medianRent: 1780, occupancy: 95.4, inventory: 5200, trend: 'up' },
		{ id: 'sub-austin-round-rock', marketId: 'market-austin', name: 'Round Rock', medianRent: 1650, occupancy: 96.8, inventory: 8400, trend: 'up' },
		{ id: 'sub-austin-cedar-park', marketId: 'market-austin', name: 'Cedar Park', medianRent: 1720, occupancy: 97.1, inventory: 6100, trend: 'stable' },
		// Phoenix submarkets
		{ id: 'sub-phoenix-scottsdale', marketId: 'market-phoenix', name: 'Scottsdale', medianRent: 2100, occupancy: 95.5, inventory: 12000, trend: 'up' },
		{ id: 'sub-phoenix-tempe', marketId: 'market-phoenix', name: 'Tempe', medianRent: 1750, occupancy: 96.2, inventory: 15000, trend: 'up' },
		{ id: 'sub-phoenix-chandler', marketId: 'market-phoenix', name: 'Chandler', medianRent: 1680, occupancy: 95.8, inventory: 11000, trend: 'stable' },
		// Orlando submarkets
		{ id: 'sub-orlando-downtown', marketId: 'market-orlando', name: 'Downtown', medianRent: 2200, occupancy: 94.5, inventory: 8500, trend: 'up' },
		{ id: 'sub-orlando-lake-nona', marketId: 'market-orlando', name: 'Lake Nona', medianRent: 1950, occupancy: 97.2, inventory: 4200, trend: 'up' },
	];

	for (const submarket of submarketsData) {
		const existing = await db.select().from(submarkets).where(eq(submarkets.id, submarket.id));
		if (existing.length === 0) {
			await db.insert(submarkets).values(submarket);
		}
	}

	console.log('✅ Submarkets seeded');
}

async function seedProperties() {
	console.log('🌱 Seeding properties...');

	// 8-Petal Bloom scoring (LOCATION, TENANCY, COMPLIANCE, FINANCING, CASHFLOW, APPRECIATION, LIQUIDITY, CONDITION)
	const propertiesData = [
		{
			id: 'prop-austin-tech-towers',
			userId: TEST_USER_ID,
			name: 'Austin Tech Towers',
			address: '123 Tech Blvd, Austin, TX 78701',
			units: 342,
			scores: [7.5, 7.8, 7.2, 7.5, 8.0, 7.8, 7.0, 7.2], // Total: 60.0
			totalScore: 60,
			grade: 'A+',
			documentType: 'om',
		},
		{
			id: 'prop-phoenix-garden',
			userId: TEST_USER_ID,
			name: 'Phoenix Garden Apartments',
			address: '456 Desert Rd, Phoenix, AZ 85001',
			units: 218,
			scores: [7.0, 7.2, 6.8, 7.0, 7.5, 7.2, 6.8, 7.0], // Total: 56.5
			totalScore: 56,
			grade: 'A',
			documentType: 'om',
		},
		{
			id: 'prop-orlando-lakeside',
			userId: TEST_USER_ID,
			name: 'Orlando Lakeside Villas',
			address: '789 Lake View Dr, Orlando, FL 32801',
			units: 156,
			scores: [6.5, 7.0, 6.5, 6.8, 7.0, 7.5, 6.5, 6.8], // Total: 54.6
			totalScore: 55,
			grade: 'A',
			documentType: 'om',
		},
		{
			id: 'prop-nashville-heights',
			userId: TEST_USER_ID,
			name: 'Nashville Heights',
			address: '321 Music Row, Nashville, TN 37201',
			units: 284,
			scores: [7.2, 7.5, 7.0, 7.2, 7.8, 7.5, 7.0, 7.2], // Total: 58.4
			totalScore: 58,
			grade: 'A',
			documentType: 'manual',
		},
		{
			id: 'prop-denver-mountain-view',
			userId: TEST_USER_ID,
			name: 'Denver Mountain View',
			address: '555 Peak Ct, Denver, CO 80202',
			units: 198,
			scores: [6.8, 6.5, 6.5, 6.8, 6.8, 6.5, 6.5, 6.8], // Total: 53.2
			totalScore: 53,
			grade: 'B+',
			documentType: 'om',
		},
		{
			id: 'prop-dallas-skyline',
			userId: TEST_USER_ID,
			name: 'Dallas Skyline Plaza',
			address: '777 Commerce St, Dallas, TX 75201',
			units: 412,
			scores: [6.8, 7.0, 6.5, 7.0, 7.2, 7.5, 6.5, 6.8], // Total: 55.3
			totalScore: 55,
			grade: 'A',
			documentType: 'om',
		},
		{
			id: 'prop-tampa-bay',
			userId: TEST_USER_ID,
			name: 'Tampa Bay Residences',
			address: '888 Bayshore Blvd, Tampa, FL 33606',
			units: 245,
			scores: [7.2, 7.5, 7.0, 7.2, 7.5, 7.5, 6.8, 7.2], // Total: 57.9
			totalScore: 58,
			grade: 'A',
			documentType: 'rent_roll',
		},
		{
			id: 'prop-atlanta-midtown',
			userId: TEST_USER_ID,
			name: 'Atlanta Midtown Lofts',
			address: '999 Peachtree St, Atlanta, GA 30309',
			units: 178,
			scores: [6.5, 6.8, 6.5, 6.5, 6.5, 6.8, 6.2, 6.5], // Total: 52.3
			totalScore: 52,
			grade: 'B+',
			documentType: 'om',
		},
	];

	for (const property of propertiesData) {
		const existing = await db.select().from(properties).where(eq(properties.id, property.id));
		if (existing.length === 0) {
			await db.insert(properties).values(property);
		}
	}

	console.log('✅ Properties seeded');
}

async function seedDeals() {
	console.log('🌱 Seeding deals...');

	const dealsData = [
		{
			id: 'deal-1',
			propertyId: 'prop-austin-tech-towers',
			userId: TEST_USER_ID,
			stage: 'underwriting',
			askingPrice: '48500000',
			pricePerUnit: '141812',
			capRate: 5.8,
			notes: 'Strong value-add opportunity. Need to verify renovation budget.',
			daysInStage: 4,
		},
		{
			id: 'deal-2',
			propertyId: 'prop-phoenix-garden',
			userId: TEST_USER_ID,
			stage: 'loi',
			askingPrice: '32000000',
			pricePerUnit: '146789',
			capRate: 6.2,
			notes: 'LOI submitted at $31M. Waiting for seller response.',
			daysInStage: 8,
		},
		{
			id: 'deal-3',
			propertyId: 'prop-orlando-lakeside',
			userId: TEST_USER_ID,
			stage: 'analyzing',
			askingPrice: '22500000',
			pricePerUnit: '144231',
			capRate: 5.5,
			notes: 'Running initial market comps and rent analysis.',
			daysInStage: 5,
		},
		{
			id: 'deal-4',
			propertyId: 'prop-nashville-heights',
			userId: TEST_USER_ID,
			stage: 'due_diligence',
			askingPrice: '41000000',
			pricePerUnit: '144366',
			capRate: 6.0,
			notes: 'In DD phase. Inspections scheduled for next week.',
			daysInStage: 14,
		},
		{
			id: 'deal-5',
			propertyId: 'prop-denver-mountain-view',
			userId: TEST_USER_ID,
			stage: 'sourced',
			askingPrice: '35000000',
			pricePerUnit: '176768',
			capRate: 5.2,
			notes: 'New listing. Need to schedule tour.',
			daysInStage: 1,
		},
	];

	for (const deal of dealsData) {
		const existing = await db.select().from(deals).where(eq(deals.id, deal.id));
		if (existing.length === 0) {
			await db.insert(deals).values(deal);
		}
	}

	console.log('✅ Deals seeded');
}

async function seedSavedSearches() {
	console.log('🌱 Seeding saved searches...');

	const searchesData = [
		{
			id: 'search-1',
			userId: TEST_USER_ID,
			name: 'Austin Value-Add 200+ Units',
			query: '200+ unit value-add deals in Austin with 6%+ cap rate',
			filters: { market: 'austin', minUnits: 200, minCapRate: 6, propertyType: 'value-add' },
			alertsEnabled: true,
			alertFrequency: 'daily',
			matchCount: 23,
			newMatches: 3,
		},
		{
			id: 'search-2',
			userId: TEST_USER_ID,
			name: 'Sunbelt A-Class 150+ Units',
			query: 'Class A properties 150+ units in sunbelt markets',
			filters: { propertyClass: 'A', minUnits: 150, markets: ['austin', 'phoenix', 'orlando', 'tampa'] },
			alertsEnabled: true,
			alertFrequency: 'weekly',
			matchCount: 45,
			newMatches: 7,
		},
		{
			id: 'search-3',
			userId: TEST_USER_ID,
			name: 'High Yield Phoenix',
			query: 'Phoenix properties with 7%+ cap rate',
			filters: { market: 'phoenix', minCapRate: 7 },
			alertsEnabled: false,
			matchCount: 12,
			newMatches: 0,
		},
	];

	for (const search of searchesData) {
		const existing = await db.select().from(savedSearches).where(eq(savedSearches.id, search.id));
		if (existing.length === 0) {
			await db.insert(savedSearches).values(search);
		}
	}

	console.log('✅ Saved searches seeded');
}

async function seedWatchlist() {
	console.log('🌱 Seeding watchlist...');

	const watchlistData = [
		{
			id: 'watch-1',
			userId: TEST_USER_ID,
			propertyId: 'prop-dallas-skyline',
			priceAlerts: true,
			statusAlerts: true,
			notes: 'Watching for price reduction',
			initialPrice: '58000000',
			currentPrice: '55000000',
			priceChange: -5.2,
		},
		{
			id: 'watch-2',
			userId: TEST_USER_ID,
			propertyId: 'prop-tampa-bay',
			priceAlerts: true,
			statusAlerts: true,
			notes: 'Strong submarket, waiting for better timing',
			initialPrice: '36500000',
			currentPrice: '36500000',
			priceChange: 0,
		},
		{
			id: 'watch-3',
			userId: TEST_USER_ID,
			propertyId: 'prop-atlanta-midtown',
			priceAlerts: false,
			statusAlerts: true,
			notes: 'Monitoring for market conditions',
			initialPrice: '28000000',
			currentPrice: '27500000',
			priceChange: -1.8,
		},
	];

	for (const item of watchlistData) {
		const existing = await db.select().from(watchlist).where(eq(watchlist.id, item.id));
		if (existing.length === 0) {
			await db.insert(watchlist).values(item);
		}
	}

	console.log('✅ Watchlist seeded');
}

async function seedTeams() {
	console.log('🌱 Seeding teams...');

	const teamsData = [
		{
			id: 'team-alpha',
			name: 'Alpha Acquisitions',
			ownerId: TEST_USER_ID,
			maxMembers: 10,
		},
	];

	for (const team of teamsData) {
		const existing = await db.select().from(teams).where(eq(teams.id, team.id));
		if (existing.length === 0) {
			await db.insert(teams).values(team);
		}
	}

	// Team members
	const membersData = [
		{
			id: 'member-1',
			teamId: 'team-alpha',
			userId: TEST_USER_ID,
			role: 'owner',
			displayName: 'Arnold Alagar',
			dealsAnalyzed: 45,
			investmentsSourced: 12,
		},
		{
			id: 'member-2',
			teamId: 'team-alpha',
			userId: TEAM_MEMBER_IDS.sarah,
			role: 'admin',
			displayName: 'Sarah Chen',
			dealsAnalyzed: 67,
			investmentsSourced: 18,
		},
		{
			id: 'member-3',
			teamId: 'team-alpha',
			userId: TEAM_MEMBER_IDS.mike,
			role: 'member',
			displayName: 'Mike Johnson',
			dealsAnalyzed: 34,
			investmentsSourced: 8,
		},
		{
			id: 'member-4',
			teamId: 'team-alpha',
			userId: TEAM_MEMBER_IDS.emily,
			role: 'member',
			displayName: 'Emily Davis',
			dealsAnalyzed: 28,
			investmentsSourced: 5,
		},
	];

	for (const member of membersData) {
		const existing = await db.select().from(teamMembers).where(eq(teamMembers.id, member.id));
		if (existing.length === 0) {
			await db.insert(teamMembers).values(member);
		}
	}

	console.log('✅ Teams seeded');
}

async function seedTeamActivities() {
	console.log('🌱 Seeding team activities...');

	const activitiesData = [
		{
			id: 'activity-1',
			teamId: 'team-alpha',
			userId: TEAM_MEMBER_IDS.sarah,
			activityType: 'deal_added',
			entityType: 'deal',
			entityId: 'deal-1',
			description: 'Added Austin Tech Towers to pipeline',
		},
		{
			id: 'activity-2',
			teamId: 'team-alpha',
			userId: TEST_USER_ID,
			activityType: 'stage_change',
			entityType: 'deal',
			entityId: 'deal-2',
			description: 'Moved Phoenix Garden to LOI stage',
		},
		{
			id: 'activity-3',
			teamId: 'team-alpha',
			userId: TEAM_MEMBER_IDS.mike,
			activityType: 'comment',
			entityType: 'deal',
			entityId: 'deal-4',
			description: 'Added inspection notes for Nashville Heights',
		},
		{
			id: 'activity-4',
			teamId: 'team-alpha',
			userId: TEAM_MEMBER_IDS.emily,
			activityType: 'deal_updated',
			entityType: 'deal',
			entityId: 'deal-3',
			description: 'Updated financial projections for Orlando Lakeside',
		},
	];

	for (const activity of activitiesData) {
		const existing = await db.select().from(teamActivities).where(eq(teamActivities.id, activity.id));
		if (existing.length === 0) {
			await db.insert(teamActivities).values(activity);
		}
	}

	console.log('✅ Team activities seeded');
}

async function seedArchivedDeals() {
	console.log('🌱 Seeding archived deals...');

	const archivedData = [
		{
			id: 'archived-1',
			propertyId: 'prop-atlanta-midtown',
			userId: TEST_USER_ID,
			reason: 'pricing',
			notes: 'Seller not willing to negotiate below $30M',
			askingPrice: '32000000',
			score: 75,
			grade: 'B+',
		},
	];

	for (const archived of archivedData) {
		const existing = await db.select().from(archivedDeals).where(eq(archivedDeals.id, archived.id));
		if (existing.length === 0) {
			await db.insert(archivedDeals).values(archived);
		}
	}

	console.log('✅ Archived deals seeded');
}

async function seedSyndications() {
	console.log('🌱 Seeding syndications...');

	const syndicationsData = [
		{
			id: 'synd-1',
			propertyId: 'prop-austin-tech-towers',
			creatorUserId: TEST_USER_ID,
			hederaTokenId: '0.0.123456',
			tokenName: 'Austin Tech Towers LP',
			tokenSymbol: 'ATT',
			totalTokens: 10000000,
			decimals: 6,
			totalRaiseUSD: '15000000',
			minInvestmentUSD: '50000',
			maxInvestmentUSD: '1000000',
			status: 'active',
			amountRaisedUSD: '8500000',
			investorCount: 42,
			regulationType: 'reg_d',
			accreditedOnly: true,
			explorerUrl: 'https://hashscan.io/mainnet/token/0.0.123456',
		},
		{
			id: 'synd-2',
			propertyId: 'prop-nashville-heights',
			creatorUserId: TEST_USER_ID,
			hederaTokenId: '0.0.234567',
			tokenName: 'Nashville Heights Fund',
			tokenSymbol: 'NHF',
			totalTokens: 8000000,
			decimals: 6,
			totalRaiseUSD: '12000000',
			minInvestmentUSD: '25000',
			status: 'draft',
			amountRaisedUSD: '0',
			investorCount: 0,
			regulationType: 'reg_d',
			accreditedOnly: true,
		},
	];

	for (const synd of syndicationsData) {
		const existing = await db.select().from(syndications).where(eq(syndications.id, synd.id));
		if (existing.length === 0) {
			await db.insert(syndications).values(synd);
		}
	}

	console.log('✅ Syndications seeded');
}

async function seedInvestments() {
	console.log('🌱 Seeding investments...');

	const investmentsData = [
		{
			id: 'invest-1',
			syndicationId: 'synd-1',
			userId: TEAM_MEMBER_IDS.sarah,
			amountUSD: '100000',
			tokenAmount: 66667,
			ownershipPercentage: '0.667',
			investorHederaAccount: '0.0.789012',
			status: 'completed',
			paymentMethod: 'wire',
			accreditationVerified: true,
			kycCompleted: true,
		},
		{
			id: 'invest-2',
			syndicationId: 'synd-1',
			userId: TEAM_MEMBER_IDS.david,
			amountUSD: '250000',
			tokenAmount: 166667,
			ownershipPercentage: '1.667',
			investorHederaAccount: '0.0.890123',
			status: 'completed',
			paymentMethod: 'crypto',
			accreditationVerified: true,
			kycCompleted: true,
		},
	];

	for (const invest of investmentsData) {
		const existing = await db.select().from(investments).where(eq(investments.id, invest.id));
		if (existing.length === 0) {
			await db.insert(investments).values(invest);
		}
	}

	console.log('✅ Investments seeded');
}

// ============================================================================
// GAME DATA SEEDS
// ============================================================================

async function seedCityGateways() {
	console.log('🌱 Seeding city gateways...');

	const cityGatewaysData = [
		// EXPERT TIER (Level 15)
		{
			id: 'new-york',
			name: 'New York',
			country: 'USA',
			region: 'americas',
			centerLng: -73.985,
			centerLat: 40.748,
			tier: 'expert',
			unlockLevel: 15,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: '$2.5M',
			growthRate: '+4.2%',
			propertyCount: 10
		},
		{
			id: 'london',
			name: 'London',
			country: 'UK',
			region: 'europe',
			centerLng: -0.1276,
			centerLat: 51.5074,
			tier: 'expert',
			unlockLevel: 15,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: '£1.8M',
			growthRate: '+2.8%',
			propertyCount: 10
		},
		{
			id: 'hong-kong',
			name: 'Hong Kong',
			country: 'China',
			region: 'asia-pacific',
			centerLng: 114.1694,
			centerLat: 22.3193,
			tier: 'expert',
			unlockLevel: 15,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: 'HK$25M',
			growthRate: '+1.5%',
			propertyCount: 10
		},
		// ADVANCED TIER (Level 10)
		{
			id: 'los-angeles',
			name: 'Los Angeles',
			country: 'USA',
			region: 'americas',
			centerLng: -118.2437,
			centerLat: 34.0522,
			tier: 'advanced',
			unlockLevel: 10,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: '$2.2M',
			growthRate: '+5.5%',
			propertyCount: 10
		},
		{
			id: 'paris',
			name: 'Paris',
			country: 'France',
			region: 'europe',
			centerLng: 2.3522,
			centerLat: 48.8566,
			tier: 'advanced',
			unlockLevel: 10,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: '€1.9M',
			growthRate: '+3.4%',
			propertyCount: 10
		},
		{
			id: 'tokyo',
			name: 'Tokyo',
			country: 'Japan',
			region: 'asia-pacific',
			centerLng: 139.6917,
			centerLat: 35.6895,
			tier: 'advanced',
			unlockLevel: 10,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: '¥180M',
			growthRate: '+5.8%',
			propertyCount: 10
		},
		// INTERMEDIATE TIER (Level 5)
		{
			id: 'miami',
			name: 'Miami',
			country: 'USA',
			region: 'americas',
			centerLng: -80.1918,
			centerLat: 25.7617,
			tier: 'intermediate',
			unlockLevel: 5,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: '$1.8M',
			growthRate: '+9.8%',
			propertyCount: 10
		},
		{
			id: 'dubai',
			name: 'Dubai',
			country: 'UAE',
			region: 'middle-east',
			centerLng: 55.2708,
			centerLat: 25.2048,
			tier: 'intermediate',
			unlockLevel: 5,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: 'AED 8M',
			growthRate: '+12.5%',
			propertyCount: 10
		},
		{
			id: 'singapore',
			name: 'Singapore',
			country: 'Singapore',
			region: 'asia-pacific',
			centerLng: 103.8198,
			centerLat: 1.3521,
			tier: 'intermediate',
			unlockLevel: 5,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: 'S$3.2M',
			growthRate: '+6.1%',
			propertyCount: 10
		},
		// STARTER TIER (Level 1)
		{
			id: 'san-diego',
			name: 'San Diego',
			country: 'USA',
			region: 'americas',
			centerLng: -117.1611,
			centerLat: 32.7157,
			tier: 'starter',
			unlockLevel: 1,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: '$1.4M',
			growthRate: '+6.7%',
			propertyCount: 10
		},
		{
			id: 'manila',
			name: 'Manila',
			country: 'Philippines',
			region: 'asia-pacific',
			centerLng: 120.9842,
			centerLat: 14.5995,
			tier: 'starter',
			unlockLevel: 1,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: '₱45M',
			growthRate: '+8.3%',
			propertyCount: 10
		},
		{
			id: 'sydney',
			name: 'Sydney',
			country: 'Australia',
			region: 'asia-pacific',
			centerLng: 151.2093,
			centerLat: -33.8688,
			tier: 'starter',
			unlockLevel: 1,
			totalChallenges: 10,
			totalDeedReward: 2500,
			totalXpReward: 5000,
			avgPrice: 'A$2.1M',
			growthRate: '+7.2%',
			propertyCount: 10
		}
	];

	for (const city of cityGatewaysData) {
		const existing = await db.select().from(cityGateways).where(eq(cityGateways.id, city.id));
		if (existing.length === 0) {
			await db.insert(cityGateways).values(city);
		}
	}

	console.log('✅ City gateways seeded');
}

async function seedBadges() {
	console.log('🌱 Seeding badges...');

	const badgesData = [
		// Common badges
		{
			id: 'first-analysis',
			name: 'First Steps',
			description: 'Complete your first property analysis',
			icon: '🎯',
			rarity: 'common',
			requirementType: 'properties',
			requirementValue: 1
		},
		{
			id: 'welcome',
			name: 'Welcome Aboard',
			description: 'Join deed.guru and start your real estate journey',
			icon: '👋',
			rarity: 'common',
			requirementType: 'level',
			requirementValue: 1
		},
		// Uncommon badges
		{
			id: 'streak-3',
			name: 'On Fire',
			description: 'Get 3 correct analyses in a row',
			icon: '🔥',
			rarity: 'uncommon',
			requirementType: 'streak',
			requirementValue: 3
		},
		{
			id: 'properties-10',
			name: 'Property Scout',
			description: 'Analyze 10 properties',
			icon: '🏘️',
			rarity: 'uncommon',
			requirementType: 'properties',
			requirementValue: 10
		},
		{
			id: 'level-5',
			name: 'Rising Star',
			description: 'Reach level 5',
			icon: '⭐',
			rarity: 'uncommon',
			requirementType: 'level',
			requirementValue: 5
		},
		// Rare badges
		{
			id: 'bloom-master',
			name: 'Bloom Master',
			description: 'Score a property with 60+ Bloom Score',
			icon: '🌸',
			rarity: 'rare',
			requirementType: 'accuracy',
			requirementValue: 60
		},
		{
			id: 'streak-10',
			name: 'Unstoppable',
			description: 'Get 10 correct analyses in a row',
			icon: '💪',
			rarity: 'rare',
			requirementType: 'streak',
			requirementValue: 10
		},
		{
			id: 'properties-50',
			name: 'Deal Hunter',
			description: 'Analyze 50 properties',
			icon: '🎰',
			rarity: 'rare',
			requirementType: 'properties',
			requirementValue: 50
		},
		{
			id: 'level-10',
			name: 'Seasoned Investor',
			description: 'Reach level 10',
			icon: '💼',
			rarity: 'rare',
			requirementType: 'level',
			requirementValue: 10
		},
		// Epic badges
		{
			id: 'accuracy-90',
			name: 'Precision Expert',
			description: 'Maintain 90% accuracy over 20+ analyses',
			icon: '🎯',
			rarity: 'epic',
			requirementType: 'accuracy',
			requirementValue: 90
		},
		{
			id: 'properties-100',
			name: 'Property Tycoon',
			description: 'Analyze 100 properties',
			icon: '🏰',
			rarity: 'epic',
			requirementType: 'properties',
			requirementValue: 100
		},
		{
			id: 'level-15',
			name: 'Master Analyst',
			description: 'Reach level 15',
			icon: '👑',
			rarity: 'epic',
			requirementType: 'level',
			requirementValue: 15
		},
		{
			id: 'streak-25',
			name: 'Perfection',
			description: 'Get 25 correct analyses in a row',
			icon: '✨',
			rarity: 'epic',
			requirementType: 'streak',
			requirementValue: 25
		},
		// Legendary badges
		{
			id: 'grand-master',
			name: 'Grand Master',
			description: 'Reach level 20',
			icon: '👑',
			rarity: 'legendary',
			requirementType: 'level',
			requirementValue: 20
		},
		{
			id: 'properties-500',
			name: 'Legendary Investor',
			description: 'Analyze 500 properties',
			icon: '🌟',
			rarity: 'legendary',
			requirementType: 'properties',
			requirementValue: 500
		},
		{
			id: 'accuracy-95',
			name: 'Oracle',
			description: 'Maintain 95% accuracy over 50+ analyses',
			icon: '🔮',
			rarity: 'legendary',
			requirementType: 'accuracy',
			requirementValue: 95
		},
		{
			id: 'streak-50',
			name: 'Infallible',
			description: 'Get 50 correct analyses in a row',
			icon: '🏆',
			rarity: 'legendary',
			requirementType: 'streak',
			requirementValue: 50
		}
	];

	for (const badge of badgesData) {
		const existing = await db.select().from(badges).where(eq(badges.id, badge.id));
		if (existing.length === 0) {
			await db.insert(badges).values(badge);
		}
	}

	console.log('✅ Badges seeded');
}

async function seedTournaments() {
	console.log('🌱 Seeding tournaments...');

	const tournamentsData = [
		{
			id: 'weekly-sprint-001',
			name: 'Weekly Sprint Challenge',
			description: 'Analyze 10 properties as fast as possible with highest accuracy',
			mode: 'academy',
			startAt: new Date(),
			endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
			entryFee: 100,
			prizePool: 50000,
			maxParticipants: 2000,
			status: 'active',
			participantCount: 847
		},
		{
			id: 'monthly-championship-001',
			name: 'Monthly Championship',
			description: 'Compete for the top spot in accuracy and speed',
			mode: 'trading-floor',
			startAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Started 10 days ago
			endAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
			entryFee: 500,
			prizePool: 250000,
			maxParticipants: 1000,
			status: 'active',
			participantCount: 623
		},
		{
			id: 'beginner-bootcamp-001',
			name: 'Beginner Bootcamp',
			description: 'Learn the ropes in this beginner-friendly tournament',
			mode: 'sandbox',
			startAt: new Date(),
			endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
			entryFee: 0,
			prizePool: 10000,
			maxParticipants: 5000,
			status: 'active',
			participantCount: 2341
		}
	];

	for (const tournament of tournamentsData) {
		const existing = await db.select().from(tournaments).where(eq(tournaments.id, tournament.id));
		if (existing.length === 0) {
			await db.insert(tournaments).values(tournament);
		}
	}

	console.log('✅ Tournaments seeded');
}

async function seedDemoPlayer() {
	console.log('🌱 Seeding demo player...');

	// Create demo player profile
	const demoPlayerData = {
		id: 'demo-player-1',
		userId: TEST_USER_ID,
		username: 'PropertyMaster',
		tier: 'novice',
		level: 7,
		xp: 2450,
		xpToNextLevel: 5000,
		deedTokens: 15750,
		dguruTokens: 125,
		propertiesAnalyzed: 42,
		dealsCompleted: 8,
		accuracyScore: 87,
		streak: 5,
		familiesHoused: 12,
		affordableUnitsCreated: 3,
		communityScore: 156,
		currentTitle: 'Deal Hunter',
		unlockedTitles: ['Property Scout', 'Deal Hunter']
	};

	const existingPlayer = await db.select().from(players).where(eq(players.id, demoPlayerData.id));
	if (existingPlayer.length === 0) {
		await db.insert(players).values(demoPlayerData);
	}

	// Unlock starter cities for demo player
	const starterCities = ['san-diego', 'manila', 'sydney'];
	for (const cityId of starterCities) {
		const progressId = `progress-${demoPlayerData.id}-${cityId}`;
		const existing = await db.select().from(playerCityProgress).where(eq(playerCityProgress.id, progressId));
		if (existing.length === 0) {
			await db.insert(playerCityProgress).values({
				id: progressId,
				playerId: demoPlayerData.id,
				cityId: cityId,
				completedChallenges: Math.floor(Math.random() * 3),
				status: 'available',
				unlockedAt: new Date()
			});
		}
	}

	// Give demo player some badges
	const demoBadges = ['first-analysis', 'streak-3', 'bloom-master'];
	for (const badgeId of demoBadges) {
		const playerBadgeId = `pb-${demoPlayerData.id}-${badgeId}`;
		const existing = await db.select().from(playerBadges).where(eq(playerBadges.id, playerBadgeId));
		if (existing.length === 0) {
			await db.insert(playerBadges).values({
				id: playerBadgeId,
				playerId: demoPlayerData.id,
				badgeId: badgeId,
				earnedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
			});
		}
	}

	console.log('✅ Demo player seeded');
}

// Main seed function
async function seed() {
	console.log('🚀 Starting deed.guru seed process...\n');

	try {
		// Order matters due to foreign key constraints
		await seedUsers();
		await seedMarkets();
		await seedSubmarkets();
		await seedProperties();
		await seedDeals();
		await seedSavedSearches();
		await seedWatchlist();
		await seedTeams();
		await seedTeamActivities();
		await seedArchivedDeals();
		await seedSyndications();
		await seedInvestments();

		// Game data seeds
		await seedCityGateways();
		await seedBadges();
		await seedTournaments();
		await seedDemoPlayer();

		console.log('\n✅ All seed data inserted successfully!');
		console.log('\n📋 Test Account:');
		console.log('   Email: test@deedguru.com');
		console.log('   Note: Create this user in Supabase Auth with matching email');
		console.log('\n🎮 Game Features:');
		console.log('   - 12 city gateways across 4 tiers');
		console.log('   - 17 achievement badges');
		console.log('   - 3 active tournaments');
		console.log('   - Demo player profile with progress');
	} catch (error) {
		console.error('❌ Seed failed:', error);
		throw error;
	}
}

// Run if called directly
if (import.meta.main) {
	await seed();
	process.exit(0);
}

export {
	seed,
	seedUsers,
	seedMarkets,
	seedProperties,
	seedDeals,
	seedCityGateways,
	seedBadges,
	seedTournaments,
	seedDemoPlayer
};
