<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import type { CityGateway, CityTier } from '$lib/types/game.types';
	import { worldCities } from '$lib/data/world-cities';

	interface GameMapProps {
		playerLevel?: number;
		onCityClick?: (city: CityGateway) => void;
	}

	let {
		playerLevel = 1,
		onCityClick
	}: GameMapProps = $props();

	// Expose flyTo function for external control
	export function flyToLocation(lng: number, lat: number, zoom: number = 14) {
		if (map) {
			map.flyTo({
				center: [lng, lat],
				zoom,
				pitch: 60,
				bearing: Math.random() * 60 - 30,
				duration: 2000,
				essential: true
			});
		}
	}

	// Fly to city location
	function flyToCity(city: CityGateway) {
		if (map) {
			map.flyTo({
				center: city.center,
				zoom: 10,
				pitch: 60,
				bearing: Math.random() * 40 - 20,
				duration: 1500,
				essential: true
			});
		}
	}

	let mapContainer: HTMLDivElement;
	let map: any = $state(null);
	let mapboxgl: any = null;
	let mapMarkers: any[] = [];
	let hoveredCity: CityGateway | null = $state(null);
	let hoverPosition: { x: number; y: number } = $state({ x: 0, y: 0 });
	let mapLoaded = $state(false);
	let containerReady = $state(false);

	// Generate city gateways from world cities data
	const cityGateways = $derived.by((): CityGateway[] => {
		return worldCities.map(city => {
			// Determine tier and unlock level based on city
			const tierConfig = getCityTierConfig(city.id);
			const isUnlocked = playerLevel >= tierConfig.unlockLevel;

			// Calculate total rewards from properties
			const totalDeed = city.properties.length * 250;
			const totalXp = city.properties.length * 500;

			return {
				id: city.id,
				name: city.name,
				country: city.country,
				region: getCityRegion(city.country),
				center: city.center,
				tier: tierConfig.tier,
				unlockLevel: tierConfig.unlockLevel,
				totalChallenges: city.properties.length,
				completedChallenges: Math.floor(Math.random() * 3), // Demo: random progress
				rewards: {
					deed: totalDeed,
					xp: totalXp
				},
				marketStats: {
					avgPrice: getMarketAvgPrice(city.id),
					growth: getMarketGrowth(city.id),
					properties: city.properties.length
				},
				status: isUnlocked ? 'available' : 'locked'
			};
		});
	});

	// Get city tier configuration
	function getCityTierConfig(cityId: string): { tier: CityTier; unlockLevel: number } {
		const tierMap: Record<string, { tier: CityTier; unlockLevel: number }> = {
			// Starter cities (Level 1)
			'san-diego': { tier: 'starter', unlockLevel: 1 },
			'manila': { tier: 'starter', unlockLevel: 1 },
			'sydney': { tier: 'starter', unlockLevel: 1 },
			// Intermediate cities (Level 5)
			'miami': { tier: 'intermediate', unlockLevel: 5 },
			'dubai': { tier: 'intermediate', unlockLevel: 5 },
			'singapore': { tier: 'intermediate', unlockLevel: 5 },
			// Advanced cities (Level 10)
			'los-angeles': { tier: 'advanced', unlockLevel: 10 },
			'paris': { tier: 'advanced', unlockLevel: 10 },
			'tokyo': { tier: 'advanced', unlockLevel: 10 },
			// Expert cities (Level 15)
			'new-york': { tier: 'expert', unlockLevel: 15 },
			'london': { tier: 'expert', unlockLevel: 15 },
			'hong-kong': { tier: 'expert', unlockLevel: 15 }
		};
		return tierMap[cityId] || { tier: 'starter', unlockLevel: 1 };
	}

	// Get city region
	function getCityRegion(country: string): 'americas' | 'europe' | 'middle-east' | 'asia-pacific' {
		const regionMap: Record<string, 'americas' | 'europe' | 'middle-east' | 'asia-pacific'> = {
			'USA': 'americas',
			'UK': 'europe',
			'France': 'europe',
			'UAE': 'middle-east',
			'Japan': 'asia-pacific',
			'China': 'asia-pacific',
			'Singapore': 'asia-pacific',
			'Australia': 'asia-pacific',
			'Philippines': 'asia-pacific'
		};
		return regionMap[country] || 'americas';
	}

	// Get market average price (demo data)
	function getMarketAvgPrice(cityId: string): string {
		const prices: Record<string, string> = {
			'new-york': '$2.5M',
			'london': '£1.8M',
			'dubai': 'AED 8M',
			'singapore': 'S$3.2M',
			'hong-kong': 'HK$25M',
			'tokyo': '¥180M',
			'sydney': 'A$2.1M',
			'paris': '€1.9M',
			'miami': '$1.8M',
			'los-angeles': '$2.2M',
			'manila': '₱45M',
			'san-diego': '$1.4M'
		};
		return prices[cityId] || '$1M';
	}

	// Get market growth (demo data)
	function getMarketGrowth(cityId: string): string {
		const growth: Record<string, string> = {
			'new-york': '+4.2%',
			'london': '+2.8%',
			'dubai': '+12.5%',
			'singapore': '+6.1%',
			'hong-kong': '+1.5%',
			'tokyo': '+5.8%',
			'sydney': '+7.2%',
			'paris': '+3.4%',
			'miami': '+9.8%',
			'los-angeles': '+5.5%',
			'manila': '+8.3%',
			'san-diego': '+6.7%'
		};
		return growth[cityId] || '+5%';
	}

	// Get city marker color based on tier
	function getCityColor(tier: CityTier, status: string): string {
		if (status === 'locked') return '#374151';
		if (status === 'completed') return '#6b7060';

		switch (tier) {
			case 'expert': return '#c8ab37'; // Gold
			case 'advanced': return '#d4c78a'; // Light gold
			case 'intermediate': return '#a8a080'; // Muted warm
			case 'starter': return '#6b7060'; // Gray-green
			default: return '#6b7060';
		}
	}

	// Get tier badge color
	function getTierBadgeClass(tier: CityTier): string {
		switch (tier) {
			case 'expert': return 'bg-primary/20 text-primary';
			case 'advanced': return 'bg-[#d4c78a]/20 text-[#d4c78a]';
			case 'intermediate': return 'bg-[#a8a080]/20 text-[#a8a080]';
			case 'starter': return 'bg-[#6b7060]/20 text-[#a8a080]';
			default: return 'bg-slate-700/50 text-slate-400';
		}
	}

	function handleCityClick(city: CityGateway) {
		if (city.status !== 'locked') {
			flyToCity(city);
			if (onCityClick) {
				setTimeout(() => onCityClick(city), 300);
			}
		}
	}

	// Create custom city marker element
	function createCityMarkerElement(city: CityGateway): HTMLDivElement {
		const el = document.createElement('div');
		const color = getCityColor(city.tier, city.status);
		const isLocked = city.status === 'locked';
		const size = city.tier === 'expert' ? 56 : city.tier === 'advanced' ? 50 : city.tier === 'intermediate' ? 44 : 40;

		el.className = 'city-gateway-marker';
		el.style.cssText = `
			width: ${size}px;
			height: ${size}px;
			cursor: ${isLocked ? 'not-allowed' : 'pointer'};
			position: relative;
		`;

		// Progress percentage
		const progress = city.totalChallenges > 0
			? Math.round((city.completedChallenges / city.totalChallenges) * 100)
			: 0;

		// Inner content div
		const innerDiv = document.createElement('div');
		innerDiv.className = 'city-marker-inner';
		innerDiv.style.cssText = `
			width: 100%;
			height: 100%;
			border-radius: 12px;
			background: linear-gradient(135deg, ${color}dd 0%, ${color}aa 100%);
			border: 3px solid #0f172a;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-shadow: 0 0 ${isLocked ? '0' : '20px'} ${color}50;
			opacity: ${isLocked ? '0.5' : '1'};
			font-size: ${size * 0.28}px;
			font-weight: bold;
			color: #0f172a;
			text-align: center;
			line-height: 1.1;
			transition: box-shadow 0.2s ease, border-color 0.2s ease;
		`;
		innerDiv.innerHTML = isLocked ? '🔒' : `<span style="font-size: ${size * 0.22}px;">${city.name.substring(0, 3).toUpperCase()}</span><span style="font-size: ${size * 0.18}px; opacity: 0.8;">${progress}%</span>`;
		el.appendChild(innerDiv);

		// Pulse ring for available cities
		if (!isLocked && city.status === 'available') {
			const pulseRing = document.createElement('div');
			pulseRing.className = 'pulse-ring';
			pulseRing.style.cssText = `
				position: absolute;
				top: -4px;
				left: -4px;
				right: -4px;
				bottom: -4px;
				border-radius: 14px;
				border: 2px solid ${color};
				opacity: 0;
				animation: marker-pulse 2.5s ease-out infinite;
			`;
			el.appendChild(pulseRing);
		}

		// Hover effect - enhance glow, no transform to avoid position shift
		el.addEventListener('mouseenter', (e: MouseEvent) => {
			if (!isLocked) {
				innerDiv.style.boxShadow = `0 0 30px ${color}80, 0 0 60px ${color}40`;
				innerDiv.style.borderColor = color;
				hoveredCity = city;
				hoverPosition = { x: e.clientX, y: e.clientY };
			}
		});

		el.addEventListener('mousemove', (e: MouseEvent) => {
			if (hoveredCity?.id === city.id) {
				hoverPosition = { x: e.clientX, y: e.clientY };
			}
		});

		el.addEventListener('mouseleave', () => {
			innerDiv.style.boxShadow = `0 0 ${isLocked ? '0' : '20px'} ${color}50`;
			innerDiv.style.borderColor = '#0f172a';
			if (hoveredCity?.id === city.id) {
				hoveredCity = null;
			}
		});

		// Click handler
		el.addEventListener('click', () => {
			handleCityClick(city);
		});

		return el;
	}

	// Add city markers using native Mapbox layers (more reliable positioning)
	function addCityMarkers() {
		if (!map || !mapboxgl || !mapLoaded) return;

		// Remove existing HTML markers
		mapMarkers.forEach(m => m.remove());
		mapMarkers = [];

		// Debug: log container dimensions and map state
		const rect = mapContainer.getBoundingClientRect();
		console.log('Map container:', rect.width, 'x', rect.height);
		console.log('Map center:', map.getCenter());
		console.log('Map zoom:', map.getZoom());

		// Create GeoJSON for cities
		const geojson = {
			type: 'FeatureCollection' as const,
			features: cityGateways.map(city => ({
				type: 'Feature' as const,
				properties: {
					id: city.id,
					name: city.name,
					tier: city.tier,
					status: city.status,
					country: city.country,
					progress: city.totalChallenges > 0
						? Math.round((city.completedChallenges / city.totalChallenges) * 100)
						: 0
				},
				geometry: {
					type: 'Point' as const,
					coordinates: city.center
				}
			}))
		};

		// Debug: log first few coordinates
		geojson.features.forEach(f => {
			console.log(`${f.properties.name}: [${f.geometry.coordinates[0]}, ${f.geometry.coordinates[1]}]`);
		});

		// Remove existing source/layer if they exist
		if (map.getLayer('city-labels')) map.removeLayer('city-labels');
		if (map.getLayer('city-markers')) map.removeLayer('city-markers');
		if (map.getSource('cities')) map.removeSource('cities');

		// Add source
		map.addSource('cities', {
			type: 'geojson',
			data: geojson
		});

		// Add circle layer for markers
		map.addLayer({
			id: 'city-markers',
			type: 'circle',
			source: 'cities',
			paint: {
				'circle-radius': [
					'match',
					['get', 'tier'],
					'expert', 20,
					'advanced', 18,
					'intermediate', 16,
					14 // starter
				],
				'circle-color': [
					'match',
					['get', 'tier'],
					'expert', '#c8ab37',
					'advanced', '#d4c78a',
					'intermediate', '#a8a080',
					'#6b7060' // starter
				],
				'circle-stroke-width': 3,
				'circle-stroke-color': '#0f172a',
				'circle-opacity': [
					'case',
					['==', ['get', 'status'], 'locked'],
					0.4,
					0.9
				]
			}
		});

		// Add labels
		map.addLayer({
			id: 'city-labels',
			type: 'symbol',
			source: 'cities',
			layout: {
				'text-field': ['get', 'name'],
				'text-size': 12,
				'text-offset': [0, 2],
				'text-anchor': 'top',
				'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold']
			},
			paint: {
				'text-color': '#f8fafc',
				'text-halo-color': '#0f172a',
				'text-halo-width': 1.5
			}
		});

		// Handle clicks on markers
		map.on('click', 'city-markers', (e: any) => {
			if (e.features && e.features.length > 0) {
				const feature = e.features[0];
				const cityId = feature.properties.id;
				const city = cityGateways.find(c => c.id === cityId);
				if (city && city.status !== 'locked') {
					flyToCity(city);
					if (onCityClick) {
						setTimeout(() => onCityClick(city), 300);
					}
				}
			}
		});

		// Change cursor on hover
		map.on('mouseenter', 'city-markers', () => {
			map.getCanvas().style.cursor = 'pointer';
		});
		map.on('mouseleave', 'city-markers', () => {
			map.getCanvas().style.cursor = '';
		});
	}

	let resizeObserver: ResizeObserver | null = null;

	onMount(() => {
		const initMap = async () => {
			mapboxgl = (await import('mapbox-gl')).default;
			await import('mapbox-gl/dist/mapbox-gl.css');

			mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

			// Wait for container to have proper dimensions
			const waitForContainer = (): Promise<void> => {
				return new Promise((resolve) => {
					const checkDimensions = () => {
						const rect = mapContainer.getBoundingClientRect();
						if (rect.width > 0 && rect.height > 0) {
							resolve();
						} else {
							requestAnimationFrame(checkDimensions);
						}
					};
					checkDimensions();
				});
			};

			await waitForContainer();
			containerReady = true;

			map = new mapboxgl.Map({
				container: mapContainer,
				style: 'mapbox://styles/mapbox/dark-v11',
				center: [0, 20], // World view centered
				zoom: 1.5,
				pitch: 0,
				bearing: 0,
				antialias: true,
				trackResize: true,
				projection: 'globe' // Use globe projection for 3D effect
			});

			map.addControl(new mapboxgl.NavigationControl(), 'top-right');

			map.on('load', () => {
				// Add atmosphere/fog for globe effect
				map.setFog({
					color: 'rgb(15, 23, 42)', // Dark slate
					'high-color': 'rgb(30, 41, 59)', // Slightly lighter
					'horizon-blend': 0.02,
					'space-color': 'rgb(10, 15, 30)', // Dark space
					'star-intensity': 0.6
				});

				// Force resize after load
				setTimeout(() => {
					map.resize();
					const proj = map.getProjection();
					console.log('Map projection name:', proj?.name);
					mapLoaded = true;
					addCityMarkers();
				}, 100);

				// Add 3D building layer
				const layers = map.getStyle().layers;
				const labelLayerId = layers?.find(
					(layer: any) => layer.type === 'symbol' && layer.layout?.['text-field']
				)?.id;

				if (labelLayerId) {
					map.addLayer(
						{
							id: '3d-buildings',
							source: 'composite',
							'source-layer': 'building',
							filter: ['==', 'extrude', 'true'],
							type: 'fill-extrusion',
							minzoom: 12,
							paint: {
								'fill-extrusion-color': '#1e293b',
								'fill-extrusion-height': ['get', 'height'],
								'fill-extrusion-base': ['get', 'min_height'],
								'fill-extrusion-opacity': 0.6
							}
						},
						labelLayerId
					);
				}
			});

			// Also listen for resize events
			resizeObserver = new ResizeObserver(() => {
				if (map) {
					map.resize();
				}
			});
			resizeObserver.observe(mapContainer);
		};

		initMap();

		return () => {
			resizeObserver?.disconnect();
		};
	});

	// React to player level changes
	$effect(() => {
		if (mapLoaded) {
			addCityMarkers();
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="game-map-wrapper">
	<div bind:this={mapContainer} class="game-map-container"></div>

	<!-- Loading overlay -->
	{#if !mapLoaded}
		<div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-10">
			<div class="text-center">
				<div class="size-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
				<p class="text-slate-400">Loading game world...</p>
			</div>
		</div>
	{/if}

	<!-- City Hover Tooltip -->
	{#if hoveredCity}
		<div
			class="glass-tooltip fixed rounded-xl p-4 min-w-[280px] pointer-events-none z-[100]"
			style="left: {hoverPosition.x + 20}px; top: {hoverPosition.y - 20}px;"
		>
			<div class="flex items-center justify-between mb-3">
				<div>
					<h4 class="font-bold text-slate-50 text-lg">{hoveredCity.name}</h4>
					<p class="text-slate-400 text-sm">{hoveredCity.country}</p>
				</div>
				<span class="text-xs px-2.5 py-1 rounded-full {getTierBadgeClass(hoveredCity.tier)} font-semibold uppercase">
					{hoveredCity.tier}
				</span>
			</div>

			<!-- Progress -->
			<div class="mb-3">
				<div class="flex justify-between text-sm mb-1">
					<span class="text-slate-400">Progress</span>
					<span class="text-slate-200 font-medium">{hoveredCity.completedChallenges}/{hoveredCity.totalChallenges} challenges</span>
				</div>
				<div class="h-2 bg-slate-800/50 rounded-full overflow-hidden ring-1 ring-white/10">
					<div
						class="h-full bg-gradient-to-r from-primary to-[#d4c78a]"
						style="width: {(hoveredCity.completedChallenges / hoveredCity.totalChallenges) * 100}%"
					></div>
				</div>
			</div>

			<!-- Market Stats -->
			<div class="grid grid-cols-3 gap-2 text-sm mb-3">
				<div class="text-center">
					<p class="text-slate-500 text-xs">Avg Price</p>
					<p class="text-slate-200 font-semibold">{hoveredCity.marketStats.avgPrice}</p>
				</div>
				<div class="text-center">
					<p class="text-slate-500 text-xs">Growth</p>
					<p class="text-primary font-semibold">{hoveredCity.marketStats.growth}</p>
				</div>
				<div class="text-center">
					<p class="text-slate-500 text-xs">Properties</p>
					<p class="text-slate-200 font-semibold">{hoveredCity.marketStats.properties}</p>
				</div>
			</div>

			<!-- Rewards -->
			<div class="flex items-center justify-between pt-2 border-t border-white/10">
				<div class="flex items-center gap-3">
					<span class="text-primary font-bold">+{hoveredCity.rewards.deed.toLocaleString()} $DEED</span>
					<span class="text-[#d4c78a] font-bold">+{hoveredCity.rewards.xp.toLocaleString()} XP</span>
				</div>
			</div>

			{#if hoveredCity.status === 'locked'}
				<div class="mt-2 text-center text-slate-500 text-sm">
					🔒 Unlock at Level {hoveredCity.unlockLevel}
				</div>
			{:else}
				<div class="mt-2 text-center">
					<span class="text-xs text-primary">Click to enter city</span>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Map Legend -->
	<div class="glass-panel absolute bottom-24 right-4 rounded-xl p-3 z-10">
		<div class="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wide">City Tiers</div>
		<div class="space-y-2 text-sm">
			<div class="flex items-center gap-2">
				<div class="size-3 rounded bg-[#c8ab37] ring-2 ring-[#c8ab37]/30"></div>
				<span class="text-slate-200">Expert (Lv.15+)</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="size-3 rounded bg-[#d4c78a] ring-2 ring-[#d4c78a]/30"></div>
				<span class="text-slate-200">Advanced (Lv.10+)</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="size-3 rounded bg-[#a8a080] ring-2 ring-[#a8a080]/30"></div>
				<span class="text-slate-200">Intermediate (Lv.5+)</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="size-3 rounded bg-[#6b7060] ring-2 ring-[#6b7060]/30"></div>
				<span class="text-slate-200">Starter (Lv.1+)</span>
			</div>
		</div>
	</div>

	<!-- Map Controls Hint -->
	<div class="glass-panel absolute bottom-24 left-4 rounded-xl p-3 z-10 text-xs text-slate-400">
		<p>Scroll to zoom | Drag to pan | Click city to enter</p>
	</div>
</div>

<style>
	.game-map-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.game-map-container {
		width: 100vw;
		height: 100vh;
	}

	/* Glass morphism panels - dark background for dark map */
	.glass-panel {
		background: linear-gradient(
			135deg,
			rgba(15, 23, 42, 0.75) 0%,
			rgba(15, 23, 42, 0.6) 100%
		);
		backdrop-filter: blur(16px) saturate(180%);
		-webkit-backdrop-filter: blur(16px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
		color: #f8fafc;
	}

	.glass-tooltip {
		background: linear-gradient(
			135deg,
			rgba(15, 23, 42, 0.9) 0%,
			rgba(15, 23, 42, 0.8) 100%
		);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow:
			0 16px 48px rgba(0, 0, 0, 0.5),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
		color: #f8fafc;
	}

	:global(.mapboxgl-ctrl-group) {
		background: linear-gradient(
			135deg,
			rgba(15, 23, 42, 0.8) 0%,
			rgba(15, 23, 42, 0.6) 100%
		) !important;
		backdrop-filter: blur(12px) saturate(180%) !important;
		-webkit-backdrop-filter: blur(12px) saturate(180%) !important;
		border: 1px solid rgba(255, 255, 255, 0.1) !important;
		border-radius: 8px !important;
	}

	:global(.mapboxgl-ctrl-group button) {
		background-color: transparent !important;
	}

	:global(.mapboxgl-ctrl-group button span) {
		filter: invert(1);
	}

	:global(.mapboxgl-ctrl-group button:hover) {
		background-color: rgba(255, 255, 255, 0.1) !important;
	}

	/* Let Mapbox handle canvas sizing - don't override */

	@keyframes marker-pulse {
		0% {
			transform: scale(1);
			opacity: 0.5;
		}
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}

	:global(.city-gateway-marker .pulse-ring) {
		animation: marker-pulse 2.5s ease-out infinite;
	}
</style>
