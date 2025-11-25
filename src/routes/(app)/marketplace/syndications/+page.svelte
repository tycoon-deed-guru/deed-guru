<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Progress } from "$lib/components/ui/progress";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import UsersIcon from "@tabler/icons-svelte/icons/users";
	import DollarIcon from "@tabler/icons-svelte/icons/currency-dollar";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";
	import MailIcon from "@tabler/icons-svelte/icons/mail";
	import EditIcon from "@tabler/icons-svelte/icons/edit";
	import CheckCircleIcon from "@tabler/icons-svelte/icons/circle-check";
	import ClockIcon from "@tabler/icons-svelte/icons/clock";
	import RocketIcon from "@tabler/icons-svelte/icons/rocket";
	import PlusIcon from "@tabler/icons-svelte/icons/plus";

	// Mock GP syndication data
	const activeRaises = [
		{
			id: "1",
			propertyName: "Austin Tech Towers",
			status: "active",
			targetRaise: 12000000,
			currentRaise: 8400000,
			investorCount: 147,
			avgInvestment: 57143,
			daysRemaining: 27,

			// Activity metrics
			pageViews7d: 1243,
			detailViews7d: 87,
			newInvestments7d: 12,
			newCapital7d: 680000,
		},
		{
			id: "2",
			propertyName: "Nashville Heights",
			status: "coming_soon",
			targetRaise: 8500000,
			launchDate: "Dec 1, 2024",
		}
	];

	const operatingSyndications = [
		{
			id: "3",
			propertyName: "Phoenix Towers",
			closedDate: "Mar 2023",
			investorCount: 203,
			totalRaised: 15200000,
			currentIRR: 18.2,
			nextDistribution: {
				date: "Dec 30, 2024",
				amount: 127000
			}
		},
		{
			id: "4",
			propertyName: "Orlando Gardens",
			closedDate: "Jul 2023",
			investorCount: 84,
			totalRaised: 7000000,
			currentIRR: 16.5,
			nextDistribution: {
				date: "Dec 28, 2024",
				amount: 48500
			}
		}
	];

	function formatCurrency(value: number): string {
		if (value >= 1000000) {
			return "$" + (value / 1000000).toFixed(1) + "M";
		}
		return "$" + value.toLocaleString();
	}

	function getFundingPercent(current: number, target: number): number {
		return Math.round((current / target) * 100);
	}
</script>

