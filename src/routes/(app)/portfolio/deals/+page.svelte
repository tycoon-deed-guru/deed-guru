<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import * as Sheet from "$lib/components/ui/sheet";
	import * as Tabs from "$lib/components/ui/tabs";
	import FolderIcon from "@tabler/icons-svelte/icons/folder";
	import LayoutGridIcon from "@tabler/icons-svelte/icons/layout-grid";
	import ListIcon from "@tabler/icons-svelte/icons/list";
	import TableIcon from "@tabler/icons-svelte/icons/table";
	import PlusIcon from "@tabler/icons-svelte/icons/plus";
	import FilterIcon from "@tabler/icons-svelte/icons/filter";
	import ArrowsUpDownIcon from "@tabler/icons-svelte/icons/arrows-up-down";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import MapPinIcon from "@tabler/icons-svelte/icons/map-pin";
	import CalendarIcon from "@tabler/icons-svelte/icons/calendar";
	import DollarIcon from "@tabler/icons-svelte/icons/currency-dollar";
	import FlowerIcon from "@tabler/icons-svelte/icons/flower";
	import FileTextIcon from "@tabler/icons-svelte/icons/file-text";
	import TrashIcon from "@tabler/icons-svelte/icons/trash";

	// View mode state
	let viewMode = $state<"cards" | "list" | "table">("cards");
	let selectedDealId = $state<string | null>(null);

	// Stage filter state
	let activeStageFilter = $state<string>("all");

	// Mock deals data with stage management
	const deals = [
		{
			id: "1",
			propertyName: "Austin Tech Towers",
			address: "123 Tech Blvd, Austin, TX 78701",
			units: 342,
			askingPrice: 48500000,
			pricePerUnit: 141812,
			capRate: 5.8,
			bloomScore: 58,
			grade: "A+",
			stage: "underwriting",
			addedDate: "2024-11-15",
			updatedDate: "2024-11-19",
			daysInStage: 4,
			notes: "Strong value-add opportunity. Need to verify renovation budget.",
		},
		{
			id: "2",
			propertyName: "Phoenix Garden Apartments",
			address: "456 Desert Rd, Phoenix, AZ 85001",
			units: 218,
			askingPrice: 32000000,
			pricePerUnit: 146789,
			capRate: 6.2,
			bloomScore: 54,
			grade: "A",
			stage: "loi",
			addedDate: "2024-11-10",
			updatedDate: "2024-11-18",
			daysInStage: 8,
			notes: "LOI submitted at $31M. Waiting for seller response.",
		},
		{
			id: "3",
			propertyName: "Orlando Lakeside Villas",
			address: "789 Lake View Dr, Orlando, FL 32801",
			units: 156,
			askingPrice: 22500000,
			pricePerUnit: 144231,
			capRate: 5.5,
			bloomScore: 50,
			grade: "A-",
			stage: "analyzing",
			addedDate: "2024-11-12",
			updatedDate: "2024-11-17",
			daysInStage: 5,
			notes: "Running initial market comps and rent analysis.",
		},
		{
			id: "4",
			propertyName: "Nashville Heights",
			address: "321 Music Row, Nashville, TN 37201",
			units: 284,
			askingPrice: 41000000,
			pricePerUnit: 144366,
			capRate: 6.0,
			bloomScore: 55,
			grade: "A",
			stage: "due_diligence",
			addedDate: "2024-11-05",
			updatedDate: "2024-11-19",
			daysInStage: 14,
			notes: "In DD phase. Inspections scheduled for next week.",
		},
		{
			id: "5",
			propertyName: "Denver Mountain View",
			address: "555 Peak Ct, Denver, CO 80202",
			units: 198,
			askingPrice: 35000000,
			pricePerUnit: 176768,
			capRate: 5.2,
			bloomScore: 46,
			grade: "B+",
			stage: "sourced",
			addedDate: "2024-11-18",
			updatedDate: "2024-11-18",
			daysInStage: 1,
			notes: "New listing. Need to schedule tour.",
		},
	];

	// Stage definitions with colors
	const stages = [
		{ value: "all", label: "All Stages", count: deals.length, color: "" },
		{
			value: "sourced",
			label: "Sourced",
			count: deals.filter((d) => d.stage === "sourced").length,
			color: "bg-gray-100 text-gray-800",
		},
		{
			value: "analyzing",
			label: "Analyzing",
			count: deals.filter((d) => d.stage === "analyzing").length,
			color: "bg-blue-100 text-blue-800",
		},
		{
			value: "underwriting",
			label: "Underwriting",
			count: deals.filter((d) => d.stage === "underwriting").length,
			color: "bg-purple-100 text-purple-800",
		},
		{
			value: "loi",
			label: "LOI",
			count: deals.filter((d) => d.stage === "loi").length,
			color: "bg-orange-100 text-orange-800",
		},
		{
			value: "due_diligence",
			label: "Due Diligence",
			count: deals.filter((d) => d.stage === "due_diligence").length,
			color: "bg-yellow-100 text-yellow-800",
		},
		{
			value: "ready_to_close",
			label: "Ready to Close",
			count: deals.filter((d) => d.stage === "ready_to_close").length,
			color: "bg-green-100 text-green-800",
		},
	];

	function getStageConfig(stage: string) {
		return stages.find((s) => s.value === stage) || stages[0];
	}

	function formatCurrency(value: number): string {
		if (value >= 1000000) {
			return "$" + (value / 1000000).toFixed(1) + "M";
		}
		return "$" + value.toLocaleString();
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
	}

	const filteredDeals = $derived(
		activeStageFilter === "all" ? deals : deals.filter((d) => d.stage === activeStageFilter)
	);

	const selectedDeal = $derived(deals.find((d) => d.id === selectedDealId));
