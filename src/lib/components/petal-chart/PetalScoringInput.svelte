<script lang="ts">
	import { ChevronDown, ChevronUp, Info } from 'lucide-svelte';
	import type { PetalCategory } from '$lib/types/petal-chart.types';
	import { PETAL_LABELS, PETAL_DESCRIPTIONS } from '$lib/types/petal-chart.types';
	import { PETAL_SUB_CRITERIA, type SubCriteria, type SubCriteriaDefinition } from '$lib/types/scoring.types';

	interface Props {
		category: PetalCategory;
		subCriteriaScores?: SubCriteria[];
		onScoreChange?: (category: PetalCategory, subCriteria: SubCriteria[]) => void;
		expanded?: boolean;
		readonly?: boolean;
	}

	let {
		category,
		subCriteriaScores = $bindable(),
		onScoreChange,
		expanded = false,
		readonly = false
	}: Props = $props();

	let isExpanded = $state(expanded);

	// Get sub-criteria definitions for this category
	const definitions: SubCriteriaDefinition[] = PETAL_SUB_CRITERIA[category] ?? [];

	// Initialize scores from props or defaults
	let scores = $state<SubCriteria[]>(
		subCriteriaScores ?? definitions.map((def) => ({
			id: def.id,
			label: def.label,
			score: 4, // Default mid-score
			weight: def.weight,
			description: def.description,
			measurementType: def.measurementType
		}))
	);

	// Calculate weighted petal score
	const petalScore = $derived(() => {
		const total = scores.reduce((sum, sc) => sum + sc.score * sc.weight, 0);
		return Math.round(total * 10) / 10;
	});

	function handleScoreChange(index: number, newScore: number) {
		if (readonly) return;
		const newScores = [...scores];
		newScores[index] = { ...newScores[index], score: newScore };
		scores = newScores;
		subCriteriaScores = newScores;
		onScoreChange?.(category, newScores);
	}

	function getScoreColor(score: number): string {
		if (score >= 7) return '#B8860B'; // Dark gold - mature
		if (score >= 5) return '#E8DCC4'; // Cream - developing
		if (score >= 3) return '#86efac'; // Light green - early
		return '#22c55e'; // Green - budding
	}

	function getScoreLabel(score: number): string {
		if (score >= 7) return 'Excellent';
		if (score >= 5) return 'Good';
		if (score >= 3) return 'Fair';
		return 'Needs Work';
	}
</script>

<div class="petal-scoring-input" class:expanded={isExpanded}>
	<button
		type="button"
		class="petal-header"
		onclick={() => (isExpanded = !isExpanded)}
		disabled={readonly && !isExpanded}
	>
		<div class="petal-info">
			<span class="petal-label">{PETAL_LABELS[category]}</span>
			<span class="petal-description">{PETAL_DESCRIPTIONS[category]}</span>
		</div>
		<div class="petal-score-badge" style:background-color={getScoreColor(petalScore())}>
			<span class="score-value">{petalScore()}</span>
			<span class="score-max">/8</span>
		</div>
		{#if !readonly}
			<span class="expand-icon">
				{#if isExpanded}
					<ChevronUp class="h-4 w-4" />
				{:else}
					<ChevronDown class="h-4 w-4" />
				{/if}
			</span>
		{/if}
	</button>

	{#if isExpanded}
		<div class="sub-criteria-list">
			{#each scores as sc, index}
				{@const def = definitions[index]}
				<div class="sub-criteria-item">
					<div class="criteria-header">
						<span class="criteria-label">{sc.label}</span>
						<span class="criteria-weight">({Math.round(sc.weight * 100)}%)</span>
						{#if def?.howToMeasure}
							<button type="button" class="info-btn" title={def.howToMeasure}>
								<Info class="h-3 w-3" />
							</button>
						{/if}
					</div>

					{#if readonly}
						<div class="score-display">
							<div
								class="score-bar"
								style:width="{(sc.score / 8) * 100}%"
								style:background-color={getScoreColor(sc.score)}
							></div>
							<span class="score-text">{sc.score}/8 - {getScoreLabel(sc.score)}</span>
						</div>
					{:else}
						<div class="score-slider">
							<input
								type="range"
								min={0}
								max={8}
								step={0.5}
								value={sc.score}
								oninput={(e) => handleScoreChange(index, Number(e.currentTarget.value))}
								class="slider-input"
							/>
							<span class="score-label" style:color={getScoreColor(sc.score)}>
								{sc.score} - {getScoreLabel(sc.score)}
							</span>
						</div>
					{/if}

					{#if def?.description}
						<p class="criteria-description">{def.description}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.petal-scoring-input {
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--card);
	}

	.petal-scoring-input.expanded {
		border-color: var(--primary);
	}

	.petal-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
	}

	.petal-header:hover {
		background: var(--muted);
	}

	.petal-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.petal-label {
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--foreground);
	}

	.petal-description {
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}

	.petal-score-badge {
		display: flex;
		align-items: baseline;
		gap: 0.125rem;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		color: var(--foreground);
	}

	.score-value {
		font-weight: 700;
		font-size: 1rem;
	}

	.score-max {
		font-size: 0.625rem;
		opacity: 0.7;
	}

	.expand-icon {
		color: var(--muted-foreground);
	}

	.sub-criteria-list {
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sub-criteria-item {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.criteria-header {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.criteria-label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--foreground);
	}

	.criteria-weight {
		font-size: 0.6875rem;
		color: var(--muted-foreground);
	}

	.info-btn {
		padding: 0.125rem;
		background: none;
		border: none;
		color: var(--muted-foreground);
		cursor: help;
	}

	.info-btn:hover {
		color: var(--foreground);
	}

	.score-slider {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.slider-input {
		flex: 1;
		height: 6px;
		border-radius: 3px;
		background: var(--muted);
		appearance: none;
		cursor: pointer;
	}

	.slider-input::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--primary);
		border: 2px solid var(--background);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	.slider-input::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--primary);
		border: 2px solid var(--background);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	.score-label {
		font-size: 0.75rem;
		font-weight: 600;
		min-width: 80px;
	}

	.score-display {
		position: relative;
		height: 20px;
		background: var(--muted);
		border-radius: 4px;
		overflow: hidden;
	}

	.score-bar {
		height: 100%;
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.score-text {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--foreground);
	}

	.criteria-description {
		font-size: 0.6875rem;
		color: var(--muted-foreground);
		margin: 0;
		line-height: 1.4;
	}
</style>
