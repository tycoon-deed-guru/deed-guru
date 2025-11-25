<script lang="ts">
	import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-svelte';

	export interface ScoreHistoryEntry {
		date: Date;
		score: number; // 0-64 bloom score
		notes?: string;
	}

	interface Props {
		history: ScoreHistoryEntry[];
		height?: number;
	}

	let { history, height = 120 }: Props = $props();

	// Sort by date ascending
	const sortedHistory = $derived(
		[...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
	);

	// Calculate chart dimensions
	const padding = { top: 10, right: 10, bottom: 25, left: 35 };
	const chartWidth = 280;
	const chartHeight = height;
	const innerWidth = chartWidth - padding.left - padding.right;
	const innerHeight = chartHeight - padding.top - padding.bottom;

	// Scale functions
	function xScale(index: number): number {
		if (sortedHistory.length <= 1) return padding.left + innerWidth / 2;
		return padding.left + (index / (sortedHistory.length - 1)) * innerWidth;
	}

	function yScale(score: number): number {
		return padding.top + innerHeight - (score / 64) * innerHeight;
	}

	// Generate path for line chart
	const linePath = $derived(() => {
		if (sortedHistory.length === 0) return '';
		const points = sortedHistory.map((entry, i) => `${xScale(i)},${yScale(entry.score)}`);
		return `M${points.join(' L')}`;
	});

	// Generate area path (for gradient fill)
	const areaPath = $derived(() => {
		if (sortedHistory.length === 0) return '';
		const baseline = yScale(0);
		const points = sortedHistory.map((entry, i) => `${xScale(i)},${yScale(entry.score)}`);
		return `M${padding.left},${baseline} L${points.join(' L')} L${xScale(sortedHistory.length - 1)},${baseline} Z`;
	});

	// Calculate trend
	const trend = $derived(() => {
		if (sortedHistory.length < 2) return 'stable';
		const first = sortedHistory[0].score;
		const last = sortedHistory[sortedHistory.length - 1].score;
		const diff = last - first;
		if (diff >= 2) return 'up';
		if (diff <= -2) return 'down';
		return 'stable';
	});

	const trendDiff = $derived(() => {
		if (sortedHistory.length < 2) return 0;
		return sortedHistory[sortedHistory.length - 1].score - sortedHistory[0].score;
	});

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function getTrendIcon(t: string) {
		switch (t) {
			case 'up':
				return TrendingUp;
			case 'down':
				return TrendingDown;
			default:
				return Minus;
		}
	}

	function getTrendColor(t: string): string {
		switch (t) {
			case 'up':
				return '#22c55e';
			case 'down':
				return '#ef4444';
			default:
				return '#71717a';
		}
	}
</script>

<div class="history-chart">
	<div class="chart-header">
		<div class="header-left">
			<Calendar class="h-4 w-4 text-muted-foreground" />
			<span class="header-title">Score History</span>
		</div>
		<div class="trend-indicator" style:color={getTrendColor(trend())}>
			{#if trend() === 'up'}
				<TrendingUp class="h-4 w-4" />
			{:else if trend() === 'down'}
				<TrendingDown class="h-4 w-4" />
			{:else}
				<Minus class="h-4 w-4" />
			{/if}
			<span>
				{#if trendDiff() > 0}+{/if}{trendDiff().toFixed(1)}
			</span>
		</div>
	</div>

	{#if sortedHistory.length === 0}
		<div class="empty-state">
			<p>No history yet</p>
			<span>Scores will be tracked over time</span>
		</div>
	{:else}
		<svg width="100%" viewBox="0 0 {chartWidth} {chartHeight}" class="chart-svg">
			<defs>
				<linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3" />
					<stop offset="100%" stop-color="var(--primary)" stop-opacity="0" />
				</linearGradient>
			</defs>

			<!-- Y-axis labels -->
			<text x={padding.left - 5} y={yScale(64)} class="axis-label" text-anchor="end">64</text>
			<text x={padding.left - 5} y={yScale(32)} class="axis-label" text-anchor="end">32</text>
			<text x={padding.left - 5} y={yScale(0)} class="axis-label" text-anchor="end">0</text>

			<!-- Grid lines -->
			<line
				x1={padding.left}
				y1={yScale(64)}
				x2={chartWidth - padding.right}
				y2={yScale(64)}
				class="grid-line"
			/>
			<line
				x1={padding.left}
				y1={yScale(32)}
				x2={chartWidth - padding.right}
				y2={yScale(32)}
				class="grid-line"
			/>
			<line
				x1={padding.left}
				y1={yScale(0)}
				x2={chartWidth - padding.right}
				y2={yScale(0)}
				class="grid-line"
			/>

			<!-- Area fill -->
			<path d={areaPath()} fill="url(#areaGradient)" />

			<!-- Line -->
			<path d={linePath()} class="chart-line" fill="none" />

			<!-- Data points -->
			{#each sortedHistory as entry, i}
				<circle cx={xScale(i)} cy={yScale(entry.score)} r="4" class="data-point" />
				{#if i === 0 || i === sortedHistory.length - 1}
					<text x={xScale(i)} y={chartHeight - 5} class="date-label" text-anchor="middle">
						{formatDate(entry.date)}
					</text>
				{/if}
			{/each}
		</svg>

		<div class="chart-footer">
			<span class="footer-stat">
				<strong>{sortedHistory.length}</strong> recordings
			</span>
			<span class="footer-stat">
				Avg: <strong>{(sortedHistory.reduce((s, e) => s + e.score, 0) / sortedHistory.length).toFixed(1)}</strong>
			</span>
		</div>
	{/if}
</div>

<style>
	.history-chart {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.header-title {
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--foreground);
	}

	.trend-indicator {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.chart-svg {
		width: 100%;
		max-width: 280px;
	}

	.axis-label {
		font-size: 10px;
		fill: var(--muted-foreground);
		dominant-baseline: middle;
	}

	.date-label {
		font-size: 9px;
		fill: var(--muted-foreground);
	}

	.grid-line {
		stroke: var(--border);
		stroke-width: 1;
		stroke-dasharray: 2, 2;
	}

	.chart-line {
		stroke: var(--primary);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.data-point {
		fill: var(--primary);
		stroke: var(--background);
		stroke-width: 2;
	}

	.chart-footer {
		display: flex;
		justify-content: space-between;
		font-size: 0.6875rem;
		color: var(--muted-foreground);
	}

	.footer-stat strong {
		color: var(--foreground);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100px;
		text-align: center;
		color: var(--muted-foreground);
	}

	.empty-state p {
		margin: 0;
		font-weight: 500;
		font-size: 0.875rem;
	}

	.empty-state span {
		font-size: 0.75rem;
	}
</style>
