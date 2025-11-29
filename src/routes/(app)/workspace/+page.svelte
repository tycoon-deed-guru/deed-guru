<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import * as Select from "$lib/components/ui/select";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import PlugIcon from "@tabler/icons-svelte/icons/plug";
	import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";
	import BrainIcon from "@tabler/icons-svelte/icons/brain";
	import ChartRadarIcon from "@tabler/icons-svelte/icons/chart-radar";
	import RefreshIcon from "@tabler/icons-svelte/icons/refresh";
	import CheckCircleIcon from "@tabler/icons-svelte/icons/circle-check";
	import FileTextIcon from "@tabler/icons-svelte/icons/file-text";
	import UploadIcon from "@tabler/icons-svelte/icons/upload";
	import SaveIcon from "@tabler/icons-svelte/icons/device-floppy";
	import SparklesIcon from "@tabler/icons-svelte/icons/sparkles";
	import SendIcon from "@tabler/icons-svelte/icons/send";
	import TerminalIcon from "@tabler/icons-svelte/icons/terminal";
	import ChevronUpIcon from "@tabler/icons-svelte/icons/chevron-up";
	import ChevronDownIcon from "@tabler/icons-svelte/icons/chevron-down";
	import XIcon from "@tabler/icons-svelte/icons/x";
	import LightbulbIcon from "@tabler/icons-svelte/icons/bulb";
	import { goto } from "$app/navigation";
	import type { PageData } from './$types';

	// Import Guardian-grade scoring components
	import { PetalChart, BloomStatus } from '$lib/components/petal-chart';
	import PetalDetailModal from '$lib/components/petal-chart/PetalDetailModal.svelte';
	import type { PetalDataPoint, PetalCategory } from '$lib/types/petal-chart.types';
	import { PETAL_ORDER, PETAL_LABELS } from '$lib/types/petal-chart.types';
	import {
		PETAL_DIMENSIONS,
		PETAL_SUB_CRITERIA,
		calculatePetalScore,
		createPetalScoringFromRaw,
		generateInsights,
		getScoreInterpretation,
		WEIGHTING_PROFILES,
		type PetalScoring,
		type PetalDimension,
		type WeightingProfileType
	} from '$lib/types/scoring.types';
	import { calculateBloomScore, calculateBloomPercentage, getGradeFromBloomScore } from '$lib/utils/petal-chart.utils';

	// Page data from server
	let { data }: { data: PageData } = $props();

	// State from database
	let selectedProperty = $state(data.property.id);
	let selectedAnalysisType = $state(data.workspaceSession.selectedAnalysisType || "petal");
	let chatInput = $state("");
	let terminalOpen = $state(data.workspaceSession.terminalOpen ?? true);
	let terminalHeight = $state(250);
	let selectedPetal = $state<PetalCategory | null>(null);
	let modalOpen = $state(false);
	let selectedWeightingProfile = $state<WeightingProfileType>("equal");

	let chatMessages = $state<Array<{ role: "user" | "assistant"; content: string }>>([
		{
			role: "assistant",
			content: "Hi! I'm your AI copilot. Ask me about this property's 8-petal Bloom Score, run scenarios, or get recommendations."
		}
	]);

	// Underwriting assumptions (editable)
	let underwritingAssumptions = $state({
		purchasePrice: 48500000,
		downPaymentPercent: 25,
		interestRate: 5.2,
		loanTerm: 30,
		rentGrowth: 5.0,
		expenseGrowth: 3.0,
		exitCapRate: 5.5,
		holdPeriod: 5,
	});

	// Mock data sources
	const dataSources = [
		{
			id: "mls",
			name: "MLS/RESO",
			status: "connected",
			lastSync: "1h ago",
			stats: "1,247 listings",
		},
		{
			id: "yardi",
			name: "Yardi Voyager",
			status: "connected",
			lastSync: "5m ago",
			stats: "5 properties",
		},
	];

	const uploadedDocuments = [
		{ name: "Austin_Tech_Towers_OM.pdf", date: "Nov 18", size: "2.4 MB" },
		{ name: "Orlando_Rent_Roll.xlsx", date: "Nov 17", size: "845 KB" },
	];

	// Guardian-grade 8-Petal scoring data (editable sub-criteria raw values)
	let subCriteriaValues = $state<Record<PetalCategory, Record<string, number | boolean>>>({
		cashflow: {
			'noi-yield': 6.8,
			'cash-on-cash': 7.2,
			'occupancy-rate': 94,
			'expense-ratio': 38,
			'rent-collection': 97,
			'break-even-ratio': 72
		},
		appreciation: {
			'market-price-growth': 6.5,
			'supply-pipeline': 0.7,
			'population-job-growth': 3.8,
			'forced-appreciation': 22,
			'rent-growth-trend': 5.5
		},
		financing: {
			'dscr': 1.52,
			'ltv': 58,
			'interest-rate-spread': -0.2,
			'prepayment-flexibility': 7,
			'maturity-profile': 8
		},
		location: {
			'walk-transit-score': 85,
			'economic-drivers': 8,
			'school-quality': 7,
			'crime-index': 65,
			'submarket-performance': 8,
			'zoning-upside': 6
		},
		condition: {
			'effective-age': 8,
			'building-class': 7,
			'recent-capex': 12000,
			'deferred-maintenance': 4,
			'systems-condition': 15
		},
		tenancy: {
			'tenant-credit': 75,
			'walt': 5.2,
			'rollover-risk': 18,
			'rent-vs-market': 98,
			'tenant-diversity': 22
		},
		liquidity: {
			'asset-class-liquidity': 8,
			'transaction-velocity': 7,
			'buyer-pool-depth': 8,
			'tokenized-secondary': 6,
			'hold-period-flexibility': 8
		},
		compliance: {
			'title-survey': true,
			'environmental': true,
			'zoning-permits': true,
			'insurance-coverage': true,
			'guardian-verification': 8
		}
	});

	// Calculate petal scores from sub-criteria values
	const petalScorings = $derived<PetalScoring[]>(
		PETAL_ORDER.map(category => createPetalScoringFromRaw(
			category,
			subCriteriaValues[category],
			{
				notes: '',
				trend: category === 'appreciation' ? 'up' : category === 'condition' ? 'down' : 'stable',
				confidence: 0.92
			}
		))
	);

	// Convert to PetalDataPoint for chart
	const petalData = $derived<PetalDataPoint[]>(
		petalScorings.map(scoring => {
			const avgScore = scoring.subCriteria.reduce((sum, c) => sum + c.score * c.weight, 0);
			return {
				id: scoring.category,
				label: scoring.label,
				score: avgScore,
				confidence: scoring.confidence,
				completeness: 1.0,
				trend: scoring.trend,
				category: scoring.category,
				description: scoring.notes
			};
		})
	);

	// Calculate totals
	const bloomScore = $derived(calculateBloomScore(petalData));
	const bloomPercentage = $derived(calculateBloomPercentage(petalData));
	const grade = $derived(getGradeFromBloomScore(bloomScore));

	// Calculate dimension scores
	const dimensionScores = $derived.by(() => {
		const dimensions: Record<PetalDimension, { sum: number; count: number }> = {
			returns: { sum: 0, count: 0 },
			asset: { sum: 0, count: 0 },
			risk: { sum: 0, count: 0 }
		};
		for (const petal of petalData) {
			if (petal.category) {
				const dimension = PETAL_DIMENSIONS[petal.category];
				dimensions[dimension].sum += petal.score;
				dimensions[dimension].count += 1;
			}
		}
		return {
			returns: dimensions.returns.count > 0 ? dimensions.returns.sum / dimensions.returns.count : 0,
			asset: dimensions.asset.count > 0 ? dimensions.asset.sum / dimensions.asset.count : 0,
			risk: dimensions.risk.count > 0 ? dimensions.risk.sum / dimensions.risk.count : 0
		} as Record<PetalDimension, number>;
	});

	// Generate AI insights
	const insights = $derived(generateInsights(petalScorings));

	const dimensionInfo: Record<PetalDimension, { label: string; icon: string; color: string }> = {
		returns: { label: 'Returns', icon: '💰', color: 'text-emerald-600' },
		asset: { label: 'Asset Quality', icon: '🏢', color: 'text-blue-600' },
		risk: { label: 'Risk Profile', icon: '🛡️', color: 'text-amber-600' }
	};

	function togglePetal(category: PetalCategory) {
		selectedPetal = category;
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
	}

	function navigateToPetal(category: PetalCategory) {
		selectedPetal = category;
	}

	function getPetalScoring(category: PetalCategory): PetalScoring | undefined {
		return petalScorings.find(p => p.category === category);
	}

	function getPetalData(category: PetalCategory): PetalDataPoint | undefined {
		return petalData.find(p => p.category === category);
	}

	// Underwriting calculations
	const underwritingCalcs = $derived(() => {
		const { purchasePrice, downPaymentPercent, interestRate, loanTerm, rentGrowth, expenseGrowth, exitCapRate, holdPeriod } = underwritingAssumptions;

		const downPayment = purchasePrice * (downPaymentPercent / 100);
		const loanAmount = purchasePrice - downPayment;
		const monthlyRate = interestRate / 100 / 12;
		const numPayments = loanTerm * 12;
		const monthlyDebtService = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
		const annualDebtService = monthlyDebtService * 12;

		const baseNOI = 3200000;
		const baseRevenue = 4800000;
		const baseExpenses = 1600000;

		const years = [];
		let cumulativeCashFlow = 0;

		for (let year = 1; year <= holdPeriod; year++) {
			const growthFactor = Math.pow(1 + rentGrowth / 100, year - 1);
			const expenseGrowthFactor = Math.pow(1 + expenseGrowth / 100, year - 1);

			const revenue = baseRevenue * growthFactor;
			const expenses = baseExpenses * expenseGrowthFactor;
			const noi = revenue - expenses;
			const cashFlow = noi - annualDebtService;
			cumulativeCashFlow += cashFlow;

			const coc = (cashFlow / downPayment) * 100;

			years.push({
				year,
				revenue: Math.round(revenue),
				expenses: Math.round(expenses),
				noi: Math.round(noi),
				debtService: Math.round(annualDebtService),
				cashFlow: Math.round(cashFlow),
				coc: coc.toFixed(1),
			});
		}

		const exitYear = years[holdPeriod - 1];
		const exitValue = exitYear.noi / (exitCapRate / 100);
		const loanBalance = loanAmount * 0.88;
		const saleProceeds = exitValue - loanBalance;
		const totalReturn = saleProceeds + cumulativeCashFlow - downPayment;
		const equityMultiple = (saleProceeds + cumulativeCashFlow) / downPayment;
		const irr = ((Math.pow(equityMultiple, 1 / holdPeriod) - 1) * 100);

		return {
			downPayment,
			loanAmount,
			annualDebtService,
			years,
			exitValue,
			saleProceeds,
			totalReturn,
			equityMultiple,
			irr,
			year1CoC: parseFloat(years[0].coc),
		};
	});

	function formatCurrency(value: number): string {
		if (value >= 1000000) {
			return "$" + (value / 1000000).toFixed(1) + "M";
		}
		return "$" + value.toLocaleString();
	}

	function handleSendMessage() {
		if (!chatInput.trim()) return;

		chatMessages.push({
			role: "user",
			content: chatInput,
		});

		// Simulate AI response with Guardian-grade petal scoring awareness
		setTimeout(() => {
			const query = chatInput.toLowerCase();
			const dims = dimensionScores;

			if (query.includes("score") || query.includes("why") || query.includes("bloom")) {
				const topPetal = [...petalData].sort((a, b) => b.score - a.score)[0];
				const weakPetal = [...petalData].sort((a, b) => a.score - b.score)[0];
				chatMessages.push({
					role: "assistant",
					content: `Austin Tech Towers has a Bloom Score of ${bloomScore}/64 (${bloomPercentage}%, ${grade}). Strongest petal: ${topPetal.label} (${topPetal.score.toFixed(1)}/8). Area for improvement: ${weakPetal.label} (${weakPetal.score.toFixed(1)}/8). The 3 dimensions score: Returns ${dims.returns.toFixed(1)}/8, Asset ${dims.asset.toFixed(1)}/8, Risk ${dims.risk.toFixed(1)}/8.`
				});
			} else if (query.includes("cashflow") || query.includes("cash flow") || query.includes("noi")) {
				const cashflowPetal = getPetalScoring('cashflow');
				const subScoreStr = cashflowPetal?.subCriteria.map(c => `${c.label}: ${c.score.toFixed(1)}/8`).join(', ') || '';
				chatMessages.push({
					role: "assistant",
					content: `Cashflow scores ${getPetalData('cashflow')?.score.toFixed(1)}/8. Sub-criteria breakdown: ${subScoreStr}. NOI yield is strong at 6.8%, and occupancy at 94% supports stable cash flow.`
				});
			} else if (query.includes("rent growth") || query.includes("appreciation")) {
				chatMessages.push({
					role: "assistant",
					content: `With 3% rent growth instead of 5%, the appreciation petal would drop from ${getPetalData('appreciation')?.score.toFixed(1)}/8 to approximately 5.8/8. Year 5 NOI would fall to $3.8M and IRR decreases to 16.1%. Still exceeds 15% target.`
				});
			} else if (query.includes("dimension") || query.includes("returns") || query.includes("asset") || query.includes("risk")) {
				chatMessages.push({
					role: "assistant",
					content: `The 3 dimensions break down as: Returns (Cashflow + Appreciation + Financing) averages ${dims.returns.toFixed(1)}/8. Asset Quality (Location + Condition + Tenancy) averages ${dims.asset.toFixed(1)}/8. Risk Profile (Liquidity + Compliance) averages ${dims.risk.toFixed(1)}/8.`
				});
			} else {
				chatMessages.push({
					role: "assistant",
					content: "I can analyze the 8-petal Bloom Score, explain sub-criteria, run scenarios, or provide investment recommendations. Try asking about 'bloom score', 'cashflow', 'dimensions', or 'rent growth scenarios'."
				});
			}
		}, 800);

		chatInput = "";
	}

	function toggleTerminal() {
		terminalOpen = !terminalOpen;
	}
