<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Progress } from "$lib/components/ui/progress";
	import { Input } from "$lib/components/ui/input";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as Select from "$lib/components/ui/select";
	import DiamondIcon from "@tabler/icons-svelte/icons/diamond";
	import SearchIcon from "@tabler/icons-svelte/icons/search";
	import FilterIcon from "@tabler/icons-svelte/icons/filter";
	import ShoppingCartIcon from "@tabler/icons-svelte/icons/shopping-cart";
	import WalletIcon from "@tabler/icons-svelte/icons/wallet";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import ClockIcon from "@tabler/icons-svelte/icons/clock";
	import UsersIcon from "@tabler/icons-svelte/icons/users";
	import FlowerIcon from "@tabler/icons-svelte/icons/flower";
	import BookmarkIcon from "@tabler/icons-svelte/icons/bookmark";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";

	// Mock syndication offerings data
	const offerings = [
		{
			id: "1",
			propertyName: "Austin Tech Towers",
			address: "2400 Domain Dr, Austin, TX",
			units: 342,
			totalValue: 48500000,
			propertyClass: "A",
			propertyType: "Multifamily",

			// Fundraising
			targetRaise: 12000000,
			currentRaise: 8400000,
			investorCount: 147,
			minInvestment: 50000,

			// Returns
			year1CoC: 8.5,
			avgCashYield: 7.2,
			projectedIRR: 18.3,
			equityMultiple: 2.1,
			holdPeriod: 5,

			// Sponsor
			sponsorName: "Cardone Capital",
			sponsorDeals: 47,
			sponsorAvgIRR: 19.2,

			// Bloom Score (8-petal, max 64)
			bloomScore: 58,
			grade: "A+",

			// Status
			daysRemaining: 27,
			closingDate: "Dec 15, 2024",
			status: "active"
		},
		{
			id: "2",
			propertyName: "Orlando Gardens",
			address: "1200 Lake Nona Blvd, Orlando, FL",
			units: 218,
			totalValue: 28500000,
			propertyClass: "A-",
			propertyType: "Multifamily",

			targetRaise: 7000000,
			currentRaise: 4200000,
			investorCount: 84,
			minInvestment: 50000,

			year1CoC: 7.8,
			avgCashYield: 6.5,
			projectedIRR: 16.8,
			equityMultiple: 1.9,
			holdPeriod: 5,

			sponsorName: "Valor Equity",
			sponsorDeals: 23,
			sponsorAvgIRR: 17.4,

			bloomScore: 54,
			grade: "A",

			daysRemaining: 45,
			closingDate: "Jan 15, 2025",
			status: "active"
		},
		{
			id: "3",
			propertyName: "Phoenix Heights",
			address: "4500 Scottsdale Rd, Phoenix, AZ",
			units: 156,
			totalValue: 19800000,
			propertyClass: "B+",
			propertyType: "Multifamily",

			targetRaise: 5000000,
			currentRaise: 3800000,
			investorCount: 62,
			minInvestment: 25000,

			year1CoC: 9.2,
			avgCashYield: 8.1,
			projectedIRR: 19.5,
			equityMultiple: 2.3,
			holdPeriod: 4,

			sponsorName: "Sunbelt Ventures",
			sponsorDeals: 31,
			sponsorAvgIRR: 18.8,

			bloomScore: 50,
			grade: "A-",

			daysRemaining: 18,
			closingDate: "Dec 5, 2024",
			status: "active"
		}
	];

	function formatCurrency(value: number): string {
		if (value >= 1000000) {
			return "$" + (value / 1000000).toFixed(1) + "M";
		}
		return "$" + (value / 1000).toLocaleString();
	}

	function formatPercent(value: number): string {
		return value.toFixed(1) + "%";
	}

	function getFundingPercent(current: number, target: number): number {
		return Math.round((current / target) * 100);
	}

	function getGradeColor(grade: string): string {
		if (grade.startsWith("A")) return "bg-green-100 text-green-800";
		if (grade.startsWith("B")) return "bg-yellow-100 text-yellow-800";
		if (grade.startsWith("C")) return "bg-orange-100 text-orange-800";
		return "bg-red-100 text-red-800";
	}
