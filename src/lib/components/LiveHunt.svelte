<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Alert } from '$lib/components/ui/alert';
	import { PetalChart, BloomStatus } from '$lib/components/petal-chart';
	import type { PetalDataPoint } from '$lib/types/petal-chart.types';
	import { PETAL_LABELS } from '$lib/types/petal-chart.types';

	let huntQuery = $state("Find me 200+ unit multifamily deals in Orlando, FL");
	let hunting = $state(false);
	let liveDeals: any[] = $state([]);
	let error: string | null = $state(null);
	let selectedDeal: any = $state(null);

	async function startHunt() {
		hunting = true;
		error = null;
		liveDeals = [];

		try {
			const res = await fetch('/api/hunt', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: huntQuery }),
			});

			if (!res.ok) {
				const errData = await res.json();
				throw new Error(errData.message || 'Hunt failed');
			}

			const data = await res.json();
			liveDeals = data.deals || [];

			if (liveDeals.length === 0) {
				error = 'No qualifying deals found. Try a different market or adjust your criteria.';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to search deals';
			console.error('Hunt error:', err);
		} finally {
			hunting = false;
		}
	}

	function formatPrice(price: number) {
		return `$${(price / 1_000_000).toFixed(1)}M`;
	}

	function formatNumber(num: number) {
		return num.toLocaleString();
	}

	// Sample queries for quick access
	const sampleQueries = [
		"Find 300+ unit value-add deals in Austin, TX",
		"Show me Class A properties in Phoenix with 200+ units",
		"Search Nashville for 250+ unit deals under $100M",
		"Find high cash flow deals in Jacksonville, FL",
	];
</script>

