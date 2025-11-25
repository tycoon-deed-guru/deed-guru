<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import FolderIcon from "@tabler/icons-svelte/icons/folder";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import ArchiveIcon from "@tabler/icons-svelte/icons/archive";
</script>

<div class="flex h-full flex-1 flex-col gap-4 p-4">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Portfolio</h1>
			<p class="text-muted-foreground">Manage deals and properties</p>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">My Deals</Card.Title>
				<FolderIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">12</div>
				<p class="text-xs text-muted-foreground">Active pipeline</p>
				<Button href="/portfolio/deals" variant="link" class="mt-2 h-auto p-0">
					View all →
				</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Watching</Card.Title>
				<EyeIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">27</div>
				<p class="text-xs text-muted-foreground">Premium watchlist</p>
				<Button href="/portfolio/watching" variant="link" class="mt-2 h-auto p-0">
					View all →
				</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Owned Properties</Card.Title>
				<BuildingIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">5</div>
				<p class="text-xs text-muted-foreground">Live PMS data</p>
				<Button href="/portfolio/owned" variant="link" class="mt-2 h-auto p-0">
					View all →
				</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Archived</Card.Title>
				<ArchiveIcon class="size-4 text-muted-foreground" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">43</div>
				<p class="text-xs text-muted-foreground">Passed deals</p>
				<Button href="/portfolio/archived" variant="link" class="mt-2 h-auto p-0">
					View all →
				</Button>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Recent Activity</Card.Title>
				<Card.Description>Latest updates across your portfolio</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div class="flex items-start gap-4">
						<div class="rounded-full bg-primary/10 p-2">
							<EyeIcon class="size-4 text-primary" />
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium">Price drop alert</p>
							<p class="text-xs text-muted-foreground">Austin Tech Towers reduced by $2M</p>
							<p class="text-xs text-muted-foreground">2 hours ago</p>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="rounded-full bg-primary/10 p-2">
							<FolderIcon class="size-4 text-primary" />
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium">New deal added</p>
							<p class="text-xs text-muted-foreground">Orlando Gardens Apartments</p>
							<p class="text-xs text-muted-foreground">Yesterday</p>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Portfolio Performance</Card.Title>
				<Card.Description>Key metrics overview</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div>
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">Avg Occupancy</span>
							<span class="font-medium">94.2%</span>
						</div>
					</div>
					<div>
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">Portfolio NOI</span>
							<span class="font-medium">$12.3M</span>
						</div>
					</div>
					<div>
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">YTD Returns</span>
							<span class="font-medium text-green-600">+16.8%</span>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
