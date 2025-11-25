<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import WalletIcon from "@tabler/icons-svelte/icons/wallet";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import DollarIcon from "@tabler/icons-svelte/icons/currency-dollar";
	import FileTextIcon from "@tabler/icons-svelte/icons/file-text";
	import ShoppingBagIcon from "@tabler/icons-svelte/icons/shopping-bag";
	import ArrowRightIcon from "@tabler/icons-svelte/icons/arrow-right";
	import CheckCircleIcon from "@tabler/icons-svelte/icons/circle-check";
	import AlertCircleIcon from "@tabler/icons-svelte/icons/alert-circle";

	// Mock investment data
	const portfolioSummary = {
		totalInvested: 450000,
		currentValue: 523400,
		returnPercent: 16.3,
		cashDistributed: 38200,
		portfolioIRR: 17.8,
	};

	const investments = [
		{
			id: "1",
			propertyName: "Austin Tech Towers",
			propertyImage: "/placeholder.jpg",

			// Investment details
			invested: 100000,
			investedDate: "Dec 2024",
			tokensOwned: 1000,
			ownershipPercent: 0.83,
			currentValue: 108300,
			returnPercent: 8.3,
			cashReceived: 6200,
			ytdReturn: 14.5,

			// Property performance
			occupancy: 94.2,
			occupancyTarget: 93.0,
			noi: 3200000,
			noiBudget: 3100000,
			rentGrowth: 4.8,

			status: "performing",
		},
		{
			id: "2",
			propertyName: "Orlando Gardens",
			propertyImage: "/placeholder.jpg",

			invested: 75000,
			investedDate: "Jul 2024",
			tokensOwned: 750,
			ownershipPercent: 1.07,
			currentValue: 81200,
			returnPercent: 8.3,
			cashReceived: 4800,
			ytdReturn: 13.8,

			occupancy: 91.5,
			occupancyTarget: 92.0,
			noi: 2100000,
			noiBudget: 2050000,
			rentGrowth: 3.2,

			status: "performing",
		},
		{
			id: "3",
			propertyName: "Phoenix Heights",
			propertyImage: "/placeholder.jpg",

			invested: 50000,
			investedDate: "Mar 2024",
			tokensOwned: 500,
			ownershipPercent: 1.00,
			currentValue: 54800,
			returnPercent: 9.6,
			cashReceived: 3200,
			ytdReturn: 16.2,

			occupancy: 96.1,
			occupancyTarget: 94.0,
			noi: 1800000,
			noiBudget: 1750000,
			rentGrowth: 5.4,

			status: "performing",
		},
	];

	const exitedInvestments = [
		{
			propertyName: "Phoenix Towers",
			exitDate: "Jun 2024",
			invested: 80000,
			returned: 117200,
			irr: 21.4,
		},
		{
			propertyName: "Tampa Bay Lofts",
			exitDate: "Jan 2024",
			invested: 60000,
			returned: 78400,
			irr: 16.8,
		},
	];

	function formatCurrency(value: number): string {
		return "$" + value.toLocaleString();
	}

	function formatPercent(value: number): string {
		return (value >= 0 ? "+" : "") + value.toFixed(1) + "%";
	}

	function formatShortCurrency(value: number): string {
		if (value >= 1000000) {
			return "$" + (value / 1000000).toFixed(1) + "M";
		}
		return "$" + (value / 1000).toFixed(0) + "K";
	}
</script>

