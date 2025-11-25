<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Progress } from "$lib/components/ui/progress";
	import { Separator } from "$lib/components/ui/separator";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as Tabs from "$lib/components/ui/tabs";
	import DiamondIcon from "@tabler/icons-svelte/icons/diamond";
	import BuildingIcon from "@tabler/icons-svelte/icons/building";
	import MapPinIcon from "@tabler/icons-svelte/icons/map-pin";
	import ClockIcon from "@tabler/icons-svelte/icons/clock";
	import UsersIcon from "@tabler/icons-svelte/icons/users";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import DollarIcon from "@tabler/icons-svelte/icons/currency-dollar";
	import FileTextIcon from "@tabler/icons-svelte/icons/file-text";
	import AlertCircleIcon from "@tabler/icons-svelte/icons/alert-circle";
	import CheckCircleIcon from "@tabler/icons-svelte/icons/circle-check";
	import BookmarkIcon from "@tabler/icons-svelte/icons/bookmark";
	import ShareIcon from "@tabler/icons-svelte/icons/share";
	import FlowerIcon from "@tabler/icons-svelte/icons/flower";
	import CalendarIcon from "@tabler/icons-svelte/icons/calendar";
	import { PetalChart, BloomStatus } from '$lib/components/petal-chart';
	import type { PetalDataPoint, PetalCategory } from '$lib/types/petal-chart.types';
	import { PETAL_LABELS, PETAL_DESCRIPTIONS } from '$lib/types/petal-chart.types';
	import { calculateBloomScore, getGradeFromBloomScore } from '$lib/utils/petal-chart.utils';

	// Mock offering data - would come from API based on [id] param
	const offering = {
		id: "1",
		propertyName: "Austin Tech Towers",
		address: "2400 Domain Dr, Austin, TX 78758",
		units: 342,
		totalValue: 48500000,
		propertyClass: "A",
		propertyType: "Multifamily",
		yearBuilt: 2018,

		// Fundraising
		targetRaise: 12000000,
		currentRaise: 8400000,
		investorCount: 147,
		minInvestment: 50000,
		maxInvestment: 500000,

		// Returns
		year1CoC: 8.5,
		avgCashYield: 7.2,
		projectedIRR: 18.3,
		equityMultiple: 2.1,
		holdPeriod: 5,

		// Sponsor
		sponsorName: "Cardone Capital",
		sponsorDeals: 47,
		sponsorAvgIRR: 19.2,
		sponsorBio: "Leading multifamily syndicator with $4B+ AUM. 20+ years experience in value-add acquisitions across Sunbelt markets.",

		// 8-Petal Bloom Score data
		petalScores: [
			{ id: 'cashflow', label: 'Cash Flow', score: 7.5, confidence: 0.92, completeness: 0.95, trend: 'up' as const, category: 'cashflow' as PetalCategory, description: PETAL_DESCRIPTIONS.cashflow },
			{ id: 'appreciation', label: 'Appreciation', score: 7.8, confidence: 0.88, completeness: 0.90, trend: 'up' as const, category: 'appreciation' as PetalCategory, description: PETAL_DESCRIPTIONS.appreciation },
			{ id: 'financing', label: 'Financing', score: 7.2, confidence: 0.95, completeness: 0.98, trend: 'stable' as const, category: 'financing' as PetalCategory, description: PETAL_DESCRIPTIONS.financing },
			{ id: 'location', label: 'Location', score: 8.0, confidence: 0.90, completeness: 0.92, trend: 'up' as const, category: 'location' as PetalCategory, description: PETAL_DESCRIPTIONS.location },
			{ id: 'condition', label: 'Condition', score: 7.0, confidence: 0.85, completeness: 0.88, trend: 'stable' as const, category: 'condition' as PetalCategory, description: PETAL_DESCRIPTIONS.condition },
			{ id: 'tenancy', label: 'Tenancy', score: 7.6, confidence: 0.92, completeness: 0.94, trend: 'up' as const, category: 'tenancy' as PetalCategory, description: PETAL_DESCRIPTIONS.tenancy },
			{ id: 'liquidity', label: 'Liquidity', score: 7.4, confidence: 0.88, completeness: 0.90, trend: 'stable' as const, category: 'liquidity' as PetalCategory, description: PETAL_DESCRIPTIONS.liquidity },
			{ id: 'compliance', label: 'Compliance', score: 7.8, confidence: 0.96, completeness: 0.98, trend: 'up' as const, category: 'compliance' as PetalCategory, description: PETAL_DESCRIPTIONS.compliance },
		] as PetalDataPoint[],

		// Status
		daysRemaining: 27,
		closingDate: "Dec 15, 2024",
		status: "active",

		// Deal Structure
		purchasePrice: 48500000,
		downPayment: 12125000,
		loanAmount: 36375000,
		preferredReturn: 8.0,
		profitSplit: { lp: 70, gp: 30 },

		// Property Details
		occupancy: 94.2,
		avgRent: 1850,
		rentGrowthCAGR: 6.8,
		capRate: 6.2,
		noi: 3200000,

		// Market
		marketName: "Austin - Domain",
		jobGrowth: 5.5,
		popGrowth: 4.1,
		medianIncome: 95000,

		// Business Plan
		renovationBudget: 2300000,
		renovationCostPerUnit: 6725,
		projectedRentIncrease: 250,
		stabilizedOccupancy: 96.0,

		// Documents
		documents: [
			{ name: "Offering Memorandum (OM)", size: "8.4 MB", type: "pdf" },
			{ name: "Private Placement Memorandum (PPM)", size: "2.1 MB", type: "pdf" },
			{ name: "Operating Agreement", size: "1.8 MB", type: "pdf" },
			{ name: "Subscription Agreement", size: "645 KB", type: "pdf" },
			{ name: "Property Inspection Report", size: "12.3 MB", type: "pdf" },
			{ name: "Rent Roll (Current)", size: "892 KB", type: "xlsx" },
		],

		// Q&A
		qaItems: [
			{
				question: "What is the renovation plan?",
				answer: "We're implementing a $2.3M interior renovation program targeting 280 units (82% of portfolio). This includes stainless steel appliances, quartz countertops, luxury vinyl plank flooring, and updated lighting fixtures. We project $250/month rent premiums post-renovation.",
				askedBy: "John M.",
				answeredDate: "Nov 15, 2024"
			},
			{
				question: "What are the exit strategies?",
				answer: "Primary exit is a sale to institutional buyer in Year 5. Alternative strategies include refinancing (cash-out refi to return capital) or holding for longer-term cash flow. Austin's strong fundamentals support multiple exit paths.",
				askedBy: "Sarah K.",
				answeredDate: "Nov 12, 2024"
			}
		]
	};

	function formatCurrency(value: number): string {
		if (value >= 1000000) {
			return "$" + (value / 1000000).toFixed(1) + "M";
		}
		return "$" + value.toLocaleString();
	}

	function formatPercent(value: number): string {
		return value.toFixed(1) + "%";
	}

	function getFundingPercent(current: number, target: number): number {
		return Math.round((current / target) * 100);
	}

	function getGradeColor(grade: string): string {
		if (grade.startsWith("A")) return "bg-green-100 text-green-800";
		if (grade.startsWith("B")) return "bg-yellow-100 text-yellow-800";
		if (grade.startsWith("C")) return "bg-orange-100 text-orange-800";
		return "bg-red-100 text-red-800";
	}

	// Investment modal state
	let showInvestModal = $state(false);

	// Compute Bloom Score from petal data
	const bloomScore = calculateBloomScore(offering.petalScores);
	const bloomGrade = getGradeFromBloomScore(bloomScore);

	function getBloomGradeColor(grade: string): string {
		if (grade.startsWith("A")) return "bg-amber-100 text-amber-800 border-amber-300";
		if (grade.startsWith("B")) return "bg-green-100 text-green-800 border-green-300";
		if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800 border-yellow-300";
		return "bg-red-100 text-red-800 border-red-300";
	}
