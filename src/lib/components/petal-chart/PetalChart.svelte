<script lang="ts">
	import type { PetalDataPoint } from '$lib/types/petal-chart.types';
	import { getBloomStatus } from '$lib/types/petal-chart.types';

	interface PetalChartProps {
		data: PetalDataPoint[];
		size?: number;
		minCenterRadius?: number;
		maxCenterRadius?: number;
		centerValue?: number; // 0-10 scale, controls center circle size
		maxPetalLength?: number;
		showLabels?: boolean;
		showValues?: boolean;
		showCenterValue?: boolean;
		interactive?: boolean;
		enableGlow?: boolean;
		comparisonData?: PetalDataPoint[];
		onPetalClick?: (petal: PetalDataPoint) => void;
		onPetalHover?: (petal: PetalDataPoint | null) => void;
	}

	let {
		data,
		size = 400,
		minCenterRadius = 30,
		maxCenterRadius = 60,
		centerValue,
		maxPetalLength = 150,
		showLabels = true,
		showValues = false,
		showCenterValue = true,
		interactive = true,
		enableGlow = true,
		comparisonData,
		onPetalClick,
		onPetalHover
	}: PetalChartProps = $props();

	const center = $derived(size / 2);
	const angleStep = $derived((2 * Math.PI) / data.length);

	// Calculate total bloom score (0-64 scale for 8 petals with 0-8 each)
	const totalBloomScore = $derived(data.reduce((sum, d) => sum + d.score, 0));
	const bloomPercentage = $derived(Math.round((totalBloomScore / 64) * 100));
	const bloomStatus = $derived(getBloomStatus(totalBloomScore));

	// Calculate aggregate score if centerValue not provided (for center radius sizing)
	const aggregateScore = $derived(
		centerValue ?? data.reduce((sum, d) => sum + d.score, 0) / data.length
	);

	// Dynamic center radius based on aggregate score (0-10 scale)
	const dynamicCenterRadius = $derived(
		minCenterRadius + (aggregateScore / 10) * (maxCenterRadius - minCenterRadius)
	);

	// Calculate fixed petal width for guaranteed 10% overlap at widest point
	// The widest point is at 60% of petal length from center
	// Formula: halfWidth = sin(angleStep/2) * wideRadius * 1.1 (10% overlap on each side)
	const widePointRadius = $derived(dynamicCenterRadius + maxPetalLength * 0.6);
	const fixedHalfWidth = $derived(Math.sin(angleStep / 2) * widePointRadius * 1.1);

	// Average confidence for the confidence ring around center
	const avgConfidence = $derived(data.reduce((sum, d) => sum + d.confidence, 0) / data.length);

	// Average completeness for Guardian verification ring
	const avgCompleteness = $derived(data.reduce((sum, d) => sum + d.completeness, 0) / data.length);

	// Theme-aligned color gradient using primary gold (#c8ab37) progression
	// Natural progression: muted (budding) -> developing -> gold (mature)
	function getPetalColor(score: number): string {
		if (score >= 7) {
			// Rich gold gradient (7-8) - mature/fully developed - uses theme primary
			const t = (score - 7) / 1; // 0 at 7, 1 at 8
			return interpolateColor('#c8ab37', '#b8960b', t); // Theme primary gold to darker gold
		} else if (score >= 5) {
			// Warm gold-tinted gradient (5-6) - developing
			const t = (score - 5) / 2; // 0 at 5, 1 at 7
			return interpolateColor('#d4c78a', '#c8ab37', t); // Light gold to theme primary
		} else if (score >= 3) {
			// Muted warm gradient (3-4) - early development
			const t = (score - 3) / 2; // 0 at 3, 1 at 5
			return interpolateColor('#a8a080', '#c4b878', t); // Muted to warm
		} else {
			// Subtle muted gradient (0-2) - budding/new
			const t = Math.max(0, score) / 3; // 0 at 0, 1 at 3
			return interpolateColor('#6b7060', '#8a8a70', t); // Muted gray-green to warmer
		}
	}

	// Helper to interpolate between two hex colors
	function interpolateColor(color1: string, color2: string, t: number): string {
		const r1 = parseInt(color1.slice(1, 3), 16);
		const g1 = parseInt(color1.slice(3, 5), 16);
		const b1 = parseInt(color1.slice(5, 7), 16);
		const r2 = parseInt(color2.slice(1, 3), 16);
		const g2 = parseInt(color2.slice(3, 5), 16);
		const b2 = parseInt(color2.slice(5, 7), 16);
		const r = Math.round(r1 + (r2 - r1) * t);
		const g = Math.round(g1 + (g2 - g1) * t);
		const b = Math.round(b1 + (b2 - b1) * t);
		return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
	}

	// Check if petal should have golden glow (score = 8)
	function hasGoldenGlow(score: number): boolean {
		return score >= 8;
	}

	function getPetalPath(index: number, dataPoint: PetalDataPoint): string {
		const angle = index * angleStep - Math.PI / 2;
		// Score is 0-8 scale per DESIGN.md, petal length proportional to score
		const length = dynamicCenterRadius + (dataPoint.score / 8) * maxPetalLength;
		// Fixed width for consistent 10% overlap - all petals same width
		const halfWidth = fixedHalfWidth;

		// Perpendicular angle for width
		const perpAngle = angle + Math.PI / 2;

		// Inner radius for petal overlap - petals start at 40% of center radius
		const innerRadius = dynamicCenterRadius * 0.4;

		// Petal length (from inner start to outer tip)
		const petalLength = length - innerRadius;

		// LOTUS PETAL: Smooth arc sides, widest at 60%, rounded tip
		// Base has slight width for natural overlap near center
		const baseHalfWidth = halfWidth * 0.25;

		// Inner base points (where petal starts - with slight width for overlap)
		const baseX = center + Math.cos(angle) * innerRadius;
		const baseY = center + Math.sin(angle) * innerRadius;
		const baseLeftX = baseX + Math.cos(perpAngle) * baseHalfWidth;
		const baseLeftY = baseY + Math.sin(perpAngle) * baseHalfWidth;
		const baseRightX = baseX - Math.cos(perpAngle) * baseHalfWidth;
		const baseRightY = baseY - Math.sin(perpAngle) * baseHalfWidth;

		// Widest point at 60% from base - closer to tip for rounder end
		const wideRadius = innerRadius + petalLength * 0.6;
		const wideLeftX = center + Math.cos(angle) * wideRadius + Math.cos(perpAngle) * halfWidth;
		const wideLeftY = center + Math.sin(angle) * wideRadius + Math.sin(perpAngle) * halfWidth;
		const wideRightX = center + Math.cos(angle) * wideRadius - Math.cos(perpAngle) * halfWidth;
		const wideRightY = center + Math.sin(angle) * wideRadius - Math.sin(perpAngle) * halfWidth;

		// Outer tip point - will be more rounded due to closer widest point
		const tipX = center + Math.cos(angle) * length;
		const tipY = center + Math.sin(angle) * length;

		// Control points for smooth arc from base to widest point (inner 60%)
		// Pull outward to create the rounded bulge
		const innerArcCtrlRadius = innerRadius + petalLength * 0.3;
		const innerArcCtrlLeftX =
			center + Math.cos(angle) * innerArcCtrlRadius + Math.cos(perpAngle) * halfWidth * 1.0;
		const innerArcCtrlLeftY =
			center + Math.sin(angle) * innerArcCtrlRadius + Math.sin(perpAngle) * halfWidth * 1.0;
		const innerArcCtrlRightX =
			center + Math.cos(angle) * innerArcCtrlRadius - Math.cos(perpAngle) * halfWidth * 1.0;
		const innerArcCtrlRightY =
			center + Math.sin(angle) * innerArcCtrlRadius - Math.sin(perpAngle) * halfWidth * 1.0;

		// Control points for rounded tip (outer 40%) - keeps width longer for rounder tip
		const outerArcCtrlRadius = innerRadius + petalLength * 0.85;
		const outerArcCtrlLeftX =
			center + Math.cos(angle) * outerArcCtrlRadius + Math.cos(perpAngle) * halfWidth * 0.5;
		const outerArcCtrlLeftY =
			center + Math.sin(angle) * outerArcCtrlRadius + Math.sin(perpAngle) * halfWidth * 0.5;
		const outerArcCtrlRightX =
			center + Math.cos(angle) * outerArcCtrlRadius - Math.cos(perpAngle) * halfWidth * 0.5;
		const outerArcCtrlRightY =
			center + Math.sin(angle) * outerArcCtrlRadius - Math.sin(perpAngle) * halfWidth * 0.5;

		// Control point for smooth base closure (curves inward slightly)
		const baseCtrlX = baseX - Math.cos(angle) * baseHalfWidth * 0.3;
		const baseCtrlY = baseY - Math.sin(angle) * baseHalfWidth * 0.3;

		// Build smooth lotus petal with continuous arcs, rounded tip, and wide base for overlap
		return `
			M ${baseLeftX} ${baseLeftY}
			Q ${innerArcCtrlLeftX} ${innerArcCtrlLeftY}, ${wideLeftX} ${wideLeftY}
			C ${wideLeftX + Math.cos(angle) * halfWidth * 0.3} ${wideLeftY + Math.sin(angle) * halfWidth * 0.3}, ${outerArcCtrlLeftX} ${outerArcCtrlLeftY}, ${tipX} ${tipY}
			C ${outerArcCtrlRightX} ${outerArcCtrlRightY}, ${wideRightX + Math.cos(angle) * halfWidth * 0.3} ${wideRightY + Math.sin(angle) * halfWidth * 0.3}, ${wideRightX} ${wideRightY}
			Q ${innerArcCtrlRightX} ${innerArcCtrlRightY}, ${baseRightX} ${baseRightY}
			Q ${baseCtrlX} ${baseCtrlY}, ${baseLeftX} ${baseLeftY}
			Z
		`;
	}

	function handleClick(petal: PetalDataPoint) {
		if (interactive && onPetalClick) {
			onPetalClick(petal);
		}
	}

	function handleHover(petal: PetalDataPoint | null) {
		if (interactive && onPetalHover) {
			onPetalHover(petal);
		}
	}
