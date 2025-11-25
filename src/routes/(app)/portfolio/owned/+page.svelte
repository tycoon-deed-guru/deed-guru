<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Progress } from "$lib/components/ui/progress";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import TrendingDownIcon from "@tabler/icons-svelte/icons/trending-down";
	import UsersIcon from "@tabler/icons-svelte/icons/users";
	import DollarIcon from "@tabler/icons-svelte/icons/currency-dollar";
	import AlertCircleIcon from "@tabler/icons-svelte/icons/alert-circle";
	import CheckCircleIcon from "@tabler/icons-svelte/icons/circle-check";
	import PlugIcon from "@tabler/icons-svelte/icons/plug";
	import RefreshIcon from "@tabler/icons-svelte/icons/refresh";
	import DownloadIcon from "@tabler/icons-svelte/icons/download";
	import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";

	// Mock owned properties with live PMS data
	const ownedProperties = [
		{
			id: "1",
			propertyName: "Park Vista Apartments",
			address: "789 Park Ave, Austin, TX 78701",
			units: 248,
			acquisition: {
				date: "2023-03-15",
				price: 38500000,
			},
			pmsIntegration: {
				provider: "Yardi Voyager",
				status: "connected",
				lastSync: "2024-11-20T08:30:00Z",
			},
			liveData: {
				occupancy: 94.8,
				occupancyChange: 1.2,
				occupiedUnits: 235,
				vacantUnits: 13,
				avgRent: 1850,
				rentChange: 3.5,
				collections: 96.2,
				collectionsChange: -0.8,
				noi: 4200000,
				noiTarget: 4100000,
				daysToTurn: 4.2,
				leaseRenewalRate: 68.5,
			},
			alerts: [
				{
					type: "info",
					message: "12 leases expiring in next 30 days",
				},
			],
		},
		{
			id: "2",
			propertyName: "Lakeside Commons",
			address: "456 Lake Dr, Orlando, FL 32801",
			units: 186,
			acquisition: {
				date: "2022-08-20",
				price: 27000000,
			},
			pmsIntegration: {
				provider: "RealPage OneSite",
				status: "connected",
				lastSync: "2024-11-20T07:45:00Z",
			},
			liveData: {
				occupancy: 91.4,
				occupancyChange: -1.8,
				occupiedUnits: 170,
				vacantUnits: 16,
				avgRent: 1650,
				rentChange: 2.1,
				collections: 94.5,
				collectionsChange: -1.2,
				noi: 2800000,
				noiTarget: 2900000,
				daysToTurn: 6.8,
				leaseRenewalRate: 62.3,
			},
			alerts: [
				{
					type: "warning",
					message: "Occupancy below target (93%)",
				},
				{
					type: "warning",
					message: "Collections trending down",
				},
			],
		},
		{
			id: "3",
			propertyName: "Metro Heights",
			address: "123 Metro St, Phoenix, AZ 85001",
			units: 312,
			acquisition: {
				date: "2023-11-10",
				price: 52000000,
			},
			pmsIntegration: {
				provider: "Entrata",
				status: "connected",
				lastSync: "2024-11-20T09:00:00Z",
			},
			liveData: {
				occupancy: 96.2,
				occupancyChange: 0.5,
				occupiedUnits: 300,
				vacantUnits: 12,
				avgRent: 1975,
				rentChange: 4.2,
				collections: 97.8,
				collectionsChange: 0.5,
				noi: 6500000,
				noiTarget: 6200000,
				daysToTurn: 3.5,
				leaseRenewalRate: 72.1,
			},
			alerts: [],
		},
	];

	function formatCurrency(value: number): string {
		if (value >= 1000000) {
			return "$" + (value / 1000000).toFixed(1) + "M";
		}
		return "$" + value.toLocaleString();
	}

	function formatPercent(value: number, showSign: boolean = false): string {
		const sign = showSign && value > 0 ? "+" : "";
		return sign + value.toFixed(1) + "%";
	}

	function getLastSyncText(lastSync: string): string {
		const diff = Date.now() - new Date(lastSync).getTime();
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return "Just now";
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		return `${hours}h ago`;
	}

	function getMetricColor(value: number, isGood: "higher" | "lower"): string {
		if (isGood === "higher") {
			return value > 0 ? "text-green-600" : "text-red-600";
		}
		return value < 0 ? "text-green-600" : "text-red-600";
	}

	// Portfolio summary
	const portfolioSummary = $derived({
		totalUnits: ownedProperties.reduce((sum, p) => sum + p.units, 0),
		avgOccupancy:
			ownedProperties.reduce((sum, p) => sum + p.liveData.occupancy, 0) / ownedProperties.length,
		totalNOI: ownedProperties.reduce((sum, p) => sum + p.liveData.noi, 0),
		avgCollections:
			ownedProperties.reduce((sum, p) => sum + p.liveData.collections, 0) / ownedProperties.length,
	});
