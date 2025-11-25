<script lang="ts">
	import { CheckCircle2, CircleAlert, Lightbulb, TrendingDown } from 'lucide-svelte';
	import type { PetalCategory, PetalDataPoint } from '$lib/types/petal-chart.types';
	import { PETAL_LABELS } from '$lib/types/petal-chart.types';
	import { PETAL_DIMENSIONS } from '$lib/types/scoring.types';

	interface Props {
		petals: PetalDataPoint[];
		maxInsights?: number;
	}

	let { petals, maxInsights = 6 }: Props = $props();

	interface Insight {
		type: 'strength' | 'weakness' | 'opportunity' | 'risk';
		category: PetalCategory;
		title: string;
		description: string;
		score: number;
		priority: number; // 1-3, higher = more important
	}

	// Generate insights from petal scores
	const insights = $derived(() => {
		const results: Insight[] = [];

		// Sort petals by score
		const sorted = [...petals].sort((a, b) => b.score - a.score);

		// Top 2 strengths (score >= 6)
		const strengths = sorted.filter((p) => p.score >= 6).slice(0, 2);
		for (const p of strengths) {
			const cat = p.category ?? (p.id as PetalCategory);
			results.push({
				type: 'strength',
				category: cat,
				title: `Strong ${PETAL_LABELS[cat]}`,
				description: `${PETAL_LABELS[cat]} scores ${p.score}/8, indicating ${getStrengthDescription(cat)}`,
				score: p.score,
				priority: p.score >= 7 ? 3 : 2
			});
		}

		// Bottom 2 weaknesses (score <= 4)
		const weaknesses = sorted.filter((p) => p.score <= 4).slice(-2).reverse();
		for (const p of weaknesses) {
			const cat = p.category ?? (p.id as PetalCategory);
			results.push({
				type: 'weakness',
				category: cat,
				title: `Improve ${PETAL_LABELS[cat]}`,
				description: `${PETAL_LABELS[cat]} at ${p.score}/8 needs attention. ${getWeaknessDescription(cat)}`,
				score: p.score,
				priority: p.score <= 2 ? 3 : 2
			});
		}

		// Look for opportunities (mid-score petals in asset dimension)
		const opportunities = petals.filter((p) => {
			const cat = p.category ?? (p.id as PetalCategory);
			return p.score >= 4 && p.score <= 6 && PETAL_DIMENSIONS[cat] === 'asset';
		});
		if (opportunities.length > 0) {
			const p = opportunities[0];
			const cat = p.category ?? (p.id as PetalCategory);
			results.push({
				type: 'opportunity',
				category: cat,
				title: `Value-Add Potential`,
				description: `${PETAL_LABELS[cat]} at ${p.score}/8 could be improved through strategic investment.`,
				score: p.score,
				priority: 2
			});
		}

		// Look for risks (low scores in risk dimension)
		const risks = petals.filter((p) => {
			const cat = p.category ?? (p.id as PetalCategory);
			return p.score <= 4 && PETAL_DIMENSIONS[cat] === 'risk';
		});
		if (risks.length > 0) {
			const p = risks[0];
			const cat = p.category ?? (p.id as PetalCategory);
			results.push({
				type: 'risk',
				category: cat,
				title: `${PETAL_LABELS[cat]} Risk`,
				description: `Low ${PETAL_LABELS[cat].toLowerCase()} score (${p.score}/8) may affect exit options.`,
				score: p.score,
				priority: 3
			});
		}

		// Sort by priority and limit
		return results.sort((a, b) => b.priority - a.priority).slice(0, maxInsights);
	});

	function getStrengthDescription(cat: PetalCategory): string {
		const descriptions: Record<PetalCategory, string> = {
			location: 'excellent fundamentals and market positioning',
			tenancy: 'strong tenant base and lease stability',
			compliance: 'clean regulatory standing and low risk',
			cashflow: 'solid income generation and returns',
			appreciation: 'strong growth trajectory and market momentum',
			financing: 'favorable debt structure and terms',
			liquidity: 'easy exit options and active buyer market',
			condition: 'well-maintained property with low capex needs'
		};
		return descriptions[cat];
	}

	function getWeaknessDescription(cat: PetalCategory): string {
		const descriptions: Record<PetalCategory, string> = {
			location: 'Consider location-based value drivers and accessibility improvements.',
			tenancy: 'Focus on tenant retention programs and lease optimization.',
			compliance: 'Address outstanding permits, zoning issues, or environmental concerns.',
			cashflow: 'Analyze expense reduction opportunities and rent optimization.',
			appreciation: 'Evaluate market timing and value-add strategies.',
			financing: 'Explore refinancing options or debt restructuring.',
			liquidity: 'Consider property improvements to broaden buyer appeal.',
			condition: 'Prioritize deferred maintenance and capital improvements.'
		};
		return descriptions[cat];
	}

	// Score-based colors matching petal chart progression
	// Gold (7-8 mature) → Ivory (5-6 developing) → Muted (3-4 early) → Gray-green (0-2 budding)
	function getScoreColor(score: number): string {
		if (score >= 7) return 'var(--primary, #c8ab37)'; // Gold - mature
		if (score >= 5) return '#d4c78a'; // Light gold/ivory - developing
		if (score >= 3) return '#a8a080'; // Muted warm - early
		return '#6b7060'; // Muted gray-green - budding
	}
