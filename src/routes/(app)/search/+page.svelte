<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import SearchIcon from "@tabler/icons-svelte/icons/search";
	import ListIcon from "@tabler/icons-svelte/icons/list";
	import MapIcon from "@tabler/icons-svelte/icons/map";
	import LayoutGridIcon from "@tabler/icons-svelte/icons/layout-grid";
	import TableIcon from "@tabler/icons-svelte/icons/table";
	import FlowerIcon from "@tabler/icons-svelte/icons/flower";
	import FilterIcon from "@tabler/icons-svelte/icons/filter";
	import SortAscendingIcon from "@tabler/icons-svelte/icons/sort-ascending";
	import XIcon from "@tabler/icons-svelte/icons/x";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";
	import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";
	import BookmarkIcon from "@tabler/icons-svelte/icons/bookmark";

	// Mock data - replace with actual API calls
	const mockProperties = [
		{
			id: "1",
			name: "Austin Tech Towers",
			address: "2400 Domain Dr, Austin, TX",
			units: 342,
			price: 48500000,
			capRate: 6.2,
			cashOnCash: 9.8,
			yearBuilt: 2018,
			bloomScore: 58,
			grade: "A+",
			imageUrl: "/placeholder-property.jpg",
			location: { lat: 30.2672, lng: -97.7431 },
		},
		{
			id: "2",
			name: "Domain Heights",
			address: "3500 Esperanza Crossing, Austin, TX",
			units: 456,
			price: 62800000,
			capRate: 5.8,
			cashOnCash: 8.4,
			yearBuilt: 2015,
			bloomScore: 52,
			grade: "A",
			imageUrl: "/placeholder-property.jpg",
			location: { lat: 30.4000, lng: -97.7200 },
		},
		{
			id: "3",
			name: "South Lamar Apartments",
			address: "1200 S Lamar Blvd, Austin, TX",
			units: 268,
			price: 35200000,
			capRate: 6.5,
			cashOnCash: 10.2,
			yearBuilt: 2012,
			bloomScore: 49,
			grade: "A-",
			imageUrl: "/placeholder-property.jpg",
			location: { lat: 30.2500, lng: -97.7700 },
		},
		{
			id: "4",
			name: "Riverside Park",
			address: "800 E Riverside Dr, Austin, TX",
			units: 224,
			price: 29100000,
			capRate: 6.8,
			cashOnCash: 9.1,
			yearBuilt: 2010,
			bloomScore: 47,
			grade: "B+",
			imageUrl: "/placeholder-property.jpg",
			location: { lat: 30.2400, lng: -97.7300 },
		},
		{
			id: "5",
			name: "Mueller Lofts",
			address: "4550 Mueller Blvd, Austin, TX",
			units: 198,
			price: 26400000,
			capRate: 5.9,
			cashOnCash: 7.8,
			yearBuilt: 2014,
			bloomScore: 45,
			grade: "B+",
			imageUrl: "/placeholder-property.jpg",
			location: { lat: 30.2900, lng: -97.7100 },
		},
	];

	let viewMode = $state<"list" | "map" | "cards" | "table">("list");
	let searchQuery = $state("");
	let activeFilters = $state<{ label: string; value: string }[]>([
		{ label: "Austin, TX", value: "location:austin" },
		{ label: "$20M - $60M", value: "price:20-60" },
		{ label: "200+ units", value: "units:200+" },
	]);
	let sortBy = $state<"score" | "price" | "cap" | "coc">("score");
	let selectedProperties = $state<string[]>([]);

	function formatPrice(price: number): string {
		return "$" + (price / 1000000).toFixed(1) + "M";
	}

	function removeFilter(filter: { label: string; value: string }) {
		activeFilters = activeFilters.filter((f) => f.value !== filter.value);
	}

	function togglePropertySelect(id: string) {
		if (selectedProperties.includes(id)) {
			selectedProperties = selectedProperties.filter((p) => p !== id);
		} else {
			selectedProperties = [...selectedProperties, id];
		}
	}

	function getGradeColor(grade: string): string {
		if (grade.startsWith("A")) return "bg-green-100 text-green-800";
		if (grade.startsWith("B")) return "bg-yellow-100 text-yellow-800";
		if (grade.startsWith("C")) return "bg-orange-100 text-orange-800";
		return "bg-red-100 text-red-800";
	}