</script>

<svelte:head>
	<title>Marketplace - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<DiamondIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Marketplace</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="outline" size="sm" href="/marketplace/investments">
				<WalletIcon class="mr-2 size-4" />
				My Investments
			</Button>
			<Button size="sm" href="/marketplace/syndications">
				<TrendingUpIcon class="mr-2 size-4" />
				Create Offering
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Welcome Section -->
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Tokenized Syndication Marketplace</h2>
		<p class="text-muted-foreground">Discover, invest in, and trade real estate syndications</p>
	</div>

	<!-- Stats Overview -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Offerings</Card.Title>
				<ShoppingCartIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">24</div>
				<p class="text-xs text-muted-foreground">$347M total raise</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Capital Deployed</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">$218M</div>
				<p class="text-xs text-green-600">63% of target</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Investors</Card.Title>
				<UsersIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">1,247</div>
				<p class="text-xs text-muted-foreground">+143 this month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Avg IRR</Card.Title>
				<DiamondIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">18.4%</div>
				<p class="text-xs text-muted-foreground">Across all offerings</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Search & Filters -->
	<Card.Root>
		<Card.Content class="p-4">
			<div class="flex flex-col gap-4 md:flex-row md:items-center">
				<div class="relative flex-1">
					<SearchIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input placeholder="Search by property, location, or sponsor..." class="pl-10" />
				</div>
				<div class="flex gap-2">
					<Select.Root>
						<Select.Trigger class="w-[180px]">
							Property Type
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="all">All Types</Select.Item>
							<Select.Item value="multifamily">Multifamily</Select.Item>
							<Select.Item value="office">Office</Select.Item>
							<Select.Item value="retail">Retail</Select.Item>
							<Select.Item value="industrial">Industrial</Select.Item>
						</Select.Content>
					</Select.Root>

					<Select.Root>
						<Select.Trigger class="w-[180px]">
							Min Investment
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="all">Any Amount</Select.Item>
							<Select.Item value="25k">$25K+</Select.Item>
							<Select.Item value="50k">$50K+</Select.Item>
							<Select.Item value="100k">$100K+</Select.Item>
						</Select.Content>
					</Select.Root>

					<Button variant="outline">
						<FilterIcon class="mr-2 size-4" />
						More Filters
					</Button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Quick Nav Tabs -->
	<div class="flex gap-2 border-b">
		<button class="border-b-2 border-primary px-4 py-2 font-medium text-primary">
			Browse Offerings
		</button>
		<button class="px-4 py-2 text-muted-foreground hover:text-foreground">
			My Investments
		</button>
		<button class="px-4 py-2 text-muted-foreground hover:text-foreground">
			My Syndications
		</button>
		<button class="px-4 py-2 text-muted-foreground hover:text-foreground">
			Secondary Market
		</button>
	</div>

	<!-- Offerings Grid -->
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-semibold">Active Offerings ({offerings.length})</h3>
			<Select.Root>
				<Select.Trigger class="w-[180px]">
					Sort by: Bloom Score
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="score">Bloom Score</Select.Item>
					<Select.Item value="irr">Projected IRR</Select.Item>
					<Select.Item value="funding">Funding Progress</Select.Item>
					<Select.Item value="closing">Closing Soon</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each offerings as offering}
				<Card.Root class="overflow-hidden transition-all hover:shadow-lg">
					<!-- Property Image Placeholder -->
					<div class="relative aspect-video w-full bg-gradient-to-br from-primary/20 to-primary/5">
						<div class="absolute right-2 top-2">
							<Badge class="{getGradeColor(offering.grade)} text-lg font-bold px-3 py-1">
								{offering.bloomScore}/64 • {offering.grade}
							</Badge>
						</div>
						<div class="absolute left-2 bottom-2">
							<Badge variant="secondary" class="font-medium">
								<ClockIcon class="mr-1 size-3" />
								{offering.daysRemaining}d left
							</Badge>
						</div>
					</div>

					<Card.Header>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<Card.Title class="text-lg">{offering.propertyName}</Card.Title>
								<Card.Description class="mt-1">
									<BuildingIcon class="mr-1 inline size-3" />
									{offering.units} units • Class {offering.propertyClass}
								</Card.Description>
								<p class="mt-1 text-xs text-muted-foreground">{offering.address}</p>
							</div>
						</div>
					</Card.Header>

					<Card.Content class="space-y-4">
						<!-- Fundraising Progress -->
						<div>
							<div class="mb-2 flex items-center justify-between text-sm">
								<span class="font-medium">Fundraising Progress</span>
								<span class="text-muted-foreground">
									{getFundingPercent(offering.currentRaise, offering.targetRaise)}%
								</span>
							</div>
							<Progress
								value={getFundingPercent(offering.currentRaise, offering.targetRaise)}
								class="h-2"
							/>
							<div class="mt-1 flex justify-between text-xs text-muted-foreground">
								<span>{formatCurrency(offering.currentRaise)} raised</span>
								<span>{formatCurrency(offering.targetRaise)} target</span>
							</div>
						</div>

						<!-- Key Metrics -->
						<div class="grid grid-cols-2 gap-3 text-sm">
							<div>
								<p class="text-muted-foreground">Min Investment</p>
								<p class="font-semibold">{formatCurrency(offering.minInvestment)}</p>
							</div>
							<div>
								<p class="text-muted-foreground">Investors</p>
								<p class="font-semibold">{offering.investorCount}</p>
							</div>
						</div>

						<!-- Projected Returns -->
						<div class="rounded-lg border bg-muted/50 p-3">
							<p class="mb-2 text-xs font-medium text-muted-foreground">PROJECTED RETURNS</p>
							<div class="grid grid-cols-2 gap-2 text-sm">
								<div>
									<p class="text-xs text-muted-foreground">Year 1 CoC</p>
									<p class="font-semibold text-primary">{formatPercent(offering.year1CoC)}</p>
								</div>
								<div>
									<p class="text-xs text-muted-foreground">Avg Yield</p>
									<p class="font-semibold">{formatPercent(offering.avgCashYield)}</p>
								</div>
								<div>
									<p class="text-xs text-muted-foreground">IRR ({offering.holdPeriod}yr)</p>
									<p class="font-semibold text-green-600">{formatPercent(offering.projectedIRR)}</p>
								</div>
								<div>
									<p class="text-xs text-muted-foreground">Equity Multiple</p>
									<p class="font-semibold">{offering.equityMultiple}x</p>
								</div>
							</div>
						</div>

						<!-- Sponsor Info -->
						<div class="flex items-center gap-3 rounded-lg border p-3">
							<div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
								<UsersIcon class="size-5 text-primary" />
							</div>
							<div class="flex-1">
								<p class="text-sm font-medium">{offering.sponsorName}</p>
								<p class="text-xs text-muted-foreground">
									{offering.sponsorDeals} deals • {formatPercent(offering.sponsorAvgIRR)} avg IRR
								</p>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex gap-2">
							<Button variant="outline" size="sm" class="flex-1">
								<BookmarkIcon class="mr-1 size-4" />
								Save
							</Button>
							<Button variant="outline" size="sm" class="flex-1">
								<EyeIcon class="mr-1 size-4" />
								Details
							</Button>
						</div>
						<Button class="w-full" size="lg">
							<DiamondIcon class="mr-2 size-4" />
							Invest Now
						</Button>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<!-- Load More -->
		<div class="mt-6 flex justify-center">
			<Button variant="outline">Load More Offerings</Button>
		</div>
	</div>

	<!-- Info Banner -->
	<Card.Root class="border-primary/50 bg-primary/5">
		<Card.Content class="flex items-center gap-4 p-6">
			<div class="flex size-12 items-center justify-center rounded-full bg-primary/20">
				<DiamondIcon class="size-6 text-primary" />
			</div>
			<div class="flex-1">
				<h3 class="font-semibold">New to Real Estate Syndications?</h3>
				<p class="text-sm text-muted-foreground">
					Learn how tokenized real estate investing works, understand the risks, and get started with confidence.
				</p>
			</div>
			<Button variant="outline">
				Learn More
			</Button>
		</Card.Content>
	</Card.Root>
</div>
