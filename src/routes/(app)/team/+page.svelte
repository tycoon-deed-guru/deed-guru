<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import UsersIcon from "@tabler/icons-svelte/icons/users";
	import UserPlusIcon from "@tabler/icons-svelte/icons/user-plus";
	import MessageIcon from "@tabler/icons-svelte/icons/message";
	import BellIcon from "@tabler/icons-svelte/icons/bell";
	import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";
	import FolderIcon from "@tabler/icons-svelte/icons/folder";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";
	import ClockIcon from "@tabler/icons-svelte/icons/clock";
	import CheckCircleIcon from "@tabler/icons-svelte/icons/circle-check";
	import TrophyIcon from "@tabler/icons-svelte/icons/trophy";
	import GamepadIcon from "@tabler/icons-svelte/icons/device-gamepad";
	import ShareIcon from "@tabler/icons-svelte/icons/share";
	import StarIcon from "@tabler/icons-svelte/icons/star";
	import SettingsIcon from "@tabler/icons-svelte/icons/settings";

	let activeTab = $state("overview");
	let inviteDialogOpen = $state(false);
	let inviteEmail = $state("");

	// Mock team data
	const teamMembers = [
		{
			id: "1",
			name: "Arnold Alagar",
			email: "arnold@propertyradar.guru",
			role: "Owner",
			avatar: "/avatars/arnold.jpg",
			status: "online",
			dealsAnalyzed: 47,
			lastActive: "Active now",
			permissions: ["admin", "analyze", "invite", "export"],
		},
		{
			id: "2",
			name: "Sarah Chen",
			email: "sarah@propertyradar.guru",
			role: "Analyst",
			avatar: "/avatars/sarah.jpg",
			status: "online",
			dealsAnalyzed: 32,
			lastActive: "Active now",
			permissions: ["analyze", "comment", "export"],
		},
		{
			id: "3",
			name: "Mike Johnson",
			email: "mike@propertyradar.guru",
			role: "Associate",
			avatar: "/avatars/mike.jpg",
			status: "away",
			dealsAnalyzed: 18,
			lastActive: "2 hours ago",
			permissions: ["analyze", "comment"],
		},
		{
			id: "4",
			name: "Jessica Park",
			email: "jessica@propertyradar.guru",
			role: "Analyst",
			avatar: "/avatars/jessica.jpg",
			status: "offline",
			dealsAnalyzed: 28,
			lastActive: "Yesterday",
			permissions: ["analyze", "comment", "export"],
		},
	];

	// Team activity feed
	const activities = [
		{
			id: "1",
			user: "Sarah Chen",
			action: "analyzed",
			target: "Austin Tech Towers",
			score: 93,
			time: "5 minutes ago",
			type: "analysis",
		},
		{
			id: "2",
			user: "Mike Johnson",
			action: "commented on",
			target: "Orlando Gardens",
			comment: "Cap rate seems aggressive given the market",
			time: "15 minutes ago",
			type: "comment",
		},
		{
			id: "3",
			user: "Arnold Alagar",
			action: "added to portfolio",
			target: "Phoenix Heights",
			time: "1 hour ago",
			type: "portfolio",
		},
		{
			id: "4",
			user: "Jessica Park",
			action: "completed workspace",
			target: "Dallas Market Analysis",
			time: "2 hours ago",
			type: "workspace",
		},
		{
			id: "5",
			user: "Sarah Chen",
			action: "shared",
			target: "deed.guru Report - Austin Tech Towers",
			time: "3 hours ago",
			type: "share",
		},
	];

	// Shared workspaces
	const sharedWorkspaces = [
		{
			id: "1",
			name: "Austin Tech Towers - Full Analysis",
			property: "Austin Tech Towers",
			owner: "Sarah Chen",
			collaborators: ["Arnold Alagar", "Mike Johnson"],
			lastUpdated: "10 minutes ago",
			comments: 8,
			status: "active",
		},
		{
			id: "2",
			name: "Sunbelt Market Comparison",
			property: "Multiple Properties",
			owner: "Arnold Alagar",
			collaborators: ["Sarah Chen", "Jessica Park"],
			lastUpdated: "2 hours ago",
			comments: 15,
			status: "active",
		},
		{
			id: "3",
			name: "Q4 Pipeline Review",
			property: "Portfolio Analysis",
			owner: "Jessica Park",
			collaborators: ["Arnold Alagar", "Sarah Chen", "Mike Johnson"],
			lastUpdated: "Yesterday",
			comments: 23,
			status: "completed",
		},
	];

	// Game mode / competitions
	const competitions = [
		{
			id: "1",
			name: "Q4 2024 Tycoon Challenge",
			type: "Competition",
			startDate: "Nov 1, 2024",
			endDate: "Dec 31, 2024",
			participants: 4,
			status: "active",
			leader: "Sarah Chen",
			leaderScore: "$147M Portfolio Value",
		},
		{
			id: "2",
			name: "Recession Survival Scenario",
			type: "Training",
			startDate: "Nov 15, 2024",
			endDate: "Nov 30, 2024",
			participants: 3,
			status: "active",
			leader: "Arnold Alagar",
			leaderScore: "18.2% IRR Avg",
		},
	];

	// Team leaderboard
	const leaderboard = [
		{ rank: 1, name: "Sarah Chen", score: 147, metric: "Portfolio Value ($M)", avatar: "/avatars/sarah.jpg" },
		{ rank: 2, name: "Arnold Alagar", score: 132, metric: "Portfolio Value ($M)", avatar: "/avatars/arnold.jpg" },
		{ rank: 3, name: "Jessica Park", score: 118, metric: "Portfolio Value ($M)", avatar: "/avatars/jessica.jpg" },
		{ rank: 4, name: "Mike Johnson", score: 94, metric: "Portfolio Value ($M)", avatar: "/avatars/mike.jpg" },
	];

	function getStatusColor(status: string) {
		switch (status) {
			case "online": return "bg-green-500";
			case "away": return "bg-yellow-500";
			case "offline": return "bg-gray-400";
			default: return "bg-gray-400";
		}
	}

	function getRoleBadgeColor(role: string) {
		switch (role) {
			case "Owner": return "bg-purple-100 text-purple-800";
			case "Analyst": return "bg-blue-100 text-blue-800";
			case "Associate": return "bg-green-100 text-green-800";
			default: return "bg-gray-100 text-gray-800";
		}
	}

	function handleInvite() {
		console.log("Inviting:", inviteEmail);
		inviteEmail = "";
		inviteDialogOpen = false;
	}
