<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Flame,
		Backpack,
		BarChart3,
		Settings,
		Trophy,
		Home,
		Clock,
		Coins,
		Gem
	} from 'lucide-svelte';
	import type { PlayerProfile, GameSession, Tournament } from '$lib/types/game.types';

	interface GameHUDProps {
		player: PlayerProfile;
		session?: GameSession | null;
		activeTournaments?: Tournament[];
		onOpenMenu?: () => void;
		onOpenInventory?: () => void;
		onOpenLeaderboard?: () => void;
	}

	let {
		player,
		session = null,
		activeTournaments = [],
		onOpenMenu,
		onOpenInventory,
		onOpenLeaderboard
	}: GameHUDProps = $props();

	// Calculate XP progress percentage
	const xpProgress = $derived((player.xp / player.xpToNextLevel) * 100);

	// Tier colors - using gold progression for game UI chrome
	const tierColors: Record<string, string> = {
		novice: 'bg-[#6b7060]/30 text-[#a8a080] border-[#6b7060]/40',
		intermediate: 'bg-[#d4c78a]/30 text-[#d4c78a] border-[#d4c78a]/40',
		professional: 'bg-primary/30 text-primary border-primary/40'
	};

	// Format large numbers
	function formatNumber(n: number): string {
		if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
		if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
		return n.toLocaleString();
	}
</script>

<!-- Glass morphism styles for HUD panels - dark map background requires light text -->
<style>
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
		color: #f8fafc; /* Force light text */
	}

	.glass-panel-accent {
		background: linear-gradient(
			135deg,
			rgba(200, 171, 55, 0.2) 0%,
			rgba(200, 171, 55, 0.1) 100%
		);
		backdrop-filter: blur(16px) saturate(180%);
		-webkit-backdrop-filter: blur(16px) saturate(180%);
		border: 1px solid rgba(200, 171, 55, 0.3);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(200, 171, 55, 0.15);
		color: #f8fafc; /* Force light text */
	}

	/* Override theme text colors for dark map */
	.glass-panel :global(.text-foreground),
	.glass-panel-accent :global(.text-foreground) {
		color: #f8fafc !important;
	}

	.glass-panel :global(.text-muted-foreground),
	.glass-panel-accent :global(.text-muted-foreground) {
		color: #94a3b8 !important;
	}
</style>

