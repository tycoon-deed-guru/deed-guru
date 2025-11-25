<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as Select from "$lib/components/ui/select";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import ArchiveIcon from "@tabler/icons-svelte/icons/archive";
	import FilterIcon from "@tabler/icons-svelte/icons/filter";
	import SearchIcon from "@tabler/icons-svelte/icons/search";
	import MapPinIcon from "@tabler/icons-svelte/icons/map-pin";
	import CalendarIcon from "@tabler/icons-svelte/icons/calendar";
	import DollarIcon from "@tabler/icons-svelte/icons/currency-dollar";
	import XIcon from "@tabler/icons-svelte/icons/x";
	import CheckIcon from "@tabler/icons-svelte/icons/check";
	import BrainIcon from "@tabler/icons-svelte/icons/brain";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import AlertTriangleIcon from "@tabler/icons-svelte/icons/alert-triangle";
	import FileTextIcon from "@tabler/icons-svelte/icons/file-text";

	// Archive reasons
	const archiveReasons = [
		{ value: "all", label: "All Reasons" },
		{ value: "pricing", label: "Pricing Too High" },
		{ value: "condition", label: "Property Condition" },
		{ value: "market", label: "Market Concerns" },
		{ value: "location", label: "Location Issues" },
		{ value: "competition", label: "Lost to Competition" },
		{ value: "financing", label: "Financing Fell Through" },
		{ value: "timing", label: "Bad Timing" },
		{ value: "other", label: "Other" },
	];

	// State
	let selectedReason = $state("all");
	let selectedDealId = $state<string | null>(null);
	let archiveDialogOpen = $state(false);

	// Mock archived deals
	const archivedDeals = [
		{
			id: "1",
			propertyName: "Riverside Towers",
			address: "456 River Rd, Portland, OR 97201",
			units: 298,
			askingPrice: 44000000,
			archivedDate: "2024-11-10",
			archivedReason: "pricing",
			reasonDetail: "Seller unwilling to negotiate below $44M. Comps suggest $40M is fair value.",
			stage: "loi",
			daysInPipeline: 28,
			score: 85,
			lessons: "Wait for price adjustment or seller motivation to increase.",
		},
		{
			id: "2",
			propertyName: "Downtown Lofts",
			address: "789 Main St, Denver, CO 80202",
			units: 156,
			askingPrice: 28500000,
			archivedDate: "2024-11-05",
			archivedReason: "competition",
			reasonDetail: "Lost to cash buyer. They offered $29M with 21-day close.",
			stage: "due_diligence",
			daysInPipeline: 42,
			score: 88,
			lessons: "Need stronger relationships with brokers for off-market deals.",
		},
		{
			id: "3",
			propertyName: "Sunset Gardens",
			address: "321 Sunset Blvd, Phoenix, AZ 85001",
			units: 224,
			askingPrice: 31000000,
			archivedDate: "2024-10-28",
			archivedReason: "condition",
			reasonDetail: "Deferred maintenance estimated at $4.2M. ROI doesn't work.",
			stage: "underwriting",
			daysInPipeline: 18,
			score: 72,
			lessons: "Request detailed capex schedule earlier in diligence.",
		},
		{
			id: "4",
			propertyName: "Metro Heights",
			address: "123 Metro Ave, Seattle, WA 98101",
			units: 342,
			askingPrice: 52000000,
			archivedDate: "2024-10-22",
			archivedReason: "market",
			reasonDetail: "Seattle market showing early signs of softening. High exposure to tech employment.",
			stage: "analyzing",
			daysInPipeline: 12,
			score: 81,
			lessons: "Monitor tech sector layoffs and employment data before entering Seattle.",
		},
		{
			id: "5",
			propertyName: "Lakeside Commons",
			address: "555 Lake Dr, Austin, TX 78701",
			units: 188,
			askingPrice: 29000000,
			archivedDate: "2024-10-15",
			archivedReason: "financing",
			reasonDetail: "Lender pulled back due to LTV concerns. Needed 35% down vs budgeted 25%.",
			stage: "ready_to_close",
			daysInPipeline: 67,
			score: 90,
			lessons: "Secure financing pre-approval before going hard on deposits.",
		},
	];

	function formatCurrency(value: number): string {
		if (value >= 1000000) {
			return "$" + (value / 1000000).toFixed(1) + "M";
		}
		return "$" + value.toLocaleString();
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	function getReasonBadgeColor(reason: string): string {
		const colors: Record<string, string> = {
			pricing: "bg-orange-100 text-orange-800",
			condition: "bg-red-100 text-red-800",
			market: "bg-purple-100 text-purple-800",
			location: "bg-blue-100 text-blue-800",
			competition: "bg-yellow-100 text-yellow-800",
			financing: "bg-pink-100 text-pink-800",
			timing: "bg-gray-100 text-gray-800",
			other: "bg-gray-100 text-gray-800",
		};
		return colors[reason] || "bg-gray-100 text-gray-800";
	}

	function getReasonLabel(reason: string): string {
		const found = archiveReasons.find((r) => r.value === reason);
		return found ? found.label : reason;
	}

	const filteredDeals = $derived(
		selectedReason === "all"
			? archivedDeals
			: archivedDeals.filter((d) => d.archivedReason === selectedReason)
	);

	const selectedDeal = $derived(archivedDeals.find((d) => d.id === selectedDealId));

	// Analytics
	const reasonBreakdown = $derived(
		archiveReasons.slice(1).map((reason) => ({
			...reason,
			count: archivedDeals.filter((d) => d.archivedReason === reason.value).length,
		}))
	);

	const avgDaysInPipeline = $derived(
		Math.round(
			archivedDeals.reduce((sum, d) => sum + d.daysInPipeline, 0) / archivedDeals.length
		)
	);

	const mostCommonReason = $derived(
		reasonBreakdown.sort((a, b) => b.count - a.count)[0]
	);
</script>

<svelte:head>
	<title>Archived Deals - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<ArchiveIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Archived Deals</h1>
			<Badge variant="secondary">{archivedDeals.length}</Badge>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Select.Root>
				<Select.Trigger class="w-[200px]">
					<FilterIcon class="mr-2 size-4" />
					{getReasonLabel(selectedReason)}
				</Select.Trigger>
				<Select.Content>
					{#each archiveReasons as reason}
						<Select.Item value={reason.value} onclick={() => (selectedReason = reason.value)}>
							{reason.label}
							{#if reason.value !== "all"}
								<Badge variant="secondary" class="ml-2">
									{archivedDeals.filter((d) => d.archivedReason === reason.value).length}
								</Badge>
							{/if}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Analytics Section -->
	<div class="grid gap-4 md:grid-cols-3">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Archived</Card.Title>
				<ArchiveIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{archivedDeals.length}</div>
				<p class="text-xs text-muted-foreground">Passed opportunities</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Avg Days in Pipeline</Card.Title>
				<CalendarIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{avgDaysInPipeline}d</div>
				<p class="text-xs text-muted-foreground">Before archiving</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Top Reason</Card.Title>
				<AlertTriangleIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{mostCommonReason.count}</div>
				<p class="text-xs text-muted-foreground">{mostCommonReason.label}</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Learning Insights -->
	<Card.Root class="border-primary/50 bg-primary/5">
		<Card.Header>
			<div class="flex items-center gap-2">
				<BrainIcon class="size-5 text-primary" />
				<Card.Title>Key Learnings</Card.Title>
			</div>
			<Card.Description>Insights from archived deals to improve future success</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="space-y-3">
				<div class="flex items-start gap-3 rounded-lg border bg-background p-3">
					<CheckIcon class="size-5 text-green-600" />
					<div>
						<p class="font-medium">Pre-qualify financing earlier</p>
						<p class="text-sm text-muted-foreground">
							2 deals failed at late stages due to financing. Get lender commitment before LOI.
						</p>
					</div>
				</div>
				<div class="flex items-start gap-3 rounded-lg border bg-background p-3">
					<CheckIcon class="size-5 text-green-600" />
					<div>
						<p class="font-medium">Deeper due diligence on condition</p>
						<p class="text-sm text-muted-foreground">
							Property inspections earlier in process saved 18 days on deals that wouldn't work.
						</p>
					</div>
				</div>
				<div class="flex items-start gap-3 rounded-lg border bg-background p-3">
					<TrendingUpIcon class="size-5 text-blue-600" />
					<div>
						<p class="font-medium">Competitive pressure in top markets</p>
						<p class="text-sm text-muted-foreground">
							Build stronger broker relationships and consider off-market sourcing strategies.
						</p>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Reason Breakdown -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Archive Reasons</Card.Title>
			<Card.Description>Distribution of why deals were passed</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="space-y-3">
				{#each reasonBreakdown.filter((r) => r.count > 0) as reason}
					<div class="flex items-center gap-3">
						<div class="w-32">
							<Badge class={getReasonBadgeColor(reason.value)}>{reason.label}</Badge>
						</div>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<div class="h-2 flex-1 rounded-full bg-muted">
									<div
										class="h-full rounded-full bg-primary"
										style="width: {(reason.count / archivedDeals.length) * 100}%"
									></div>
								</div>
								<span class="w-12 text-right text-sm font-medium">{reason.count}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Archived Deals List -->
	<div class="space-y-3">
		<h3 class="text-lg font-semibold">
			Archived Deals ({filteredDeals.length})
		</h3>
		{#each filteredDeals as deal}
			<Card.Root class="cursor-pointer transition-all hover:shadow-sm" onclick={() => (selectedDealId = deal.id)}>
				<Card.Content class="flex items-center gap-4 p-4">
					<div class="flex size-12 items-center justify-center rounded-lg bg-muted">
						<ArchiveIcon class="size-6 text-muted-foreground" />
					</div>
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<h3 class="font-semibold">{deal.propertyName}</h3>
							<Badge class={getReasonBadgeColor(deal.archivedReason)}>
								{getReasonLabel(deal.archivedReason)}
							</Badge>
							<Badge variant="secondary" class="text-xs">{deal.score}</Badge>
						</div>
						<p class="text-sm text-muted-foreground">{deal.address}</p>
					</div>
					<div class="grid grid-cols-3 gap-6 text-sm">
						<div class="text-right">
							<p class="text-muted-foreground">Price</p>
							<p class="font-semibold">{formatCurrency(deal.askingPrice)}</p>
						</div>
						<div class="text-right">
							<p class="text-muted-foreground">Days Active</p>
							<p class="font-semibold">{deal.daysInPipeline}d</p>
						</div>
						<div class="text-right">
							<p class="text-muted-foreground">Archived</p>
							<p class="font-semibold">{formatDate(deal.archivedDate)}</p>
						</div>
					</div>
					<Button variant="ghost" size="sm">View</Button>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>

<!-- Deal Detail Dialog -->
<Dialog.Root open={selectedDealId !== null} onOpenChange={(open) => !open && (selectedDealId = null)}>
	<Dialog.Content class="max-w-2xl">
		{#if selectedDeal}
			<Dialog.Header>
				<Dialog.Title>{selectedDeal.propertyName}</Dialog.Title>
				<Dialog.Description>{selectedDeal.address}</Dialog.Description>
			</Dialog.Header>

			<div class="space-y-6 py-4">
				<!-- Archive Info -->
				<div class="flex items-center justify-between rounded-lg border p-4">
					<div>
						<Badge class={getReasonBadgeColor(selectedDeal.archivedReason)}>
							{getReasonLabel(selectedDeal.archivedReason)}
						</Badge>
						<p class="mt-2 text-sm text-muted-foreground">
							Archived {formatDate(selectedDeal.archivedDate)} after {selectedDeal.daysInPipeline} days
						</p>
					</div>
					<Badge variant="secondary" class="text-lg">
						{selectedDeal.score}
					</Badge>
				</div>

				<!-- Key Details -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-base">Property Details</Card.Title>
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
							<p class="text-muted-foreground">Stage Reached</p>
							<p class="font-semibold capitalize">{selectedDeal.stage.replace("_", " ")}</p>
						</div>
						<div>
							<p class="text-muted-foreground">Days in Pipeline</p>
							<p class="font-semibold">{selectedDeal.daysInPipeline} days</p>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Reason Detail -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-base">Why We Passed</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">{selectedDeal.reasonDetail}</p>
					</Card.Content>
				</Card.Root>

				<!-- Lessons Learned -->
				<Card.Root class="border-primary/50 bg-primary/5">
					<Card.Header>
						<div class="flex items-center gap-2">
							<BrainIcon class="size-4 text-primary" />
							<Card.Title class="text-base">Lesson Learned</Card.Title>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">{selectedDeal.lessons}</p>
					</Card.Content>
				</Card.Root>
			</div>

			<Dialog.Footer>
				<Button variant="outline" onclick={() => (selectedDealId = null)}>Close</Button>
				<Button variant="outline">
					<FileTextIcon class="mr-2 size-4" />
					Export Report
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