</script>

<svg width={size} height={size} viewBox="0 0 {size} {size}" class="petal-chart">
	<defs>
		{#if enableGlow}
			<!-- Standard glow for trending up petals -->
			<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
				<feGaussianBlur stdDeviation="3" result="coloredBlur" />
				<feMerge>
					<feMergeNode in="coloredBlur" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>

			<!-- Golden glow for perfect score (8) petals -->
			<filter id="golden-glow" x="-100%" y="-100%" width="300%" height="300%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
				<feColorMatrix
					in="blur1"
					type="matrix"
					result="gold1"
					values="1.2 0.3 0 0 0.1
							0.3 0.8 0 0 0.05
							0   0   0.2 0 0
							0   0   0   1 0"
				/>
				<feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
				<feColorMatrix
					in="blur2"
					type="matrix"
					result="gold2"
					values="1.3 0.4 0 0 0.15
							0.4 0.9 0 0 0.08
							0   0   0.3 0 0
							0   0   0   1 0"
				/>
				<feMerge>
					<feMergeNode in="gold1" />
					<feMergeNode in="gold2" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>

			<!-- Sparkle effect for perfect petals -->
			<filter id="sparkle" x="-50%" y="-50%" width="200%" height="200%">
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="noise" />
				<feColorMatrix
					in="noise"
					type="matrix"
					result="sparkle"
					values="0 0 0 0 1
							0 0 0 0 0.9
							0 0 0 0 0.5
							0 0 0 0.15 0"
				/>
				<feComposite in="sparkle" in2="SourceGraphic" operator="in" result="masked" />
				<feMerge>
					<feMergeNode in="SourceGraphic" />
					<feMergeNode in="masked" />
				</feMerge>
			</filter>
		{/if}

		<!-- Sparkle gradient for max score overlay -->
		<linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" stop-color="#FFD700" stop-opacity="0.6" />
			<stop offset="50%" stop-color="#FFF8DC" stop-opacity="0.8" />
			<stop offset="100%" stop-color="#FFD700" stop-opacity="0.6" />
		</linearGradient>

		<!-- Text shadow/glow filter for labels -->
		<filter id="text-shadow" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.7"/>
		</filter>

		<!-- Text background for better readability -->
		<filter id="text-bg" x="-10%" y="-10%" width="120%" height="120%">
			<feFlood flood-color="#0f172a" flood-opacity="0.6" result="bg"/>
			<feMorphology in="SourceAlpha" operator="dilate" radius="3" result="dilated"/>
			<feComposite in="bg" in2="dilated" operator="in" result="bg-masked"/>
			<feMerge>
				<feMergeNode in="bg-masked"/>
				<feMergeNode in="SourceGraphic"/>
			</feMerge>
		</filter>

		<!-- Guardian verification ring gradient -->
		<linearGradient id="guardian-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" stop-color="#3b82f6" />
			<stop offset="50%" stop-color="#8b5cf6" />
			<stop offset="100%" stop-color="#3b82f6" />
		</linearGradient>
	</defs>

	<!-- Petals -->
	{#each data as petal, i}
		{@const isMaxScore = hasGoldenGlow(petal.score)}
		{@const petalFilter = isMaxScore && enableGlow
			? 'url(#golden-glow)'
			: enableGlow && petal.trend === 'up'
				? 'url(#glow)'
				: undefined}
		<path
			d={getPetalPath(i, petal)}
			fill={getPetalColor(petal.score)}
			opacity={0.5 + petal.confidence * 0.5}
			class="petal"
			class:interactive
			class:max-score={isMaxScore}
			filter={petalFilter}
			role={interactive ? 'button' : undefined}
			tabindex={interactive ? 0 : undefined}
			onclick={() => handleClick(petal)}
			onmouseenter={() => handleHover(petal)}
			onmouseleave={() => handleHover(null)}
			onkeydown={(e) => e.key === 'Enter' && handleClick(petal)}
		/>

		<!-- Sparkle overlay for max score petals -->
		{#if isMaxScore && enableGlow}
			<path
				d={getPetalPath(i, petal)}
				fill="url(#sparkle-gradient)"
				opacity="0.3"
				filter="url(#sparkle)"
				class="sparkle-overlay"
				pointer-events="none"
			/>
		{/if}

		<!-- Labels -->
		{#if showLabels}
			{@const angle = i * angleStep - Math.PI / 2}
			{@const baseRadius = dynamicCenterRadius + maxPetalLength + 20}
			{@const verticalFactor = Math.abs(Math.sin(angle))}
			{@const horizontalFactor = Math.abs(Math.cos(angle))}
			{@const isTopOrBottom = verticalFactor > 0.85}
			{@const labelRadius = isTopOrBottom ? baseRadius + 12 : baseRadius - horizontalFactor * 15}
			{@const labelX = center + Math.cos(angle) * labelRadius}
			{@const labelY = center + Math.sin(angle) * labelRadius}
			{@const textAnchor = horizontalFactor < 0.3 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end')}
			{@const xOffset = horizontalFactor < 0.3 ? 0 : (Math.cos(angle) > 0 ? 4 : -4)}
			<text
				x={labelX + xOffset}
				y={labelY}
				text-anchor={textAnchor}
				dominant-baseline="middle"
				class="petal-label"
			>
				{petal.label}
			</text>
		{/if}

		<!-- Values -->
		{#if showValues}
			{@const angle = i * angleStep - Math.PI / 2}
			{@const valueRadius = dynamicCenterRadius + (petal.score / 10) * maxPetalLength * 0.6}
			{@const valueX = center + Math.cos(angle) * valueRadius}
			{@const valueY = center + Math.sin(angle) * valueRadius}
			<text
				x={valueX}
				y={valueY}
				text-anchor="middle"
				dominant-baseline="middle"
				class="petal-value"
			>
				{petal.score.toFixed(1)}
			</text>
		{/if}
	{/each}

	<!-- Comparison overlay -->
	{#if comparisonData}
		{#each comparisonData as petal, i}
			<path
				d={getPetalPath(i, petal)}
				fill="none"
				stroke="#475569"
				stroke-width="2"
				stroke-dasharray="4 2"
				opacity="0.6"
				class="comparison-petal"
			/>
		{/each}
	{/if}

	<!-- Center circle with dynamic size based on aggregate score -->
	<!-- Outer glow ring -->
	<circle cx={center} cy={center} r={dynamicCenterRadius + 8} class="center-glow" />

	<!-- Guardian verification ring (outer) - shows data completeness -->
	<circle
		cx={center}
		cy={center}
		r={dynamicCenterRadius + 6}
		fill="none"
		stroke="url(#guardian-gradient)"
		stroke-width="2"
		stroke-dasharray="{avgCompleteness * 2 * Math.PI * (dynamicCenterRadius + 6)} {2 *
			Math.PI *
			(dynamicCenterRadius + 6)}"
		stroke-linecap="round"
		transform="rotate(-90 {center} {center})"
		class="guardian-ring"
		opacity="0.8"
	/>
	<!-- Guardian ring background (shows incomplete portion) -->
	<circle
		cx={center}
		cy={center}
		r={dynamicCenterRadius + 6}
		fill="none"
		stroke="#e2e8f0"
		stroke-width="2"
		opacity="0.3"
	/>

	<!-- Confidence ring (inner) - uses theme primary gold -->
	<circle
		cx={center}
		cy={center}
		r={dynamicCenterRadius + 2}
		fill="none"
		stroke="var(--primary, #c8ab37)"
		stroke-width="3"
		stroke-dasharray="{avgConfidence * 2 * Math.PI * (dynamicCenterRadius + 2)} {2 *
			Math.PI *
			(dynamicCenterRadius + 2)}"
		stroke-linecap="round"
		transform="rotate(-90 {center} {center})"
		class="confidence-ring"
	/>

	<!-- Main center circle -->
	<circle cx={center} cy={center} r={dynamicCenterRadius} class="center-circle" />

	{#if showCenterValue}
		<!-- Raw score (X/64) -->
		<text x={center} y={center - 14} text-anchor="middle" dominant-baseline="middle" class="center-score">
			{totalBloomScore.toFixed(0)}<tspan class="center-score-max">/64</tspan>
		</text>

		<!-- Bloom percentage -->
		<text
			x={center}
			y={center + 4}
			text-anchor="middle"
			dominant-baseline="middle"
			class="center-percentage"
		>
			{bloomPercentage}%
		</text>

		<!-- Bloom status label -->
		<text
			x={center}
			y={center + 20}
			text-anchor="middle"
			dominant-baseline="middle"
			class="center-status"
			class:fully-bloomed={bloomStatus.status === 'fully-bloomed'}
			class:near-bloom={bloomStatus.status === 'near-bloom'}
			class:blooming={bloomStatus.status === 'blooming'}
			class:late-bloom={bloomStatus.status === 'late-bloom'}
			class:budding={bloomStatus.status === 'budding'}
		>
			{bloomStatus.label}
		</text>
	{/if}
</svg>

<style>
	.petal-chart {
		overflow: visible;
	}

	.petal {
		transition: all 0.2s ease;
	}

	.petal.interactive:hover {
		filter: brightness(1.1);
		cursor: pointer;
	}

	.petal.interactive:focus {
		outline: 2px solid var(--primary, #c8ab37);
		outline-offset: 2px;
	}

	.center-glow {
		fill: color-mix(in srgb, var(--primary, #c8ab37) 25%, transparent);
		transition: r 0.3s ease;
	}

	.confidence-ring {
		transition: stroke-dasharray 0.5s ease;
	}

	.center-circle {
		fill: var(--card, #0f172a);
		stroke: var(--border, #334155);
		stroke-width: 2;
		transition: r 0.3s ease;
	}

	/* New center display styles */
	.center-score {
		font-size: 18px;
		font-weight: 800;
		fill: var(--foreground, #f8fafc);
	}

	.center-score-max {
		font-size: 12px;
		font-weight: 600;
		fill: var(--muted-foreground, #94a3b8);
	}

	.center-percentage {
		font-size: 14px;
		font-weight: 700;
		fill: var(--primary, #c8ab37);
	}

	.center-status {
		font-size: 8px;
		font-weight: 600;
		fill: var(--muted-foreground, #cbd5e1);
		text-transform: uppercase;
		letter-spacing: 0.3px;
	}

	.center-status.fully-bloomed {
		fill: var(--primary, #c8ab37);
	}

	.center-status.near-bloom {
		fill: var(--primary, #c8ab37);
	}

	.center-status.blooming {
		fill: #d4c78a; /* Light gold */
	}

	.center-status.late-bloom {
		fill: #a8a080; /* Muted warm */
	}

	.center-status.budding {
		fill: var(--muted-foreground, #6b7060);
	}

	/* Guardian verification ring */
	.guardian-ring {
		transition: stroke-dasharray 0.5s ease;
	}

	/* Max score petal effects */
	.petal.max-score {
		animation: pulse-glow 2s ease-in-out infinite;
	}

	@keyframes pulse-glow {
		0%,
		100% {
			filter: brightness(1);
		}
		50% {
			filter: brightness(1.15);
		}
	}

	.sparkle-overlay {
		animation: sparkle-shimmer 3s ease-in-out infinite;
	}

	@keyframes sparkle-shimmer {
		0%,
		100% {
			opacity: 0.2;
		}
		50% {
			opacity: 0.4;
		}
	}

	.petal-label {
		font-size: 14px;
		font-weight: 700;
		fill: var(--primary, #c8ab37);
	}

	.petal-value {
		font-size: 11px;
		font-weight: 700;
		fill: var(--foreground, white);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.comparison-petal {
		pointer-events: none;
	}
</style>
