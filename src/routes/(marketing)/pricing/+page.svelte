<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	const plans = [
		{
			name: "Free",
			price: 0,
			period: "forever",
			description: "Perfect for trying out deed.guru",
			features: [
				"5 live hunts per day",
				"10 saved deals",
				"Basic deed.guru scoring",
				"Radar chart visualization",
				"Community support",
			],
			limitations: [
				"No document upload",
				"No PDF exports",
				"No team collaboration",
			],
			cta: "Start Free",
			href: "/signup",
			popular: false,
		},
		{
			name: "Pro",
			price: 99,
			period: "month",
			description: "For serious investors and syndicators",
			features: [
				"Unlimited live hunts",
				"Unlimited saved deals",
				"Advanced deed.guru scoring",
				"AI document extraction",
				"PDF/Excel exports",
				"Market intelligence",
				"Email support",
				"Deal alerts",
			],
			limitations: [],
			cta: "Start 14-Day Trial",
			href: "/signup?plan=pro",
			popular: true,
		},
		{
			name: "Syndicate",
			price: 299,
			period: "month",
			description: "For teams and fund managers",
			features: [
				"Everything in Pro",
				"Team workspaces (5 users)",
				"API access",
				"Batch deal processing",
				"Custom integrations",
				"White-label reports",
				"Priority support",
				"Dedicated account manager",
			],
			limitations: [],
			cta: "Contact Sales",
			href: "/contact?plan=syndicate",
			popular: false,
		},
	];
</script>

<svelte:head>
	<title>Pricing - deed.guru</title>
	<meta name="description" content="Choose the perfect plan for your multifamily investment business. Free trial available." />
</svelte:head>

<!-- Hero -->
<section class="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl text-center max-w-4xl">
		<Badge variant="secondary" class="mb-4">Pricing</Badge>
		<h1 class="text-4xl md:text-6xl font-bold mb-6">
			Simple, Transparent Pricing
		</h1>
		<p class="text-xl text-muted-foreground mb-8">
			Start free. Upgrade when you're ready. Cancel anytime.
		</p>
	</div>
</section>

<!-- Pricing Cards -->
<section class="py-12 -mt-16 relative z-10">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl">
		<div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			{#each plans as plan}
				<Card class={plan.popular ? "border-primary border-2 shadow-2xl scale-105" : ""}>
					<CardHeader>
						{#if plan.popular}
							<Badge class="w-fit mb-2 bg-primary text-primary-foreground">Most Popular</Badge>
						{/if}
						<CardTitle class="text-2xl">{plan.name}</CardTitle>
						<CardDescription>{plan.description}</CardDescription>
						<div class="mt-4">
							<span class="text-5xl font-bold">${plan.price}</span>
							{#if plan.price > 0}
								<span class="text-muted-foreground">/{plan.period}</span>
							{:else}
								<span class="text-muted-foreground">{plan.period}</span>
							{/if}
						</div>
					</CardHeader>
					<CardContent class="space-y-6">
						<!-- Features -->
						<ul class="space-y-3">
							{#each plan.features as feature}
								<li class="flex items-start gap-2 text-sm">
									<span class="text-primary font-bold">✓</span>
									<span>{feature}</span>
								</li>
							{/each}
							{#each plan.limitations as limitation}
								<li class="flex items-start gap-2 text-sm text-muted-foreground">
									<span class="text-red-500 font-bold">✗</span>
									<span>{limitation}</span>
								</li>
							{/each}
						</ul>

						<!-- CTA -->
						<Button
							href={plan.href}
							size="lg"
							variant={plan.popular ? "default" : "outline"}
							class="w-full"
						>
							{plan.cta}
						</Button>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section class="py-20 md:py-32">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl max-w-3xl">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold mb-4">
				Frequently Asked Questions
			</h2>
		</div>

		<div class="space-y-6">
			{#each [
				{
					q: "How does the free trial work?",
					a: "All paid plans include a 14-day free trial. No credit card required. Cancel anytime before the trial ends and you won't be charged."
				},
				{
					q: "Can I switch plans later?",
					a: "Yes! You can upgrade or downgrade at any time. When upgrading, you'll only pay the prorated difference. Downgrades take effect at the next billing cycle."
				},
				{
					q: "What payment methods do you accept?",
					a: "We accept all major credit cards (Visa, Mastercard, Amex) and ACH transfers for annual plans. Payment processing is handled securely by Stripe."
				},
				{
					q: "How accurate is the AI extraction?",
					a: "Our AI achieves 95%+ accuracy on standard OMs and rent rolls. You can always manually adjust any extracted data before saving."
				},
				{
					q: "Do you offer annual pricing?",
					a: "Yes! Save 20% with annual billing. Contact sales for custom enterprise pricing and multi-year contracts."
				},
				{
					q: "What markets are covered in Live Hunt?",
					a: "Currently: Austin, Orlando, Phoenix, Nashville, Jacksonville, Dallas, Houston, San Antonio, Tampa, Charlotte, Atlanta, Raleigh, and 20+ more sunbelt markets."
				},
			] as faq}
				<Card>
					<CardHeader>
						<CardTitle class="text-lg">{faq.q}</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-muted-foreground">{faq.a}</p>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Final CTA -->
<section class="py-20 bg-muted/20">
	<div class="w-full mx-auto px-6 sm:px-8 md:px-12 lg:max-w-7xl text-center max-w-3xl">
		<h2 class="text-3xl md:text-4xl font-bold mb-4">
			Still Have Questions?
		</h2>
		<p class="text-lg text-muted-foreground mb-8">
			Book a demo with our team to see deed.guru in action.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<Button size="lg" href="/contact">
				Schedule a Demo
			</Button>
			<Button size="lg" variant="outline" href="/signup">
				Start Free Trial
			</Button>
		</div>
	</div>
</section>
