<script lang="ts">
	import type { PetalCategory } from '$lib/types/petal-chart.types';
	import { PETAL_LABELS, PETAL_DESCRIPTIONS } from '$lib/types/petal-chart.types';
	import {
		PETAL_SUB_CRITERIA,
		PETAL_DIMENSIONS,
		SCORE_INTERPRETATIONS,
		getScoreInterpretation,
		type SubCriteriaDefinition,
		type PetalDimension
	} from '$lib/types/scoring.types';
	import { ChevronDown, ChevronUp, Info, TrendingUp, TrendingDown, Minus } from 'lucide-svelte';

	interface Props {
		category: PetalCategory;
		score: number;
		confidence?: number;
		trend?: 'up' | 'down' | 'stable';
		subScores?: Array<{
			id: string;
			score: number;
			rawValue?: number | boolean | string;
		}>;
		expanded?: boolean;
		onToggle?: () => void;
	}

	let {
		category,
		score,
		confidence = 0.85,
		trend = 'stable',
		subScores = [],
		expanded = false,
		onToggle
	}: Props = $props();

	const subCriteria = $derived(PETAL_SUB_CRITERIA[category]);
	const dimension = $derived(PETAL_DIMENSIONS[category]);
	const interpretation = $derived(getScoreInterpretation(score));

	const dimensionColors: Record<PetalDimension, string> = {
		returns: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
		asset: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
		risk: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
	};

	const dimensionLabels: Record<PetalDimension, string> = {
		returns: 'Returns',
		asset: 'Asset',
		risk: 'Risk'
	};

	function getSubScore(criteriaId: string): number {
		const found = subScores.find((s) => s.id === criteriaId);
		return found?.score ?? 5; // Default mid-score
	}

	function getRawValue(criteriaId: string): string | undefined {
		const found = subScores.find((s) => s.id === criteriaId);
		if (found?.rawValue === undefined) return undefined;
		if (typeof found.rawValue === 'boolean') return found.rawValue ? 'Yes' : 'No';
		if (typeof found.rawValue === 'number') return found.rawValue.toFixed(2);
		return String(found.rawValue);
	}

	function getScoreBarWidth(score: number): string {
		return `${(score / 8) * 100}%`;
	}

	function getScoreBarColor(score: number): string {
		if (score >= 7) return 'bg-emerald-500';
		if (score >= 5) return 'bg-green-500';
		if (score >= 4) return 'bg-yellow-500';
		if (score >= 3) return 'bg-orange-500';
		return 'bg-red-500';
	}
</script>

<div class="rounded-lg border bg-card">
	<!-- Header -->
	<button
		type="button"
		class="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
		onclick={onToggle}
	>
		<div class="flex items-center gap-3">
			<!-- Dimension Badge -->
			<span
				class="px-2 py-0.5 text-xs font-medium rounded-full border {dimensionColors[dimension]}"
			>
				{dimensionLabels[dimension]}
			</span>

			<!-- Petal Name -->
			<div>
				<h3 class="font-semibold text-lg">{PETAL_LABELS[category]}</h3>
				<p class="text-sm text-muted-foreground">{PETAL_DESCRIPTIONS[category]}</p>
			</div>
		</div>

		<div class="flex items-center gap-4">
			<!-- Trend Indicator -->
			<div class="flex items-center gap-1 text-sm">
				{#if trend === 'up'}
					<TrendingUp class="size-4 text-green-500" />
					<span class="text-green-600">Rising</span>
				{:else if trend === 'down'}
					<TrendingDown class="size-4 text-red-500" />
					<span class="text-red-600">Falling</span>
				{:else}
					<Minus class="size-4 text-muted-foreground" />
					<span class="text-muted-foreground">Stable</span>
				{/if}
			</div>

			<!-- Score -->
			<div class="flex items-center gap-2">
				<div
					class="text-2xl font-bold"
					style="color: {interpretation.color}"
				>
					{score.toFixed(1)}
				</div>
				<div class="text-sm text-muted-foreground">/8</div>
			</div>

			<!-- Expand/Collapse -->
			{#if expanded}
				<ChevronUp class="size-5 text-muted-foreground" />
			{:else}
				<ChevronDown class="size-5 text-muted-foreground" />
			{/if}
		</div>
	</button>

	<!-- Expanded Content -->
	{#if expanded}
		<div class="border-t px-4 py-3 space-y-4">
			<!-- Score Interpretation -->
			<div class="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
				<div
					class="w-3 h-3 rounded-full"
					style="background-color: {interpretation.color}"
				></div>
				<span class="font-medium">{interpretation.label}</span>
				<span class="text-sm text-muted-foreground">— {interpretation.description}</span>
			</div>

			<!-- Confidence -->
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Data Confidence</span>
				<div class="flex items-center gap-2">
					<div class="w-24 h-2 bg-muted rounded-full overflow-hidden">
						<div
							class="h-full bg-primary transition-all"
							style="width: {confidence * 100}%"
						></div>
					</div>
					<span class="font-medium">{Math.round(confidence * 100)}%</span>
				</div>
			</div>

			<!-- Sub-Criteria List -->
			<div class="space-y-3">
				<h4 class="text-sm font-medium text-muted-foreground flex items-center gap-1">
					<Info class="size-4" />
					Sub-Criteria Breakdown
				</h4>

				{#each subCriteria as criteria}
					{@const subScore = getSubScore(criteria.id)}
					{@const rawValue = getRawValue(criteria.id)}
					<div class="p-3 rounded-lg border bg-background">
						<div class="flex items-start justify-between mb-2">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<span class="font-medium text-sm">{criteria.label}</span>
									<span class="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
										{Math.round(criteria.weight * 100)}%
									</span>
								</div>
								<p class="text-xs text-muted-foreground mt-0.5">{criteria.description}</p>
							</div>
							<div class="text-right">
								<div class="font-semibold" style="color: {getScoreInterpretation(subScore).color}">
									{subScore.toFixed(1)}
								</div>
								{#if rawValue}
									<div class="text-xs text-muted-foreground">{rawValue}</div>
								{/if}
							</div>
						</div>

						<!-- Score Bar -->
						<div class="h-1.5 bg-muted rounded-full overflow-hidden">
							<div
								class="h-full transition-all {getScoreBarColor(subScore)}"
								style="width: {getScoreBarWidth(subScore)}"
							></div>
						</div>

						<!-- How to Measure -->
						<div class="mt-2 text-xs text-muted-foreground">
							<span class="font-medium">Measurement:</span>
							{criteria.howToMeasure}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
