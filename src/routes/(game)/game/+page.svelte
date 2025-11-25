<script lang="ts">
	import { GameHUD, GameMap, GameModeSelector } from '$lib/components/game';
	import { Button } from '$lib/components/ui/button';
	import {
		Home,
		ArrowLeft,
		ArrowRight,
		MapPin,
		X,
		Coins,
		Sparkles,
		Lock,
		Gamepad2,
		Heart,
		Building2,
		TrendingUp,
		Globe
	} from 'lucide-svelte';
	import type { PlayerProfile, GameSession, Tournament, GameMode, CityGateway, CityTier } from '$lib/types/game.types';

	// Demo player profile
	let player = $state<PlayerProfile>({
		id: 'demo-player-1',
		username: 'PropertyMaster',
		tier: 'novice',
		level: 7,
		xp: 2450,
		xpToNextLevel: 5000,
		tokens: {
			deed: 15750,
			dguru: 125
		},
		propertiesAnalyzed: 42,
		dealsCompleted: 8,
		accuracyScore: 87,
		streak: 5,
		familiesHoused: 12,
		affordableUnitsCreated: 3,
		communityScore: 156,
		badges: [
			{ id: 'first-analysis', name: 'First Steps', description: 'Complete your first property analysis', icon: '🎯', earnedAt: new Date(), rarity: 'common' },
			{ id: 'streak-3', name: 'On Fire', description: 'Get 3 correct analyses in a row', icon: '🔥', earnedAt: new Date(), rarity: 'uncommon' },
			{ id: 'bloom-master', name: 'Bloom Master', description: 'Score a property with 60+ Bloom Score', icon: '🌸', earnedAt: new Date(), rarity: 'rare' }
		],
		titles: ['Property Scout', 'Deal Hunter'],
		currentTitle: 'Deal Hunter',
		joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
		lastActiveAt: new Date()
	});

	// Current game session (null when in lobby)
	let session = $state<GameSession | null>(null);

	// Active tournaments
	let activeTournaments = $state<Tournament[]>([
		{
			id: 'weekly-sprint',
			name: 'Weekly Sprint Challenge',
			description: 'Analyze 10 properties as fast as possible with highest accuracy',
			mode: 'academy',
			startAt: new Date(),
			endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
			entryFee: 100,
			prizePool: 50000,
			participants: 847,
			maxParticipants: 2000,
			status: 'active'
		}
	]);

	// UI state
	let showModeSelector = $state(false);
	let showWelcome = $state(true);
	let selectedCity = $state<CityGateway | null>(null);
	let currentMode = $state<GameMode | null>(null);

	function handleCityClick(city: CityGateway) {
		selectedCity = city;
	}

	function handleSelectMode(mode: GameMode) {
		currentMode = mode;
		showModeSelector = false;
		showWelcome = false;

		// Start a session for the mode
		session = {
			mode,
			score: 0,
			streak: 0,
			timeRemaining: mode === 'sandbox' ? undefined : 600
		};
	}

	function handleOpenMenu() {
		window.location.href = '/dashboard';
	}

	function handleStartPlaying() {
		showWelcome = false;
		showModeSelector = true;
	}

	function handleExitToApp() {
		window.location.href = '/dashboard';
	}

	function handleEnterCity() {
		if (selectedCity) {
			// TODO: Navigate to city-specific game view
			console.log('Entering city:', selectedCity.name);
			selectedCity = null;
		}
	}

	// Get tier badge styling
	function getTierBadgeClass(tier: CityTier): string {
		switch (tier) {
			case 'expert': return 'bg-primary/20 text-primary border-primary/30';
			case 'advanced': return 'bg-[#d4c78a]/20 text-[#d4c78a] border-[#d4c78a]/30';
			case 'intermediate': return 'bg-[#a8a080]/20 text-[#a8a080] border-[#a8a080]/30';
			case 'starter': return 'bg-[#6b7060]/20 text-[#a8a080] border-[#6b7060]/30';
			default: return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
		}
	}
</script>

