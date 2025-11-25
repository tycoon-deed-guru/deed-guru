<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { themeStore } from '$lib/stores/theme.svelte';
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={() => themeStore.toggleTheme()}
	aria-label="Toggle theme"
	class="relative transition-all hover:bg-[var(--surface-glass-hover)] hover:shadow-[var(--glow-gold)]"
>
	{#if themeStore.isLight}
		<!-- Moon icon for dark mode option -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="transition-transform hover:rotate-12"
		>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	{:else}
		<!-- Sun icon for light mode option -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="var(--accent-primary)"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="transition-transform hover:rotate-90"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</svg>
	{/if}
</Button>