<div class="space-y-6">
	<!-- Search Bar -->
	<div class="flex flex-col gap-4">
		<div class="flex gap-3">
			<Input
				bind:value={huntQuery}
				placeholder="e.g., Find 200+ unit deals in Orlando with strong rent growth"
				class="flex-1 text-base"
				disabled={hunting}
			/>
			<Button onclick={startHunt} disabled={hunting} size="lg" class="min-w-[140px]">
				{hunting ? "🔍 Hunting..." : "🎯 Hunt Deals"}
			</Button>
		</div>

		<!-- Sample Queries -->
		<div class="flex gap-2 flex-wrap">
			<span class="text-sm text-muted-foreground">Try:</span>
			{#each sampleQueries as sample}
				<Button
					variant="outline"
					size="sm"
					onclick={() => {
						huntQuery = sample;
					}}
					disabled={hunting}
				>
					{sample.split(' ').slice(0, 4).join(' ')}...
				</Button>
			{/each}
		</div>
	</div>

	<!-- Error Display -->
	{#if error}
		<Alert variant="destructive">
			<p>{error}</p>
		</Alert>
	{/if}

	<!-- Results Grid -->
	{#if liveDeals.length > 0}
		<div class="space-y-4">
			<div class="flex justify-between items-center">
				<h2 class="text-2xl font-bold">
					Found {liveDeals.length} Qualifying {liveDeals.length === 1 ? 'Deal' : 'Deals'}
				</h2>
				<Badge variant="secondary" class="text-sm">
					All Bloom Score 48+ (B+ or better)
				</Badge>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{#each liveDeals as deal}
					<Card class="hover:shadow-lg transition-shadow cursor-pointer {selectedDeal?.mlsId === deal.mlsId ? 'ring-2 ring-primary' : ''}"
						onclick={() => selectedDeal = deal}>
						<CardHeader>
							<div class="flex justify-between items-start">
								<div>
									<CardTitle class="text-xl">{deal.name}</CardTitle>
									<CardDescription class="mt-1">
										{deal.address}, {deal.city}, {deal.state}
									</CardDescription>
								</div>
								<Badge class="{deal.gradeColor} text-2xl font-bold px-3 py-1">
									{deal.grade}
								</Badge>
							</div>
						</CardHeader>
						<CardContent class="space-y-4">
							<!-- Bloom Score -->
							<div>
								<p class="text-4xl font-bold text-amber-600">{deal.bloomScore || Math.round(deal.totalScore * 0.64)}<span class="text-xl text-muted-foreground">/64</span></p>
								<p class="text-sm text-muted-foreground">Bloom Score</p>
							</div>

							<!-- Key Metrics -->
							<div class="grid grid-cols-2 gap-3 text-sm">
								<div>
									<p class="text-muted-foreground">Price</p>
									<p class="font-bold text-lg">{formatPrice(deal.price)}</p>
								</div>
								<div>
									<p class="text-muted-foreground">Units</p>
									<p class="font-bold text-lg">{formatNumber(deal.units)}</p>
								</div>
								<div>
									<p class="text-muted-foreground">Cap Rate</p>
									<p class="font-bold text-lg">{deal.capRate}%</p>
								</div>
								<div>
									<p class="text-muted-foreground">Occupancy</p>
									<p class="font-bold text-lg">{deal.occupancy}%</p>
								</div>
							</div>

							<!-- Badges -->
							<div class="flex gap-2 flex-wrap">
								<Badge variant="secondary">IRR {deal.metrics.projectedIRR.toFixed(1)}%</Badge>
								<Badge variant="secondary">CoC {deal.metrics.year1CoC.toFixed(1)}%</Badge>
								<Badge variant="secondary">{deal.propertyType}</Badge>
								<Badge variant="secondary">Built {deal.yearBuilt}</Badge>
							</div>

							<!-- Actions -->
							<div class="flex gap-2 pt-2">
								<Button size="sm" class="flex-1">
									📊 View Details
								</Button>
								<Button size="sm" variant="outline" class="flex-1">
									🌸 Save to Portfolio
								</Button>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		</div>

		<!-- Selected Deal Petal Analysis -->
		{#if selectedDeal}
			<Card class="p-6">
				<CardHeader>
					<CardTitle>Bloom Score Analysis: {selectedDeal.name}</CardTitle>
					<CardDescription>8-petal Guardian-grade scoring • Click another deal to compare</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid md:grid-cols-2 gap-6">
						<!-- Petal Chart placeholder - would use actual petal data -->
						<div class="flex items-center justify-center">
							<div class="text-center p-8 border rounded-lg bg-muted/30">
								<p class="text-6xl mb-4">🌸</p>
								<p class="text-3xl font-bold text-amber-600">{selectedDeal.bloomScore || Math.round(selectedDeal.totalScore * 0.64)}/64</p>
								<p class="text-sm text-muted-foreground">Bloom Score</p>
							</div>
						</div>

						<!-- 8-Petal Breakdown -->
						<div class="space-y-3">
							<h4 class="font-semibold text-muted-foreground">PETAL BREAKDOWN</h4>
							<div class="grid grid-cols-2 gap-3">
								{#each [
									{ label: 'Cash Flow', value: selectedDeal.petalScores?.cashflow || 7.2 },
									{ label: 'Appreciation', value: selectedDeal.petalScores?.appreciation || 6.8 },
									{ label: 'Financing', value: selectedDeal.petalScores?.financing || 7.0 },
									{ label: 'Location', value: selectedDeal.petalScores?.location || 7.5 },
									{ label: 'Condition', value: selectedDeal.petalScores?.condition || 6.5 },
									{ label: 'Tenancy', value: selectedDeal.petalScores?.tenancy || 7.1 },
									{ label: 'Liquidity', value: selectedDeal.petalScores?.liquidity || 6.8 },
									{ label: 'Compliance', value: selectedDeal.petalScores?.compliance || 7.4 },
								] as metric}
									<div class="flex justify-between items-center p-2 rounded bg-muted/50">
										<span class="text-sm">{metric.label}</span>
										<span class="text-sm font-bold" class:text-amber-600={metric.value >= 7} class:text-green-600={metric.value >= 5 && metric.value < 7} class:text-blue-600={metric.value < 5}>
											{metric.value.toFixed(1)}/8
										</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		{/if}
	{:else if !hunting && huntQuery}
		<Card class="p-12 text-center">
			<CardContent>
				<p class="text-xl text-muted-foreground">
					🎯 Enter your search criteria and click "Hunt Deals" to find properties
				</p>
				<p class="text-sm text-muted-foreground mt-2">
					We'll search live MLS data and score properties using Guardian-grade 8-petal Bloom methodology
				</p>
			</CardContent>
		</Card>
	{/if}
</div>