<style>
	.glass-modal {
		background: linear-gradient(
			135deg,
			rgba(15, 23, 42, 0.92) 0%,
			rgba(15, 23, 42, 0.85) 100%
		);
		backdrop-filter: blur(24px) saturate(180%);
		-webkit-backdrop-filter: blur(24px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.5),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
		color: #f8fafc;
	}

	.glass-panel {
		background: linear-gradient(
			135deg,
			rgba(15, 23, 42, 0.75) 0%,
			rgba(15, 23, 42, 0.6) 100%
		);
		backdrop-filter: blur(16px) saturate(180%);
		-webkit-backdrop-filter: blur(16px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
		color: #f8fafc;
	}

	.glass-stat {
		background: linear-gradient(
			135deg,
			rgba(30, 41, 59, 0.6) 0%,
			rgba(30, 41, 59, 0.4) 100%
		);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		color: #f8fafc;
	}
</style>

<svelte:head>
	<title>deed.guru Game | Play Games, House Families</title>
</svelte:head>

<!-- Full-screen game map -->
<GameMap
	playerLevel={player.level}
	onCityClick={handleCityClick}
/>

<!-- Game HUD Overlay -->
<GameHUD
	{player}
	{session}
	{activeTournaments}
	onOpenMenu={handleOpenMenu}
/>

<!-- Welcome Modal (first time) -->
{#if showWelcome}
	<div class="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-60 flex items-center justify-center p-4">
		<div class="glass-modal rounded-2xl max-w-2xl w-full p-8">
			<!-- Logo/Title -->
			<div class="text-center mb-8">
				<div class="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-primary/80 to-[#a8960b]/80 mb-4 ring-4 ring-primary/20">
					<Home class="h-10 w-10 text-slate-900" />
				</div>
				<h1 class="text-4xl font-bold text-slate-50 mb-2">
					deed.<span class="text-primary">guru</span> Game
				</h1>
				<p class="text-xl text-primary font-medium">Play Games, House Families</p>
			</div>

			<!-- Description -->
			<div class="text-center text-slate-300 mb-8 space-y-2">
				<p>Master real estate investment through gamified learning.</p>
				<p>Explore <span class="text-primary font-semibold">12 global cities</span>, analyze properties, and earn rewards.</p>
			</div>

			<!-- Player Stats Summary -->
			<div class="grid grid-cols-3 gap-4 mb-8">
				<div class="glass-stat rounded-xl p-4 text-center ring-1 ring-white/10">
					<div class="text-3xl font-bold text-slate-50">{player.level}</div>
					<div class="text-sm text-slate-400">Level</div>
				</div>
				<div class="glass-stat rounded-xl p-4 text-center ring-1 ring-primary/20">
					<div class="text-3xl font-bold text-primary">{player.tokens.deed.toLocaleString()}</div>
					<div class="text-sm text-slate-400">$DEED</div>
				</div>
				<div class="glass-stat rounded-xl p-4 text-center ring-1 ring-[#d4c78a]/20">
					<div class="text-3xl font-bold text-[#d4c78a]">{player.familiesHoused}</div>
					<div class="text-sm text-slate-400">Families Housed</div>
				</div>
			</div>

			<!-- Impact Message -->
			<div class="glass-stat rounded-xl p-4 mb-8 ring-1 ring-primary/20">
				<div class="flex items-center gap-3">
					<Heart class="h-6 w-6 text-primary" />
					<div>
						<p class="text-primary font-medium">Your Impact Matters</p>
						<p class="text-sm text-slate-300">Every game session contributes to real affordable housing initiatives.</p>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-4">
				<Button
					variant="outline"
					class="flex-1 border-slate-600/50 text-slate-200 hover:bg-white/5 backdrop-blur-sm"
					onclick={handleExitToApp}
				>
					<ArrowLeft class="h-4 w-4 mr-2" />
					Back to App
				</Button>
				<Button
					class="flex-1 bg-gradient-to-r from-primary to-[#a8960b] hover:from-primary/90 hover:to-[#a8960b]/90 text-slate-900 font-bold"
					onclick={handleStartPlaying}
				>
					Start Playing
					<ArrowRight class="h-4 w-4 ml-2" />
				</Button>
			</div>

			<!-- Tutorial link -->
			<p class="text-center text-sm text-slate-400 mt-4">
				Start with <span class="text-[#6b7060] font-semibold">Starter cities</span> (San Diego, Sydney, Manila) to learn.
			</p>
		</div>
	</div>
{/if}

<!-- Game Mode Selector Modal -->
{#if showModeSelector}
	<GameModeSelector
		playerTier={player.tier}
		playerLevel={player.level}
		onSelectMode={handleSelectMode}
		onClose={() => showModeSelector = false}
	/>
{/if}

<!-- Selected City Panel -->
{#if selectedCity && !showWelcome && !showModeSelector}
	<div class="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-96">
		<div class="glass-panel rounded-xl overflow-hidden">
			<!-- Header -->
			<div class="p-5 border-b border-white/10">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<div class="size-14 rounded-xl bg-gradient-to-br from-primary/30 to-[#a8960b]/20 flex items-center justify-center ring-2 ring-primary/20">
							<Globe class="h-7 w-7 text-primary" />
						</div>
						<div>
							<h3 class="font-bold text-slate-50 text-xl">{selectedCity.name}</h3>
							<div class="flex items-center gap-2 mt-1">
								<span class="text-slate-400 text-sm">{selectedCity.country}</span>
								<span class="text-xs px-2 py-0.5 rounded-full {getTierBadgeClass(selectedCity.tier)} font-semibold uppercase">
									{selectedCity.tier}
								</span>
							</div>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						class="text-slate-400 hover:text-slate-50 hover:bg-white/5 rounded-full"
						onclick={() => selectedCity = null}
					>
						<X class="h-5 w-5" />
					</Button>
				</div>
			</div>

			<!-- Content -->
			<div class="p-5 space-y-5">
				<!-- Progress -->
				<div>
					<div class="flex justify-between text-sm mb-2">
						<span class="text-slate-400">Challenge Progress</span>
						<span class="text-slate-200 font-medium">{selectedCity.completedChallenges}/{selectedCity.totalChallenges}</span>
					</div>
					<div class="h-3 bg-slate-800/50 rounded-full overflow-hidden ring-1 ring-white/10">
						<div
							class="h-full bg-gradient-to-r from-primary to-[#d4c78a]"
							style="width: {(selectedCity.completedChallenges / selectedCity.totalChallenges) * 100}%"
						></div>
					</div>
				</div>

				<!-- Market Stats -->
				<div class="grid grid-cols-3 gap-3">
					<div class="glass-stat rounded-lg p-3 text-center ring-1 ring-white/10">
						<Building2 class="h-4 w-4 text-slate-400 mx-auto mb-1" />
						<div class="text-slate-50 font-bold">{selectedCity.marketStats.properties}</div>
						<div class="text-xs text-slate-500">Properties</div>
					</div>
					<div class="glass-stat rounded-lg p-3 text-center ring-1 ring-white/10">
						<MapPin class="h-4 w-4 text-slate-400 mx-auto mb-1" />
						<div class="text-slate-50 font-bold text-sm">{selectedCity.marketStats.avgPrice}</div>
						<div class="text-xs text-slate-500">Avg Price</div>
					</div>
					<div class="glass-stat rounded-lg p-3 text-center ring-1 ring-primary/20">
						<TrendingUp class="h-4 w-4 text-primary mx-auto mb-1" />
						<div class="text-primary font-bold">{selectedCity.marketStats.growth}</div>
						<div class="text-xs text-slate-500">Growth</div>
					</div>
				</div>

				<!-- Rewards -->
				<div class="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 ring-1 ring-white/5">
					<span class="text-slate-400 text-sm">Total Rewards:</span>
					<div class="flex items-center gap-4">
						<span class="flex items-center gap-1 text-primary font-bold">
							<Coins class="h-4 w-4" />
							{selectedCity.rewards.deed.toLocaleString()}
						</span>
						<span class="flex items-center gap-1 text-[#d4c78a] font-bold">
							<Sparkles class="h-4 w-4" />
							{selectedCity.rewards.xp.toLocaleString()} XP
						</span>
					</div>
				</div>

				<!-- Action Button -->
				{#if selectedCity.status === 'available'}
					<Button
						class="w-full bg-gradient-to-r from-primary to-[#a8960b] hover:from-primary/90 hover:to-[#a8960b]/90 text-slate-900 font-bold h-12 text-base"
						onclick={handleEnterCity}
					>
						<Globe class="h-5 w-5 mr-2" />
						Enter {selectedCity.name}
					</Button>
				{:else}
					<Button variant="outline" class="w-full border-slate-600/50 text-slate-500 h-12" disabled>
						<Lock class="h-5 w-5 mr-2" />
						Unlock at Level {selectedCity.unlockLevel}
					</Button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Quick Mode Selector (bottom left when in game) -->
{#if !showWelcome && !showModeSelector}
	<div class="fixed bottom-24 left-4 z-50">
		<Button
			class="glass-panel hover:bg-white/5 text-slate-50 shadow-xl"
			onclick={() => showModeSelector = true}
		>
			<Gamepad2 class="h-4 w-4 mr-2" />
			{currentMode ? currentMode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Select Mode'}
		</Button>
	</div>
{/if}
