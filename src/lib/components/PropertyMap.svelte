<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PetalDataPoint } from '$lib/types/petal-chart.types';
	import PetalChart from '$lib/components/petal-chart/PetalChart.svelte';

	interface PropertyLocation {
		id: string;
		name: string;
		address: string;
		lng: number;
		lat: number;
		data: PetalDataPoint[];
	}

	interface PropertyMapProps {
		properties: PropertyLocation[];
		accessToken: string;
		initialCenter?: [number, number];
		initialZoom?: number;
	}

	let {
		properties,
		accessToken,
		initialCenter = [-122.4194, 37.7749], // San Francisco
		initialZoom = 11
	}: PropertyMapProps = $props();

	let mapContainer: HTMLDivElement;
	let map: any = $state(null);
	let markers: any[] = [];
	let selectedProperty: PropertyLocation | null = $state(null);
	let hoveredProperty: PropertyLocation | null = $state(null);

	onMount(async () => {
		// Dynamically import mapbox-gl to avoid SSR issues
		const mapboxgl = (await import('mapbox-gl')).default;

		// Import CSS
		await import('mapbox-gl/dist/mapbox-gl.css');

		mapboxgl.accessToken = accessToken;

		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/dark-v11',
			center: initialCenter,
			zoom: initialZoom
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		map.on('load', () => {
			addPropertyMarkers(mapboxgl);
		});
	});

	function addPropertyMarkers(mapboxgl: any) {
		properties.forEach((property) => {
			// Create a DOM element for the marker
			const el = document.createElement('div');
			el.className = 'property-marker';
			el.style.cursor = 'pointer';

			// We'll render the PetalMarker as an SVG string
			const svg = createPetalSVG(property.data, 60);
			el.innerHTML = svg;

			el.addEventListener('mouseenter', () => {
				hoveredProperty = property;
			});

			el.addEventListener('mouseleave', () => {
				if (hoveredProperty?.id === property.id) {
					hoveredProperty = null;
				}
			});

			el.addEventListener('click', () => {
				selectedProperty = property;
			});

			const marker = new mapboxgl.Marker({ element: el })
				.setLngLat([property.lng, property.lat])
				.addTo(map);

			markers.push(marker);
		});
	}

	// Score-based color gradient: gold (mature) → ivory (mid) → green (budding)
	function getPetalColor(score: number): string {
		if (score >= 7) {
			// Rich gold gradient (7-8) - mature/fully developed
			const t = (score - 7) / 1;
			return interpolateColor('#CFA874', '#B8860B', t);
		} else if (score >= 5) {
			// Ivory/cream gradient (5-6) - mid development
			const t = (score - 5) / 2;
			return interpolateColor('#F5F5DC', '#E8DCC4', t);
		} else if (score >= 3) {
			// Light green gradient (3-4) - early development
			const t = (score - 3) / 2;
			return interpolateColor('#86efac', '#bbf7d0', t);
		} else {
			// Fresh green gradient (1-2) - budding/new
			const t = Math.max(0, score - 1) / 2;
			return interpolateColor('#22c55e', '#4ade80', t);
		}
	}

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

	function createPetalSVG(data: PetalDataPoint[], size: number): string {
		const center = size / 2;
		const angleStep = (2 * Math.PI) / data.length;
		const centerRadius = size * 0.15;
		const maxPetalLength = size * 0.35;
		const widePointRadius = centerRadius + maxPetalLength * 0.6;
		const fixedHalfWidth = Math.sin(angleStep / 2) * widePointRadius * 1.15;

		const aggregateScore = data.reduce((sum, d) => sum + d.score, 0) / data.length;
		const borderColor = aggregateScore >= 7 ? '#B8860B' :
			aggregateScore >= 5 ? '#CFA874' :
			aggregateScore >= 3 ? '#F5F5DC' : '#22c55e';

		let paths = '';
		data.forEach((petal, i) => {
			const angle = i * angleStep - Math.PI / 2;
			const length = centerRadius + (petal.score / 10) * maxPetalLength;
			const halfWidth = fixedHalfWidth;
			const perpAngle = angle + Math.PI / 2;
			const innerRadius = centerRadius * 0.4;
			const petalLength = length - innerRadius;
			const baseHalfWidth = halfWidth * 0.25;

			const baseX = center + Math.cos(angle) * innerRadius;
			const baseY = center + Math.sin(angle) * innerRadius;
			const baseLeftX = baseX + Math.cos(perpAngle) * baseHalfWidth;
			const baseLeftY = baseY + Math.sin(perpAngle) * baseHalfWidth;
			const baseRightX = baseX - Math.cos(perpAngle) * baseHalfWidth;
			const baseRightY = baseY - Math.sin(perpAngle) * baseHalfWidth;

			const wideRadius = innerRadius + petalLength * 0.60;
			const wideLeftX = center + Math.cos(angle) * wideRadius + Math.cos(perpAngle) * halfWidth;
			const wideLeftY = center + Math.sin(angle) * wideRadius + Math.sin(perpAngle) * halfWidth;
			const wideRightX = center + Math.cos(angle) * wideRadius - Math.cos(perpAngle) * halfWidth;
			const wideRightY = center + Math.sin(angle) * wideRadius - Math.sin(perpAngle) * halfWidth;

			const tipX = center + Math.cos(angle) * length;
			const tipY = center + Math.sin(angle) * length;

			const innerArcCtrlRadius = innerRadius + petalLength * 0.30;
			const innerArcCtrlLeftX = center + Math.cos(angle) * innerArcCtrlRadius + Math.cos(perpAngle) * halfWidth;
			const innerArcCtrlLeftY = center + Math.sin(angle) * innerArcCtrlRadius + Math.sin(perpAngle) * halfWidth;
			const innerArcCtrlRightX = center + Math.cos(angle) * innerArcCtrlRadius - Math.cos(perpAngle) * halfWidth;
			const innerArcCtrlRightY = center + Math.sin(angle) * innerArcCtrlRadius - Math.sin(perpAngle) * halfWidth;

			const outerArcCtrlRadius = innerRadius + petalLength * 0.85;
			const outerArcCtrlLeftX = center + Math.cos(angle) * outerArcCtrlRadius + Math.cos(perpAngle) * halfWidth * 0.5;
			const outerArcCtrlLeftY = center + Math.sin(angle) * outerArcCtrlRadius + Math.sin(perpAngle) * halfWidth * 0.5;
			const outerArcCtrlRightX = center + Math.cos(angle) * outerArcCtrlRadius - Math.cos(perpAngle) * halfWidth * 0.5;
			const outerArcCtrlRightY = center + Math.sin(angle) * outerArcCtrlRadius - Math.sin(perpAngle) * halfWidth * 0.5;

			const baseCtrlX = baseX - Math.cos(angle) * baseHalfWidth * 0.3;
			const baseCtrlY = baseY - Math.sin(angle) * baseHalfWidth * 0.3;

			const path = `M ${baseLeftX} ${baseLeftY}
				Q ${innerArcCtrlLeftX} ${innerArcCtrlLeftY}, ${wideLeftX} ${wideLeftY}
				C ${wideLeftX + Math.cos(angle) * halfWidth * 0.3} ${wideLeftY + Math.sin(angle) * halfWidth * 0.3}, ${outerArcCtrlLeftX} ${outerArcCtrlLeftY}, ${tipX} ${tipY}
				C ${outerArcCtrlRightX} ${outerArcCtrlRightY}, ${wideRightX + Math.cos(angle) * halfWidth * 0.3} ${wideRightY + Math.sin(angle) * halfWidth * 0.3}, ${wideRightX} ${wideRightY}
				Q ${innerArcCtrlRightX} ${innerArcCtrlRightY}, ${baseRightX} ${baseRightY}
				Q ${baseCtrlX} ${baseCtrlY}, ${baseLeftX} ${baseLeftY} Z`;

			paths += `<path d="${path}" fill="${getPetalColor(petal.score)}" opacity="${0.5 + (petal.confidence || 0.85) * 0.5}" />`;
		});

		return `
			<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="filter: drop-shadow(0 3px 8px rgba(0,0,0,0.4)); transition: transform 0.2s ease;">
				<circle cx="${center}" cy="${center}" r="${size / 2 - 2}" fill="#1e293b" />
				${paths}
				<circle cx="${center}" cy="${center}" r="${centerRadius}" fill="#0f172a" stroke="${borderColor}" stroke-width="2" />
				<text x="${center}" y="${center}" text-anchor="middle" dominant-baseline="middle" style="font-size: ${size * 0.18}px; font-weight: 700; fill: #f8fafc;">${aggregateScore.toFixed(1)}</text>
			</svg>
		`;
	}

	function closeModal() {
		selectedProperty = null;
	}

	onDestroy(() => {
		markers.forEach((m) => m.remove());
		if (map) map.remove();
	});
