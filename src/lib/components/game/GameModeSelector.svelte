<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Target,
		X,
		Gamepad2,
		GraduationCap,
		TrendingUp,
		Lock,
		ChevronRight,
		Sparkles
	} from 'lucide-svelte';
	import type { GameMode, PlayerTier } from '$lib/types/game.types';

	interface GameModeSelectorProps {
		playerTier: PlayerTier;
		playerLevel: number;
		onSelectMode?: (mode: GameMode) => void;
		onClose?: () => void;
	}

	let {
		playerTier = 'novice',
		playerLevel = 1,
		onSelectMode,
		onClose
	}: GameModeSelectorProps = $props();

	// Use typeof to capture the actual lucide icon type
	type LucideIcon = typeof Gamepad2;

	interface GameModeInfo {
		id: GameMode;
		name: string;
		subtitle: string;
		description: string;
		icon: LucideIcon;
		features: string[];
		unlockRequirement: { tier: PlayerTier; level: number } | null;
		colorClass: string;
	}

	// Using gold progression for game mode theming with lucide icons
	const gameModes: GameModeInfo[] = [
		{
			id: 'sandbox',
			name: 'The Sandbox',
			subtitle: 'Learn & Practice',
			description: 'Free play environment with no risk. Perfect for learning property analysis and Guardian-grade scoring.',
			icon: Gamepad2,
			features: ['No stakes - learn freely', 'Unlimited retries', 'AI tutoring', 'Practice challenges'],
			unlockRequirement: null,
			colorClass: 'budding'
		},
		{
			id: 'academy',
			name: 'The Academy',
			subtitle: 'Competitive Play',
			description: 'Earn $DEED tokens by completing challenges. Compete on leaderboards and climb the ranks.',
			icon: GraduationCap,
			features: ['Earn $DEED tokens', 'Weekly tournaments', 'Skill-based matching', 'Leaderboard rankings'],
			unlockRequirement: { tier: 'novice', level: 5 },
			colorClass: 'developing'
		},
		{
			id: 'trading-floor',
			name: 'The Trading Floor',
			subtitle: 'High-Stakes Pro Mode',
			description: 'Professional-grade challenges with real capital implications. Top performers earn $DGURU equity tokens.',
			icon: TrendingUp,
			features: ['Stake $DEED tokens', 'Earn $DGURU equity', 'Pro-tier challenges', 'Real-world impact'],
			unlockRequirement: { tier: 'intermediate', level: 15 },
			colorClass: 'mature'
		}
	];

	// Check if a mode is unlocked
	function isUnlocked(mode: GameModeInfo): boolean {
		if (!mode.unlockRequirement) return true;

		const tierOrder: PlayerTier[] = ['novice', 'intermediate', 'professional'];
		const playerTierIndex = tierOrder.indexOf(playerTier);
		const requiredTierIndex = tierOrder.indexOf(mode.unlockRequirement.tier);

		if (playerTierIndex > requiredTierIndex) return true;
		if (playerTierIndex < requiredTierIndex) return false;
		return playerLevel >= mode.unlockRequirement.level;
	}

	function handleSelectMode(mode: GameModeInfo) {
		if (isUnlocked(mode) && onSelectMode) {
			onSelectMode(mode.id);
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
		color: #f8fafc; /* Force light text */
	}

	.glass-card {
		background: linear-gradient(
			135deg,
			rgba(30, 41, 59, 0.6) 0%,
			rgba(30, 41, 59, 0.4) 100%
		);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		transition: all 0.3s ease;
		color: #f8fafc; /* Force light text */
	}

	.glass-card:not(:disabled):hover {
		background: linear-gradient(
			135deg,
			rgba(30, 41, 59, 0.7) 0%,
			rgba(30, 41, 59, 0.5) 100%
		);
		border-color: rgba(255, 255, 255, 0.15);
		transform: translateY(-2px);
	}

	.glass-card.budding {
		border-left: 3px solid #6b7060;
	}
	.glass-card.budding:not(:disabled):hover {
		border-left-color: #a8a080;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), -4px 0 16px rgba(107, 112, 96, 0.2);
	}

	.glass-card.developing {
		border-left: 3px solid #d4c78a;
	}
	.glass-card.developing:not(:disabled):hover {
		border-left-color: #c8ab37;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), -4px 0 16px rgba(212, 199, 138, 0.3);
	}

	.glass-card.mature {
		border-left: 3px solid #c8ab37;
	}
	.glass-card.mature:not(:disabled):hover {
		border-left-color: #c8ab37;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), -4px 0 16px rgba(200, 171, 55, 0.4);
	}

	.icon-container {
		background: linear-gradient(
			135deg,
			rgba(51, 65, 85, 0.6) 0%,
			rgba(51, 65, 85, 0.4) 100%
		);
		backdrop-filter: blur(4px);
	}

	.icon-container.budding { color: #a8a080; }
	.icon-container.developing { color: #d4c78a; }
	.icon-container.mature { color: #c8ab37; }

	/* Override theme text colors for dark map context */
	.glass-modal :global(.text-foreground) {
		color: #f8fafc !important;
	}

	.glass-modal :global(.text-muted-foreground) {
		color: #94a3b8 !important;
	}
</style>

<!-- Backdrop -->
<div
	class="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
	onclick={onClose}
	onkeydown={(e) => e.key === 'Escape' && onClose?.()}
	role="button"
	tabindex="0"
>
	<!-- Modal Content -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		class="glass-modal rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="dialog"
		aria-label="Game Mode Selection"
	>
		<!-- Header -->
		<div class="p-6 border-b border-white/10">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-2xl font-bold text-slate-50 flex items-center gap-3">
						<Target class="h-7 w-7 text-primary" />
						Select Game Mode
					</h2>
					<p class="text-slate-400 mt-1">Choose your path to mastery</p>
				</div>
				<Button variant="ghost" size="icon" class="text-slate-400 hover:text-slate-50 hover:bg-white/5 rounded-full" onclick={onClose}>
					<X class="h-5 w-5" />
				</Button>
			</div>
		</div>

		<!-- Game Modes Grid -->
		<div class="p-6 grid gap-4">
			{#each gameModes as mode}
				{@const unlocked = isUnlocked(mode)}
				<button
					class="glass-card {mode.colorClass} w-full text-left p-6 rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
					disabled={!unlocked}
					onclick={() => handleSelectMode(mode)}
				>
					<div class="flex gap-6">
						<!-- Icon -->
						<div class="shrink-0">
							<div class="icon-container {mode.colorClass} size-20 rounded-xl flex items-center justify-center">
								{#if unlocked}
									{@const Icon = mode.icon}
									<Icon class="h-10 w-10" />
								{:else}
									<Lock class="h-10 w-10 text-slate-500" />
								{/if}
							</div>
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between mb-2">
								<div>
									<h3 class="text-xl font-bold text-slate-50">{mode.name}</h3>
									<p class="text-sm text-slate-400">{mode.subtitle}</p>
								</div>
								{#if !unlocked && mode.unlockRequirement}
									<Badge class="bg-slate-700/50 text-slate-400 border-slate-600/30 backdrop-blur-sm">
										<Lock class="h-3 w-3 mr-1" />
										{mode.unlockRequirement.tier.charAt(0).toUpperCase() + mode.unlockRequirement.tier.slice(1)} Lv.{mode.unlockRequirement.level}
									</Badge>
								{:else if mode.id === 'trading-floor'}
									<Badge class="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
										<Sparkles class="h-3 w-3 mr-1" />
										Pro Mode
									</Badge>
								{/if}
							</div>

							<p class="text-slate-300 text-sm mb-4">{mode.description}</p>

							<!-- Features -->
							<div class="flex flex-wrap gap-2">
								{#each mode.features as feature}
									<span class="text-xs px-2.5 py-1 rounded-full bg-slate-800/50 text-slate-300 backdrop-blur-sm ring-1 ring-white/10">
										{feature}
									</span>
								{/each}
							</div>
						</div>

						<!-- Arrow -->
						<div class="shrink-0 flex items-center">
							{#if unlocked}
								<ChevronRight class="h-6 w-6 text-slate-400" />
							{/if}
						</div>
					</div>
				</button>
			{/each}
		</div>

		<!-- Footer -->
		<div class="p-6 border-t border-white/10 bg-slate-900/30">
			<div class="flex items-center justify-between text-sm">
				<div class="flex items-center gap-4 text-slate-400">
					<span>Your Tier: <span class="text-slate-50 font-semibold capitalize">{playerTier}</span></span>
					<span class="text-slate-600">|</span>
					<span>Level: <span class="text-slate-50 font-semibold">{playerLevel}</span></span>
				</div>
				<p class="text-slate-500">
					Complete challenges to unlock new modes
				</p>
			</div>
		</div>
	</div>
</div>