</script>

<svelte:head>
	<title>Workspace - deed.guru</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<ChartBarIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">Workspace</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Select.Root type="single" bind:value={selectedProperty}>
				<Select.Trigger class="w-[220px]">
					Austin Tech Towers
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="austin-tech-towers">Austin Tech Towers</Select.Item>
					<Select.Item value="orlando-gardens">Orlando Gardens</Select.Item>
				</Select.Content>
			</Select.Root>
			<Button variant="outline" size="sm">
				<SaveIcon class="mr-2 size-4" />
				Save
			</Button>
		</div>
	</div>
</header>

<!-- 3-Panel Workspace -->
<div class="flex flex-1 flex-col overflow-hidden">
	<!-- Main Panels Row -->
	<div class="flex flex-1 overflow-hidden" style="height: calc(100vh - 3.5rem - {terminalOpen ? terminalHeight + 'px' : '0px'});">
		<!-- LEFT PANEL: Inputs (25%) -->
		<div class="w-1/4 border-r overflow-y-auto">
			<div class="p-4 space-y-4">
				<div>
					<h2 class="text-lg font-semibold flex items-center gap-2">
						<PlugIcon class="size-5" />
						Inputs
					</h2>
					<p class="text-sm text-muted-foreground">Data sources & assumptions</p>
				</div>

				<!-- Data Sources -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm">Connected Sources</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-2">
						{#each dataSources as source}
							<div class="flex items-center justify-between text-sm">
								<div class="flex items-center gap-2">
									<CheckCircleIcon class="size-4 text-green-600" />
									<span>{source.name}</span>
								</div>
								<Button variant="ghost" size="sm" class="h-6 px-2">
									<RefreshIcon class="size-3" />
								</Button>
							</div>
						{/each}
					</Card.Content>
				</Card.Root>

				<!-- Uploaded Documents -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm">Documents</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-2">
						{#each uploadedDocuments as doc}
							<div class="flex items-center gap-2 text-sm">
								<FileTextIcon class="size-4 text-muted-foreground" />
								<div class="flex-1 min-w-0">
									<p class="truncate text-xs">{doc.name}</p>
									<p class="text-xs text-muted-foreground">{doc.size}</p>
								</div>
							</div>
						{/each}
						<Button variant="outline" size="sm" class="w-full mt-2">
							<UploadIcon class="mr-2 size-4" />
							Upload
						</Button>
					</Card.Content>
				</Card.Root>

				<!-- Underwriting Assumptions -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm">Assumptions</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-3">
						<div>
							<Label for="purchase-price" class="text-xs">Purchase Price</Label>
							<Input
								id="purchase-price"
								type="number"
								bind:value={underwritingAssumptions.purchasePrice}
								class="h-8 text-sm mt-1"
							/>
						</div>
						<div>
							<Label for="down-payment" class="text-xs">Down Payment %</Label>
							<Input
								id="down-payment"
								type="number"
								bind:value={underwritingAssumptions.downPaymentPercent}
								class="h-8 text-sm mt-1"
							/>
						</div>
						<div>
							<Label for="interest-rate" class="text-xs">Interest Rate %</Label>
							<Input
								id="interest-rate"
								type="number"
								step="0.1"
								bind:value={underwritingAssumptions.interestRate}
								class="h-8 text-sm mt-1"
							/>
						</div>
						<div>
							<Label for="rent-growth" class="text-xs">Rent Growth %</Label>
							<Input
								id="rent-growth"
								type="number"
								step="0.1"
								bind:value={underwritingAssumptions.rentGrowth}
								class="h-8 text-sm mt-1"
							/>
						</div>
						<div>
							<Label for="exit-cap" class="text-xs">Exit Cap Rate %</Label>
							<Input
								id="exit-cap"
								type="number"
								step="0.1"
								bind:value={underwritingAssumptions.exitCapRate}
								class="h-8 text-sm mt-1"
							/>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>

		<!-- MIDDLE PANEL: Analysis (50%) -->
		<div class="flex-1 overflow-y-auto">
			<div class="p-4 space-y-4">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-lg font-semibold flex items-center gap-2">
							<ChartRadarIcon class="size-5" />
							Analysis
						</h2>
						<p class="text-sm text-muted-foreground">8-Petal Guardian-Grade Scoring</p>
					</div>
					<Select.Root type="single" bind:value={selectedAnalysisType}>
						<Select.Trigger class="w-[180px]">
							{selectedAnalysisType === "petal" ? "Bloom Score" : "Underwriting"}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="petal">Bloom Score</Select.Item>
							<Select.Item value="underwriting">Underwriting</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>

				{#if selectedAnalysisType === "petal"}
					<!-- Guardian-Grade 8-Petal Chart -->
					<Card.Root>
						<Card.Header>
							<div class="flex items-center justify-center gap-6 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
								<div class="text-center">
									<div class="text-4xl font-bold text-primary">{bloomScore}</div>
									<p class="text-xs text-muted-foreground">of 64</p>
								</div>
								<Separator orientation="vertical" class="h-12" />
								<div class="text-center">
									<div class="text-4xl font-bold text-primary">{bloomPercentage}%</div>
									<p class="text-xs text-muted-foreground">Bloom</p>
								</div>
								<Separator orientation="vertical" class="h-12" />
								<div class="text-center">
									<div class="text-4xl font-bold text-primary">{grade}</div>
									<p class="text-xs text-muted-foreground">Grade</p>
								</div>
							</div>
						</Card.Header>
						<Card.Content class="space-y-4">
							<!-- Petal Chart -->
							<div class="flex justify-center py-2">
								<PetalChart
									data={petalData}
									size={320}
									interactive={true}
									showLabels={true}
									enableGlow={true}
									onPetalClick={(petal) => togglePetal(petal.category as PetalCategory)}
								/>
							</div>

							<!-- Dimension Scores Summary -->
							<div class="grid grid-cols-3 gap-3">
								{#each (['returns', 'asset', 'risk'] as PetalDimension[]) as dimension}
									{@const info = dimensionInfo[dimension]}
									{@const score = dimensionScores[dimension]}
									<div class="p-3 rounded-lg border bg-card text-center">
										<div class="text-lg">{info.icon}</div>
										<p class="text-xs text-muted-foreground mt-1">{info.label}</p>
										<p class="text-xl font-bold {info.color}">{score.toFixed(1)}</p>
										<p class="text-xs text-muted-foreground">/8</p>
									</div>
								{/each}
							</div>

							<!-- Hint Text -->
							<div class="text-center py-4">
								<p class="text-sm text-muted-foreground">Click any petal above to see detailed sub-criteria breakdown</p>
							</div>
						</Card.Content>
					</Card.Root>

				{:else}
					<!-- Underwriting Model -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Returns Summary</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="grid grid-cols-4 gap-3">
								<div class="rounded-lg border p-3">
									<p class="text-xs text-muted-foreground">Year 1 CoC</p>
									<p class="text-lg font-bold text-primary">{underwritingCalcs().year1CoC}%</p>
								</div>
								<div class="rounded-lg border p-3">
									<p class="text-xs text-muted-foreground">5-Yr IRR</p>
									<p class="text-lg font-bold text-primary">{underwritingCalcs().irr.toFixed(1)}%</p>
								</div>
								<div class="rounded-lg border p-3">
									<p class="text-xs text-muted-foreground">Equity Multiple</p>
									<p class="text-lg font-bold text-primary">{underwritingCalcs().equityMultiple.toFixed(2)}x</p>
								</div>
								<div class="rounded-lg border p-3">
									<p class="text-xs text-muted-foreground">Exit Value</p>
									<p class="text-lg font-bold text-primary">{formatCurrency(underwritingCalcs().exitValue)}</p>
								</div>
							</div>

							<!-- 5-Year Proforma -->
							<div class="overflow-x-auto rounded-lg border">
								<table class="w-full text-sm">
									<thead class="bg-muted/50">
										<tr>
											<th class="p-2 text-left text-xs font-medium">Year</th>
											<th class="p-2 text-right text-xs font-medium">Revenue</th>
											<th class="p-2 text-right text-xs font-medium">NOI</th>
											<th class="p-2 text-right text-xs font-medium">Cash Flow</th>
											<th class="p-2 text-right text-xs font-medium">CoC %</th>
										</tr>
									</thead>
									<tbody class="divide-y">
										{#each underwritingCalcs().years as year}
											<tr class="hover:bg-muted/30">
												<td class="p-2 font-medium">Yr {year.year}</td>
												<td class="p-2 text-right">{formatCurrency(year.revenue)}</td>
												<td class="p-2 text-right font-medium">{formatCurrency(year.noi)}</td>
												<td class="p-2 text-right font-medium text-green-600">{formatCurrency(year.cashFlow)}</td>
												<td class="p-2 text-right">{year.coc}%</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
			</div>
		</div>

		<!-- RIGHT PANEL: Insights (25%) -->
		<div class="w-1/4 border-l overflow-y-auto bg-muted/20">
			<div class="p-4 space-y-4">
				<div>
					<h2 class="text-lg font-semibold flex items-center gap-2">
						<SparklesIcon class="size-5" />
						Insights
					</h2>
					<p class="text-sm text-muted-foreground">AI-powered petal analysis</p>
				</div>

				<!-- Bloom Status -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm">Bloom Status</Card.Title>
					</Card.Header>
					<Card.Content class="flex justify-center">
						<BloomStatus score={bloomScore} showLabel={true} size="lg" />
					</Card.Content>
				</Card.Root>

				<!-- AI-Generated Insights -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm">Key Takeaways</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-3">
						{#each insights.slice(0, 4) as insight}
							{@const iconColor = insight.type === 'strength' ? 'text-green-600' :
								insight.type === 'weakness' ? 'text-red-600' :
								insight.type === 'opportunity' ? 'text-blue-600' : 'text-yellow-600'}
							<div class="flex items-start gap-2">
								<LightbulbIcon class="size-4 {iconColor} mt-0.5" />
								<div>
									<p class="text-xs font-medium">{insight.title}</p>
									<p class="text-xs text-muted-foreground">{insight.message}</p>
								</div>
							</div>
						{/each}
						{#if insights.length === 0}
							<div class="flex items-start gap-2">
								<LightbulbIcon class="size-4 text-green-600 mt-0.5" />
								<div>
									<p class="text-xs font-medium">Well Balanced</p>
									<p class="text-xs text-muted-foreground">{bloomScore}/64 Bloom Score ({bloomPercentage}%) with balanced petals</p>
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- Quick Actions -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm">Quick Actions</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-2">
						<Button variant="outline" size="sm" class="w-full justify-start text-xs">
							Run Sensitivity Analysis
						</Button>
						<Button variant="outline" size="sm" class="w-full justify-start text-xs">
							Compare to Comps
						</Button>
						<Button variant="outline" size="sm" class="w-full justify-start text-xs">
							Export to Portfolio
						</Button>
					</Card.Content>
				</Card.Root>

				<!-- Related Properties -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm">Similar Deals</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-2">
						<div class="rounded-lg border p-2">
							<p class="text-xs font-medium">Orlando Gardens</p>
							<p class="text-xs text-muted-foreground">87 score • $32M</p>
						</div>
						<div class="rounded-lg border p-2">
							<p class="text-xs font-medium">Phoenix Heights</p>
							<p class="text-xs text-muted-foreground">89 score • $41M</p>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>

	<!-- TERMINAL PANEL: AI Copilot (Bottom, collapsible) -->
	{#if terminalOpen}
		<div
			class="border-t bg-background"
			style="height: {terminalHeight}px;"
		>
			<div class="flex h-full flex-col">
				<!-- Terminal Header -->
				<div class="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
					<div class="flex items-center gap-2">
						<TerminalIcon class="size-4" />
						<span class="text-sm font-semibold">AI Copilot</span>
						<Badge variant="secondary" class="text-xs">Ctrl+`</Badge>
					</div>
					<div class="flex items-center gap-1">
						<Button variant="ghost" size="sm" class="h-6 px-2" onclick={toggleTerminal}>
							<ChevronDownIcon class="size-4" />
						</Button>
					</div>
				</div>

				<!-- Chat Messages -->
				<ScrollArea class="flex-1 p-4">
					<div class="space-y-3">
						{#each chatMessages as message}
							<div class={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
								<div
									class={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
										message.role === "user"
											? "bg-primary text-primary-foreground"
											: "bg-muted"
									}`}
								>
									{message.content}
								</div>
							</div>
						{/each}
					</div>
				</ScrollArea>

				<!-- Input -->
				<div class="border-t p-3">
					<div class="flex gap-2">
						<Input
							bind:value={chatInput}
							placeholder="Ask about this property, run scenarios, or get recommendations..."
							onkeydown={(e) => e.key === "Enter" && handleSendMessage()}
							class="flex-1"
						/>
						<Button onclick={handleSendMessage} disabled={!chatInput.trim()} size="sm">
							<SendIcon class="size-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Collapsed Terminal Bar -->
		<button
			onclick={toggleTerminal}
			class="flex items-center justify-center gap-2 border-t bg-muted/30 py-1.5 text-sm font-medium hover:bg-muted/50"
		>
			<ChevronUpIcon class="size-4" />
			<TerminalIcon class="size-4" />
			<span>AI Copilot</span>
		</button>
	{/if}
</div>

<!-- Petal Detail Modal -->
{#if selectedPetal}
	{@const petal = getPetalData(selectedPetal)}
	{@const scoring = getPetalScoring(selectedPetal)}
	{#if petal && scoring}
		<PetalDetailModal
			bind:open={modalOpen}
			category={selectedPetal}
			score={petal.score}
			confidence={petal.confidence}
			trend={petal.trend}
			subScores={scoring.subCriteria.map(c => ({
				id: c.id,
				score: c.score,
				rawValue: c.rawValue
			}))}
			allPetals={petalData.map(p => ({
				category: p.id as PetalCategory,
				score: p.score
			}))}
			onClose={closeModal}
			onNavigate={navigateToPetal}
		/>
	{/if}
{/if}
