<script lang="ts">
	import type { PetalCategory, PetalDataPoint } from '$lib/types/petal-chart.types';
	import { PETAL_ORDER, PETAL_LABELS, PETAL_DESCRIPTIONS } from '$lib/types/petal-chart.types';
	import { PETAL_DIMENSIONS } from '$lib/types/scoring.types';

	interface Props {
		petals?: PetalDataPoint[];
		showScores?: boolean;
		showDimensions?: boolean;
		compact?: boolean;
		onPetalClick?: (category: PetalCategory) => void;
	}

	let {
		petals = [],
		showScores = true,
		showDimensions = true,
		compact = false,
		onPetalClick
	}: Props = $props();

	// Group petals by dimension
	const groupedPetals = $derived(() => {
		if (!showDimensions) return { all: PETAL_ORDER };

		const groups: Record<string, PetalCategory[]> = {
			'Quality Crown': [],
			'Risk Balance': [],
			Returns: []
		};

		for (const cat of PETAL_ORDER) {
			const dim = PETAL_DIMENSIONS[cat];
			if (dim === 'asset') groups['Quality Crown'].push(cat);
			else if (dim === 'risk') groups['Risk Balance'].push(cat);
			else groups['Returns'].push(cat);
		}

		return groups;
	});

	function getScore(category: PetalCategory): number {
		const petal = petals.find((p) => p.category === category || p.id === category);
		return petal?.score ?? 0;
	}

	// Theme-aligned score colors using gold progression
	function getScoreColor(score: number): string {
		if (score >= 7) return 'var(--primary, #c8ab37)'; // Theme primary gold - mature
		if (score >= 5) return '#d4c78a'; // Light gold - developing
		if (score >= 3) return '#a8a080'; // Muted warm - early
		return 'var(--muted-foreground, #6b7060)'; // Muted - budding
	}

	// Get contrasting text color for score badges
	// Light backgrounds (5-6 developing, 3-4 early) need dark text
	// Dark backgrounds (7-8 mature, 0-2 budding) can use light text
	function getScoreTextColor(score: number): string {
		if (score >= 7) return '#1a1a1a'; // Dark text on gold
		if (score >= 5) return '#1a1a1a'; // Dark text on light gold/ivory
		if (score >= 3) return '#1a1a1a'; // Dark text on muted warm
		return '#f8fafc'; // Light text on dark muted
	}

	function getDimensionColor(dim: string): string {
		switch (dim) {
			case 'Quality Crown':
				return 'var(--primary, #c8ab37)'; // Primary gold
			case 'Risk Balance':
				return '#a8a080'; // Muted warm
			case 'Returns':
				return '#d4c78a'; // Light gold
			default:
				return 'var(--muted-foreground, #6b7060)';
		}
	}
</script>

<div class="petal-legend" class:compact>
	{#each Object.entries(groupedPetals()) as [dimension, categories]}
		{#if showDimensions && dimension !== 'all'}
			<div class="dimension-group">
				<div class="dimension-header">
					<span class="dimension-dot" style:background-color={getDimensionColor(dimension)}></span>
					<span class="dimension-label">{dimension}</span>
				</div>
				<div class="petals-row">
					{#each categories as category}
						<button
							type="button"
							class="petal-item"
							onclick={() => onPetalClick?.(category)}
							disabled={!onPetalClick}
						>
							<span class="petal-name">{PETAL_LABELS[category]}</span>
							{#if showScores && petals.length > 0}
								<span
									class="petal-score"
									style:background-color={getScoreColor(getScore(category))}
									style:color={getScoreTextColor(getScore(category))}
								>
									{getScore(category)}
								</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{:else}
			<div class="petals-grid">
				{#each PETAL_ORDER as category}
					<button
						type="button"
						class="petal-item"
						onclick={() => onPetalClick?.(category)}
						disabled={!onPetalClick}
					>
						<span class="petal-color" style:background-color={getScoreColor(getScore(category))}
						></span>
						<span class="petal-name">{PETAL_LABELS[category]}</span>
						{#if showScores && petals.length > 0}
							<span class="petal-score-text">{getScore(category)}/8</span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	{/each}

	{#if !compact}
		<div class="color-scale">
			<span class="scale-label">Score Scale:</span>
			<div class="scale-items">
				<div class="scale-item">
					<span class="scale-dot scale-budding"></span>
					<span>0-2 Budding</span>
				</div>
				<div class="scale-item">
					<span class="scale-dot scale-early"></span>
					<span>3-4 Early</span>
				</div>
				<div class="scale-item">
					<span class="scale-dot scale-developing"></span>
					<span>5-6 Developing</span>
				</div>
				<div class="scale-item">
					<span class="scale-dot scale-mature"></span>
					<span>7-8 Mature</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.petal-legend {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.petal-legend.compact {
		gap: 0.5rem;
	}

	.dimension-group {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.dimension-header {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.dimension-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.dimension-label {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.petals-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.petals-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.375rem;
	}

	.compact .petals-grid {
		grid-template-columns: repeat(4, 1fr);
	}

	.petal-item {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.5rem;
		background: var(--muted);
		border: 1px solid transparent;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		cursor: default;
		transition: all 0.2s;
	}

	.petal-item:not(:disabled) {
		cursor: pointer;
	}

	.petal-item:not(:disabled):hover {
		border-color: var(--ring);
		background: var(--card);
	}

	.petal-color {
		width: 10px;
		height: 10px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.petal-name {
		font-weight: 500;
		color: var(--foreground);
	}

	.compact .petal-name {
		font-size: 0.6875rem;
	}

	.petal-score {
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-weight: 700;
		font-size: 0.6875rem;
		margin-left: auto;
		/* Color set inline based on background for contrast */
	}

	.petal-score-text {
		font-weight: 600;
		color: var(--muted-foreground);
		margin-left: auto;
	}

	.color-scale {
		padding-top: 0.5rem;
		border-top: 1px solid var(--border);
	}

	.scale-label {
		display: block;
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--muted-foreground);
		margin-bottom: 0.375rem;
	}

	.scale-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.scale-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.6875rem;
		color: var(--muted-foreground);
	}

	.scale-dot {
		width: 12px;
		height: 12px;
		border-radius: 2px;
	}

	/* Theme-aligned scale colors */
	.scale-dot.scale-budding {
		background-color: var(--muted-foreground, #6b7060);
	}

	.scale-dot.scale-early {
		background-color: #a8a080;
	}

	.scale-dot.scale-developing {
		background-color: #d4c78a;
	}

	.scale-dot.scale-mature {
		background-color: var(--primary, #c8ab37);
	}
</style>
