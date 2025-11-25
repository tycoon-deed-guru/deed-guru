<script lang="ts">
	import { getBloomStatus, type BloomStatusInfo } from '$lib/types/petal-chart.types';
	import { Badge } from '$lib/components/ui/badge';

	interface BloomStatusProps {
		score: number; // 0-64 bloom score
		showEmoji?: boolean;
		showLabel?: boolean;
		showPercentage?: boolean;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'outline' | 'ghost';
	}

	let {
		score,
		showEmoji = true,
		showLabel = true,
		showPercentage = false,
		size = 'md',
		variant = 'default'
	}: BloomStatusProps = $props();

	const bloomInfo: BloomStatusInfo = $derived(getBloomStatus(score));
	const percentage = $derived(Math.round((score / 64) * 100));

	const sizeClasses = {
		sm: 'text-xs px-2 py-0.5',
		md: 'text-sm px-3 py-1',
		lg: 'text-base px-4 py-1.5'
	};

	// Theme-aligned status colors using gold progression (no greens)
	const statusColors: Record<string, string> = {
		'fully-bloomed': 'bg-primary text-primary-foreground hover:bg-primary/90',
		'near-bloom': 'bg-primary text-primary-foreground hover:bg-primary/90',
		blooming: 'bg-[#d4c78a] text-[#1a1a1a] hover:bg-[#c8b87a]',
		'late-bloom': 'bg-[#a8a080] text-[#1a1a1a] hover:bg-[#9a9270]',
		budding: 'bg-muted-foreground text-white hover:bg-muted-foreground/90'
	};

	const outlineColors: Record<string, string> = {
		'fully-bloomed': 'border-primary text-primary',
		'near-bloom': 'border-primary text-primary',
		blooming: 'border-[#d4c78a] text-[#d4c78a]',
		'late-bloom': 'border-[#a8a080] text-[#a8a080]',
		budding: 'border-muted-foreground text-muted-foreground'
	};
</script>

{#if variant === 'default'}
	<Badge class="{sizeClasses[size]} {statusColors[bloomInfo.status]} font-semibold">
		{#if showEmoji}
			<span class="mr-1">{bloomInfo.emoji}</span>
		{/if}
		{#if showLabel}
			{bloomInfo.label}
		{/if}
		{#if showPercentage}
			<span class="ml-1 opacity-80">({percentage}%)</span>
		{/if}
	</Badge>
{:else if variant === 'outline'}
	<Badge
		variant="outline"
		class="{sizeClasses[size]} {outlineColors[bloomInfo.status]} font-semibold"
	>
		{#if showEmoji}
			<span class="mr-1">{bloomInfo.emoji}</span>
		{/if}
		{#if showLabel}
			{bloomInfo.label}
		{/if}
		{#if showPercentage}
			<span class="ml-1 opacity-80">({percentage}%)</span>
		{/if}
	</Badge>
{:else}
	<span
		class="{sizeClasses[size]} font-semibold inline-flex items-center"
		style="color: {bloomInfo.color}"
	>
		{#if showEmoji}
			<span class="mr-1">{bloomInfo.emoji}</span>
		{/if}
		{#if showLabel}
			{bloomInfo.label}
		{/if}
		{#if showPercentage}
			<span class="ml-1 opacity-80">({percentage}%)</span>
		{/if}
	</span>
{/if}