</script>

<div class="auto-insights">
	<div class="insights-header">
		<Lightbulb class="h-4 w-4 text-primary" />
		<span class="header-title">Auto Insights</span>
		<span class="insight-count">{insights().length} findings</span>
	</div>

	<div class="insights-list">
		{#each insights() as insight}
			<div class="insight-card" style:border-left-color={getScoreColor(insight.score)}>
				<div class="insight-icon" style:color={getScoreColor(insight.score)}>
					{#if insight.type === 'strength'}
						<CheckCircle2 class="h-5 w-5" />
					{:else if insight.type === 'weakness'}
						<TrendingDown class="h-5 w-5" />
					{:else if insight.type === 'opportunity'}
						<Lightbulb class="h-5 w-5" />
					{:else}
						<CircleAlert class="h-5 w-5" />
					{/if}
				</div>
				<div class="insight-content">
					<div class="insight-title-row">
						<span class="insight-title">{insight.title}</span>
						<span class="insight-score" style:color={getScoreColor(insight.score)}>
							{insight.score}/8
						</span>
					</div>
					<p class="insight-description">{insight.description}</p>
				</div>
			</div>
		{/each}

		{#if insights().length === 0}
			<div class="no-insights">
				<CheckCircle2 class="h-8 w-8 text-muted-foreground" />
				<p>No significant findings. Scores are balanced.</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.auto-insights {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.insights-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.header-title {
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--foreground);
	}

	.insight-count {
		margin-left: auto;
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}

	.insights-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.insight-card {
		display: flex;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--card);
		border: 1px solid var(--border);
		border-left: 3px solid var(--primary, #c8ab37); /* Default, overridden by inline style */
		border-radius: 0.5rem;
		transition: border-color 0.2s;
	}

	.insight-card:hover {
		border-color: var(--ring);
		border-left-color: inherit; /* Preserve the score-based left border on hover */
	}

	.insight-icon {
		flex-shrink: 0;
		padding-top: 0.125rem;
	}

	.insight-content {
		flex: 1;
		min-width: 0;
	}

	.insight-title-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.insight-title {
		font-weight: 600;
		font-size: 0.8125rem;
		color: var(--foreground);
	}

	.insight-score {
		font-weight: 700;
		font-size: 0.75rem;
	}

	.insight-description {
		margin: 0.25rem 0 0;
		font-size: 0.75rem;
		color: var(--muted-foreground);
		line-height: 1.4;
	}

	.no-insights {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 2rem;
		text-align: center;
	}

	.no-insights p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--muted-foreground);
	}
</style>
