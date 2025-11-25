<script lang="ts">
	import { page } from "$app/stores";
	import ArchiveIcon from "@tabler/icons-svelte/icons/archive";
	import BrainIcon from "@tabler/icons-svelte/icons/brain";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";
	import DiamondIcon from "@tabler/icons-svelte/icons/diamond";
	import EyeIcon from "@tabler/icons-svelte/icons/eye";
	import FolderIcon from "@tabler/icons-svelte/icons/folder";
	import HomeIcon from "@tabler/icons-svelte/icons/home";
	import ListIcon from "@tabler/icons-svelte/icons/list";
	import MapIcon from "@tabler/icons-svelte/icons/map";
	import PaletteIcon from "@tabler/icons-svelte/icons/palette";
	import PlugIcon from "@tabler/icons-svelte/icons/plug";
	import RadarIcon from "@tabler/icons-svelte/icons/radar";
	import SearchIcon from "@tabler/icons-svelte/icons/search";
	import BookmarkIcon from "@tabler/icons-svelte/icons/bookmark";
	import ChartLineIcon from "@tabler/icons-svelte/icons/chart-line";
	import SettingsIcon from "@tabler/icons-svelte/icons/settings";
	import ShoppingCartIcon from "@tabler/icons-svelte/icons/shopping-cart";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import UsersIcon from "@tabler/icons-svelte/icons/users";
	import WalletIcon from "@tabler/icons-svelte/icons/wallet";
	import NavUser from "./nav-user.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";

	// Helper function to check if route is active
	function isRouteActive(url: string, pathname: string): boolean {
		if (url === pathname) return true;
		// For parent routes, check if current path starts with the route
		if (pathname.startsWith(url + '/')) return true;
		return false;
	}

	const data = {
		user: {
			name: "Arnold Alagar",
			email: "arnold@deed.guru",
			avatar: "/avatars/bot.png",
		},
		navMain: [
			{
				title: "Overview",
				url: "/dashboard",
				icon: HomeIcon,
			},
			{
				title: "Search",
				url: "/search",
				icon: SearchIcon,
				items: [
					{
						title: "Saved Searches",
						url: "/search/saved",
						icon: BookmarkIcon,
					},
					{
						title: "Markets",
						url: "/search/markets",
						icon: ChartLineIcon,
					},
				],
			},
			{
				title: "Workspace",
				url: "/workspace",
				icon: PaletteIcon,
			},
			{
				title: "Portfolio",
				url: "/portfolio",
				icon: FolderIcon,
				items: [
					{
						title: "My Deals",
						url: "/portfolio/deals",
						icon: FolderIcon,
					},
					{
						title: "Watching",
						url: "/portfolio/watching",
						icon: EyeIcon,
					},
					{
						title: "Owned Properties",
						url: "/portfolio/owned",
						icon: BuildingIcon,
					},
					{
						title: "Archived",
						url: "/portfolio/archived",
						icon: ArchiveIcon,
					},
				],
			},
			{
				title: "Marketplace",
				url: "/marketplace",
				icon: DiamondIcon,
				items: [
					{
						title: "My Investments",
						url: "/marketplace/investments",
						icon: WalletIcon,
					},
					{
						title: "My Syndications",
						url: "/marketplace/syndications",
						icon: TrendingUpIcon,
					},
				],
			},
		],
		navBottom: [
			{
				title: "Team",
				url: "/team",
				icon: UsersIcon,
			},
			{
				title: "Settings",
				url: "/settings",
				icon: SettingsIcon,
			},
		],
	};

	type Props = {
		variant?: "sidebar" | "floating" | "inset";
	};

	let { variant = "inset" }: Props = $props();
</script>

<Sidebar.Root collapsible="icon" {variant}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:p-1.5!">
					{#snippet child({ props })}
						<a href="/dashboard" {...props} class="flex items-center gap-2">
							<img
								src="/images/deedguru.navy.png"
								alt="deed.guru"
								class="size-8 dark:hidden"
							/>
							<img
								src="/images/deedguru.gold.png"
								alt="deed.guru"
								class="size- hidden dark:block"
							/>
							<span class="text-base font-semibold">deed.guru</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each data.navMain as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								tooltipContent={item.title}
								isActive={isRouteActive(item.url, $page.url.pathname)}
							>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
							{#if item.items && item.items.length > 0}
								<Sidebar.MenuSub>
									{#each item.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton
												href={subItem.url}
												isActive={isRouteActive(subItem.url, $page.url.pathname)}
											>
												<subItem.icon class="size-4" />
												<span>{subItem.title}</span>
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							{/if}
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<!-- Bottom Navigation -->
		<Sidebar.Group class="mt-auto">
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each data.navBottom as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								tooltipContent={item.title}
								isActive={isRouteActive(item.url, $page.url.pathname)}
							>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