</script>

<svelte:head>
	<title>Team - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<UsersIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Team</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="outline" size="sm">
				<BellIcon class="mr-2 size-4" />
				Notifications
			</Button>
			<Button size="sm" onclick={() => (inviteDialogOpen = true)}>
				<UserPlusIcon class="mr-2 size-4" />
				Invite Member
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Page Header -->
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Team Collaboration</h2>
		<p class="text-muted-foreground">Work together, share insights, and compete</p>
	</div>

	<!-- Tabs -->
	<Tabs.Root bind:value={activeTab} class="flex-1">
		<Tabs.List class="grid w-full max-w-2xl grid-cols-4">
			<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
			<Tabs.Trigger value="members">Members</Tabs.Trigger>
			<Tabs.Trigger value="workspaces">Workspaces</Tabs.Trigger>
			<Tabs.Trigger value="compete">Compete</Tabs.Trigger>
		</Tabs.List>

		<!-- OVERVIEW TAB -->
		<Tabs.Content value="overview" class="mt-6 space-y-6">
			<!-- Team Stats -->
			<div class="grid gap-4 md:grid-cols-4">
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Team Members</Card.Title>
						<UsersIcon class="size-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{teamMembers.length}</div>
						<p class="text-xs text-green-600">2 active now</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Deals Analyzed</Card.Title>
						<ChartBarIcon class="size-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{teamMembers.reduce((sum, m) => sum + m.dealsAnalyzed, 0)}</div>
						<p class="text-xs text-muted-foreground">This month</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Shared Workspaces</Card.Title>
						<FolderIcon class="size-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{sharedWorkspaces.length}</div>
						<p class="text-xs text-muted-foreground">{sharedWorkspaces.filter(w => w.status === "active").length} active</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">Competitions</Card.Title>
						<TrophyIcon class="size-4 text-muted-foreground" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">{competitions.filter(c => c.status === "active").length}</div>
						<p class="text-xs text-muted-foreground">Active challenges</p>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Activity Feed & Online Members -->
			<div class="grid gap-4 md:grid-cols-3">
				<!-- Activity Feed -->
				<Card.Root class="md:col-span-2">
					<Card.Header>
						<Card.Title>Recent Activity</Card.Title>
						<Card.Description>What your team has been working on</Card.Description>
					</Card.Header>
					<Card.Content>
						<ScrollArea class="h-[400px] pr-4">
							<div class="space-y-4">
								{#each activities as activity}
									<div class="flex items-start gap-4">
										<Avatar.Root class="size-8">
											<Avatar.Fallback>{activity.user.slice(0, 2)}</Avatar.Fallback>
										</Avatar.Root>
										<div class="flex-1 space-y-1">
											<p class="text-sm">
												<span class="font-medium">{activity.user}</span>
												<span class="text-muted-foreground"> {activity.action} </span>
												<span class="font-medium">{activity.target}</span>
												{#if activity.score}
													<Badge variant="secondary" class="ml-2">Score: {activity.score}</Badge>
												{/if}
											</p>
											{#if activity.comment}
												<p class="text-xs text-muted-foreground italic">" {activity.comment}"</p>
											{/if}
											<p class="text-xs text-muted-foreground">
												<ClockIcon class="mr-1 inline size-3" />
												{activity.time}
											</p>
										</div>
									</div>
								{/each}
							</div>
						</ScrollArea>
					</Card.Content>
				</Card.Root>

				<!-- Online Members -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Team Status</Card.Title>
						<Card.Description>Who's online</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							{#each teamMembers as member}
								<div class="flex items-center gap-3">
									<div class="relative">
										<Avatar.Root class="size-10">
											<Avatar.Fallback>{member.name.slice(0, 2)}</Avatar.Fallback>
										</Avatar.Root>
										<div class="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background {getStatusColor(member.status)}"></div>
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-sm font-medium truncate">{member.name}</p>
										<p class="text-xs text-muted-foreground">{member.lastActive}</p>
									</div>
									<Button variant="ghost" size="sm" class="h-8 px-2">
										<MessageIcon class="size-4" />
									</Button>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</Tabs.Content>

		<!-- MEMBERS TAB -->
		<Tabs.Content value="members" class="mt-6 space-y-6">
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each teamMembers as member}
					<Card.Root>
						<Card.Header>
							<div class="flex items-start justify-between">
								<div class="flex items-center gap-3">
									<div class="relative">
										<Avatar.Root class="size-12">
											<Avatar.Fallback class="text-lg">{member.name.slice(0, 2)}</Avatar.Fallback>
										</Avatar.Root>
										<div class="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background {getStatusColor(member.status)}"></div>
									</div>
									<div>
										<h3 class="font-semibold">{member.name}</h3>
										<p class="text-xs text-muted-foreground">{member.email}</p>
									</div>
								</div>
							</div>
						</Card.Header>
						<Card.Content class="space-y-3">
							<div class="flex items-center justify-between">
								<Badge class="{getRoleBadgeColor(member.role)}">{member.role}</Badge>
								<span class="text-xs text-muted-foreground">{member.lastActive}</span>
							</div>

							<Separator />

							<div class="space-y-2">
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Deals Analyzed</span>
									<span class="font-semibold">{member.dealsAnalyzed}</span>
								</div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-muted-foreground">Permissions</span>
									<span class="font-semibold">{member.permissions.length}</span>
								</div>
							</div>

							<div class="flex gap-2 pt-2">
								<Button variant="outline" size="sm" class="flex-1">
									<MessageIcon class="mr-2 size-4" />
									Message
								</Button>
								<Button variant="ghost" size="sm">
									<SettingsIcon class="size-4" />
								</Button>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</Tabs.Content>

		<!-- WORKSPACES TAB -->
		<Tabs.Content value="workspaces" class="mt-6 space-y-6">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Shared Workspaces</h3>
					<p class="text-sm text-muted-foreground">Collaborate on property analysis</p>
				</div>
				<Button>
					<ShareIcon class="mr-2 size-4" />
					New Shared Workspace
				</Button>
			</div>

			<div class="space-y-3">
				{#each sharedWorkspaces as workspace}
					<Card.Root class="transition-all hover:shadow-md">
						<Card.Content class="p-6">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<h3 class="text-lg font-semibold">{workspace.name}</h3>
										<Badge variant={workspace.status === "active" ? "default" : "secondary"}>
											{workspace.status}
										</Badge>
									</div>
									<p class="mt-1 text-sm text-muted-foreground">{workspace.property}</p>

									<div class="mt-4 flex items-center gap-6 text-sm">
										<div class="flex items-center gap-2">
											<Avatar.Root class="size-6">
												<Avatar.Fallback class="text-xs">{workspace.owner.slice(0, 2)}</Avatar.Fallback>
											</Avatar.Root>
											<span class="text-muted-foreground">Owner: {workspace.owner}</span>
										</div>
										<div class="flex items-center gap-1">
											<UsersIcon class="size-4 text-muted-foreground" />
											<span class="text-muted-foreground">{workspace.collaborators.length} collaborators</span>
										</div>
										<div class="flex items-center gap-1">
											<MessageIcon class="size-4 text-muted-foreground" />
											<span class="text-muted-foreground">{workspace.comments} comments</span>
										</div>
									</div>

									<div class="mt-3 flex -space-x-2">
										{#each workspace.collaborators.slice(0, 3) as collaborator}
											<Avatar.Root class="size-8 border-2 border-background">
												<Avatar.Fallback class="text-xs">{collaborator.slice(0, 2)}</Avatar.Fallback>
											</Avatar.Root>
										{/each}
										{#if workspace.collaborators.length > 3}
											<div class="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
												+{workspace.collaborators.length - 3}
											</div>
										{/if}
									</div>
								</div>

								<div class="flex flex-col gap-2">
									<Button size="sm">
										<EyeIcon class="mr-2 size-4" />
										Open
									</Button>
									<Button variant="outline" size="sm">
										<MessageIcon class="mr-2 size-4" />
										Comments
									</Button>
								</div>
							</div>

							<div class="mt-4 border-t pt-3">
								<p class="text-xs text-muted-foreground">
									<ClockIcon class="mr-1 inline size-3" />
									Last updated {workspace.lastUpdated}
								</p>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</Tabs.Content>

		<!-- COMPETE TAB -->
		<Tabs.Content value="compete" class="mt-6 space-y-6">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">Team Competitions</h3>
					<p class="text-sm text-muted-foreground">Practice, compete, and improve your skills</p>
				</div>
				<Button>
					<GamepadIcon class="mr-2 size-4" />
					New Competition
				</Button>
			</div>

			<!-- Active Competitions -->
			<div class="grid gap-4 md:grid-cols-2">
				{#each competitions as competition}
					<Card.Root class="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
						<Card.Header>
							<div class="flex items-start justify-between">
								<div>
									<Card.Title class="flex items-center gap-2">
										<TrophyIcon class="size-5 text-primary" />
										{competition.name}
									</Card.Title>
									<Card.Description class="mt-1">{competition.type}</Card.Description>
								</div>
								<Badge class="bg-green-100 text-green-800">{competition.status}</Badge>
							</div>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Duration</span>
								<span class="font-medium">{competition.startDate} - {competition.endDate}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Participants</span>
								<span class="font-medium">{competition.participants} members</span>
							</div>

							<Separator />

							<div class="rounded-lg border bg-background p-3">
								<div class="flex items-center gap-2">
									<StarIcon class="size-5 text-yellow-500" />
									<div>
										<p class="text-sm font-medium">Current Leader</p>
										<p class="text-xs text-muted-foreground">{competition.leader}</p>
									</div>
								</div>
								<p class="mt-2 text-lg font-bold text-primary">{competition.leaderScore}</p>
							</div>

							<div class="flex gap-2">
								<Button class="flex-1">
									<EyeIcon class="mr-2 size-4" />
									View Leaderboard
								</Button>
								<Button variant="outline">
									<SettingsIcon class="size-4" />
								</Button>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			<!-- Leaderboard -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Current Leaderboard - Q4 Tycoon Challenge</Card.Title>
					<Card.Description>Portfolio value rankings</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-3">
						{#each leaderboard as entry}
							<div class="flex items-center gap-4 rounded-lg border p-4 {entry.rank === 1 ? 'border-yellow-500 bg-yellow-50' : ''}">
								<div class="flex size-10 items-center justify-center rounded-full {entry.rank === 1 ? 'bg-yellow-500 text-white' : entry.rank === 2 ? 'bg-gray-400 text-white' : entry.rank === 3 ? 'bg-amber-700 text-white' : 'bg-muted'} font-bold">
									{entry.rank}
								</div>
								<Avatar.Root class="size-10">
									<Avatar.Fallback>{entry.name.slice(0, 2)}</Avatar.Fallback>
								</Avatar.Root>
								<div class="flex-1">
									<p class="font-semibold">{entry.name}</p>
									<p class="text-xs text-muted-foreground">{entry.metric}</p>
								</div>
								<div class="text-right">
									<p class="text-2xl font-bold text-primary">${entry.score}M</p>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>

<!-- Invite Member Dialog -->
<Dialog.Root bind:open={inviteDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Invite Team Member</Dialog.Title>
			<Dialog.Description>Send an invitation to join your team</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<div>
				<Label for="email">Email Address</Label>
				<Input
					id="email"
					type="email"
					bind:value={inviteEmail}
					placeholder="colleague@company.com"
					class="mt-2"
				/>
			</div>
			<div>
				<Label for="role">Role</Label>
				<select id="role" class="mt-2 w-full rounded-md border px-3 py-2">
					<option value="analyst">Analyst</option>
					<option value="associate">Associate</option>
					<option value="admin">Admin</option>
				</select>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (inviteDialogOpen = false)}>Cancel</Button>
			<Button onclick={handleInvite}>Send Invitation</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
