<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { PetalChart, BloomStatus, BloomScoreCard, AutoInsights, PetalLegend, PETAL_LABELS, PETAL_ORDER, type PetalDataPoint } from '$lib/components/petal-chart';
	import PropertyMap from '$lib/components/PropertyMap.svelte';
	import { worldCities, type CityData } from '$lib/data/world-cities';
	import { Rocket, TrendingUp, DollarSign, BarChart3, Wrench, Building2, Shield, MapPin, Target, Zap, Coins, Search, Bot, Users, Check, Droplets, FileCheck, Globe } from 'lucide-svelte';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

	// Selected city for the map - default to New York
	let selectedCity: CityData = $state(worldCities[0]);

	function selectCity(city: CityData) {
		selectedCity = city;
	}

	// 8-petal categories - clockwise from 12 o'clock per DESIGN.md
	// 8 petals at 45° intervals: 12:00, 1:30, 3:00, 4:30, 6:00, 7:30, 9:00, 10:30
	// Zone Strategy: Quality Crown (top) → Risk Balance (sides) → Returns (bottom)
	const petalMetrics = [
		{ label: 'Location', icon: MapPin, desc: 'Walk score, schools, amenities', zone: 'Quality Crown' },    // 12:00
		{ label: 'Tenancy', icon: Users, desc: 'Occupancy, lease terms, quality', zone: 'Quality Crown' },     // 1:30
		{ label: 'Compliance', icon: FileCheck, desc: 'Permits, zoning, regulations', zone: 'Risk Balance' },  // 3:00
		{ label: 'Financing', icon: DollarSign, desc: 'DSCR, loan terms, LTV', zone: 'Returns' },              // 4:30
		{ label: 'Cashflow', icon: Coins, desc: 'Cap rate, CoC returns, NOI', zone: 'Returns' },               // 6:00 (bottom)
		{ label: 'Appreciation', icon: TrendingUp, desc: 'Rent growth, market trends', zone: 'Returns' },      // 7:30
		{ label: 'Liquidity', icon: Droplets, desc: 'Days on market, exit options', zone: 'Risk Balance' },    // 9:00
		{ label: 'Condition', icon: Wrench, desc: 'Structure, systems, value-add', zone: 'Quality Crown' }     // 10:30
	];

	// Example property for petal chart demo - Austin Tech Towers
	// Order matches PETAL_ORDER: clockwise from 12 o'clock per DESIGN.md
	// 8 petals at 45° intervals: 12:00, 1:30, 3:00, 4:30, 6:00, 7:30, 9:00, 10:30
	const examplePetalData: PetalDataPoint[] = [
		{ id: 'location', label: 'Location', score: 7.2, confidence: 0.95, completeness: 0.95, trend: 'up', category: 'location' },       // 12:00
		{ id: 'tenancy', label: 'Tenancy', score: 6.4, confidence: 0.9, completeness: 0.88, trend: 'up', category: 'tenancy' },           // 1:30
		{ id: 'compliance', label: 'Compliance', score: 6.4, confidence: 0.92, completeness: 0.9, trend: 'stable', category: 'compliance' }, // 3:00
		{ id: 'financing', label: 'Financing', score: 6.4, confidence: 0.92, completeness: 0.9, trend: 'stable', category: 'financing' }, // 4:30
		{ id: 'cashflow', label: 'Cashflow', score: 7.2, confidence: 0.95, completeness: 0.9, trend: 'up', category: 'cashflow' },        // 6:00 (bottom)
		{ id: 'appreciation', label: 'Appreciation', score: 6.8, confidence: 0.88, completeness: 0.85, trend: 'up', category: 'appreciation' }, // 7:30
		{ id: 'liquidity', label: 'Liquidity', score: 5.5, confidence: 0.75, completeness: 0.7, trend: 'stable', category: 'liquidity' }, // 9:00
		{ id: 'condition', label: 'Condition', score: 5.6, confidence: 0.85, completeness: 0.8, trend: 'stable', category: 'condition' }  // 10:30
	];

	// Calculate bloom score for display
	const bloomScore = examplePetalData.reduce((sum, p) => sum + p.score, 0);
	const bloomPercentage = Math.round((bloomScore / 64) * 100);