<svelte:head>
	<title>My Investments - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<WalletIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">My Investments</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="outline" size="sm" href="/marketplace">
				<ShoppingBagIcon class="mr-2 size-4" />
				Browse Offerings
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Welcome Section -->
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Investment Portfolio</h2>
		<p class="text-muted-foreground">Track your syndication investments and performance</p>
	</div>

	<!-- Portfolio Summary -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
		<Card.Root class="md:col-span-2 lg:col-span-1">
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Invested</Card.Title>
				<WalletIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(portfolioSummary.totalInvested)}</div>
				<p class="text-xs text-muted-foreground">Across {investments.length} properties</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Current Value</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(portfolioSummary.currentValue)}</div>
				<p class="text-xs text-green-600">
					{formatPercent(portfolioSummary.returnPercent)} gain
				</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Cash Distributed</Card.Title>
				<DollarIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(portfolioSummary.cashDistributed)}</div>
				<p class="text-xs text-muted-foreground">To date</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Portfolio IRR</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-green-600">
					{portfolioSummary.portfolioIRR.toFixed(1)}%
				</div>
				<p class="text-xs text-muted-foreground">Trailing</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Unrealized Gain</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-green-600">
					{formatCurrency(portfolioSummary.currentValue - portfolioSummary.totalInvested)}
				</div>
				<p class="text-xs text-muted-foreground">Paper gain</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Active Investments -->
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-semibold">Active Investments ({investments.length})</h3>
			<Button variant="outline" size="sm">Export Report</Button>
		</div>

		<div class="space-y-4">
			{#each investments as investment}
				<Card.Root class="overflow-hidden">
					<div class="grid md:grid-cols-3">
						<!-- Left: Property Info -->
						<div class="border-r p-6">
							<div class="flex items-start gap-4">
								<div class="size-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5"></div>
								<div class="flex-1">
									<h4 class="font-semibold">{investment.propertyName}</h4>
									<p class="mt-1 text-sm text-muted-foreground">
										Invested: {investment.investedDate}
									</p>
									<div class="mt-3 space-y-1 text-sm">
										<div class="flex justify-between">
											<span class="text-muted-foreground">Your Position:</span>
											<span class="font-medium">{formatCurrency(investment.invested)}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-muted-foreground">Ownership:</span>
											<span class="font-medium">
												{investment.ownershipPercent}% ({investment.tokensOwned} tokens)
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Middle: Returns -->
						<div class="border-r p-6">
							<div class="mb-4">
								<p class="text-sm text-muted-foreground">Current Value</p>
								<div class="flex items-baseline gap-2">
									<p class="text-2xl font-bold">{formatCurrency(investment.currentValue)}</p>
									<Badge class="bg-green-100 text-green-800">
										{formatPercent(investment.returnPercent)}
									</Badge>
								</div>
							</div>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Cash Received:</span>
									<span class="font-medium">{formatCurrency(investment.cashReceived)}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">YTD Return:</span>
									<span class="font-medium text-green-600">
										{formatPercent(investment.ytdReturn)}
									</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Unrealized Gain:</span>
									<span class="font-medium">
										{formatCurrency(investment.currentValue - investment.invested)}
									</span>
								</div>
							</div>
						</div>

						<!-- Right: Property Performance -->
						<div class="p-6">
							<p class="mb-3 text-sm font-medium text-muted-foreground">PROPERTY PERFORMANCE</p>
							<div class="space-y-3">
								<div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-muted-foreground">Occupancy</span>
										<div class="flex items-center gap-1">
											<span class="font-medium">{investment.occupancy.toFixed(1)}%</span>
											{#if investment.occupancy >= investment.occupancyTarget}
												<CheckCircleIcon class="size-4 text-green-600" />
											{:else}
												<AlertCircleIcon class="size-4 text-orange-600" />
											{/if}
										</div>
									</div>
									<p class="mt-1 text-xs text-muted-foreground">
										Target: {investment.occupancyTarget}%
									</p>
								</div>

								<div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-muted-foreground">NOI</span>
										<div class="flex items-center gap-1">
											<span class="font-medium">{formatShortCurrency(investment.noi)}</span>
											{#if investment.noi >= investment.noiBudget}
												<CheckCircleIcon class="size-4 text-green-600" />
											{:else}
												<AlertCircleIcon class="size-4 text-orange-600" />
											{/if}
										</div>
									</div>
									<p class="mt-1 text-xs text-muted-foreground">
										vs {formatShortCurrency(investment.noiBudget)} budget
									</p>
								</div>

								<div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-muted-foreground">Rent Growth</span>
										<div class="flex items-center gap-1">
											<span class="font-medium text-green-600">
												+{investment.rentGrowth.toFixed(1)}% YoY
											</span>
											<CheckCircleIcon class="size-4 text-green-600" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Actions Footer -->
					<div class="flex gap-2 border-t bg-muted/30 p-4">
						<Button variant="outline" size="sm">
							<FileTextIcon class="mr-2 size-4" />
							View Full Dashboard
						</Button>
						<Button variant="outline" size="sm">
							<ShoppingBagIcon class="mr-2 size-4" />
							Sell Position
						</Button>
						<Button variant="outline" size="sm">
							<FileTextIcon class="mr-2 size-4" />
							Download K-1
						</Button>
					</div>
				</Card.Root>
			{/each}
		</div>
	</div>

	<!-- Exited Investments -->
	<div>
		<h3 class="mb-4 text-lg font-semibold">Exited Investments ({exitedInvestments.length})</h3>
		<Card.Root>
			<Card.Content class="p-0">
				<div class="divide-y">
					{#each exitedInvestments as exit}
						<div class="flex items-center justify-between p-4">
							<div class="flex items-center gap-4">
								<div class="flex size-10 items-center justify-center rounded-lg bg-muted">
									<CheckCircleIcon class="size-5 text-green-600" />
								</div>
								<div>
									<p class="font-medium">{exit.propertyName}</p>
									<p class="text-sm text-muted-foreground">Exited {exit.exitDate}</p>
								</div>
							</div>
							<div class="text-right">
								<p class="text-sm text-muted-foreground">
									{formatCurrency(exit.invested)} → {formatCurrency(exit.returned)}
								</p>
								<p class="font-semibold text-green-600">{exit.irr}% IRR</p>
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- CTA Banner -->
	<Card.Root class="border-primary/50 bg-primary/5">
		<Card.Content class="flex items-center gap-4 p-6">
			<div class="flex size-12 items-center justify-center rounded-full bg-primary/20">
				<ShoppingBagIcon class="size-6 text-primary" />
			</div>
			<div class="flex-1">
				<h3 class="font-semibold">Ready to expand your portfolio?</h3>
				<p class="text-sm text-muted-foreground">
					Browse 24 active syndication offerings with projected IRRs of 15-20%+
				</p>
			</div>
			<Button href="/marketplace">
				Browse Offerings
				<ArrowRightIcon class="ml-2 size-4" />
			</Button>
		</Card.Content>
	</Card.Root>
</div>