</script>

<svelte:head>
	<title>Owned Properties - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<BuildingIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Owned Properties</h1>
			<Badge variant="secondary">{ownedProperties.length}</Badge>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="outline" size="sm">
				<RefreshIcon class="mr-2 size-4" />
				Sync All
			</Button>
			<Button variant="outline" size="sm">
				<DownloadIcon class="mr-2 size-4" />
				Export Report
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Portfolio Summary -->
	<div class="grid gap-4 md:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Units</Card.Title>
				<BuildingIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{portfolioSummary.totalUnits}</div>
				<p class="text-xs text-muted-foreground">Across {ownedProperties.length} properties</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Avg Occupancy</Card.Title>
				<UsersIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{portfolioSummary.avgOccupancy.toFixed(1)}%</div>
				<p class="text-xs text-muted-foreground">Portfolio wide</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total NOI</Card.Title>
				<DollarIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{formatCurrency(portfolioSummary.totalNOI)}</div>
				<p class="text-xs text-muted-foreground">Annual run rate</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Collections</Card.Title>
				<CheckCircleIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{portfolioSummary.avgCollections.toFixed(1)}%</div>
				<p class="text-xs text-muted-foreground">Average rate</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Properties Grid -->
	<div class="space-y-4">
		{#each ownedProperties as property}
			<Card.Root>
				<Card.Header>
					<div class="flex items-start justify-between">
						<div>
							<Card.Title class="text-xl">{property.propertyName}</Card.Title>
							<Card.Description>{property.address}</Card.Description>
							<div class="mt-2 flex items-center gap-2 text-sm">
								<div class="flex items-center gap-1">
									<PlugIcon class="size-3 text-green-600" />
									<span class="text-muted-foreground">{property.pmsIntegration.provider}</span>
								</div>
								<Separator orientation="vertical" class="h-4" />
								<span class="text-muted-foreground">
									Last sync: {getLastSyncText(property.pmsIntegration.lastSync)}
								</span>
							</div>
						</div>
						<Badge class="bg-green-100 text-green-800">
							<CheckCircleIcon class="mr-1 size-3" />
							Connected
						</Badge>
					</div>
				</Card.Header>

				<Card.Content class="space-y-6">
					<!-- Alerts -->
					{#if property.alerts.length > 0}
						<div class="space-y-2">
							{#each property.alerts as alert}
								<div
									class={`flex items-start gap-2 rounded-lg border p-3 ${
										alert.type === "warning"
											? "border-orange-200 bg-orange-50"
											: "border-blue-200 bg-blue-50"
									}`}
								>
									<AlertCircleIcon
										class={`size-4 ${alert.type === "warning" ? "text-orange-600" : "text-blue-600"}`}
									/>
									<p class="text-sm">{alert.message}</p>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Key Performance Metrics -->
					<div class="grid gap-6 md:grid-cols-3">
						<!-- Occupancy Section -->
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<p class="text-sm font-medium text-muted-foreground">OCCUPANCY</p>
								<div class="flex items-center gap-1">
									<span class="text-2xl font-bold">{property.liveData.occupancy.toFixed(1)}%</span>
									<div class="flex items-center gap-0.5 text-sm">
										{#if property.liveData.occupancyChange > 0}
											<TrendingUpIcon class="size-4 text-green-600" />
										{:else}
											<TrendingDownIcon class="size-4 text-red-600" />
										{/if}
										<span class={getMetricColor(property.liveData.occupancyChange, "higher")}>
											{formatPercent(Math.abs(property.liveData.occupancyChange), true)}
										</span>
									</div>
								</div>
							</div>
							<Progress value={property.liveData.occupancy} class="h-2" />
							<div class="flex justify-between text-sm text-muted-foreground">
								<span>Occupied: {property.liveData.occupiedUnits}</span>
								<span>Vacant: {property.liveData.vacantUnits}</span>
							</div>
						</div>

						<!-- Rent Section -->
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<p class="text-sm font-medium text-muted-foreground">AVG RENT</p>
								<div class="flex items-center gap-1">
									<span class="text-2xl font-bold">${property.liveData.avgRent}</span>
									<div class="flex items-center gap-0.5 text-sm">
										{#if property.liveData.rentChange > 0}
											<TrendingUpIcon class="size-4 text-green-600" />
										{:else}
											<TrendingDownIcon class="size-4 text-red-600" />
										{/if}
										<span class={getMetricColor(property.liveData.rentChange, "higher")}>
											{formatPercent(Math.abs(property.liveData.rentChange), true)}
										</span>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-2 text-sm">
								<div>
									<p class="text-muted-foreground">Renewal Rate</p>
									<p class="font-semibold">{property.liveData.leaseRenewalRate}%</p>
								</div>
								<div>
									<p class="text-muted-foreground">Days to Turn</p>
									<p class="font-semibold">{property.liveData.daysToTurn}</p>
								</div>
							</div>
						</div>

						<!-- Financial Section -->
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<p class="text-sm font-medium text-muted-foreground">NOI</p>
								<div class="flex items-center gap-1">
									<span class="text-2xl font-bold">{formatCurrency(property.liveData.noi)}</span>
									{#if property.liveData.noi >= property.liveData.noiTarget}
										<CheckCircleIcon class="size-5 text-green-600" />
									{:else}
										<AlertCircleIcon class="size-5 text-orange-600" />
									{/if}
								</div>
							</div>
							<div class="text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Target:</span>
									<span>{formatCurrency(property.liveData.noiTarget)}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Collections:</span>
									<div class="flex items-center gap-1">
										<span class="font-semibold">{property.liveData.collections}%</span>
										<span class={getMetricColor(property.liveData.collectionsChange, "higher")}>
											({formatPercent(property.liveData.collectionsChange, true)})
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex gap-2 border-t pt-4">
						<Button variant="outline" size="sm">
							<ChartBarIcon class="mr-2 size-4" />
							Full Analytics
						</Button>
						<Button variant="outline" size="sm">
							<DownloadIcon class="mr-2 size-4" />
							Download Report
						</Button>
						<Button variant="outline" size="sm">
							<RefreshIcon class="mr-2 size-4" />
							Sync Now
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<!-- PMS Integration CTA -->
	<Card.Root class="border-primary/50 bg-primary/5">
		<Card.Content class="flex items-center gap-4 p-6">
			<div class="flex size-12 items-center justify-center rounded-full bg-primary/20">
				<PlugIcon class="size-6 text-primary" />
			</div>
			<div class="flex-1">
				<h3 class="font-semibold">Connect More Properties</h3>
				<p class="text-sm text-muted-foreground">
					Integrate with Yardi, RealPage, Entrata, or AppFolio for live portfolio tracking
				</p>
			</div>
			<Button>
				<PlugIcon class="mr-2 size-4" />
				Add PMS Connection
			</Button>
		</Card.Content>
	</Card.Root>
</div>