</script>

<svelte:head>
	<title>deed.guru - Real Estate Tokenization Platform Built on Hedera Guardian</title>
	<meta name="description" content="AI-powered real estate tokenization platform. Tokenize commercial properties, raise capital through dual-token ICO ($PROP + $DEAL), and create liquid real estate markets." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 min-h-screen flex items-center">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl relative z-10">
		<div class="mx-auto max-w-5xl text-center space-y-8">
			<!-- Badge -->
			<Badge variant="secondary" class="text-sm px-4 py-1 flex items-center gap-2 w-fit mx-auto">
				<Rocket class="size-4" />
				Built on Hedera Guardian Framework
			</Badge>

			<!-- Headline -->
			<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
				Tokenize Real Estate
				<span class="text-primary font-extrabold">
					On-Chain
				</span>
				in Minutes
			</h1>

			<!-- Subheadline -->
			<p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
				AI-powered property tokenization platform that adapts Hedera Guardian for commercial real estate. Create compliant security tokens, raise capital via ICO, and build liquid markets.
			</p>

			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button size="lg" class="text-lg px-8 py-6" href="/signup">
					Start Free Trial →
				</Button>
				<Button size="lg" variant="outline" class="text-lg px-8 py-6" href="#how-it-works">
					See How It Works
				</Button>
			</div>

			<!-- Social Proof -->
			<div class="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-8">
				<div class="flex items-center gap-2">
					<div class="flex -space-x-2">
						{#each Array(4) as _, i}
							<div class="size-8 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-background"></div>
						{/each}
					</div>
					<span>500+ Investors</span>
				</div>
				<div>⭐⭐⭐⭐⭐ 4.9/5</div>
				<div>$2.3B+ Analyzed</div>
			</div>
		</div>
	</div>

	<!-- Background Gradient -->
	<div class="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.green.100),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.green.950),transparent)]"></div>
</section>

<!-- deed.guru Demo Section -->
<section class="min-h-screen flex items-center py-16 md:py-24 lg:py-32 bg-muted/30">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl">
		<div class="max-w-6xl mx-auto">
			<div class="text-center mb-16">
				<Badge variant="secondary" class="mb-4">deed.guru Petal Scoring Engine</Badge>
				<h2 class="text-3xl md:text-5xl font-bold mb-6">
					Visualize Deal Quality
					<span class="text-primary font-extrabold">Instantly</span>
				</h2>
				<p class="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
					Our AI analyzes 8 critical dimensions across every property using our proprietary Petal Chart visualization, giving you a beautiful bloom status in seconds.
				</p>
			</div>

			<!-- Petal Chart Card -->
			<Card class="p-8">
				<div class="grid lg:grid-cols-2 gap-8 items-center">
					<!-- Petal Chart -->
					<div class="order-2 lg:order-1 flex justify-center">
						<PetalChart
							data={examplePetalData}
							size={450}
							minCenterRadius={35}
							maxCenterRadius={55}
							maxPetalLength={130}
							showLabels={true}
							showValues={false}
							showCenterValue={true}
							interactive={true}
							enableGlow={true}
						/>
					</div>

					<!-- Metrics Explanation -->
					<div class="order-1 lg:order-2 space-y-6">
						<div>
							<h3 class="text-2xl font-bold mb-4">8-Petal Bloom Scoring</h3>
							<p class="text-muted-foreground mb-4">
								Properties scored 0-8 across three strategic zones:
							</p>
						</div>

						<!-- Bloom Score Card -->
						<BloomScoreCard
							totalScore={bloomScore}
							confidence={0.9}
							completeness={0.85}
							trend="up"
						/>

						<!-- Petal Legend with zones -->
						<div class="pt-4">
							<PetalLegend petals={examplePetalData} showScores={true} showDimensions={true} compact={false} />
						</div>
					</div>
				</div>
			</Card>

			<!-- Auto Insights Demo -->
			<div class="mt-12">
				<Card class="p-6">
					<AutoInsights petals={examplePetalData} maxInsights={4} />
				</Card>
			</div>

			<!-- Quick Stats -->
			<div class="grid md:grid-cols-3 gap-6 mt-8">
				<Card class="text-center p-6">
					<p class="text-4xl font-bold text-primary mb-2">98.7%</p>
					<p class="text-sm text-muted-foreground">Context efficiency vs. traditional analysis</p>
				</Card>
				<Card class="text-center p-6">
					<p class="text-4xl font-bold text-primary mb-2">&lt;3 sec</p>
					<p class="text-sm text-muted-foreground">Average property analysis time</p>
				</Card>
				<Card class="text-center p-6">
					<p class="text-4xl font-bold text-primary mb-2">8 petals</p>
					<p class="text-sm text-muted-foreground">Comprehensive bloom evaluation</p>
				</Card>
			</div>
		</div>
	</div>
</section>

<!-- Global Property Map Section -->
<section class="py-16 md:py-24 lg:py-32">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl">
		<div class="max-w-6xl mx-auto">
			<div class="text-center mb-12">
				<Badge variant="secondary" class="mb-4">
					<Globe class="size-4 mr-2" />
					Global Property Intelligence
				</Badge>
				<h2 class="text-3xl md:text-5xl font-bold mb-6">
					Premium Properties
					<span class="text-primary font-extrabold">Worldwide</span>
				</h2>
				<p class="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
					Explore prime real estate across 12 global cities. Each property features our 8-petal bloom scoring for instant quality assessment.
				</p>
			</div>

			<!-- City Selector -->
			<div class="flex flex-wrap justify-center gap-2 mb-6">
				{#each worldCities as city}
					<Button
						variant={selectedCity.id === city.id ? 'default' : 'outline'}
						size="sm"
						onclick={() => selectCity(city)}
						class="text-sm"
					>
						{city.name}
					</Button>
				{/each}
			</div>

			<!-- Interactive Property Map -->
			<Card class="p-2 md:p-4 bg-slate-950/50 border-slate-800 overflow-hidden">
				<div class="h-[500px] md:h-[600px] rounded-lg overflow-hidden">
					{#if PUBLIC_MAPBOX_TOKEN}
						{#key selectedCity.id}
							<PropertyMap
								properties={selectedCity.properties}
								accessToken={PUBLIC_MAPBOX_TOKEN}
								initialCenter={selectedCity.center}
								initialZoom={selectedCity.zoom}
							/>
						{/key}
					{:else}
						<div class="h-full flex flex-col items-center justify-center bg-slate-900/50 rounded-lg">
							<Globe class="size-16 text-muted-foreground mb-4" />
							<p class="text-lg font-medium text-muted-foreground">Map requires Mapbox token</p>
							<p class="text-sm text-muted-foreground mt-2">Add PUBLIC_MAPBOX_TOKEN to your .env file</p>
							<p class="text-xs text-muted-foreground mt-1">Get a free token at mapbox.com</p>
						</div>
					{/if}
				</div>
			</Card>

			<!-- City Info -->
			<div class="text-center mt-4 mb-8">
				<p class="text-muted-foreground">
					Viewing <span class="font-semibold text-foreground">{selectedCity.properties.length} properties</span> in
					<span class="font-semibold text-foreground">{selectedCity.name}, {selectedCity.country}</span>
				</p>
				<p class="text-sm text-muted-foreground mt-1">
					Click on any petal marker to view detailed bloom analysis
				</p>
			</div>

			<!-- Market Stats Grid -->
			<div class="grid md:grid-cols-4 gap-4 mt-8">
				<Card class="text-center p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
					<p class="text-3xl font-bold text-primary mb-1">{worldCities.length}</p>
					<p class="text-sm text-muted-foreground">Global Cities</p>
				</Card>
				<Card class="text-center p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
					<p class="text-3xl font-bold text-primary mb-1">{worldCities.reduce((sum, c) => sum + c.properties.length, 0)}+</p>
					<p class="text-sm text-muted-foreground">Properties Analyzed</p>
				</Card>
				<Card class="text-center p-4 bg-gradient-to-br from-amber-700/10 to-transparent border-amber-500/20">
					<p class="text-3xl font-bold text-primary mb-1">8</p>
					<p class="text-sm text-muted-foreground">Petal Categories</p>
				</Card>
				<Card class="text-center p-4 bg-gradient-to-br from-amber-900/10 to-transparent border-amber-500/20">
					<p class="text-3xl font-bold text-primary mb-1">64</p>
					<p class="text-sm text-muted-foreground">Max Bloom Score</p>
				</Card>
			</div>

			<!-- All Cities Badges -->
			<div class="flex flex-wrap justify-center gap-2 mt-8">
				{#each worldCities as city}
					<Badge variant="outline" class="text-sm px-3 py-1">
						<MapPin class="size-3 mr-1" />
						{city.name}
					</Badge>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section id="features" class="min-h-screen flex items-center py-16 md:py-24 lg:py-32 bg-muted/20">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl">
		<div class="text-center max-w-4xl mx-auto mb-16">
			<Badge variant="secondary" class="mb-4">Features</Badge>
			<h2 class="text-3xl md:text-5xl font-bold mb-6">
				Everything You Need to
				<span class="text-primary font-extrabold">Dominate</span>
				Multifamily
			</h2>
			<p class="text-lg md:text-xl text-muted-foreground">
				Built for syndicators, operators, and investors who demand speed, accuracy, and deed.guru results.
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
			<!-- Feature 1 -->
			<Card>
				<CardHeader>
					<div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
						<Search class="size-6 text-primary" />
					</div>
					<CardTitle>Live MLS Hunt</CardTitle>
					<CardDescription>
						Search 1000s of multifamily properties across sunbelt markets with natural language queries.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Natural language search</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Real-time MLS data</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> 15+ major markets</li>
					</ul>
				</CardContent>
			</Card>

			<!-- Feature 2 -->
			<Card>
				<CardHeader>
					<div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
						<Bot class="size-6 text-primary" />
					</div>
					<CardTitle>AI Document Extraction</CardTitle>
					<CardDescription>
						Upload OMs and rent rolls - AI extracts all metrics in seconds using Claude 3.5 Sonnet.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> PDF, Excel, CSV support</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> 95%+ accuracy</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Instant extraction</li>
					</ul>
				</CardContent>
			</Card>

			<!-- Feature 3 -->
			<Card>
				<CardHeader>
					<div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
						<BarChart3 class="size-6 text-primary" />
					</div>
					<CardTitle>Petal Chart Scoring</CardTitle>
					<CardDescription>
						Every property visualized with our proprietary 8-petal bloom chart for instant quality assessment.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> 8-petal analysis</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Bloom status rating</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Instant comparisons</li>
					</ul>
				</CardContent>
			</Card>

			<!-- Feature 4 -->
			<Card>
				<CardHeader>
					<div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
						<DollarSign class="size-6 text-primary" />
					</div>
					<CardTitle>Auto Underwriting</CardTitle>
					<CardDescription>
						IRR, CoC, DSCR, and value-add calculations done automatically from extracted data.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> 5-year proformas</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Cash flow analysis</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Exit scenarios</li>
					</ul>
				</CardContent>
			</Card>

			<!-- Feature 5 -->
			<Card>
				<CardHeader>
					<div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
						<TrendingUp class="size-6 text-primary" />
					</div>
					<CardTitle>Market Intelligence</CardTitle>
					<CardDescription>
						Live rent growth, population trends, and economic resilience data for every market.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> CoStar integration</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Job growth data</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Submarket analysis</li>
					</ul>
				</CardContent>
			</Card>

			<!-- Feature 6 -->
			<Card>
				<CardHeader>
					<div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
						<Users class="size-6 text-primary" />
					</div>
					<CardTitle>Team Collaboration</CardTitle>
					<CardDescription>
						Share deals, comment, and collaborate with your team or investors in real-time.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Deal sharing</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Team workspaces</li>
						<li class="flex items-center gap-2"><Check class="size-4 text-primary shrink-0" /> Export to PDF</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	</div>
</section>

<!-- How It Works Section -->
<section id="how-it-works" class="min-h-screen flex items-center py-16 md:py-24 lg:py-32 bg-muted/20">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl">
		<div class="text-center max-w-4xl mx-auto mb-16">
			<Badge variant="secondary" class="mb-4">How It Works</Badge>
			<h2 class="text-3xl md:text-5xl font-bold mb-6">
				From Query to Deal in
				<span class="text-primary font-extrabold">3 Seconds</span>
			</h2>
		</div>

		<div class="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
			<!-- Step 1 -->
			<div class="relative">
				<div class="text-center space-y-4">
					<div class="size-16 rounded-full bg-gray-900 text-white text-2xl font-bold flex items-center justify-center mx-auto">
						1
					</div>
					<h3 class="text-xl font-bold">Search or Upload</h3>
					<p class="text-muted-foreground">
						Type "Find 200+ unit deals in Austin" or upload an OM document.
					</p>
				</div>
				{#if false}
					<div class="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gray-900"></div>
				{/if}
			</div>

			<!-- Step 2 -->
			<div class="relative">
				<div class="text-center space-y-4">
					<div class="size-16 rounded-full bg-gray-900 text-white text-2xl font-bold flex items-center justify-center mx-auto">
						2
					</div>
					<h3 class="text-xl font-bold">AI Analyzes</h3>
					<p class="text-muted-foreground">
						Claude 3.5 extracts metrics and searches live MLS data instantly.
					</p>
				</div>
			</div>

			<!-- Step 3 -->
			<div class="relative">
				<div class="text-center space-y-4">
					<div class="size-16 rounded-full bg-gray-900 text-white text-2xl font-bold flex items-center justify-center mx-auto">
						3
					</div>
					<h3 class="text-xl font-bold">Get Results</h3>
					<p class="text-muted-foreground">
						Instant deed.guru scores, radar charts, and investment-grade analysis.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Testimonials Section -->
<section id="testimonials" class="min-h-screen flex items-center py-16 md:py-24 lg:py-32">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl">
		<div class="text-center max-w-4xl mx-auto mb-16">
			<Badge variant="secondary" class="mb-4">Testimonials</Badge>
			<h2 class="text-3xl md:text-5xl font-bold mb-6">
				Trusted by <span class="text-primary font-extrabold">Top Operators</span>
			</h2>
		</div>

		<div class="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
			{#each [
				{
					name: "Marcus Chen",
					role: "GP, $500M AUM",
					quote: "deed.guru cut our underwriting time from 3 hours to 10 minutes. We've analyzed 150+ deals and closed 3 in 60 days.",
					rating: 5
				},
				{
					name: "Sarah Williams",
					role: "Syndicator, 2,400 units",
					quote: "The Live Hunt feature is insane. Found a 280-unit value-add deal in Phoenix that nobody else saw. Scored 92/100 - we're closing next month.",
					rating: 5
				},
				{
					name: "David Rodriguez",
					role: "Fund Manager",
					quote: "Best PropTech tool I've used. The deed.guru scoring is spot-on with Grant's methodology. Worth 10x the price.",
					rating: 5
				}
			] as testimonial}
				<Card>
					<CardHeader>
						<div class="flex items-center gap-1 text-yellow-500 mb-2">
							{#each Array(testimonial.rating) as _}
								<span>⭐</span>
							{/each}
						</div>
						<CardDescription class="text-base">
							"{testimonial.quote}"
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div>
							<p class="font-semibold">{testimonial.name}</p>
							<p class="text-sm text-muted-foreground">{testimonial.role}</p>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 to-black text-white">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl text-center">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-3xl md:text-5xl font-bold mb-6">
				Ready to Find Your Next deed.guru?
			</h2>
			<p class="text-xl md:text-2xl mb-10 text-green-50 max-w-3xl mx-auto">
				Join 500+ investors using AI to dominate multifamily. Start your free trial today.
			</p>
		</div>
		<div class="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
			<Button size="lg" variant="secondary" class="text-lg px-8 py-6" href="/signup">
				Start Free Trial (No Credit Card)
			</Button>
			<Button size="lg" variant="outline" class="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary dark:hover:text-primary" href="/pricing">
				View Pricing
			</Button>
		</div>
	</div>
</section>
