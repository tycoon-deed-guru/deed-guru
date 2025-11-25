<script lang="ts">
	import { TrendingUp, TrendingDown, Minus, Shield, Target } from 'lucide-svelte';
	import { getBloomStatus, type BloomStatusInfo } from '$lib/types/petal-chart.types';

	interface Props {
		totalScore: number; // 0-64 raw score
		confidence?: number; // 0-1
		completeness?: number; // 0-1
		trend?: 'up' | 'down' | 'stable';
		compact?: boolean;
	}

	let {
		totalScore,
		confidence = 0.85,
		completeness = 0.8,
		trend = 'stable',
		compact = false
	}: Props = $props();

	const bloomStatus: BloomStatusInfo = $derived(getBloomStatus(totalScore));
	const normalizedScore = $derived(Math.round((totalScore / 64) * 100));

	function getTrendIcon(t: 'up' | 'down' | 'stable') {
		switch (t) {
			case 'up':
				return TrendingUp;
			case 'down':
				return TrendingDown;
			default:
				return Minus;
		}
	}

	function getTrendLabel(t: 'up' | 'down' | 'stable'): string {
		switch (t) {
			case 'up':
				return 'Improving';
			case 'down':
				return 'Declining';
			default:
				return 'Stable';
		}
	}

	function getTrendColor(t: 'up' | 'down' | 'stable'): string {
		switch (t) {
			case 'up':
				return 'var(--primary, #c8ab37)'; // Gold for positive
			case 'down':
				return '#a8a080'; // Muted warm for negative
			default:
				return 'var(--muted-foreground, #6b7060)';
		}
	}
</script>

{#if compact}
	<div class="bloom-card-compact">
		<div class="score-circle" style:background-color={bloomStatus.color}>
			<span class="score-emoji">{bloomStatus.emoji}</span>
			<span class="score-value">{totalScore}</span>
			<span class="score-max">/64</span>
		</div>
		<div class="score-info">
			<span class="status-label" style:color={bloomStatus.color}>{bloomStatus.label}</span>
			<span class="normalized-score">{normalizedScore}%</span>
		</div>
	</div>
{:else}
	<div class="bloom-card">
		<div class="card-header">
			<div class="bloom-badge" style:background-color={bloomStatus.color}>
				<span class="bloom-emoji">{bloomStatus.emoji}</span>
				<span class="bloom-label">{bloomStatus.label}</span>
			</div>
			<div class="trend-badge" style:color={getTrendColor(trend)}>
				{#if trend === 'up'}
					<TrendingUp class="h-4 w-4" />
				{:else if trend === 'down'}
					<TrendingDown class="h-4 w-4" />
				{:else}
					<Minus class="h-4 w-4" />
				{/if}
				<span>{getTrendLabel(trend)}</span>
			</div>
		</div>

		<div class="score-section">
			<div class="main-score">
				<span class="score-number">{totalScore}</span>
				<span class="score-denominator">/64</span>
			</div>
			<div class="normalized-badge">
				<span class="normalized-value">{normalizedScore}%</span>
				<span class="normalized-label">Bloom Score</span>
			</div>
		</div>

		<div class="metrics-row">
			<div class="metric">
				<Shield class="h-4 w-4 text-muted-foreground" />
				<div class="metric-info">
					<span class="metric-label">Confidence</span>
					<div class="metric-bar">
						<div class="metric-fill" style:width="{confidence * 100}%"></div>
					</div>
					<span class="metric-value">{Math.round(confidence * 100)}%</span>
				</div>
			</div>
			<div class="metric">
				<Target class="h-4 w-4 text-muted-foreground" />
				<div class="metric-info">
					<span class="metric-label">Data Complete</span>
					<div class="metric-bar">
						<div class="metric-fill completeness" style:width="{completeness * 100}%"></div>
					</div>
					<span class="metric-value">{Math.round(completeness * 100)}%</span>
				</div>
			</div>
		</div>

		<div class="score-breakdown">
			<div class="breakdown-row">
				<span class="breakdown-label">Quality Crown</span>
				<span class="breakdown-hint">Location + Condition + Tenancy</span>
			</div>
			<div class="breakdown-row">
				<span class="breakdown-label">Risk Balance</span>
				<span class="breakdown-hint">Liquidity + Compliance</span>
			</div>
			<div class="breakdown-row">
				<span class="breakdown-label">Returns</span>
				<span class="breakdown-hint">Cashflow + Appreciation + Financing</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.bloom-card {
		padding: 1.25rem;
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.bloom-card-compact {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bloom-badge {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		border-radius: 9999px;
		color: white;
		font-weight: 600;
		font-size: 0.8125rem;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.bloom-emoji {
		font-size: 1rem;
	}

	.trend-badge {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.score-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.main-score {
		display: flex;
		align-items: baseline;
	}

	.score-number {
		font-size: 3rem;
		font-weight: 800;
		line-height: 1;
		color: var(--foreground);
	}

	.score-denominator {
		font-size: 1.25rem;
		font-weight: 500;
		color: var(--muted-foreground);
		margin-left: 0.25rem;
	}

	.normalized-badge {
		text-align: right;
	}

	.normalized-value {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--primary);
	}

	.normalized-label {
		font-size: 0.6875rem;
		color: var(--muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.metrics-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.metric {
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.metric-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.metric-label {
		font-size: 0.6875rem;
		color: var(--muted-foreground);
	}

	.metric-bar {
		height: 4px;
		background: var(--muted);
		border-radius: 2px;
		overflow: hidden;
	}

	.metric-fill {
		height: 100%;
		background: var(--primary);
		border-radius: 2px;
	}

	.metric-fill.completeness {
		background: #d4c78a; /* Light gold - no green */
	}

	.metric-value {
		font-size: 0.75rem;
		font-weight: 600;
	}

	.score-breakdown {
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.breakdown-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.6875rem;
	}

	.breakdown-label {
		font-weight: 600;
		color: var(--foreground);
	}

	.breakdown-hint {
		color: var(--muted-foreground);
	}

	/* Compact styles */
	.score-circle {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.score-circle .score-emoji {
		font-size: 0.875rem;
		line-height: 1;
	}

	.score-circle .score-value {
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1;
	}

	.score-circle .score-max {
		font-size: 0.5rem;
		opacity: 0.8;
	}

	.score-info {
		display: flex;
		flex-direction: column;
	}

	.status-label {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.score-info .normalized-score {
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}
</style>