</script>

<svelte:head>
	<title>My Deals - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<FolderIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">My Deals</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<ToggleGroup.Root bind:value={viewMode} type="single">
				<ToggleGroup.Item value="cards" aria-label="Cards view">
					<LayoutGridIcon class="size-4" />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="list" aria-label="List view">
					<ListIcon class="size-4" />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="table" aria-label="Table view">
					<TableIcon class="size-4" />
				</ToggleGroup.Item>
			</ToggleGroup.Root>
			<Button size="sm">
				<PlusIcon class="mr-2 size-4" />
				Add Deal
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Stage Filters -->
	<div class="flex flex-wrap gap-2">
		{#each stages as stage}
			<Button
				variant={activeStageFilter === stage.value ? "default" : "outline"}
				size="sm"
				onclick={() => (activeStageFilter = stage.value)}
			>
				{stage.label}
				<Badge variant="secondary" class="ml-2">{stage.count}</Badge>
			</Button>
		{/each}
	</div>

	<!-- Cards View -->
	{#if viewMode === "cards"}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredDeals as deal}
				<Card.Root class="cursor-pointer transition-all hover:shadow-md" onclick={() => (selectedDealId = deal.id)}>
					<Card.Header>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<Card.Title class="text-lg">{deal.propertyName}</Card.Title>
								<div class="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
									<MapPinIcon class="size-3" />
									<span class="truncate">{deal.address}</span>
								</div>
							</div>
							<Badge class={getStageConfig(deal.stage).color}>
								{getStageConfig(deal.stage).label}
							</Badge>
						</div>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p class="text-muted-foreground">Units</p>
								<p class="font-semibold">{deal.units}</p>
							</div>
							<div>
								<p class="text-muted-foreground">Asking Price</p>
								<p class="font-semibold">{formatCurrency(deal.askingPrice)}</p>
							</div>
							<div>
								<p class="text-muted-foreground">Cap Rate</p>
								<p class="font-semibold">{deal.capRate}%</p>
							</div>
							<div>
								<p class="text-muted-foreground">Bloom Score</p>
								<div class="flex items-center gap-1">
									<span class="font-semibold text-amber-600">{deal.bloomScore}/64</span>
									<Badge variant="secondary" class="text-xs">{deal.grade}</Badge>
								</div>
							</div>
						</div>

						<div class="flex items-center justify-between text-xs text-muted-foreground">
							<div class="flex items-center gap-1">
								<CalendarIcon class="size-3" />
								<span>Added {formatDate(deal.addedDate)}</span>
							</div>
							<span>{deal.daysInStage}d in stage</span>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}

	<!-- List View -->
	{#if viewMode === "list"}
		<div class="space-y-2">
			{#each filteredDeals as deal}
				<Card.Root class="cursor-pointer transition-all hover:shadow-sm" onclick={() => (selectedDealId = deal.id)}>
					<Card.Content class="flex items-center gap-4 p-4">
						<div class="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
							<BuildingIcon class="size-6 text-primary" />
						</div>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h3 class="font-semibold">{deal.propertyName}</h3>
								<Badge class={getStageConfig(deal.stage).color}>
									{getStageConfig(deal.stage).label}
								</Badge>
								<Badge variant="secondary" class="text-xs">{deal.bloomScore}/64 • {deal.grade}</Badge>
							</div>
							<p class="text-sm text-muted-foreground">{deal.address}</p>
						</div>
						<div class="grid grid-cols-4 gap-6 text-sm">
							<div class="text-right">
								<p class="text-muted-foreground">Units</p>
								<p class="font-semibold">{deal.units}</p>
							</div>
							<div class="text-right">
								<p class="text-muted-foreground">Price</p>
								<p class="font-semibold">{formatCurrency(deal.askingPrice)}</p>
							</div>
							<div class="text-right">
								<p class="text-muted-foreground">Cap Rate</p>
								<p class="font-semibold">{deal.capRate}%</p>
							</div>
							<div class="text-right">
								<p class="text-muted-foreground">Days</p>
								<p class="font-semibold">{deal.daysInStage}d</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}

	<!-- Table View -->
	{#if viewMode === "table"}
		<Card.Root>
			<Card.Content class="p-0">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="border-b bg-muted/50">
							<tr>
								<th class="p-3 text-left text-sm font-medium">Property</th>
								<th class="p-3 text-left text-sm font-medium">Stage</th>
								<th class="p-3 text-right text-sm font-medium">Units</th>
								<th class="p-3 text-right text-sm font-medium">Price</th>
								<th class="p-3 text-right text-sm font-medium">$/Unit</th>
								<th class="p-3 text-right text-sm font-medium">Cap Rate</th>
								<th class="p-3 text-center text-sm font-medium">Bloom</th>
								<th class="p-3 text-right text-sm font-medium">Days</th>
								<th class="p-3 text-center text-sm font-medium">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y">
							{#each filteredDeals as deal}
								<tr class="cursor-pointer hover:bg-muted/50" onclick={() => (selectedDealId = deal.id)}>
									<td class="p-3">
										<div>
											<p class="font-medium">{deal.propertyName}</p>
											<p class="text-xs text-muted-foreground">{deal.address}</p>
										</div>
									</td>
									<td class="p-3">
										<Badge class={getStageConfig(deal.stage).color}>
											{getStageConfig(deal.stage).label}
										</Badge>
									</td>
									<td class="p-3 text-right">{deal.units}</td>
									<td class="p-3 text-right font-medium">{formatCurrency(deal.askingPrice)}</td>
									<td class="p-3 text-right">{formatCurrency(deal.pricePerUnit)}</td>
									<td class="p-3 text-right">{deal.capRate}%</td>
									<td class="p-3 text-center">
										<div class="flex items-center justify-center gap-1">
											<span class="font-semibold text-amber-600">{deal.bloomScore}/64</span>
											<Badge variant="secondary" class="text-xs">{deal.grade}</Badge>
										</div>
									</td>
									<td class="p-3 text-right">{deal.daysInStage}d</td>
									<td class="p-3 text-center">
										<Button variant="ghost" size="sm">View</Button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<!-- Deal Detail Sheet -->
<Sheet.Root open={selectedDealId !== null} onOpenChange={(open) => !open && (selectedDealId = null)}>
	<Sheet.Content side="right" class="w-full sm:max-w-2xl overflow-y-auto">
		{#if selectedDeal}
			<Sheet.Header>
				<Sheet.Title>{selectedDeal.propertyName}</Sheet.Title>
				<Sheet.Description>{selectedDeal.address}</Sheet.Description>
			</Sheet.Header>

			<div class="mt-6 space-y-6">
				<!-- Stage & Score -->
				<div class="flex items-center gap-4">
					<Badge class={getStageConfig(selectedDeal.stage).color}>
						{getStageConfig(selectedDeal.stage).label}
					</Badge>
					<div class="flex items-center gap-2">
						<span class="text-2xl font-bold text-amber-600">{selectedDeal.bloomScore}/64</span>
						<Badge variant="secondary">{selectedDeal.grade}</Badge>
					</div>
				</div>

				<Tabs.Root value="overview">
					<Tabs.List class="grid w-full grid-cols-3">
						<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
						<Tabs.Trigger value="analysis">Analysis</Tabs.Trigger>
						<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="overview" class="space-y-4">
						<!-- Key Metrics -->
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-base">Key Metrics</Card.Title>
							</Card.Header>
							<Card.Content class="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p class="text-muted-foreground">Units</p>
									<p class="font-semibold">{selectedDeal.units}</p>
								</div>
								<div>
									<p class="text-muted-foreground">Asking Price</p>
									<p class="font-semibold">{formatCurrency(selectedDeal.askingPrice)}</p>
								</div>
								<div>
									<p class="text-muted-foreground">Price per Unit</p>
									<p class="font-semibold">{formatCurrency(selectedDeal.pricePerUnit)}</p>
								</div>
								<div>
									<p class="text-muted-foreground">Cap Rate</p>
									<p class="font-semibold">{selectedDeal.capRate}%</p>
								</div>
							</Card.Content>
						</Card.Root>

						<!-- Timeline -->
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-base">Timeline</Card.Title>
							</Card.Header>
							<Card.Content class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Added</span>
									<span>{formatDate(selectedDeal.addedDate)}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Last Updated</span>
									<span>{formatDate(selectedDeal.updatedDate)}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Days in Stage</span>
									<Badge variant="secondary">{selectedDeal.daysInStage} days</Badge>
								</div>
							</Card.Content>
						</Card.Root>

						<!-- Notes -->
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-base">Notes</Card.Title>
							</Card.Header>
							<Card.Content>
								<p class="text-sm">{selectedDeal.notes}</p>
							</Card.Content>
						</Card.Root>
					</Tabs.Content>

					<Tabs.Content value="analysis" class="space-y-4">
						<!-- Bloom Score Analysis Placeholder -->
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-base">Bloom Score Analysis</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
									<div class="text-center">
										<FlowerIcon class="mx-auto size-12 text-amber-500" />
										<p class="mt-2 text-sm text-muted-foreground">8-Petal Bloom Chart</p>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					</Tabs.Content>

					<Tabs.Content value="activity" class="space-y-4">
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-base">Recent Activity</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="space-y-4">
									<div class="flex gap-3">
										<div class="flex size-8 items-center justify-center rounded-full bg-primary/10">
											<FileTextIcon class="size-4 text-primary" />
										</div>
										<div>
											<p class="text-sm font-medium">Stage changed to {getStageConfig(selectedDeal.stage).label}</p>
											<p class="text-xs text-muted-foreground">{formatDate(selectedDeal.updatedDate)}</p>
										</div>
									</div>
									<div class="flex gap-3">
										<div class="flex size-8 items-center justify-center rounded-full bg-primary/10">
											<FolderIcon class="size-4 text-primary" />
										</div>
										<div>
											<p class="text-sm font-medium">Deal added to pipeline</p>
											<p class="text-xs text-muted-foreground">{formatDate(selectedDeal.addedDate)}</p>
										</div>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					</Tabs.Content>
				</Tabs.Root>

				<!-- Actions -->
				<div class="flex gap-2">
					<Button variant="outline" class="flex-1">Edit Notes</Button>
					<Button variant="outline" class="flex-1">Change Stage</Button>
					<Button variant="outline" size="icon">
						<TrashIcon class="size-4" />
					</Button>
				</div>
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>
