<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Progress } from "$lib/components/ui/progress";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import HomeIcon from "@tabler/icons-svelte/icons/home";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import AlertCircleIcon from "@tabler/icons-svelte/icons/alert-circle";
	import BellIcon from "@tabler/icons-svelte/icons/bell";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";
	import FolderIcon from "@tabler/icons-svelte/icons/folder";
	import SearchIcon from "@tabler/icons-svelte/icons/search";
	import FlowerIcon from "@tabler/icons-svelte/icons/flower";
</script>

<svelte:head>
	<title>Overview - deed.guru</title>
</svelte:head>

<!-- Header -->
<header
	class="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<HomeIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Overview</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="outline" size="sm">
				<BellIcon class="size-4" />
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Welcome Section -->
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Welcome back, Arnold</h2>
		<p class="text-muted-foreground">Here's what needs your attention today</p>
	</div>

	<!-- Portfolio Health Summary -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total AUM</Card.Title>
				<BuildingIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">$150M</div>
				<p class="text-xs text-muted-foreground">5 properties, 1,847 units</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Avg Occupancy</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">94.2%</div>
				<p class="text-xs text-green-600">+2.3% from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Portfolio NOI</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">$12.3M</div>
				<p class="text-xs text-muted-foreground">Annual run rate</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">YTD Returns</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-green-600">+16.8%</div>
				<p class="text-xs text-muted-foreground">Above target 15%</p>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="grid gap-4 md:grid-cols-7">
		<!-- Left Column - Wider -->
		<div class="md:col-span-4 space-y-4">
			<!-- Active Pipeline -->
			<Card.Root>
				<Card.Header>
					<div class="flex items-center justify-between">
						<div>
							<Card.Title>Active Pipeline</Card.Title>
							<Card.Description>Deals in progress</Card.Description>
						</div>
						<Button variant="outline" size="sm" href="/portfolio/deals">View All</Button>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						<!-- Pipeline Stats -->
						<div class="grid grid-cols-4 gap-4 rounded-lg border p-4">
							<div class="text-center">
								<div class="text-2xl font-bold text-primary">5</div>
								<p class="text-xs text-muted-foreground">In Analysis</p>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-yellow-600">3</div>
								<p class="text-xs text-muted-foreground">Under LOI</p>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-orange-600">2</div>
								<p class="text-xs text-muted-foreground">Due Diligence</p>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-green-600">1</div>
								<p class="text-xs text-muted-foreground">Closing</p>
							</div>
						</div>

						<!-- Recent Deals -->
						<div class="space-y-3">
							<div class="flex items-center justify-between rounded-lg border p-3">
								<div class="flex items-center gap-3">
									<div class="flex size-10 items-center justify-center rounded-lg bg-amber-100">
										<FlowerIcon class="size-5 text-amber-600" />
									</div>
									<div>
										<p class="font-medium">Austin Tech Towers</p>
										<p class="text-sm text-muted-foreground">342 units • Bloom: 58/64 A+</p>
									</div>
								</div>
								<Badge variant="secondary">Analyzing</Badge>
							</div>

							<div class="flex items-center justify-between rounded-lg border p-3">
								<div class="flex items-center gap-3">
									<div class="flex size-10 items-center justify-center rounded-lg bg-amber-50">
										<FlowerIcon class="size-5 text-amber-500" />
									</div>
									<div>
										<p class="font-medium">Orlando Gardens</p>
										<p class="text-sm text-muted-foreground">218 units • Bloom: 52/64 A</p>
									</div>
								</div>
								<Badge class="bg-yellow-100 text-yellow-800">Under LOI</Badge>
							</div>

							<div class="flex items-center justify-between rounded-lg border p-3">
								<div class="flex items-center gap-3">
									<div class="flex size-10 items-center justify-center rounded-lg bg-green-100">
										<FlowerIcon class="size-5 text-green-600" />
									</div>
									<div>
										<p class="font-medium">Phoenix Heights</p>
										<p class="text-sm text-muted-foreground">156 units • Bloom: 48/64 B+</p>
									</div>
								</div>
								<Badge class="bg-orange-100 text-orange-800">Due Diligence</Badge>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Recent Search Activity -->
			<Card.Root>
				<Card.Header>
					<div class="flex items-center justify-between">
						<div>
							<Card.Title>Recent Search Activity</Card.Title>
							<Card.Description>Your latest property searches</Card.Description>
						</div>
						<Button variant="outline" size="sm" href="/search">
							<SearchIcon class="mr-2 size-4" />
							New Search
						</Button>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="space-y-3">
						<div class="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p class="font-medium">Austin Multifamily 200+ units</p>
								<p class="text-sm text-muted-foreground">47 results • Last run 2 hours ago</p>
							</div>
							<Button variant="ghost" size="sm">View</Button>
						</div>
						<div class="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p class="font-medium">Orlando Class A properties</p>
								<p class="text-sm text-muted-foreground">23 results • Last run yesterday</p>
							</div>
							<Button variant="ghost" size="sm">View</Button>
						</div>
						<div class="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p class="font-medium">Phoenix value-add deals</p>
								<p class="text-sm text-muted-foreground">12 results • Last run 3 days ago</p>
							</div>
							<Button variant="ghost" size="sm">View</Button>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Right Column - Alerts & Quick Actions -->
		<div class="md:col-span-3 space-y-4">
			<!-- Alerts & Notifications -->
			<Card.Root>
				<Card.Header>
					<div class="flex items-center gap-2">
						<AlertCircleIcon class="size-4 text-orange-600" />
						<Card.Title>Alerts & Notifications</Card.Title>
					</div>
					<Card.Description>Items needing attention</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						<div class="flex items-start gap-3 rounded-lg border-l-4 border-l-red-600 bg-red-50 p-3">
							<AlertCircleIcon class="mt-0.5 size-5 text-red-600" />
							<div class="flex-1">
								<p class="font-medium text-sm">Occupancy Alert</p>
								<p class="text-xs text-muted-foreground">Tampa Gardens dropped to 88% (-4%)</p>
								<p class="text-xs text-muted-foreground">30 minutes ago</p>
							</div>
						</div>

						<div class="flex items-start gap-3 rounded-lg border-l-4 border-l-blue-600 bg-blue-50 p-3">
							<EyeIcon class="mt-0.5 size-5 text-blue-600" />
							<div class="flex-1">
								<p class="font-medium text-sm">Price Drop</p>
								<p class="text-xs text-muted-foreground">Austin Tech Towers reduced by $2M</p>
								<p class="text-xs text-muted-foreground">2 hours ago</p>
							</div>
						</div>

						<div class="flex items-start gap-3 rounded-lg border-l-4 border-l-green-600 bg-green-50 p-3">
							<SearchIcon class="mt-0.5 size-5 text-green-600" />
							<div class="flex-1">
								<p class="font-medium text-sm">New Matches</p>
								<p class="text-xs text-muted-foreground">3 new properties match your saved search</p>
								<p class="text-xs text-muted-foreground">Yesterday</p>
							</div>
						</div>

						<div class="flex items-start gap-3 rounded-lg border-l-4 border-l-yellow-600 bg-yellow-50 p-3">
							<BuildingIcon class="mt-0.5 size-5 text-yellow-600" />
							<div class="flex-1">
								<p class="font-medium text-sm">Delinquency Spike</p>
								<p class="text-xs text-muted-foreground">River Walk increased to 5.2% (+2%)</p>
								<p class="text-xs text-muted-foreground">2 days ago</p>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Quick Actions -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Quick Actions</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-2">
					<Button variant="outline" class="justify-start" href="/search">
						<SearchIcon class="mr-2 size-4" />
						Start New Hunt
					</Button>
					<Button variant="outline" class="justify-start" href="/studio/inputs">
						<FolderIcon class="mr-2 size-4" />
						Upload Deal Documents
					</Button>
					<Button variant="outline" class="justify-start" href="/studio/analysis">
						<FlowerIcon class="mr-2 size-4" />
						Create Analysis Report
					</Button>
					<Button variant="outline" class="justify-start" href="/marketplace">
						<TrendingUpIcon class="mr-2 size-4" />
						View Marketplace Offerings
					</Button>
				</Card.Content>
			</Card.Root>

			<!-- Watching Summary -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<EyeIcon class="size-4" />
						Watching
					</Card.Title>
					<Card.Description>27 properties on your watchlist</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">With price drops</span>
							<Badge variant="secondary">3</Badge>
						</div>
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">New this week</span>
							<Badge variant="secondary">5</Badge>
						</div>
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">Days on market >90</span>
							<Badge variant="secondary">8</Badge>
						</div>
					</div>
					<Button class="mt-4 w-full" variant="outline" href="/portfolio/watching">
						View Watchlist
					</Button>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