</script>

<div class="map-wrapper">
	<div bind:this={mapContainer} class="map-container"></div>

	<!-- Hover tooltip -->
	{#if hoveredProperty && !selectedProperty}
		<div class="hover-tooltip">
			<h4>{hoveredProperty.name}</h4>
			<p>{hoveredProperty.address}</p>
		</div>
	{/if}

	<!-- Selected property modal -->
	{#if selectedProperty}
		<div class="modal-overlay" onclick={closeModal} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && closeModal()}>
			<div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog">
				<button class="close-btn" onclick={closeModal}>&times;</button>

				<div class="modal-header">
					<h2>{selectedProperty.name}</h2>
					<p class="address">{selectedProperty.address}</p>
				</div>

				<div class="modal-body">
					<PetalChart
						data={selectedProperty.data}
						size={350}
						showLabels={true}
						showValues={true}
					/>
				</div>

				<div class="modal-footer">
					<button class="btn-primary">View Full Analysis</button>
					<button class="btn-secondary" onclick={closeModal}>Close</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.map-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.map-container {
		width: 100%;
		height: 100%;
		border-radius: 1rem;
		overflow: hidden;
	}

	.hover-tooltip {
		position: absolute;
		bottom: 20px;
		left: 20px;
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		padding: 1rem 1.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
		z-index: 10;
	}

	.hover-tooltip h4 {
		margin: 0 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
		color: hsl(var(--foreground));
	}

	.hover-tooltip p {
		margin: 0;
		font-size: 0.875rem;
		color: hsl(var(--muted-foreground));
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.modal-content {
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		border-radius: 1.5rem;
		padding: 2rem 2rem 1.5rem;
		max-width: 520px;
		width: 90%;
		max-height: 90vh;
		min-height: 580px;
		overflow-y: auto;
		position: relative;
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 36px;
		height: 36px;
		border: none;
		background: hsl(var(--secondary));
		border-radius: 50%;
		font-size: 1.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: hsl(var(--muted-foreground));
		transition: all 0.2s ease;
	}

	.close-btn:hover {
		background: hsl(var(--accent));
		color: hsl(var(--foreground));
	}

	.modal-header {
		margin-bottom: 1.5rem;
	}

	.modal-header h2 {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: hsl(var(--foreground));
	}

	.address {
		margin: 0;
		color: hsl(var(--muted-foreground));
		font-size: 0.9375rem;
	}

	.modal-body {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
		padding: 1rem 0;
	}

	.modal-footer {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid hsl(var(--border));
	}

	.btn-primary {
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #CFA874 0%, #B8860B 100%);
		color: #1e293b;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(207, 168, 116, 0.4);
	}

	.btn-secondary {
		padding: 0.75rem 1.5rem;
		background: hsl(var(--secondary));
		color: hsl(var(--foreground));
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-secondary:hover {
		background: hsl(var(--accent));
	}

	:global(.property-marker) {
		transition: transform 0.2s ease;
	}

	:global(.property-marker:hover) {
		transform: scale(1.2);
		z-index: 100 !important;
	}

	:global(.property-marker:hover svg) {
		filter: drop-shadow(0 4px 12px rgba(207, 168, 116, 0.5)) !important;
	}
</style>
