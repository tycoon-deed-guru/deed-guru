<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as Select from "$lib/components/ui/select";
	import ChartLineIcon from "@tabler/icons-svelte/icons/chart-line";
	import MapPinIcon from "@tabler/icons-svelte/icons/map-pin";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import TrendingDownIcon from "@tabler/icons-svelte/icons/trending-down";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import UsersIcon from "@tabler/icons-svelte/icons/users";
	import CurrencyDollarIcon from "@tabler/icons-svelte/icons/currency-dollar";
	import PercentIcon from "@tabler/icons-svelte/icons/percentage";
	import CalendarIcon from "@tabler/icons-svelte/icons/calendar";

	let selectedMarket = $state("austin");

	// Mock market data
	const markets = [
		{
			value: "austin",
			name: "Austin, TX",
			population: 2350000,
			jobGrowth: 4.2,
			medianRent: 1850,
			rentGrowth: 8.5,
			occupancy: 94.2,
			capRate: 5.8,
			pricePerUnit: 185000,
			activeListings: 47,
			submarketsCount: 12,
			trend: "up",
		},
		{
			value: "dallas",
			name: "Dallas-Fort Worth, TX",
			population: 7640000,
			jobGrowth: 3.8,
			medianRent: 1620,
			rentGrowth: 6.2,
			occupancy: 93.8,
			capRate: 6.1,
			pricePerUnit: 165000,
			activeListings: 128,
			submarketsCount: 28,
			trend: "up",
		},
		{
			value: "phoenix",
			name: "Phoenix, AZ",
			population: 4950000,
			jobGrowth: 3.1,
			medianRent: 1590,
			rentGrowth: 7.8,
			occupancy: 95.6,
			capRate: 6.0,
			pricePerUnit: 172000,
			activeListings: 62,
			submarketsCount: 18,
			trend: "up",
		},
	];

	const currentMarket = $derived(markets.find((m) => m.value === selectedMarket) || markets[0]);

	const submarkets = [
		{ name: "Domain", medianRent: 2150, occupancy: 96.2, inventory: 4200, trend: "up" },
		{ name: "Downtown", medianRent: 2450, occupancy: 94.8, inventory: 3800, trend: "up" },
		{ name: "South Congress", medianRent: 1950, occupancy: 93.5, inventory: 2600, trend: "stable" },
		{ name: "East Austin", medianRent: 1750, occupancy: 95.1, inventory: 3200, trend: "up" },
		{ name: "North Austin", medianRent: 1680, occupancy: 92.8, inventory: 5400, trend: "down" },
	];

	function formatNumber(num: number): string {
		return num.toLocaleString();
	}

	function formatCurrency(num: number): string {
		return "$" + num.toLocaleString();
	}
</script>

