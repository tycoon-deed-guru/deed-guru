<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	interface Market {
		id: string;
		name: string;
		state: string;
		lat: number;
		lng: number;
		bloomScore: number; // 8-petal market Bloom Score (max 64)
		trend: 'up' | 'down' | 'stable';
		rentGrowth: number;
		inventory: number;
	}

	// Default 15 sunbelt markets with coordinates - must be defined before props
	// Bloom scores converted: 8-petal system (max 64), roughly score * 0.64
	const DEFAULT_MARKETS: Market[] = [
		{ id: 'austin', name: 'Austin', state: 'TX', lat: 30.27, lng: -97.74, bloomScore: 58, trend: 'up', rentGrowth: 4.2, inventory: 142000 },
		{ id: 'dallas', name: 'Dallas', state: 'TX', lat: 32.78, lng: -96.80, bloomScore: 52, trend: 'stable', rentGrowth: 3.2, inventory: 285000 },
		{ id: 'houston', name: 'Houston', state: 'TX', lat: 29.76, lng: -95.37, bloomScore: 50, trend: 'stable', rentGrowth: 2.9, inventory: 320000 },
		{ id: 'san-antonio', name: 'San Antonio', state: 'TX', lat: 29.42, lng: -98.49, bloomScore: 48, trend: 'up', rentGrowth: 3.5, inventory: 145000 },
		{ id: 'phoenix', name: 'Phoenix', state: 'AZ', lat: 33.45, lng: -112.07, bloomScore: 55, trend: 'up', rentGrowth: 3.8, inventory: 198000 },
		{ id: 'tucson', name: 'Tucson', state: 'AZ', lat: 32.22, lng: -110.93, bloomScore: 46, trend: 'up', rentGrowth: 3.2, inventory: 58000 },
		{ id: 'orlando', name: 'Orlando', state: 'FL', lat: 28.54, lng: -81.38, bloomScore: 53, trend: 'up', rentGrowth: 5.1, inventory: 156000 },
		{ id: 'tampa', name: 'Tampa', state: 'FL', lat: 27.95, lng: -82.46, bloomScore: 54, trend: 'up', rentGrowth: 4.8, inventory: 132000 },
		{ id: 'miami', name: 'Miami', state: 'FL', lat: 25.76, lng: -80.19, bloomScore: 51, trend: 'stable', rentGrowth: 3.9, inventory: 215000 },
		{ id: 'jacksonville', name: 'Jacksonville', state: 'FL', lat: 30.33, lng: -81.66, bloomScore: 49, trend: 'up', rentGrowth: 4.2, inventory: 95000 },
		{ id: 'nashville', name: 'Nashville', state: 'TN', lat: 36.16, lng: -86.78, bloomScore: 54, trend: 'up', rentGrowth: 4.5, inventory: 98000 },
		{ id: 'atlanta', name: 'Atlanta', state: 'GA', lat: 33.75, lng: -84.39, bloomScore: 51, trend: 'stable', rentGrowth: 3.5, inventory: 245000 },
		{ id: 'charlotte', name: 'Charlotte', state: 'NC', lat: 35.23, lng: -80.84, bloomScore: 53, trend: 'up', rentGrowth: 4.1, inventory: 125000 },
		{ id: 'raleigh', name: 'Raleigh', state: 'NC', lat: 35.78, lng: -78.64, bloomScore: 54, trend: 'up', rentGrowth: 4.3, inventory: 89000 },
		{ id: 'denver', name: 'Denver', state: 'CO', lat: 39.74, lng: -104.99, bloomScore: 50, trend: 'stable', rentGrowth: 2.8, inventory: 175000 }
	];

	interface MarketsMapProps {
		markets?: Market[];
		selectedMarket?: string | null;
		onMarketClick?: (market: Market) => void;
		onMarketHover?: (market: Market | null) => void;
	}

	let {
		markets = DEFAULT_MARKETS,
		selectedMarket = null,
		onMarketClick,
		onMarketHover
	}: MarketsMapProps = $props();

	let hoveredMarket: Market | null = $state(null);

	// Convert lat/lng to SVG coordinates (simplified US projection)
	function projectToSVG(lat: number, lng: number): { x: number; y: number } {
		// Simplified mercator-like projection for continental US
		// lng range: -125 to -67 -> x: 50 to 950
		// lat range: 24 to 50 -> y: 450 to 50
		const x = ((lng + 125) / 58) * 900 + 50;
		const y = ((50 - lat) / 26) * 400 + 50;
		return { x, y };
	}

	function getMarkerColor(bloomScore: number): string {
		// Bloom Score thresholds: 56+ A+, 48+ A, 40+ B+, 32+ B
		if (bloomScore >= 56) return '#B8860B'; // Gold - A+ (excellent)
		if (bloomScore >= 52) return '#CFA874'; // Light gold - A (great)
		if (bloomScore >= 48) return '#22c55e'; // Green - A-/B+ (good)
		return '#86efac'; // Light green - B or below (fair)
	}

	function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
		if (trend === 'up') return '↑';
		if (trend === 'down') return '↓';
		return '→';
	}

	function handleMarkerClick(market: Market) {
		if (onMarketClick) {
			onMarketClick(market);
		}
	}

	function handleMarkerHover(market: Market | null) {
		hoveredMarket = market;
		if (onMarketHover) {
			onMarketHover(market);
		}
	}
