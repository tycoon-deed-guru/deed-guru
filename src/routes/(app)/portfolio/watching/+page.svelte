<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import { Switch } from "$lib/components/ui/switch";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";
	import BellIcon from "@tabler/icons-svelte/icons/bell";
	import MapPinIcon from "@tabler/icons-svelte/icons/map-pin";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import TrendingDownIcon from "@tabler/icons-svelte/icons/trending-down";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import AlertCircleIcon from "@tabler/icons-svelte/icons/alert-circle";
	import CrownIcon from "@tabler/icons-svelte/icons/crown";
	import SettingsIcon from "@tabler/icons-svelte/icons/settings";
	import TrashIcon from "@tabler/icons-svelte/icons/trash";
	import CalendarIcon from "@tabler/icons-svelte/icons/calendar";

	// Alert configuration modal state
	let alertDialogOpen = $state(false);
	let selectedPropertyId = $state<string | null>(null);

	// Mock watching data
	const watchingProperties = [
		{
			id: "1",
			propertyName: "Sunset Towers",
			address: "789 Sunset Blvd, Los Angeles, CA 90001",
			units: 412,
			currentPrice: 62000000,
			pricePerUnit: 150485,
			score: 91,
			grade: "A+",
			addedDate: "2024-10-15",
			alerts: {
				priceChange: true,
				priceThreshold: 60000000,
				occupancyChange: true,
				occupancyThreshold: 90,
				newListings: false,
				marketTrends: true,
			},
			recentActivity: [
				{
					type: "price_drop",
					description: "Price reduced by $3M",
					date: "2024-11-18",
				},
				{
					type: "occupancy",
					description: "Occupancy increased to 94%",
					date: "2024-11-10",
				},
			],
		},
		{
			id: "2",
			propertyName: "Metro Square Apartments",
			address: "456 Metro Ave, Seattle, WA 98101",
			units: 286,
			currentPrice: 42500000,
			pricePerUnit: 148601,
			score: 85,
			grade: "A",
			addedDate: "2024-11-01",
			alerts: {
				priceChange: true,
				priceThreshold: 40000000,
				occupancyChange: false,
				occupancyThreshold: 88,
				newListings: true,
				marketTrends: false,
			},
			recentActivity: [
				{
					type: "new_listing",
					description: "Similar property listed nearby",
					date: "2024-11-17",
				},
			],
		},
		{
			id: "3",
			propertyName: "Riverside Lofts",
			address: "123 River St, Portland, OR 97201",
			units: 198,
			currentPrice: 28000000,
			pricePerUnit: 141414,
			score: 78,
			grade: "B+",
			addedDate: "2024-11-12",
			alerts: {
				priceChange: false,
				priceThreshold: 0,
				occupancyChange: false,
				occupancyThreshold: 0,
				newListings: false,
				marketTrends: false,
			},
			recentActivity: [],
		},
	];

	function formatCurrency(value: number): string {
		if (value >= 1000000) {
			return "$" + (value / 1000000).toFixed(1) + "M";
		}
		return "$" + value.toLocaleString();
	}

	function formatDate(date: string): string {
		const d = new Date(date);
		const now = new Date();
		const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays}d ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
		return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	}

	function getActivityIcon(type: string) {
		switch (type) {
			case "price_drop":
				return TrendingDownIcon;
			case "price_increase":
				return TrendingUpIcon;
			case "occupancy":
				return BuildingIcon;
			case "new_listing":
				return MapPinIcon;
			default:
				return AlertCircleIcon;
		}
	}

	function getActivityColor(type: string) {
		switch (type) {
			case "price_drop":
				return "text-green-600 bg-green-50";
			case "price_increase":
				return "text-red-600 bg-red-50";
			case "occupancy":
				return "text-blue-600 bg-blue-50";
			case "new_listing":
				return "text-purple-600 bg-purple-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	}

	const selectedProperty = $derived(watchingProperties.find((p) => p.id === selectedPropertyId));

	const activeAlertCount = $derived(
		watchingProperties.reduce((count, prop) => {
			return (
				count +
				(prop.alerts.priceChange ? 1 : 0) +
				(prop.alerts.occupancyChange ? 1 : 0) +
				(prop.alerts.newListings ? 1 : 0) +
				(prop.alerts.marketTrends ? 1 : 0)
			);
		}, 0)
	);
</script>

<svelte:head>
	<title>Watching - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<EyeIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Watching</h1>
			<Badge variant="secondary">{watchingProperties.length}</Badge>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="outline" size="sm">
				<BellIcon class="mr-2 size-4" />
				Alerts ({activeAlertCount})
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Premium Feature Banner -->
	<Card.Root class="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
		<Card.Content class="flex items-center gap-4 p-4">
			<div class="flex size-12 items-center justify-center rounded-full bg-primary/20">
				<CrownIcon class="size-6 text-primary" />
			</div>
			<div class="flex-1">
				<h3 class="font-semibold">Premium Watchlist Active</h3>
				<p class="text-sm text-muted-foreground">
					Get instant alerts on price changes, occupancy updates, and market trends
				</p>
			</div>
			<Badge class="bg-primary text-primary-foreground">Pro</Badge>
		</Card.Content>
	</Card.Root>

	<!-- Watching Grid -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each watchingProperties as property}
			<Card.Root>
				<Card.Header>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<Card.Title class="text-lg">{property.propertyName}</Card.Title>
							<div class="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
								<MapPinIcon class="size-3" />
								<span class="truncate">{property.address}</span>
							</div>
						</div>
						<div class="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								onclick={() => {
									selectedPropertyId = property.id;
									alertDialogOpen = true;
								}}
							>
								<SettingsIcon class="size-4" />
							</Button>
							<Button variant="ghost" size="icon">
								<TrashIcon class="size-4 text-destructive" />
							</Button>
						</div>
					</div>
				</Card.Header>
				<Card.Content class="space-y-4">
					<!-- Key Metrics -->
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p class="text-muted-foreground">Units</p>
							<p class="font-semibold">{property.units}</p>
						</div>
						<div>
							<p class="text-muted-foreground">Current Price</p>
							<p class="font-semibold">{formatCurrency(property.currentPrice)}</p>
						</div>
						<div>
							<p class="text-muted-foreground">deed.guru Score</p>
							<div class="flex items-center gap-1">
								<span class="font-semibold">{property.score}</span>
								<Badge variant="secondary" class="text-xs">{property.grade}</Badge>
							</div>
						</div>
						<div>
							<p class="text-muted-foreground">$/Unit</p>
							<p class="font-semibold">{formatCurrency(property.pricePerUnit)}</p>
						</div>
					</div>

					<!-- Active Alerts -->
					<div class="rounded-lg border bg-muted/50 p-3">
						<div class="mb-2 flex items-center gap-2">
							<BellIcon class="size-4 text-muted-foreground" />
							<p class="text-sm font-medium">Active Alerts</p>
						</div>
						<div class="flex flex-wrap gap-1">
							{#if property.alerts.priceChange}
								<Badge variant="secondary" class="text-xs">Price Changes</Badge>
							{/if}
							{#if property.alerts.occupancyChange}
								<Badge variant="secondary" class="text-xs">Occupancy</Badge>
							{/if}
							{#if property.alerts.newListings}
								<Badge variant="secondary" class="text-xs">New Listings</Badge>
							{/if}
							{#if property.alerts.marketTrends}
								<Badge variant="secondary" class="text-xs">Market Trends</Badge>
							{/if}
							{#if !property.alerts.priceChange && !property.alerts.occupancyChange && !property.alerts.newListings && !property.alerts.marketTrends}
								<span class="text-xs text-muted-foreground">No alerts configured</span>
							{/if}
						</div>
					</div>

					<!-- Recent Activity -->
					{#if property.recentActivity.length > 0}
						<div class="space-y-2">
							<p class="text-sm font-medium">Recent Activity</p>
							{#each property.recentActivity as activity}
								{@const ActivityIcon = getActivityIcon(activity.type)}
								<div class="flex items-start gap-2">
									<div class={`flex size-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
										<ActivityIcon class="size-4" />
									</div>
									<div class="flex-1">
										<p class="text-sm">{activity.description}</p>
										<p class="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Footer -->
					<div class="flex items-center justify-between pt-2 text-xs text-muted-foreground">
						<div class="flex items-center gap-1">
							<CalendarIcon class="size-3" />
							<span>Added {formatDate(property.addedDate)}</span>
						</div>
						<Button variant="link" size="sm" class="h-auto p-0">View Details →</Button>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<!-- Empty State CTA -->
	{#if watchingProperties.length === 0}
		<Card.Root class="border-dashed">
			<Card.Content class="flex flex-col items-center justify-center p-12 text-center">
				<div class="flex size-16 items-center justify-center rounded-full bg-primary/10">
					<EyeIcon class="size-8 text-primary" />
				</div>
				<h3 class="mt-4 font-semibold">No properties in watchlist</h3>
				<p class="mt-2 text-sm text-muted-foreground">
					Add properties from Search to track price changes and get alerts
				</p>
				<Button href="/search" class="mt-4">
					Browse Properties
				</Button>
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<!-- Alert Configuration Dialog -->
<Dialog.Root bind:open={alertDialogOpen}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Alert Settings</Dialog.Title>
			<Dialog.Description>
				{selectedProperty ? selectedProperty.propertyName : "Configure alerts for this property"}
			</Dialog.Description>
		</Dialog.Header>

		{#if selectedProperty}
			<div class="space-y-6 py-4">
				<!-- Price Change Alerts -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<div class="space-y-0.5">
							<Label>Price Changes</Label>
							<p class="text-sm text-muted-foreground">Notify when price changes</p>
						</div>
						<Switch checked={selectedProperty.alerts.priceChange} />
					</div>
					{#if selectedProperty.alerts.priceChange}
						<div class="ml-4 space-y-2">
							<Label for="price-threshold">Alert if price drops below</Label>
							<Input
								id="price-threshold"
								type="number"
								placeholder="60000000"
								value={selectedProperty.alerts.priceThreshold}
							/>
						</div>
					{/if}
				</div>

				<Separator />

				<!-- Occupancy Alerts -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<div class="space-y-0.5">
							<Label>Occupancy Changes</Label>
							<p class="text-sm text-muted-foreground">Track occupancy trends</p>
						</div>
						<Switch checked={selectedProperty.alerts.occupancyChange} />
					</div>
					{#if selectedProperty.alerts.occupancyChange}
						<div class="ml-4 space-y-2">
							<Label for="occupancy-threshold">Alert if occupancy drops below (%)</Label>
							<Input
								id="occupancy-threshold"
								type="number"
								placeholder="90"
								value={selectedProperty.alerts.occupancyThreshold}
							/>
						</div>
					{/if}
				</div>

				<Separator />

				<!-- New Listings Alerts -->
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>New Similar Listings</Label>
						<p class="text-sm text-muted-foreground">Alert for comparable properties</p>
					</div>
					<Switch checked={selectedProperty.alerts.newListings} />
				</div>

				<Separator />

				<!-- Market Trends -->
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Market Trends</Label>
						<p class="text-sm text-muted-foreground">Get weekly market insights</p>
					</div>
					<Switch checked={selectedProperty.alerts.marketTrends} />
				</div>
			</div>

			<Dialog.Footer>
				<Button variant="outline" onclick={() => (alertDialogOpen = false)}>Cancel</Button>
				<Button onclick={() => (alertDialogOpen = false)}>Save Settings</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