</script>

<svelte:head>
	<title>{offering.propertyName} - Marketplace</title>
</svelte:head>

<!-- Header -->
<header class="flex h-14 shrink-0 items-center gap-2 border-b">
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 h-4" />
		<div class="flex items-center gap-2">
			<DiamondIcon class="size-5 text-primary" />
			<h1 class="text-base font-semibold">{offering.propertyName}</h1>
		</div>
		<div class="ml-auto flex items-center gap-2">
			<Button variant="outline" size="sm">
				<BookmarkIcon class="mr-2 size-4" />
				Save
			</Button>
			<Button variant="outline" size="sm">
				<ShareIcon class="mr-2 size-4" />
				Share
			</Button>
			<Button size="sm" onclick={() => (showInvestModal = true)}>
				<DiamondIcon class="mr-2 size-4" />
				Invest Now
			</Button>
		</div>
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
	<!-- Hero Section -->
	<div class="grid gap-6 md:grid-cols-3">
		<!-- Property Images -->
		<div class="md:col-span-2 space-y-4">
			<div class="aspect-video w-full rounded-lg bg-gradient-to-br from-primary/20 to-primary/5"></div>
			<div class="grid grid-cols-4 gap-2">
				<div class="aspect-video rounded-md bg-gradient-to-br from-primary/15 to-primary/5"></div>
				<div class="aspect-video rounded-md bg-gradient-to-br from-primary/15 to-primary/5"></div>
				<div class="aspect-video rounded-md bg-gradient-to-br from-primary/15 to-primary/5"></div>
				<div class="aspect-video rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
					<span class="text-sm font-medium text-muted-foreground">+12 more</span>
				</div>
			</div>
		</div>

		<!-- Investment Summary Card -->
		<Card.Root class="h-fit sticky top-4">
			<Card.Header>
				<div class="flex items-center justify-between">
					<Badge class="{getBloomGradeColor(bloomGrade)} text-lg font-bold px-3 py-1 border">
						{bloomScore}/64 • {bloomGrade}
					</Badge>
					<Badge variant="secondary">
						<ClockIcon class="mr-1 size-3" />
						{offering.daysRemaining}d left
					</Badge>
				</div>
			</Card.Header>
			<Card.Content class="space-y-4">
				<!-- Fundraising Progress -->
				<div>
					<div class="mb-2 flex items-center justify-between">
						<span class="text-sm font-medium">Fundraising Progress</span>
						<span class="text-sm text-muted-foreground">
							{getFundingPercent(offering.currentRaise, offering.targetRaise)}%
						</span>
					</div>
					<Progress
						value={getFundingPercent(offering.currentRaise, offering.targetRaise)}
						class="h-3"
					/>
					<div class="mt-2 flex justify-between text-xs text-muted-foreground">
						<span>{formatCurrency(offering.currentRaise)} raised</span>
						<span>{formatCurrency(offering.targetRaise)} target</span>
					</div>
				</div>

				<Separator />

				<!-- Investment Range -->
				<div class="space-y-2">
					<div class="flex justify-between text-sm">
						<span class="text-muted-foreground">Min Investment</span>
						<span class="font-semibold">{formatCurrency(offering.minInvestment)}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-muted-foreground">Max Investment</span>
						<span class="font-semibold">{formatCurrency(offering.maxInvestment)}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-muted-foreground">Investors</span>
						<span class="font-semibold">{offering.investorCount}</span>
					</div>
				</div>

				<Separator />

				<!-- Projected Returns -->
				<div>
					<p class="mb-3 text-xs font-medium text-muted-foreground">PROJECTED RETURNS</p>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<p class="text-xs text-muted-foreground">Year 1 CoC</p>
							<p class="text-lg font-bold text-primary">{formatPercent(offering.year1CoC)}</p>
						</div>
						<div>
							<p class="text-xs text-muted-foreground">Avg Yield</p>
							<p class="text-lg font-bold">{formatPercent(offering.avgCashYield)}</p>
						</div>
						<div>
							<p class="text-xs text-muted-foreground">IRR ({offering.holdPeriod}yr)</p>
							<p class="text-lg font-bold text-green-600">{formatPercent(offering.projectedIRR)}</p>
						</div>
						<div>
							<p class="text-xs text-muted-foreground">Equity Multiple</p>
							<p class="text-lg font-bold">{offering.equityMultiple}x</p>
						</div>
					</div>
				</div>

				<Button class="w-full" size="lg" onclick={() => (showInvestModal = true)}>
					<DiamondIcon class="mr-2 size-4" />
					Invest Now
				</Button>

				<p class="text-xs text-center text-muted-foreground">
					Accredited investors only • Reg D 506(c)
				</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Property Details Tabs -->
	<Tabs.Root value="overview" class="w-full">
		<Tabs.List class="w-full">
			<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
			<Tabs.Trigger value="financials">Financials</Tabs.Trigger>
			<Tabs.Trigger value="market">Market</Tabs.Trigger>
			<Tabs.Trigger value="sponsor">Sponsor</Tabs.Trigger>
			<Tabs.Trigger value="documents">Documents</Tabs.Trigger>
			<Tabs.Trigger value="qa">Q&A</Tabs.Trigger>
		</Tabs.List>

		<!-- Overview Tab -->
		<Tabs.Content value="overview" class="mt-6 space-y-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Property Overview</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="grid gap-4 md:grid-cols-2">
						<div class="space-y-3">
							<div class="flex items-start gap-3">
								<BuildingIcon class="mt-0.5 size-5 text-primary" />
								<div>
									<p class="text-sm font-medium">Property Type</p>
									<p class="text-sm text-muted-foreground">{offering.propertyType} • Class {offering.propertyClass}</p>
								</div>
							</div>
							<div class="flex items-start gap-3">
								<MapPinIcon class="mt-0.5 size-5 text-primary" />
								<div>
									<p class="text-sm font-medium">Location</p>
									<p class="text-sm text-muted-foreground">{offering.address}</p>
								</div>
							</div>
							<div class="flex items-start gap-3">
								<CalendarIcon class="mt-0.5 size-5 text-primary" />
								<div>
									<p class="text-sm font-medium">Year Built</p>
									<p class="text-sm text-muted-foreground">{offering.yearBuilt}</p>
								</div>
							</div>
						</div>

						<div class="space-y-3">
							<div>
								<p class="text-sm font-medium">Units</p>
								<p class="text-2xl font-bold">{offering.units}</p>
							</div>
							<div>
								<p class="text-sm font-medium">Current Occupancy</p>
								<p class="text-2xl font-bold">{offering.occupancy}%</p>
							</div>
							<div>
								<p class="text-sm font-medium">Avg Rent</p>
								<p class="text-2xl font-bold">{formatCurrency(offering.avgRent)}/mo</p>
							</div>
						</div>
					</div>

					<Separator />

					<div>
						<h4 class="mb-3 font-semibold">Business Plan</h4>
						<p class="text-sm text-muted-foreground leading-relaxed">
							Value-add acquisition targeting {offering.units}-unit Class {offering.propertyClass} multifamily property
							in Austin's high-growth Domain submarket. Implementation of $2.3M interior renovation program
							across 280 units (82% of portfolio) to capture $250/month rent premiums. Strong market fundamentals
							support {formatPercent(offering.rentGrowthCAGR)} annual rent growth projection.
						</p>
					</div>

					<div>
						<h4 class="mb-3 font-semibold">Investment Highlights</h4>
						<div class="grid gap-2 md:grid-cols-2">
							<div class="flex items-start gap-2">
								<CheckCircleIcon class="mt-0.5 size-5 text-green-600" />
								<span class="text-sm">Premier Austin Domain location with strong job growth</span>
							</div>
							<div class="flex items-start gap-2">
								<CheckCircleIcon class="mt-0.5 size-5 text-green-600" />
								<span class="text-sm">Clear value-add strategy with proven rent premiums</span>
							</div>
							<div class="flex items-start gap-2">
								<CheckCircleIcon class="mt-0.5 size-5 text-green-600" />
								<span class="text-sm">Experienced sponsor with 47-deal track record</span>
							</div>
							<div class="flex items-start gap-2">
								<CheckCircleIcon class="mt-0.5 size-5 text-green-600" />
								<span class="text-sm">Multiple exit strategies including institutional sale</span>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- 8-Petal Bloom Score Analysis -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<FlowerIcon class="size-5 text-primary" />
						Bloom Score Analysis
					</Card.Title>
					<p class="text-sm text-muted-foreground">
						Guardian-grade 8-petal scoring across Returns, Asset Quality, and Risk dimensions
					</p>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-6 md:grid-cols-2">
						<!-- Petal Chart -->
						<div class="flex items-center justify-center">
							<PetalChart
								data={offering.petalScores}
								size={320}
								showLabels={true}
								enableGlow={true}
							/>
						</div>

						<!-- Bloom Status & Breakdown -->
						<div class="space-y-4">
							<BloomStatus
								score={bloomScore}
								showLabel={true}
								size="lg"
							/>

							<!-- Petal Details -->
							<div class="space-y-2">
								<h4 class="text-sm font-semibold text-muted-foreground">PETAL BREAKDOWN</h4>
								<div class="grid grid-cols-2 gap-2">
									{#each offering.petalScores as petal}
										<div class="flex items-center justify-between p-2 rounded-md bg-muted/50">
											<span class="text-sm">{petal.label}</span>
											<span class="text-sm font-bold" class:text-amber-600={petal.score >= 7} class:text-green-600={petal.score >= 5 && petal.score < 7} class:text-blue-600={petal.score < 5}>
												{petal.score.toFixed(1)}/8
											</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<!-- Financials Tab -->
		<Tabs.Content value="financials" class="mt-6 space-y-6">
			<div class="grid gap-6 md:grid-cols-2">
				<Card.Root>
					<Card.Header>
						<Card.Title>Purchase Details</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-3">
						<div class="flex justify-between">
							<span class="text-muted-foreground">Purchase Price</span>
							<span class="font-semibold">{formatCurrency(offering.purchasePrice)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Down Payment (25%)</span>
							<span class="font-semibold">{formatCurrency(offering.downPayment)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Loan Amount</span>
							<span class="font-semibold">{formatCurrency(offering.loanAmount)}</span>
						</div>
						<Separator />
						<div class="flex justify-between">
							<span class="text-muted-foreground">Cap Rate</span>
							<span class="font-semibold">{formatPercent(offering.capRate)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Current NOI</span>
							<span class="font-semibold">{formatCurrency(offering.noi)}</span>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Deal Structure</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-3">
						<div class="flex justify-between">
							<span class="text-muted-foreground">Preferred Return</span>
							<span class="font-semibold">{formatPercent(offering.preferredReturn)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Profit Split (LP/GP)</span>
							<span class="font-semibold">{offering.profitSplit.lp}/{offering.profitSplit.gp}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Hold Period</span>
							<span class="font-semibold">{offering.holdPeriod} years</span>
						</div>
						<div class="flex justify-between">
							<span class="text-muted-foreground">Distribution Frequency</span>
							<span class="font-semibold">Quarterly</span>
						</div>
						<Separator />
						<div class="flex justify-between">
							<span class="text-muted-foreground">Renovation Budget</span>
							<span class="font-semibold">{formatCurrency(offering.renovationBudget)}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">Per Unit</span>
							<span>{formatCurrency(offering.renovationCostPerUnit)}</span>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</Tabs.Content>

		<!-- Market Tab -->
		<Tabs.Content value="market" class="mt-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Market Analysis - {offering.marketName}</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-6 md:grid-cols-3">
						<div>
							<p class="text-sm text-muted-foreground">Job Growth</p>
							<p class="text-2xl font-bold text-green-600">+{formatPercent(offering.jobGrowth)}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Population Growth</p>
							<p class="text-2xl font-bold text-green-600">+{formatPercent(offering.popGrowth)}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Median Income</p>
							<p class="text-2xl font-bold">{formatCurrency(offering.medianIncome)}</p>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<!-- Sponsor Tab -->
		<Tabs.Content value="sponsor" class="mt-6">
			<Card.Root>
				<Card.Header>
					<div class="flex items-center gap-4">
						<div class="flex size-16 items-center justify-center rounded-full bg-primary/10">
							<UsersIcon class="size-8 text-primary" />
						</div>
						<div>
							<Card.Title>{offering.sponsorName}</Card.Title>
							<p class="text-sm text-muted-foreground">
								{offering.sponsorDeals} deals • {formatPercent(offering.sponsorAvgIRR)} avg IRR
							</p>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground leading-relaxed">
						{offering.sponsorBio}
					</p>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<!-- Documents Tab -->
		<Tabs.Content value="documents" class="mt-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Legal Documents</Card.Title>
					<Card.Description>Review all offering documents before investing</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="divide-y">
						{#each offering.documents as doc}
							<div class="flex items-center justify-between py-3">
								<div class="flex items-center gap-3">
									<FileTextIcon class="size-5 text-muted-foreground" />
									<div>
										<p class="text-sm font-medium">{doc.name}</p>
										<p class="text-xs text-muted-foreground">{doc.size}</p>
									</div>
								</div>
								<Button variant="outline" size="sm">Download</Button>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<!-- Q&A Tab -->
		<Tabs.Content value="qa" class="mt-6 space-y-4">
			{#each offering.qaItems as qa}
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-base">{qa.question}</Card.Title>
						<Card.Description>
							Asked by {qa.askedBy} • Answered {qa.answeredDate}
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="text-sm text-muted-foreground leading-relaxed">{qa.answer}</p>
					</Card.Content>
				</Card.Root>
			{/each}

			<Card.Root class="border-dashed">
				<Card.Content class="p-6 text-center">
					<p class="text-sm text-muted-foreground mb-4">Have a question for the sponsor?</p>
					<Button>Ask a Question</Button>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>

<!-- Investment Modal (Simple version - would be full wizard) -->
{#if showInvestModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onclick={() => (showInvestModal = false)}>
		<Card.Root class="w-full max-w-lg m-4" onclick={(e) => e.stopPropagation()}>
			<Card.Header>
				<Card.Title>Invest in {offering.propertyName}</Card.Title>
				<Card.Description>Start your investment journey</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="rounded-lg border bg-muted/50 p-4">
					<p class="text-sm text-muted-foreground mb-2">Investment requirements:</p>
					<ul class="space-y-1 text-sm">
						<li>• Accredited investor verification required</li>
						<li>• Minimum: {formatCurrency(offering.minInvestment)}</li>
						<li>• Maximum: {formatCurrency(offering.maxInvestment)}</li>
					</ul>
				</div>
				<Button class="w-full" size="lg">
					Continue to Investment Wizard
				</Button>
				<Button variant="outline" class="w-full" onclick={() => (showInvestModal = false)}>
					Cancel
				</Button>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
