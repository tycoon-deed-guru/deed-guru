<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Switch } from "$lib/components/ui/switch";
	import BookmarkIcon from "@tabler/icons-svelte/icons/bookmark";
	import SearchIcon from "@tabler/icons-svelte/icons/search";
	import BellIcon from "@tabler/icons-svelte/icons/bell";
	import TrashIcon from "@tabler/icons-svelte/icons/trash";
	import PlayIcon from "@tabler/icons-svelte/icons/player-play";
	import ClockIcon from "@tabler/icons-svelte/icons/clock";
	import MapPinIcon from "@tabler/icons-svelte/icons/map-pin";

	// Mock saved searches
	const savedSearches = [
		{
			id: "1",
			name: "Austin 200+ Units Under $50M",
			criteria: "Austin, TX • 200+ units • $20M-$50M • Cap Rate 5.5%+",
			resultsCount: 24,
			lastRun: "2 hours ago",
			alertsEnabled: true,
			frequency: "Daily",
			newMatches: 3,
		},
		{
			id: "2",
			name: "Value-Add Opportunities - Texas",
			criteria: "TX • Class B+ • Built before 2010 • <85% occupancy",
			resultsCount: 47,
			lastRun: "1 day ago",
			alertsEnabled: true,
			frequency: "Weekly",
			newMatches: 8,
		},
		{
			id: "3",
			name: "Institutional Grade - Sunbelt",
			criteria: "Austin, Dallas, Phoenix, Nashville • 300+ units • Class A",
			resultsCount: 12,
			lastRun: "3 days ago",
			alertsEnabled: false,
			frequency: "Monthly",
			newMatches: 0,
		},
		{
			id: "4",
			name: "Sub-$30M Multifamily - Growth Markets",
			criteria: "Growth markets • $15M-$30M • 100-250 units",
			resultsCount: 68,
			lastRun: "5 hours ago",
			alertsEnabled: true,
			frequency: "Daily",
			newMatches: 12,
		},
	];
</script>

<svelte:head>
	<title>Saved Searches - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<BookmarkIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Saved Searches</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="outline" size="sm" href="/search">
				<SearchIcon class="mr-2 size-4" />
				New Search
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Page Header -->
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Saved Searches</h2>
		<p class="text-muted-foreground">Manage your saved searches and automated alerts</p>
	</div>

	<!-- Stats Cards -->
	<div class="grid gap-4 md:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Searches</Card.Title>
				<BookmarkIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{savedSearches.length}</div>
				<p class="text-xs text-muted-foreground">3 active alerts</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">New Matches</Card.Title>
				<BellIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{savedSearches.reduce((sum, s) => sum + s.newMatches, 0)}
				</div>
				<p class="text-xs text-green-600">+8 since yesterday</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Results</Card.Title>
				<SearchIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{savedSearches.reduce((sum, s) => sum + s.resultsCount, 0)}
				</div>
				<p class="text-xs text-muted-foreground">Across all searches</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Alerts</Card.Title>
				<BellIcon class="size-4 text-green-600" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{savedSearches.filter((s) => s.alertsEnabled).length}
				</div>
				<p class="text-xs text-muted-foreground">Email notifications on</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Saved Searches List -->
	<div class="space-y-3">
		{#each savedSearches as search}
			<Card.Root class="transition-all hover:shadow-md">
				<Card.Content class="p-6">
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<div class="flex items-start justify-between">
								<div>
									<div class="flex items-center gap-2">
										<h3 class="text-lg font-semibold">{search.name}</h3>
										{#if search.newMatches > 0}
											<Badge variant="default" class="bg-green-100 text-green-800">
												{search.newMatches} new
											</Badge>
										{/if}
									</div>
									<p class="mt-1 text-sm text-muted-foreground">
										<MapPinIcon class="mr-1 inline size-3" />
										{search.criteria}
									</p>
								</div>
							</div>

							<div class="mt-4 flex items-center gap-6 text-sm">
								<div class="flex items-center gap-2">
									<SearchIcon class="size-4 text-muted-foreground" />
									<span class="font-medium">{search.resultsCount} results</span>
								</div>
								<div class="flex items-center gap-2">
									<ClockIcon class="size-4 text-muted-foreground" />
									<span class="text-muted-foreground">Last run: {search.lastRun}</span>
								</div>
								<div class="flex items-center gap-2">
									<BellIcon class="size-4 text-muted-foreground" />
									<span class="text-muted-foreground">{search.frequency} alerts</span>
								</div>
							</div>

							<div class="mt-4 flex items-center gap-3 border-t pt-4">
								<Switch checked={search.alertsEnabled} />
								<span class="text-sm font-medium">
									{search.alertsEnabled ? "Alerts enabled" : "Alerts disabled"}
								</span>
							</div>
						</div>

						<div class="flex flex-col gap-2">
							<Button size="sm">
								<PlayIcon class="mr-2 size-4" />
								Run Now
							</Button>
							<Button variant="outline" size="sm" href="/search">
								<SearchIcon class="mr-2 size-4" />
								View Results
							</Button>
							<Button variant="outline" size="sm">Edit</Button>
							<Button variant="ghost" size="sm" class="text-destructive hover:text-destructive">
								<TrashIcon class="mr-2 size-4" />
								Delete
							</Button>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<!-- Empty State for New Users (hidden when searches exist) -->
	{#if savedSearches.length === 0}
		<Card.Root class="border-dashed">
			<Card.Content class="flex h-[400px] flex-col items-center justify-center p-12 text-center">
				<div class="flex size-16 items-center justify-center rounded-full bg-primary/10">
					<BookmarkIcon class="size-8 text-primary" />
				</div>
				<h3 class="mt-4 text-lg font-semibold">No Saved Searches</h3>
				<p class="mt-2 text-sm text-muted-foreground">
					Save your search criteria to get automated alerts when new properties match
				</p>
				<Button class="mt-4" href="/search">
					<SearchIcon class="mr-2 size-4" />
					Create Your First Search
				</Button>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