<svelte:head>
	<title>Market Analysis - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<ChartLineIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Market Analysis</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Select.Root bind:value={selectedMarket}>
				<Select.Trigger class="w-[220px]">
					{currentMarket.name}
				</Select.Trigger>
				<Select.Content>
					{#each markets as market}
						<Select.Item value={market.value}>{market.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Button variant="outline" size="sm">Compare Markets</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Page Header -->
	<div>
		<div class="flex items-center gap-2">
			<MapPinIcon class="size-6 text-primary" />
			<h2 class="text-3xl font-bold tracking-tight">{currentMarket.name}</h2>
			<Badge
				variant="secondary"
				class={currentMarket.trend === "up"
					? "bg-green-100 text-green-800"
					: "bg-gray-100 text-gray-800"}
			>
				{#if currentMarket.trend === "up"}
					<TrendingUpIcon class="mr-1 size-3" />
					Growing
				{:else}
					<TrendingDownIcon class="mr-1 size-3" />
					Stable
				{/if}
			</Badge>
		</div>
		<p class="mt-1 text-muted-foreground">
			Market fundamentals and submarket analysis • Updated daily
		</p>
	</div>

	<!-- Market Overview Stats -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Population</Card.Title>
				<UsersIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{(currentMarket.population / 1000000).toFixed(2)}M</div>
				<p class="text-xs text-muted-foreground">Metro area</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Job Growth</Card.Title>
				<TrendingUpIcon class="size-4 text-green-600" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-green-600">{currentMarket.jobGrowth}%</div>
				<p class="text-xs text-muted-foreground">YoY employment</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Median Rent</Card.Title>
				<CurrencyDollarIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(currentMarket.medianRent)}</div>
				<p class="text-xs text-green-600">+{currentMarket.rentGrowth}% YoY</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Avg Occupancy</Card.Title>
				<PercentIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{currentMarket.occupancy}%</div>
				<p class="text-xs text-muted-foreground">Multifamily</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Market Metrics Grid -->
	<div class="grid gap-4 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Investment Metrics</Card.Title>
				<Card.Description>Key multifamily investment indicators</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Avg Cap Rate</span>
					<span class="text-lg font-semibold">{currentMarket.capRate}%</span>
				</div>
				<Separator />
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Price per Unit</span>
					<span class="text-lg font-semibold">{formatCurrency(currentMarket.pricePerUnit)}</span>
				</div>
				<Separator />
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Rent Growth (12mo)</span>
					<span class="text-lg font-semibold text-green-600">+{currentMarket.rentGrowth}%</span>
				</div>
				<Separator />
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Active Listings</span>
					<span class="text-lg font-semibold">{currentMarket.activeListings}</span>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Economic Indicators</Card.Title>
				<Card.Description>Metro area economic health</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Employment Growth</span>
					<span class="text-lg font-semibold text-green-600">+{currentMarket.jobGrowth}%</span>
				</div>
				<Separator />
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Population Growth</span>
					<span class="text-lg font-semibold text-green-600">+3.1%</span>
				</div>
				<Separator />
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Median Household Income</span>
					<span class="text-lg font-semibold">$78,200</span>
				</div>
				<Separator />
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Unemployment Rate</span>
					<span class="text-lg font-semibold">3.2%</span>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Submarkets -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<div>
					<Card.Title>Top Submarkets</Card.Title>
					<Card.Description>{currentMarket.submarketsCount} submarkets tracked</Card.Description>
				</div>
				<Button variant="outline" size="sm">View All Submarkets</Button>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="border-b">
						<tr class="text-left">
							<th class="p-3 font-medium">Submarket</th>
							<th class="p-3 font-medium text-right">Median Rent</th>
							<th class="p-3 font-medium text-right">Occupancy</th>
							<th class="p-3 font-medium text-right">Inventory (Units)</th>
							<th class="p-3 font-medium">Trend</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each submarkets as submarket}
							<tr class="hover:bg-muted/30">
								<td class="p-3 font-medium">
									<MapPinIcon class="mr-2 inline size-4 text-muted-foreground" />
									{submarket.name}
								</td>
								<td class="p-3 text-right">{formatCurrency(submarket.medianRent)}</td>
								<td class="p-3 text-right">{submarket.occupancy}%</td>
								<td class="p-3 text-right">{formatNumber(submarket.inventory)}</td>
								<td class="p-3">
									<Badge
										variant="secondary"
										class={submarket.trend === "up"
											? "bg-green-100 text-green-800"
											: submarket.trend === "down"
												? "bg-red-100 text-red-800"
												: "bg-gray-100 text-gray-800"}
									>
										{#if submarket.trend === "up"}
											<TrendingUpIcon class="mr-1 size-3" />
											Growing
										{:else if submarket.trend === "down"}
											<TrendingDownIcon class="mr-1 size-3" />
											Declining
										{:else}
											Stable
										{/if}
									</Badge>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Market Insights -->
	<Card.Root class="border-primary/50 bg-primary/5">
		<Card.Header>
			<Card.Title>Market Insights</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-3">
			<div class="flex items-start gap-3">
				<div class="mt-0.5 flex size-6 items-center justify-center rounded-full bg-green-100">
					<TrendingUpIcon class="size-4 text-green-600" />
				</div>
				<div>
					<p class="font-medium">Strong rent growth momentum</p>
					<p class="text-sm text-muted-foreground">
						{currentMarket.name} has outperformed national averages for 8 consecutive quarters
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<div class="mt-0.5 flex size-6 items-center justify-center rounded-full bg-blue-100">
					<BuildingIcon class="size-4 text-blue-600" />
				</div>
				<div>
					<p class="font-medium">Limited new supply pipeline</p>
					<p class="text-sm text-muted-foreground">
						New construction deliveries 40% below historical averages
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<div class="mt-0.5 flex size-6 items-center justify-center rounded-full bg-purple-100">
					<UsersIcon class="size-4 text-purple-600" />
				</div>
				<div>
					<p class="font-medium">Tech sector driving demand</p>
					<p class="text-sm text-muted-foreground">
						Tech employment up 12% YoY, supporting premium rents
					</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
