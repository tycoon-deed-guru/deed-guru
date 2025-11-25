# deed.guru Game Database Implementation

## Overview

This document explains the comprehensive database implementation for the deed.guru gamification system. The database stores all game-related data including player profiles, city gateways, tournaments, badges, and progress tracking.

## Database Schema

### Core Game Tables

#### Players (`players`)
Stores player profiles with progression stats:
- **Profile**: username, tier (novice/intermediate/professional), level, XP
- **Tokens**: $DEED and $DGURU balances
- **Stats**: properties analyzed, deals completed, accuracy score, streak
- **Impact**: families housed, affordable units created, community score
- **Customization**: current title, unlocked titles, badges

#### City Gateways (`city_gateways`)
12 global cities with 4 tiers (starter, intermediate, advanced, expert):
- San Diego, Manila, Sydney (Starter - Level 1)
- Miami, Dubai, Singapore (Intermediate - Level 5)
- Los Angeles, Paris, Tokyo (Advanced - Level 10)
- New York, London, Hong Kong (Expert - Level 15)

#### Tournaments (`tournaments`)
Competitive events with:
- Modes: sandbox, academy, trading-floor
- Entry fees and prize pools
- Participant tracking and rankings

#### Badges (`badges`)
17 achievement badges across 5 rarity tiers:
- Common (2 badges)
- Uncommon (3 badges)
- Rare (4 badges)
- Epic (4 badges)
- Legendary (4 badges)

### Progress Tracking Tables

- **`player_city_progress`**: Tracks challenges completed per city per player
- **`player_badges`**: Junction table for earned badges
- **`player_challenges`**: Individual challenge completion tracking
- **`game_sessions`**: Active gameplay sessions with scores and streaks
- **`tournament_participants`**: Tournament participation and rankings
- **`game_notifications`**: In-game notifications and alerts
- **`leaderboard_entries`**: Daily/weekly/monthly rankings

### Additional Features

- **`game_challenges`**: Property analysis and market research challenges
- **`crisis_scenarios`**: Special event scenarios (market crashes, natural disasters)
- **`player_crisis_progress`**: Crisis scenario completion tracking

## Setup Instructions

### 1. Push Schema to Database

```bash
bun run db:push
```

This creates all tables in your Supabase database.

### 2. Seed Initial Data

```bash
bun run db:seed
```

This populates the database with:
- 12 city gateways
- 17 achievement badges
- 3 active tournaments
- Demo player profile

## Usage Examples

### Player Management

```typescript
import {
	getOrCreatePlayer,
	addPlayerXP,
	addPlayerTokens,
	recordPropertyAnalysis,
	checkAndAwardBadges,
} from '$lib/server/game';

// Create or get player
const player = await getOrCreatePlayer(userId, 'username');

// Add XP and check for level up
const { leveled, newLevel, unlockedCities } = await addPlayerXP(player.id, 500);

// Award tokens
await addPlayerTokens(player.id, 250, 10); // 250 $DEED, 10 $DGURU

// Record property analysis
await recordPropertyAnalysis(player.id, {
	correct: true,
	bloomScore: 58,
	familiesHoused: 3,
	affordableUnits: 1,
});

// Check and award badges
const newBadges = await checkAndAwardBadges(player.id);
```

### City Progress

```typescript
import { getCitiesWithProgress, updateCityProgress } from '$lib/server/game';

// Get all cities with player progress
const cities = await getCitiesWithProgress(playerId);

// Update progress
await updateCityProgress(playerId, 'san-diego', 5); // 5 challenges completed
```

### Tournaments

```typescript
import {
	getActiveTournaments,
	joinTournament,
	updateTournamentScore,
	getTournamentLeaderboard,
} from '$lib/server/game';

// Get active tournaments
const tournaments = await getActiveTournaments();

// Join tournament
const { success, error } = await joinTournament(tournamentId, playerId);

// Update score
await updateTournamentScore(tournamentId, playerId, 1500);

// Get leaderboard
const leaderboard = await getTournamentLeaderboard(tournamentId, 100);
```

### Game Sessions

```typescript
import {
	startGameSession,
	getActiveSession,
	updateGameSession,
	endGameSession,
} from '$lib/server/game';

// Start session
const session = await startGameSession(playerId, 'academy', {
	timeLimit: 600, // 10 minutes
});

// Update session
await updateGameSession(session.id, {
	score: 1500,
	streak: 5,
});

// End session
await endGameSession(session.id, 'completed');
```

