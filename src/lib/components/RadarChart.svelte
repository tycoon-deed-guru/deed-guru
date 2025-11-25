<script lang="ts">
	import { scaleLinear } from 'd3-scale';

	export let properties: { name: string; scores: number[] }[] = [];

	const axes = [
		"Market", "Rent Growth", "CoC", "IRR", "Value-Add",
		"Scale", "DSCR", "Location", "Exit Cap", "Resilience"
	];

	// Colors ordered: golden (mature/developed) -> green (less developed)
	const colors = ["#c8ab37", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981"];

	const width = 600;
	const height = 600;
	const centerX = width / 2;
	const centerY = height / 2;
	const maxRadius = Math.min(width, height) / 2 - 80;
	const numAxes = axes.length;

	// Create scale for radius
	const radiusScale = scaleLinear().domain([0, 10]).range([0, maxRadius]);

	// Calculate polygon points for each property
	function getPolygonPoints(scores: number[]): string {
		return scores
			.map((score, i) => {
				const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
				const radius = radiusScale(score);
				const x = centerX + radius * Math.cos(angle);
				const y = centerY + radius * Math.sin(angle);
				return `${x},${y}`;
			})
			.join(' ');
	}

	// Calculate axis line endpoints
	function getAxisLine(index: number) {
		const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
		const x = centerX + maxRadius * Math.cos(angle);
		const y = centerY + maxRadius * Math.sin(angle);
		return { x, y };
	}

	// Calculate label position
	function getLabelPosition(index: number) {
		const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
		const labelRadius = maxRadius + 30;
		const x = centerX + labelRadius * Math.cos(angle);
		const y = centerY + labelRadius * Math.sin(angle);
		return { x, y };
	}

	// Grid circles
	const gridLevels = [2, 4, 6, 8, 10];
</script>

<div class="w-full flex flex-col items-center">
	<svg {width} {height} class="mx-auto">
		<!-- Grid circles -->
		{#each gridLevels as level}
			<circle
				cx={centerX}
				cy={centerY}
				r={radiusScale(level)}
				fill="none"
				stroke="#e5e7eb"
				stroke-width="1"
			/>
			<text
				x={centerX + 5}
				y={centerY - radiusScale(level) + 5}
				class="text-xs fill-gray-400"
			>
				{level}
			</text>
		{/each}

		<!-- Axis lines -->
		{#each axes as axis, i}
			{@const line = getAxisLine(i)}
			<line
				x1={centerX}
				y1={centerY}
				x2={line.x}
				y2={line.y}
				stroke="#d1d5db"
				stroke-width="1"
			/>
		{/each}

		<!-- Data polygons -->
		{#each properties as prop, propIndex}
			<polygon
				points={getPolygonPoints(prop.scores)}
				fill={colors[propIndex % colors.length]}
				fill-opacity="0.25"
				stroke={colors[propIndex % colors.length]}
				stroke-width="2"
			/>
		{/each}

		<!-- Axis labels -->
		{#each axes as axis, i}
			{@const pos = getLabelPosition(i)}
			<text
				x={pos.x}
				y={pos.y}
				text-anchor="middle"
				dominant-baseline="middle"
				class="text-sm font-medium fill-gray-700"
			>
				{axis}
			</text>
		{/each}
	</svg>

	<!-- Legend -->
	{#if properties.length > 0}
		<div class="flex gap-4 mt-4 flex-wrap justify-center">
			{#each properties as prop, i}
				<div class="flex items-center gap-2">
					<div
						class="w-4 h-4 rounded"
						style="background-color: {colors[i % colors.length]}"
					></div>
					<span class="text-sm">{prop.name}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