</script>

<div class="relative w-full">
	<!-- SVG Map -->
	<svg viewBox="0 0 1000 500" class="w-full h-auto" preserveAspectRatio="xMidYMid meet">
		<defs>
			<!-- Glow filter for markers -->
			<filter id="marker-glow" x="-50%" y="-50%" width="200%" height="200%">
				<feGaussianBlur stdDeviation="3" result="coloredBlur" />
				<feMerge>
					<feMergeNode in="coloredBlur" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>

			<!-- Pulse animation -->
			<radialGradient id="pulse-gradient">
				<stop offset="0%" stop-color="#c8ab37" stop-opacity="0.6" />
				<stop offset="100%" stop-color="#c8ab37" stop-opacity="0" />
			</radialGradient>
		</defs>

		<!-- Simplified US outline (continental) -->
		<path
			d="M 100 120
				 L 150 100 L 250 95 L 350 100 L 450 110 L 550 105 L 650 95 L 750 100 L 850 120 L 900 150
				 L 920 200 L 910 250 L 880 300 L 850 350 L 800 380 L 750 400 L 700 420 L 650 430
				 L 600 425 L 550 420 L 500 430 L 450 440 L 400 435 L 350 420 L 300 400
				 L 250 380 L 200 350 L 150 300 L 120 250 L 100 200 L 90 150 Z"
			fill="none"
			stroke="#334155"
			stroke-width="2"
			opacity="0.5"
		/>

		<!-- State boundaries (simplified) -->
		<g stroke="#475569" stroke-width="1" opacity="0.3" fill="none">
			<!-- Texas -->
			<path d="M 250 280 L 350 280 L 380 350 L 350 420 L 280 430 L 220 400 L 200 350 L 220 300 Z" />
			<!-- Florida -->
			<path d="M 700 350 L 750 340 L 780 380 L 760 430 L 720 450 L 690 420 L 680 380 Z" />
			<!-- Arizona -->
			<path d="M 180 220 L 250 220 L 260 300 L 220 320 L 170 300 L 160 250 Z" />
			<!-- Georgia -->
			<path d="M 680 280 L 720 280 L 730 340 L 700 360 L 660 340 L 660 300 Z" />
			<!-- Tennessee -->
			<path d="M 580 240 L 680 235 L 690 270 L 600 275 L 570 260 Z" />
			<!-- North Carolina -->
			<path d="M 720 220 L 820 210 L 830 250 L 750 260 L 710 250 Z" />
			<!-- Colorado -->
			<path d="M 280 160 L 380 155 L 385 220 L 285 225 Z" />
		</g>

		<!-- Market markers -->
		{#each markets as market}
			{@const pos = projectToSVG(market.lat, market.lng)}
			{@const isHovered = hoveredMarket?.id === market.id}
			{@const isSelected = selectedMarket === market.id}

			<!-- Pulse ring for hovered/selected -->
			{#if isHovered || isSelected}
				<circle
					cx={pos.x}
					cy={pos.y}
					r="25"
					fill="url(#pulse-gradient)"
					class="animate-ping"
				/>
			{/if}

			<!-- Outer glow ring -->
			<circle
				cx={pos.x}
				cy={pos.y}
				r={isHovered ? 18 : 14}
				fill={getMarkerColor(market.bloomScore)}
				opacity="0.3"
				filter="url(#marker-glow)"
				class="transition-all duration-200"
			/>

			<!-- Main marker -->
			<circle
				cx={pos.x}
				cy={pos.y}
				r={isHovered ? 12 : 10}
				fill={getMarkerColor(market.bloomScore)}
				stroke="#0f172a"
				stroke-width="2"
				class="cursor-pointer transition-all duration-200 hover:scale-110"
				role="button"
				tabindex="0"
				onclick={() => handleMarkerClick(market)}
				onmouseenter={() => handleMarkerHover(market)}
				onmouseleave={() => handleMarkerHover(null)}
				onkeydown={(e) => e.key === 'Enter' && handleMarkerClick(market)}
			/>

			<!-- Score label -->
			<text
				x={pos.x}
				y={pos.y + 4}
				text-anchor="middle"
				class="text-[10px] font-bold fill-slate-900 pointer-events-none"
			>
				{market.bloomScore}
			</text>

			<!-- City name (show on hover or always for high-score markets) -->
			{#if isHovered || market.bloomScore >= 52}
				<text
					x={pos.x}
					y={pos.y - 18}
					text-anchor="middle"
					class="text-xs font-semibold fill-slate-200 pointer-events-none"
				>
					{market.name}
				</text>
			{/if}
		{/each}
	</svg>

	<!-- Legend -->
	<div class="flex flex-wrap justify-center gap-4 mt-6 text-sm">
		<div class="flex items-center gap-2">
			<div class="size-4 rounded-full bg-[#B8860B]"></div>
			<span class="text-muted-foreground">56+ A+ Excellent</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="size-4 rounded-full bg-[#CFA874]"></div>
			<span class="text-muted-foreground">52-55 A Great</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="size-4 rounded-full bg-[#22c55e]"></div>
			<span class="text-muted-foreground">48-51 B+ Good</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="size-4 rounded-full bg-[#86efac]"></div>
			<span class="text-muted-foreground">&lt;48 Fair</span>
		</div>
	</div>

	<!-- Hovered market tooltip -->
	{#if hoveredMarket}
		{@const pos = projectToSVG(hoveredMarket.lat, hoveredMarket.lng)}
		<div
			class="absolute bg-slate-900/95 border border-slate-700 rounded-lg p-4 shadow-xl min-w-[200px] pointer-events-none z-10"
			style="left: calc({(pos.x / 1000) * 100}% - 100px); top: calc({(pos.y / 500) * 100}% + 30px);"
		>
			<div class="flex items-center justify-between mb-2">
				<h4 class="font-bold text-white">{hoveredMarket.name}, {hoveredMarket.state}</h4>
				<Badge
					class={hoveredMarket.trend === 'up'
						? 'bg-green-500/20 text-green-400'
						: hoveredMarket.trend === 'down'
							? 'bg-red-500/20 text-red-400'
							: 'bg-slate-500/20 text-slate-400'}
				>
					{getTrendIcon(hoveredMarket.trend)} {hoveredMarket.trend}
				</Badge>
			</div>
			<div class="grid grid-cols-2 gap-2 text-sm">
				<div>
					<p class="text-slate-400">Bloom Score</p>
					<p class="font-semibold text-amber-500">{hoveredMarket.bloomScore}/64</p>
				</div>
				<div>
					<p class="text-slate-400">Rent Growth</p>
					<p class="font-semibold text-green-400">+{hoveredMarket.rentGrowth}%</p>
				</div>
				<div class="col-span-2">
					<p class="text-slate-400">Total Inventory</p>
					<p class="font-semibold text-white">{hoveredMarket.inventory.toLocaleString()} units</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes ping {
		0% {
			transform: scale(1);
			opacity: 0.6;
		}
		75%,
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}

	.animate-ping {
		animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
	}
</style>