### Notifications

```typescript
import { createNotification, getPlayerNotifications, markNotificationRead } from '$lib/server/game';

// Create notification
await createNotification(playerId, 'achievement', 'New Badge Earned!', 'You earned the "Deal Hunter" badge', {
	referenceType: 'badge',
	referenceId: 'properties-50',
});

// Get notifications
const notifications = await getPlayerNotifications(playerId, {
	unreadOnly: true,
	limit: 20,
});

// Mark as read
await markNotificationRead(notificationId);
```

## API Route Examples

### GET `/api/game/player`
Get player profile:
```typescript
// src/routes/api/game/player/+server.ts
import { getPlayerByUserId } from '$lib/server/game';

export async function GET({ locals }) {
	const user = await locals.getUser();
	if (!user) return new Response('Unauthorized', { status: 401 });

	const player = await getPlayerByUserId(user.id);
	return new Response(JSON.stringify(player), {
		headers: { 'Content-Type': 'application/json' },
	});
}
```

### GET `/api/game/cities`
Get cities with progress:
```typescript
import { getCitiesWithProgress } from '$lib/server/game';

export async function GET({ locals }) {
	const user = await locals.getUser();
	const player = await getPlayerByUserId(user.id);

	const cities = await getCitiesWithProgress(player.id);
	return new Response(JSON.stringify(cities), {
		headers: { 'Content-Type': 'application/json' },
	});
}
```

### POST `/api/game/analyze`
Record property analysis:
```typescript
import { recordPropertyAnalysis, addPlayerXP, checkAndAwardBadges } from '$lib/server/game';

export async function POST({ request, locals }) {
	const { playerId, correct, bloomScore } = await request.json();

	// Record analysis
	await recordPropertyAnalysis(playerId, { correct, bloomScore });

	// Award XP
	const xpReward = correct ? 100 : 50;
	const { leveled, newLevel, unlockedCities } = await addPlayerXP(playerId, xpReward);

	// Award tokens
	const tokenReward = correct ? 50 : 25;
	await addPlayerTokens(playerId, tokenReward);

	// Check for new badges
	const newBadges = await checkAndAwardBadges(playerId);

	return new Response(
		JSON.stringify({
			xpReward,
			tokenReward,
			leveled,
			newLevel,
			unlockedCities,
			newBadges,
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
}
```

## Database Maintenance

### Update Player Stats (Batch)
```typescript
// Update last active timestamp for all players
await db.update(players).set({ lastActiveAt: new Date() });
```

### Clean Old Notifications
```typescript
import { deleteOldNotifications } from '$lib/server/game';

// Delete notifications older than 30 days
const deletedCount = await deleteOldNotifications(30);
```

### Recalculate Leaderboards
```typescript
import { recalculateTournamentRankings } from '$lib/server/game/tournaments';

// Recalculate for specific tournament
await recalculateTournamentRankings(tournamentId);
```

## Migration History

- **0000_short_jamie_braddock.sql**: Initial game schema with 27 tables

## Next Steps

1. **Create API Routes**: Implement SvelteKit API routes for all game operations
2. **Update Game Components**: Integrate database calls into GameMap, GameHUD, and game pages
3. **Add Authentication**: Ensure routes are protected with Supabase Auth
4. **Implement Webhooks**: Set up Supabase triggers for real-time updates
5. **Add Caching**: Implement Redis or similar for frequently accessed data

## Testing

```bash
# Run seed script
bun run db:seed

# Test in Drizzle Studio
bun run db:studio

# Query examples in Studio:
# - View all players: SELECT * FROM players;
# - View city gateways: SELECT * FROM city_gateways ORDER BY unlock_level;
# - View badges: SELECT * FROM badges ORDER BY rarity;
# - View tournaments: SELECT * FROM tournaments WHERE status = 'active';
```

## Schema Diagram

```
users (Supabase Auth)
  └── players
      ├── player_city_progress → city_gateways
      ├── player_badges → badges
      ├── player_challenges → game_challenges
      ├── game_sessions
      ├── game_notifications
      ├── tournament_participants → tournaments
      ├── leaderboard_entries
      └── player_crisis_progress → crisis_scenarios
```

## Support

For questions or issues with the game database:
1. Check Drizzle Studio: `bun run db:studio`
2. Review schema: `src/lib/server/db/schema.ts`
3. Check utilities: `src/lib/server/game/*.ts`
4. Review seed data: `src/lib/server/db/seed.ts`
