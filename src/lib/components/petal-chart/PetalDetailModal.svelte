<script lang="ts">
	import type { PetalCategory } from '$lib/types/petal-chart.types';
	import { PETAL_LABELS, PETAL_DESCRIPTIONS } from '$lib/types/petal-chart.types';
	import {
		PETAL_SUB_CRITERIA,
		PETAL_DIMENSIONS,
		getScoreInterpretation
	} from '$lib/types/scoring.types';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight, X, TrendingUp, TrendingDown, Minus, Info } from 'lucide-svelte';

	interface Props {
		open: boolean;
		category: PetalCategory | null;
		score: number;
		confidence?: number;
		trend?: 'up' | 'down' | 'stable';
		subScores?: Array<{
			id: string;
			score: number;
			rawValue?: number | boolean | string;
		}>;
		allPetals: Array<{ category: PetalCategory; score: number }>;
		onClose: () => void;
		onNavigate?: (category: PetalCategory) => void;
	}

	let {
		open = $bindable(),
		category,
		score,
		confidence = 0.85,
		trend = 'stable',
		subScores = [],
		allPetals = [],
		onClose,
		onNavigate
	}: Props = $props();

	const subCriteria = $derived(category ? PETAL_SUB_CRITERIA[category] : []);
	const dimension = $derived(category ? PETAL_DIMENSIONS[category] : 'asset');
	const interpretation = $derived(getScoreInterpretation(score));

	const currentIndex = $derived(
		category ? allPetals.findIndex((p) => p.category === category) : -1
	);
	const hasPrev = $derived(currentIndex > 0);
	const hasNext = $derived(currentIndex >= 0 && currentIndex < allPetals.length - 1);

	const dimensionColors = {
		returns: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
		asset: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
		risk: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
	};

	const dimensionLabels = {
		returns: 'Returns',
		asset: 'Asset',
		risk: 'Risk'
	};

	function getSubScore(criteriaId: string): number {
		const found = subScores.find((s) => s.id === criteriaId);
		return found?.score ?? 5;
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

	function handlePrevious() {
		if (hasPrev && onNavigate) {
			onNavigate(allPetals[currentIndex - 1].category);
		}
	}

	function handleNext() {
		if (hasNext && onNavigate) {
			onNavigate(allPetals[currentIndex + 1].category);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			handlePrevious();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			handleNext();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-3xl max-h-[90vh] overflow-y-auto">
		{#if category}
			<!-- Header with Navigation -->
			<div class="sticky top-0 bg-background z-10 pb-4 border-b">
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-3 mb-2">
							<!-- Dimension Badge -->
							<span
								class="px-2 py-0.5 text-xs font-medium rounded-full border {dimensionColors[
									dimension
								]}"
							>
								{dimensionLabels[dimension]}
							</span>

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
						</div>

						<Dialog.Title class="text-2xl font-bold">
							{PETAL_LABELS[category]}
						</Dialog.Title>
						<Dialog.Description class="text-muted-foreground">
							{PETAL_DESCRIPTIONS[category]}
						</Dialog.Description>
					</div>

					<div class="flex items-center gap-2">
						<!-- Score -->
						<div class="text-right mr-4">
							<div class="text-3xl font-bold" style="color: {interpretation.color}">
								{score.toFixed(1)}
							</div>
							<div class="text-sm text-muted-foreground">/8</div>
						</div>
					</div>
				</div>

				<!-- Navigation Arrows -->
				<div class="flex items-center justify-between mt-4">
					<Button
						variant="outline"
						size="sm"
						disabled={!hasPrev}
						onclick={handlePrevious}
						class="gap-1"
					>
						<ChevronLeft class="size-4" />
						Previous
					</Button>

					<span class="text-sm text-muted-foreground">
						{currentIndex + 1} of {allPetals.length}
					</span>

					<Button variant="outline" size="sm" disabled={!hasNext} onclick={handleNext} class="gap-1">
						Next
						<ChevronRight class="size-4" />
					</Button>
				</div>
			</div>

			<!-- Content -->
			<div class="space-y-6 pt-6">
				<!-- Score Interpretation -->
				<div class="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
					<div class="w-3 h-3 rounded-full" style="background-color: {interpretation.color}"></div>
					<span class="font-medium">{interpretation.label}</span>
					<span class="text-sm text-muted-foreground">— {interpretation.description}</span>
				</div>

				<!-- Confidence -->
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Data Confidence</span>
					<div class="flex items-center gap-2">
						<div class="w-32 h-2 bg-muted rounded-full overflow-hidden">
							<div
								class="h-full bg-primary transition-all"
								style="width: {confidence * 100}%"
							></div>
						</div>
						<span class="font-medium">{Math.round(confidence * 100)}%</span>
					</div>
				</div>

				<!-- Sub-Criteria List -->
				<div class="space-y-4">
					<h4 class="text-sm font-semibold text-foreground flex items-center gap-2">
						<Info class="size-4" />
						Sub-Criteria Breakdown
					</h4>

					{#each subCriteria as criteria}
						{@const subScore = getSubScore(criteria.id)}
						{@const rawValue = getRawValue(criteria.id)}
						<div class="p-4 rounded-lg border bg-card">
							<div class="flex items-start justify-between mb-3">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-1">
										<span class="font-semibold">{criteria.label}</span>
										<span class="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
											{Math.round(criteria.weight * 100)}%
										</span>
									</div>
									<p class="text-sm text-muted-foreground">{criteria.description}</p>
								</div>
								<div class="text-right ml-4">
									<div class="text-xl font-bold" style="color: {getScoreInterpretation(subScore).color}">
										{subScore.toFixed(1)}
									</div>
									{#if rawValue}
										<div class="text-xs text-muted-foreground mt-0.5">{rawValue}</div>
									{/if}
								</div>
							</div>

							<!-- Score Bar -->
							<div class="h-2 bg-muted rounded-full overflow-hidden mb-3">
								<div
									class="h-full transition-all {getScoreBarColor(subScore)}"
									style="width: {getScoreBarWidth(subScore)}"
								></div>
							</div>

							<!-- How to Measure -->
							<div class="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
								<span class="font-medium text-foreground">Measurement:</span>
								{criteria.howToMeasure}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
