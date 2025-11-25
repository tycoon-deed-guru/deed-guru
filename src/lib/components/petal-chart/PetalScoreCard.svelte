<script lang="ts">
	import type { PetalDataPoint } from '$lib/types/petal-chart.types';
	import { PETAL_DESCRIPTIONS, getBloomStatus } from '$lib/types/petal-chart.types';
	import { getPetalColor, getCategoryIcon } from '$lib/utils/petal-chart.utils';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Progress } from '$lib/components/ui/progress';
	import PetalChart from './PetalChart.svelte';
	import BloomStatus from './BloomStatus.svelte';

	interface PetalScoreCardProps {
		name: string;
		data: PetalDataPoint[];
		size?: 'sm' | 'md' | 'lg';
		showChart?: boolean;
		showDetails?: boolean;
		onClick?: () => void;
	}

	let {
		name,
		data,
		size = 'md',
		showChart = true,
		showDetails = true,
		onClick
	}: PetalScoreCardProps = $props();

	const totalScore = $derived(data.reduce((sum, d) => sum + d.score, 0));
	const bloomStatus = $derived(getBloomStatus(totalScore));
	const percentage = $derived(Math.round((totalScore / 64) * 100));

	const chartSizes = {
		sm: 180,
		md: 280,
		lg: 400
	};

	// Sort petals by score for the details view
	const sortedPetals = $derived([...data].sort((a, b) => b.score - a.score));
	const topPetals = $derived(sortedPetals.slice(0, 3));
	const bottomPetals = $derived(sortedPetals.slice(-3).reverse());
</script>

<Card
	class="overflow-hidden transition-all hover:shadow-lg {onClick ? 'cursor-pointer' : ''}"
	onclick={onClick}
	onkeydown={(e) => onClick && e.key === 'Enter' && onClick()}
	role={onClick ? 'button' : undefined}
	tabindex={onClick ? 0 : undefined}
>
	<CardHeader class="pb-2">
		<div class="flex items-center justify-between">
			<CardTitle class="text-lg font-bold truncate">{name}</CardTitle>
			<BloomStatus score={totalScore} size="sm" />
		</div>
	</CardHeader>

	<CardContent class="space-y-4">
		{#if showChart}
			<div class="flex justify-center">
				<PetalChart
					{data}
					size={chartSizes[size]}
					minCenterRadius={size === 'sm' ? 20 : 30}
					maxCenterRadius={size === 'sm' ? 35 : 50}
					maxPetalLength={size === 'sm' ? 50 : size === 'md' ? 80 : 120}
					showLabels={size !== 'sm'}
					showValues={false}
					interactive={false}
					enableGlow={size !== 'sm'}
				/>
			</div>
		{/if}

		{#if showDetails}
			<!-- Score summary bar -->
			<div class="space-y-1">
				<div class="flex items-center justify-between text-sm">
					<span class="text-muted-foreground">Bloom Score</span>
					<span class="font-semibold">{totalScore.toFixed(0)}/64 ({percentage}%)</span>
				</div>
				<Progress value={percentage} class="h-2" />
			</div>

			<!-- Top strengths -->
			<div class="space-y-2">
				<p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
					Top Strengths
				</p>
				<div class="flex flex-wrap gap-1">
					{#each topPetals as petal}
						<Badge
							variant="secondary"
							class="text-xs"
							style="background-color: {getPetalColor(petal.score)}20; color: {getPetalColor(petal.score)}"
						>
							{getCategoryIcon(petal.category ?? 'cashflow')}
							{petal.label}: {petal.score.toFixed(1)}
						</Badge>
					{/each}
				</div>
			</div>

			<!-- Areas for improvement -->
			{#if bottomPetals.some((p) => p.score < 5)}
				<div class="space-y-2">
					<p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
						Areas to Watch
					</p>
					<div class="flex flex-wrap gap-1">
						{#each bottomPetals.filter((p) => p.score < 5) as petal}
							<Badge variant="outline" class="text-xs text-orange-600 border-orange-300">
								{getCategoryIcon(petal.category ?? 'cashflow')}
								{petal.label}: {petal.score.toFixed(1)}
							</Badge>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</CardContent>
</Card>
