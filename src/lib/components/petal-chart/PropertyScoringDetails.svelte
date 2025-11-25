<script lang="ts">
	import PetalChart from './PetalChart.svelte';
	import BloomStatus from './BloomStatus.svelte';
	import SubCriteriaPanel from './SubCriteriaPanel.svelte';
	import type { PetalDataPoint, PetalCategory } from '$lib/types/petal-chart.types';
	import { PETAL_ORDER } from '$lib/types/petal-chart.types';
	import {
		PETAL_DIMENSIONS,
		calculateDimensionScores,
		type PetalScoring,
		type PetalDimension
	} from '$lib/types/scoring.types';
	import { calculateBloomScore, calculateBloomPercentage } from '$lib/utils/petal-chart.utils';

	interface Props {
		propertyName: string;
		propertyAddress?: string;
		petals: PetalDataPoint[];
		petalScorings?: PetalScoring[]; // Optional detailed sub-criteria data
		showChart?: boolean;
		chartSize?: number;
	}

	let {
		propertyName,
		propertyAddress,
		petals,
		petalScorings,
		showChart = true,
		chartSize = 280
	}: Props = $props();

	let expandedPetal: PetalCategory | null = $state(null);

	const bloomScore = $derived(calculateBloomScore(petals));
	const bloomPercentage = $derived(calculateBloomPercentage(petals));

	// Calculate dimension scores if we have detailed scoring data
	const dimensionScores = $derived.by(() => {
		if (petalScorings && petalScorings.length > 0) {
			return calculateDimensionScores(petalScorings);
		}
		// Fallback: calculate from petal data
		const dimensions: Record<PetalDimension, { sum: number; count: number }> = {
			returns: { sum: 0, count: 0 },
			asset: { sum: 0, count: 0 },
			risk: { sum: 0, count: 0 }
		};
		for (const petal of petals) {
			if (petal.category) {
				const dimension = PETAL_DIMENSIONS[petal.category];
				dimensions[dimension].sum += petal.score;
				dimensions[dimension].count += 1;
			}
		}
		return {
			returns: dimensions.returns.count > 0 ? dimensions.returns.sum / dimensions.returns.count : 0,
			asset: dimensions.asset.count > 0 ? dimensions.asset.sum / dimensions.asset.count : 0,
			risk: dimensions.risk.count > 0 ? dimensions.risk.sum / dimensions.risk.count : 0
		};
	});

	function togglePetal(category: PetalCategory) {
		expandedPetal = expandedPetal === category ? null : category;
	}

	function getPetalData(category: PetalCategory): PetalDataPoint | undefined {
		return petals.find((p) => p.category === category);
	}

	function getPetalScoring(category: PetalCategory): PetalScoring | undefined {
		return petalScorings?.find((p) => p.category === category);
	}

	const dimensionInfo: Record<PetalDimension, { label: string; icon: string; color: string }> = {
		returns: { label: 'Returns', icon: '💰', color: 'text-emerald-600' },
		asset: { label: 'Asset Quality', icon: '🏢', color: 'text-blue-600' },
		risk: { label: 'Risk Profile', icon: '🛡️', color: 'text-amber-600' }
	};
</script>

<div class="space-y-6">
	<!-- Header with Chart and Summary -->
	<div class="flex flex-col lg:flex-row gap-6">
		<!-- Petal Chart -->
		{#if showChart}
			<div class="flex-shrink-0 flex flex-col items-center">
				<PetalChart
					data={petals}
					size={chartSize}
					interactive={true}
					showLabels={true}
					enableGlow={true}
				/>
				<div class="mt-4">
					<BloomStatus score={bloomScore} showLabel={true} size="lg" />
				</div>
			</div>
		{/if}

		<!-- Property Summary -->
		<div class="flex-1 space-y-4">
			<div>
				<h2 class="text-2xl font-bold">{propertyName}</h2>
				{#if propertyAddress}
					<p class="text-muted-foreground">{propertyAddress}</p>
				{/if}
			</div>

			<!-- Bloom Score -->
			<div class="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-muted-foreground">Bloom Score</p>
						<p class="text-3xl font-bold text-primary">{bloomScore}</p>
					</div>
					<div class="text-right">
						<p class="text-sm text-muted-foreground">of 64 possible</p>
						<p class="text-2xl font-semibold">{bloomPercentage}%</p>
					</div>
				</div>
			</div>

			<!-- Dimension Scores -->
			<div class="grid grid-cols-3 gap-3">
				{#each (['returns', 'asset', 'risk'] as PetalDimension[]) as dimension}
					{@const info = dimensionInfo[dimension]}
					{@const score = dimensionScores[dimension]}
					<div class="p-3 rounded-lg border bg-card text-center">
						<div class="text-lg">{info.icon}</div>
						<p class="text-xs text-muted-foreground mt-1">{info.label}</p>
						<p class="text-xl font-bold {info.color}">{score.toFixed(1)}</p>
						<p class="text-xs text-muted-foreground">/8</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Detailed Sub-Criteria Panels -->
	<div class="space-y-3">
		<h3 class="text-lg font-semibold">Detailed Scoring Breakdown</h3>
		<p class="text-sm text-muted-foreground">
			Click any petal to see the Guardian-grade sub-criteria analysis
		</p>

		{#each PETAL_ORDER as category}
			{@const petal = getPetalData(category)}
			{@const scoring = getPetalScoring(category)}
			{#if petal}
				<SubCriteriaPanel
					{category}
					score={petal.score}
					confidence={petal.confidence}
					trend={petal.trend}
					subScores={scoring?.subCriteria?.map((c) => ({
						id: c.id,
						score: c.score,
						rawValue: c.rawValue
					})) ?? []}
					expanded={expandedPetal === category}
					onToggle={() => togglePetal(category)}
				/>
			{/if}
		{/each}
	</div>
</div>