<!-- Top Bar HUD -->
<div class="absolute top-0 left-0 right-0 z-50 pointer-events-none">
	<div class="flex items-start justify-between p-4 gap-4">
		<!-- Left: Player Info -->
		<div class="pointer-events-auto">
			<div class="glass-panel rounded-xl p-4">
				<div class="flex items-center gap-4">
					<!-- Avatar & Level -->
					<div class="relative">
						<div class="size-14 rounded-full bg-gradient-to-br from-primary/80 to-[#a8960b]/80 flex items-center justify-center text-xl font-bold text-background ring-2 ring-primary/30">
							{player.level}
						</div>
						<Badge class="{tierColors[player.tier]} absolute -bottom-1 -right-1 text-[10px] px-1.5 backdrop-blur-sm">
							{player.tier.charAt(0).toUpperCase()}
						</Badge>
					</div>

					<!-- Player Details -->
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<span class="font-bold text-foreground">{player.username}</span>
							<Badge class="bg-primary/20 text-primary border-primary/30 text-xs backdrop-blur-sm">
								{player.currentTitle}
							</Badge>
						</div>

						<!-- XP Bar -->
						<div class="w-40">
							<div class="flex justify-between text-xs text-muted-foreground mb-1">
								<span>Level {player.level}</span>
								<span>{player.xp.toLocaleString()} / {player.xpToNextLevel.toLocaleString()} XP</span>
							</div>
							<div class="h-2 bg-background/30 rounded-full overflow-hidden ring-1 ring-border/20">
								<div
									class="h-full bg-gradient-to-r from-primary to-[#d4c78a] transition-all duration-500"
									style="width: {xpProgress}%"
								></div>
							</div>
						</div>

						<!-- Streak -->
						{#if player.streak > 0}
							<div class="flex items-center gap-1 text-xs">
								<Flame class="h-3.5 w-3.5 text-primary" />
								<span class="text-primary font-semibold">{player.streak} streak</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Center: Session Info (if in game) -->
		{#if session}
			<div class="pointer-events-auto">
				<div class="glass-panel-accent rounded-xl p-4 text-center">
					<div class="text-xs text-muted-foreground uppercase tracking-wide mb-1">
						{session.mode.replace('-', ' ')}
					</div>
					<div class="text-2xl font-bold text-foreground">
						{session.score.toLocaleString()}
					</div>
					{#if session.timeRemaining !== undefined}
						<div class="flex items-center justify-center gap-1 text-sm text-primary mt-1">
							<Clock class="h-4 w-4" />
							<span>{Math.floor(session.timeRemaining / 60)}:{(session.timeRemaining % 60).toString().padStart(2, '0')}</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Right: Token Balances -->
		<div class="pointer-events-auto">
			<div class="glass-panel rounded-xl p-4">
				<div class="flex items-center gap-6">
					<!-- $DEED Token -->
					<div class="text-center">
						<div class="flex items-center gap-2">
							<div class="size-8 rounded-full bg-gradient-to-br from-primary/80 to-[#a8960b]/80 flex items-center justify-center ring-2 ring-primary/30">
								<Coins class="h-4 w-4 text-background" />
							</div>
							<div>
								<div class="text-xs text-muted-foreground">$DEED</div>
								<div class="font-bold text-foreground">{formatNumber(player.tokens.deed)}</div>
							</div>
						</div>
					</div>

					<!-- Divider -->
					<div class="h-8 w-px bg-border/30"></div>

					<!-- $DGURU Token -->
					<div class="text-center">
						<div class="flex items-center gap-2">
							<div class="size-8 rounded-full bg-gradient-to-br from-[#d4c78a]/80 to-[#a8a080]/80 flex items-center justify-center ring-2 ring-[#d4c78a]/30">
								<Gem class="h-4 w-4 text-background" />
							</div>
							<div>
								<div class="text-xs text-muted-foreground">$DGURU</div>
								<div class="font-bold text-foreground">{formatNumber(player.tokens.dguru)}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Bottom Bar HUD -->
<div class="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
	<div class="flex items-end justify-between p-4 gap-4">
		<!-- Left: Quick Stats -->
		<div class="pointer-events-auto">
			<div class="glass-panel rounded-xl p-3">
				<div class="flex items-center gap-4 text-sm">
					<div class="text-center px-3 border-r border-border/30">
						<div class="text-muted-foreground text-xs">Analyzed</div>
						<div class="font-bold text-foreground">{player.propertiesAnalyzed}</div>
					</div>
					<div class="text-center px-3 border-r border-border/30">
						<div class="text-muted-foreground text-xs">Deals</div>
						<div class="font-bold text-foreground">{player.dealsCompleted}</div>
					</div>
					<div class="text-center px-3 border-r border-border/30">
						<div class="text-muted-foreground text-xs">Accuracy</div>
						<div class="font-bold text-primary">{player.accuracyScore}%</div>
					</div>
					<div class="text-center px-3">
						<div class="text-muted-foreground text-xs">Impact</div>
						<div class="font-bold text-primary flex items-center gap-1">
							<Home class="h-3.5 w-3.5" />
							{player.familiesHoused}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Center: Active Tournaments Banner -->
		{#if activeTournaments.length > 0}
			<div class="pointer-events-auto">
				<div class="glass-panel-accent rounded-xl p-3">
					<div class="flex items-center gap-3">
						<Trophy class="h-6 w-6 text-primary" />
						<div>
							<div class="text-xs text-[#d4c78a] uppercase tracking-wide">Live Tournament</div>
							<div class="font-bold text-foreground">{activeTournaments[0].name}</div>
						</div>
						<Button size="sm" class="bg-primary/90 hover:bg-primary text-background backdrop-blur-sm">
							Join Now
						</Button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Right: Navigation Buttons -->
		<div class="pointer-events-auto">
			<div class="glass-panel rounded-xl p-2">
				<div class="flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						class="text-muted-foreground hover:text-foreground hover:bg-foreground/5"
						onclick={onOpenInventory}
					>
						<Backpack class="h-4 w-4" />
						<span class="ml-1.5">Inventory</span>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						class="text-muted-foreground hover:text-foreground hover:bg-foreground/5"
						onclick={onOpenLeaderboard}
					>
						<BarChart3 class="h-4 w-4" />
						<span class="ml-1.5">Leaderboard</span>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						class="text-muted-foreground hover:text-foreground hover:bg-foreground/5"
						onclick={onOpenMenu}
					>
						<Settings class="h-4 w-4" />
						<span class="ml-1.5">Menu</span>
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>