</script>

<svelte:head>
	<title>Search - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<SearchIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Search</h1>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Search Bar -->
	<div class="space-y-4">
		<div class="flex gap-2">
			<div class="relative flex-1">
				<SearchIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					bind:value={searchQuery}
					placeholder="200+ units in Austin under $50M"
					class="pl-10"
				/>
			</div>
			<Button>
				<SearchIcon class="mr-2 size-4" />
				Search
			</Button>
			<Button variant="outline">
				<FilterIcon class="size-4" />
			</Button>
		</div>

		<!-- Active Filters -->
		{#if activeFilters.length > 0}
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-sm text-muted-foreground">Active Filters:</span>
				{#each activeFilters as filter}
					<Badge variant="secondary" class="gap-1">
						{filter.label}
						<button
							onclick={() => removeFilter(filter)}
							class="ml-1 rounded-full hover:bg-secondary-foreground/20"
						>
							<XIcon class="size-3" />
						</button>
					</Badge>
				{/each}
				<Button variant="ghost" size="sm" onclick={() => (activeFilters = [])}>Clear all</Button>
			</div>
		{/if}
	</div>

	<!-- View Controls -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<span class="text-sm text-muted-foreground">Showing {mockProperties.length} properties</span>

			<div class="flex items-center gap-2">
				<SortAscendingIcon class="size-4 text-muted-foreground" />
				<select
					bind:value={sortBy}
					class="rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
				>
					<option value="score">deed.guru Score</option>
					<option value="price">Price</option>
					<option value="cap">Cap Rate</option>
					<option value="coc">Cash on Cash</option>
				</select>
			</div>
		</div>

		<ToggleGroup.Root bind:value={viewMode} type="single" class="border rounded-lg">
			<ToggleGroup.Item value="list" aria-label="List view">
				<ListIcon class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="map" aria-label="Map view">
				<MapIcon class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="cards" aria-label="Cards view">
				<LayoutGridIcon class="size-4" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="table" aria-label="Table view">
				<TableIcon class="size-4" />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	<!-- Compare Bar (if properties selected) -->
	{#if selectedProperties.length > 0}
		<Card.Root class="border-primary/50 bg-primary/5">
			<Card.Content class="flex items-center justify-between py-3">
				<span class="text-sm font-medium">
					{selectedProperties.length} properties selected
				</span>
				<div class="flex gap-2">
					<Button size="sm" variant="outline" onclick={() => (selectedProperties = [])}>
						Clear
					</Button>
					<Button size="sm">
						<ChartBarIcon class="mr-2 size-4" />
						Compare Selected
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- View Content -->
	{#if viewMode === "list"}
		<!-- LIST VIEW -->
		<div class="space-y-3">
			{#each mockProperties as property}
				<Card.Root class="transition-all hover:shadow-md">
					<Card.Content class="flex items-center gap-4 p-4">
						<input
							type="checkbox"
							checked={selectedProperties.includes(property.id)}
							onchange={() => togglePropertySelect(property.id)}
							class="size-4 cursor-pointer"
						/>

						<div class="flex flex-1 items-center justify-between gap-4">
							<div class="flex-1">
								<div class="flex items-start justify-between">
									<div>
										<h3 class="font-semibold">{property.name}</h3>
										<p class="text-sm text-muted-foreground">
											{property.units} units • {property.address.split(",")[0]}, {property.address.split(",")[1]} • {formatPrice(property.price)}
										</p>
										<div class="mt-1 flex gap-3 text-sm">
											<span>Cap: {property.capRate}%</span>
											<span>CoC: {property.cashOnCash}%</span>
											<span>Built: {property.yearBuilt}</span>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<div class="text-right">
											<div class="text-2xl font-bold text-amber-600">{property.bloomScore}/64</div>
											<Badge class="{getGradeColor(property.grade)}">{property.grade}</Badge>
										</div>
									</div>
								</div>
							</div>

							<div class="flex gap-2">
								<Button variant="outline" size="sm">
									<BookmarkIcon class="mr-1 size-4" />
									Save
								</Button>
								<Button variant="outline" size="sm">
									<EyeIcon class="mr-1 size-4" />
									View
								</Button>
								<Button variant="outline" size="sm">
									<ChartBarIcon class="mr-1 size-4" />
									Analyze
								</Button>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<div class="flex justify-center">
			<Button variant="outline">Load More Properties</Button>
		</div>

	{:else if viewMode === "cards"}
		<!-- CARDS VIEW -->
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each mockProperties as property}
				<Card.Root class="overflow-hidden transition-all hover:shadow-lg">
					<div class="aspect-video w-full bg-muted relative">
						<input
							type="checkbox"
							checked={selectedProperties.includes(property.id)}
							onchange={() => togglePropertySelect(property.id)}
							class="absolute top-2 left-2 size-4 cursor-pointer z-10"
						/>
						<div class="absolute top-2 right-2 z-10">
							<Badge class="{getGradeColor(property.grade)} text-lg font-bold px-3 py-1">
								{property.bloomScore}/64 • {property.grade}
							</Badge>
						</div>
					</div>
					<Card.Header>
						<Card.Title class="text-lg">{property.name}</Card.Title>
						<Card.Description>{property.address}</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid grid-cols-2 gap-2 text-sm">
							<div>
								<span class="text-muted-foreground">Units:</span>
								<span class="ml-2 font-medium">{property.units}</span>
							</div>
							<div>
								<span class="text-muted-foreground">Price:</span>
								<span class="ml-2 font-medium">{formatPrice(property.price)}</span>
							</div>
							<div>
								<span class="text-muted-foreground">Cap Rate:</span>
								<span class="ml-2 font-medium">{property.capRate}%</span>
							</div>
							<div>
								<span class="text-muted-foreground">CoC:</span>
								<span class="ml-2 font-medium">{property.cashOnCash}%</span>
							</div>
						</div>

						<!-- Mini Petal Chart Placeholder -->
						<div class="flex h-32 items-center justify-center rounded-md border border-dashed">
							<div class="text-center">
								<FlowerIcon class="mx-auto size-8 text-amber-500" />
								<p class="mt-2 text-xs text-muted-foreground">Bloom Score</p>
							</div>
						</div>

						<div class="flex gap-2">
							<Button variant="outline" size="sm" class="flex-1">
								<BookmarkIcon class="mr-1 size-4" />
								Save
							</Button>
							<Button size="sm" class="flex-1">
								<EyeIcon class="mr-1 size-4" />
								View
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<div class="flex justify-center">
			<Button variant="outline">Load More Properties</Button>
		</div>

	{:else if viewMode === "map"}
		<!-- MAP VIEW -->
		<div class="grid gap-4 md:grid-cols-3">
			<Card.Root class="md:col-span-2">
				<Card.Content class="p-0">
					<div class="flex h-[600px] items-center justify-center bg-muted">
						<div class="text-center">
							<MapIcon class="mx-auto size-12 text-muted-foreground" />
							<h3 class="mt-4 text-lg font-semibold">Interactive Map</h3>
							<p class="mt-2 text-sm text-muted-foreground">
								Map integration with Mapbox/Google Maps coming soon
							</p>
							<p class="mt-1 text-xs text-muted-foreground">
								Will show clustered markers, heat maps, and draw search boundaries
							</p>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<div class="space-y-4">
				<Card.Root>
					<Card.Header>
						<Card.Title>Selected Property</Card.Title>
					</Card.Header>
					<Card.Content>
						{#if mockProperties[0]}
							<div class="space-y-3">
								<div>
									<h3 class="font-semibold">{mockProperties[0].name}</h3>
									<p class="text-sm text-muted-foreground">{mockProperties[0].address}</p>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-2xl font-bold">{mockProperties[0].score}</span>
									<Badge class="{getGradeColor(mockProperties[0].grade)}">
										{mockProperties[0].grade}
									</Badge>
								</div>
								<div class="space-y-1 text-sm">
									<div class="flex justify-between">
										<span class="text-muted-foreground">Units:</span>
										<span class="font-medium">{mockProperties[0].units}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-muted-foreground">Price:</span>
										<span class="font-medium">{formatPrice(mockProperties[0].price)}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-muted-foreground">Cap Rate:</span>
										<span class="font-medium">{mockProperties[0].capRate}%</span>
									</div>
								</div>
								<div class="flex gap-2">
									<Button size="sm" class="flex-1">View Details</Button>
									<Button size="sm" variant="outline" class="flex-1">Analyze</Button>
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Nearby Properties</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-2">
							{#each mockProperties.slice(1, 4) as property}
								<button
									class="w-full rounded-lg border p-2 text-left hover:bg-accent"
								>
									<p class="text-sm font-medium">{property.name}</p>
									<p class="text-xs text-muted-foreground">
										{property.units} units • {property.bloomScore}/64 ({property.grade})
									</p>
								</button>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>

	{:else if viewMode === "table"}
		<!-- TABLE VIEW -->
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<div>
						<Card.Title>Property Data Table</Card.Title>
						<Card.Description>Sortable, filterable, exportable</Card.Description>
					</div>
					<div class="flex gap-2">
						<Button variant="outline" size="sm">+ Add Column</Button>
						<Button variant="outline" size="sm">Export CSV</Button>
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead class="border-b">
							<tr class="text-left">
								<th class="p-2">
									<input type="checkbox" class="size-4" />
								</th>
								<th class="p-2 font-medium">Property</th>
								<th class="p-2 font-medium">Units</th>
								<th class="p-2 font-medium">Price</th>
								<th class="p-2 font-medium">Cap Rate</th>
								<th class="p-2 font-medium">CoC</th>
								<th class="p-2 font-medium">Bloom</th>
								<th class="p-2 font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each mockProperties as property}
								<tr class="border-b hover:bg-accent/50">
									<td class="p-2">
										<input
											type="checkbox"
											checked={selectedProperties.includes(property.id)}
											onchange={() => togglePropertySelect(property.id)}
											class="size-4"
										/>
									</td>
									<td class="p-2">
										<div>
											<p class="font-medium">{property.name}</p>
											<p class="text-xs text-muted-foreground">{property.address}</p>
										</div>
									</td>
									<td class="p-2">{property.units}</td>
									<td class="p-2">{formatPrice(property.price)}</td>
									<td class="p-2">{property.capRate}%</td>
									<td class="p-2">{property.cashOnCash}%</td>
									<td class="p-2">
										<div class="flex items-center gap-2">
											<span class="font-bold text-amber-600">{property.bloomScore}/64</span>
											<Badge class="{getGradeColor(property.grade)} text-xs">
												{property.grade}
											</Badge>
										</div>
									</td>
									<td class="p-2">
										<div class="flex gap-1">
											<Button variant="ghost" size="sm">
												<BookmarkIcon class="size-4" />
											</Button>
											<Button variant="ghost" size="sm">
												<EyeIcon class="size-4" />
											</Button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="mt-4 flex items-center justify-between">
					<div class="text-sm text-muted-foreground">
						Showing 1-{mockProperties.length} of {mockProperties.length} properties
					</div>
					<div class="flex gap-2">
						<Button variant="outline" size="sm" disabled>Previous</Button>
						<Button variant="outline" size="sm">Next</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