<svelte:head>
	<title>My Syndications - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<TrendingUpIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">My Syndications</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button size="sm" href="/marketplace">
				<PlusIcon class="mr-2 size-4" />
				Create New Offering
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Welcome Section -->
	<div>
		<h2 class="text-3xl font-bold tracking-tight">GP Portal</h2>
		<p class="text-muted-foreground">Manage your syndication offerings and investor relations</p>
	</div>

	<!-- Summary Stats -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Raised</Card.Title>
				<DollarIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">$30.6M</div>
				<p class="text-xs text-muted-foreground">Across all syndications</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Investors</Card.Title>
				<UsersIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">434</div>
				<p class="text-xs text-muted-foreground">Unique LPs</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Raises</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">2</div>
				<p class="text-xs text-muted-foreground">In progress</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Portfolio IRR</Card.Title>
				<TrendingUpIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-green-600">17.4%</div>
				<p class="text-xs text-muted-foreground">Weighted average</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Active Raises -->
	<div>
		<h3 class="mb-4 text-lg font-semibold">Active Raises ({activeRaises.length})</h3>
		<div class="space-y-4">
			{#each activeRaises as raise}
				{#if raise.status === "active"}
					<Card.Root>
						<Card.Header>
							<div class="flex items-start justify-between">
								<div>
									<Card.Title>{raise.propertyName}</Card.Title>
									<div class="mt-2 flex items-center gap-2">
										<Badge class="bg-green-100 text-green-800">Active Offering</Badge>
										<Badge variant="secondary">
											<ClockIcon class="mr-1 size-3" />
											{raise.daysRemaining}d remaining
										</Badge>
									</div>
								</div>
							</div>
						</Card.Header>
						<Card.Content class="space-y-6">
							<!-- Capital Raise Section -->
							<div>
								<p class="mb-3 text-sm font-medium text-muted-foreground">CAPITAL RAISE</p>
								<div class="space-y-3">
									<div>
										<div class="mb-2 flex items-center justify-between">
											<span class="text-sm font-medium">Progress</span>
											<span class="text-sm text-muted-foreground">
												{getFundingPercent(raise.currentRaise, raise.targetRaise)}%
											</span>
										</div>
										<Progress
											value={getFundingPercent(raise.currentRaise, raise.targetRaise)}
											class="h-3"
										/>
									</div>
									<div class="grid grid-cols-4 gap-4 text-sm">
										<div>
											<p class="text-muted-foreground">Target</p>
											<p class="font-semibold">{formatCurrency(raise.targetRaise)}</p>
										</div>
										<div>
											<p class="text-muted-foreground">Raised</p>
											<p class="font-semibold">{formatCurrency(raise.currentRaise)}</p>
										</div>
										<div>
											<p class="text-muted-foreground">Investors</p>
											<p class="font-semibold">{raise.investorCount}</p>
										</div>
										<div>
											<p class="text-muted-foreground">Avg Investment</p>
											<p class="font-semibold">{formatCurrency(raise.avgInvestment)}</p>
										</div>
									</div>
								</div>
							</div>

							<Separator />

							<!-- Activity Section -->
							<div>
								<p class="mb-3 text-sm font-medium text-muted-foreground">INVESTOR ACTIVITY (LAST 7 DAYS)</p>
								<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
									<div class="rounded-lg border bg-muted/50 p-3">
										<div class="flex items-center gap-2">
											<EyeIcon class="size-4 text-muted-foreground" />
											<p class="text-xs text-muted-foreground">Page Views</p>
										</div>
										<p class="mt-1 text-2xl font-bold">{raise.pageViews7d.toLocaleString()}</p>
									</div>
									<div class="rounded-lg border bg-muted/50 p-3">
										<div class="flex items-center gap-2">
											<EyeIcon class="size-4 text-muted-foreground" />
											<p class="text-xs text-muted-foreground">Detail Views</p>
										</div>
										<p class="mt-1 text-2xl font-bold">{raise.detailViews7d}</p>
									</div>
									<div class="rounded-lg border bg-green-50 p-3">
										<div class="flex items-center gap-2">
											<UsersIcon class="size-4 text-green-600" />
											<p class="text-xs text-green-600">New Investments</p>
										</div>
										<p class="mt-1 text-2xl font-bold text-green-600">{raise.newInvestments7d}</p>
									</div>
									<div class="rounded-lg border bg-green-50 p-3">
										<div class="flex items-center gap-2">
											<DollarIcon class="size-4 text-green-600" />
											<p class="text-xs text-green-600">New Capital</p>
										</div>
										<p class="mt-1 text-2xl font-bold text-green-600">
											{formatCurrency(raise.newCapital7d)}
										</p>
									</div>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex gap-2">
								<Button variant="outline" size="sm">
									<UsersIcon class="mr-2 size-4" />
									View Investor Dashboard
								</Button>
								<Button variant="outline" size="sm">
									<MailIcon class="mr-2 size-4" />
									Send Update
								</Button>
								<Button variant="outline" size="sm">
									<EditIcon class="mr-2 size-4" />
									Edit Offering
								</Button>
								<Button variant="outline" size="sm">
									<CheckCircleIcon class="mr-2 size-4" />
									Close Early
								</Button>
							</div>
						</Card.Content>
					</Card.Root>
				{:else}
					<Card.Root class="border-dashed">
						<Card.Header>
							<div class="flex items-start justify-between">
								<div>
									<Card.Title>{raise.propertyName}</Card.Title>
									<div class="mt-2 flex items-center gap-2">
										<Badge variant="secondary">Coming Soon</Badge>
										<span class="text-sm text-muted-foreground">Launches {raise.launchDate}</span>
									</div>
								</div>
							</div>
						</Card.Header>
						<Card.Content>
							<div class="space-y-3">
								<div class="flex justify-between text-sm">
									<span class="text-muted-foreground">Target Raise</span>
									<span class="font-semibold">{formatCurrency(raise.targetRaise)}</span>
								</div>
								<div class="flex gap-2">
									<Button variant="outline" size="sm">
										<EditIcon class="mr-2 size-4" />
										Edit
									</Button>
									<Button variant="outline" size="sm">
										<EyeIcon class="mr-2 size-4" />
										Preview
									</Button>
									<Button size="sm">
										<RocketIcon class="mr-2 size-4" />
										Launch Now
									</Button>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Operating Syndications -->
	<div>
		<h3 class="mb-4 text-lg font-semibold">Operating Syndications ({operatingSyndications.length})</h3>
		<div class="grid gap-4 md:grid-cols-2">
			{#each operatingSyndications as syndication}
				<Card.Root>
					<Card.Header>
						<div class="flex items-start justify-between">
							<div>
								<Card.Title class="text-lg">{syndication.propertyName}</Card.Title>
								<Card.Description>Closed {syndication.closedDate}</Card.Description>
							</div>
							<Badge class="bg-blue-100 text-blue-800">Operating</Badge>
						</div>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="grid grid-cols-3 gap-4 text-sm">
							<div>
								<p class="text-muted-foreground">Investors</p>
								<p class="font-semibold">{syndication.investorCount}</p>
							</div>
							<div>
								<p class="text-muted-foreground">Total Raised</p>
								<p class="font-semibold">{formatCurrency(syndication.totalRaised)}</p>
							</div>
							<div>
								<p class="text-muted-foreground">Current IRR</p>
								<p class="font-semibold text-green-600">{syndication.currentIRR}%</p>
							</div>
						</div>

						<div class="rounded-lg border bg-muted/50 p-3">
							<div class="flex items-center gap-2 mb-2">
								<DollarIcon class="size-4 text-primary" />
								<p class="text-sm font-medium">Next Distribution</p>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">{syndication.nextDistribution.date}</span>
								<span class="font-semibold">
									{formatCurrency(syndication.nextDistribution.amount)}
								</span>
							</div>
						</div>

						<div class="flex gap-2">
							<Button variant="outline" size="sm" class="flex-1">
								<UsersIcon class="mr-2 size-4" />
								Investor Dashboard
							</Button>
							<Button variant="outline" size="sm" class="flex-1">
								<MailIcon class="mr-2 size-4" />
								Send Update
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>

	<!-- Create New CTA -->
	<Card.Root class="border-primary/50 bg-primary/5">
		<Card.Content class="flex items-center gap-4 p-6">
			<div class="flex size-12 items-center justify-center rounded-full bg-primary/20">
				<PlusIcon class="size-6 text-primary" />
			</div>
			<div class="flex-1">
				<h3 class="font-semibold">Ready to launch a new syndication?</h3>
				<p class="text-sm text-muted-foreground">
					Use our 6-step wizard to create a compliant offering in minutes
				</p>
			</div>
			<Button>
				<PlusIcon class="mr-2 size-4" />
				Create New Offering
			</Button>
		</Card.Content>
	</Card.Root>
</div>
