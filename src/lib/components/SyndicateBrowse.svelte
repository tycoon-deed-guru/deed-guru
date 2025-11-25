<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Alert } from '$lib/components/ui/alert';
	import { onMount } from 'svelte';

	let syndications: any[] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);
	let selectedSyndication: any = $state(null);

	// Investment form state
	let investmentAmount = $state<number>(50000);
	let hederaWalletAddress = $state<string>('');
	let investing = $state(false);
	let investmentSuccess = $state<string | null>(null);

	onMount(async () => {
		await loadSyndications();
	});

	async function loadSyndications() {
		loading = true;
		error = null;

		try {
			const response = await fetch('/api/syndicate/list?status=active');
			if (!response.ok) throw new Error('Failed to load syndications');

			const data = await response.json();
			syndications = data.syndications;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load syndications';
		} finally {
			loading = false;
		}
	}

	async function invest() {
		if (!selectedSyndication) return;

		investing = true;
		error = null;
		investmentSuccess = null;

		try {
			const response = await fetch('/api/syndicate/invest', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					syndicationId: selectedSyndication.id,
					amountUSD: investmentAmount,
					investorHederaAccount: hederaWalletAddress,
					paymentMethod: 'crypto'
				})
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.message || 'Investment failed');
			}

			const data = await response.json();
			investmentSuccess = data.message;

			// Refresh syndications
			await loadSyndications();

			// Close investment modal after 2 seconds
			setTimeout(() => {
				selectedSyndication = null;
				investmentAmount = 50000;
				hederaWalletAddress = '';
			}, 2000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Investment failed';
		} finally {
			investing = false;
		}
	}

	function formatCurrency(value: number | string): string {
		const num = typeof value === 'string' ? parseFloat(value) : value;
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num);
	}

	function calculateProgress(raised: number | string, total: number | string): number {
		const raisedNum = typeof raised === 'string' ? parseFloat(raised) : raised;
		const totalNum = typeof total === 'string' ? parseFloat(total) : total;
		return (raisedNum / totalNum) * 100;
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<div>
			<h2 class="text-3xl font-bold">Active Syndications</h2>
			<p class="text-muted-foreground mt-1">
				Invest in tokenized multifamily deals on Hedera Hashgraph
			</p>
		</div>
		<Button onclick={loadSyndications} variant="outline">
			🔄 Refresh
		</Button>
	</div>

	{#if error}
		<Alert variant="destructive">
			<p>{error}</p>
		</Alert>
	{/if}

	{#if loading}
		<div class="flex justify-center items-center py-12">
			<p class="text-muted-foreground">Loading syndications...</p>
		</div>
	{:else if syndications.length === 0}
		<Card class="p-12 text-center">
			<CardContent>
				<p class="text-xl text-muted-foreground">
					No active syndications at this time
				</p>
				<p class="text-sm text-muted-foreground mt-2">
					Check back soon for new tokenized real estate opportunities
				</p>
			</CardContent>
		</Card>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{#each syndications as syndication}
				{@const progress = calculateProgress(syndication.amountRaisedUSD, syndication.totalRaiseUSD)}
				{@const remaining = parseFloat(syndication.totalRaiseUSD) - parseFloat(syndication.amountRaisedUSD)}

				<Card class="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<CardTitle class="text-xl">{syndication.property?.name || 'Unnamed Property'}</CardTitle>
								<CardDescription class="mt-1">
									Token: <span class="font-mono font-semibold">{syndication.tokenSymbol}</span>
								</CardDescription>
							</div>
							<Badge class="text-lg px-3 py-1">
								{progress.toFixed(0)}% Funded
							</Badge>
						</div>
					</CardHeader>

					<CardContent class="space-y-4">
						<!-- Progress Bar -->
						<div>
							<div class="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
								<div
									class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
									style="width: {Math.min(progress, 100)}%"
								></div>
							</div>
							<div class="flex justify-between mt-2 text-sm">
								<span class="text-muted-foreground">
									Raised: {formatCurrency(syndication.amountRaisedUSD)}
								</span>
								<span class="font-semibold">
									Goal: {formatCurrency(syndication.totalRaiseUSD)}
								</span>
							</div>
						</div>

						<!-- Key Metrics -->
						<div class="grid grid-cols-3 gap-3 text-sm">
							<div>
								<p class="text-muted-foreground">Min. Investment</p>
								<p class="font-bold">{formatCurrency(syndication.minInvestmentUSD)}</p>
							</div>
							<div>
								<p class="text-muted-foreground">Investors</p>
								<p class="font-bold">{syndication.investorCount}</p>
							</div>
							<div>
								<p class="text-muted-foreground">Remaining</p>
								<p class="font-bold">{formatCurrency(remaining)}</p>
							</div>
						</div>

						<!-- Property Score -->
						{#if syndication.property}
							<div class="bg-muted/50 rounded-lg p-3">
								<div class="flex justify-between items-center">
									<span class="text-sm text-muted-foreground">deed.guru Score</span>
									<div class="flex items-center gap-2">
										<span class="text-2xl font-bold text-primary">
											{syndication.property.totalScore}/100
										</span>
										<Badge>{syndication.property.grade}</Badge>
									</div>
								</div>
							</div>
						{/if}

						<!-- Compliance Badges -->
						<div class="flex gap-2 flex-wrap">
							<Badge variant="secondary">{syndication.regulationType?.toUpperCase() || 'REG D'}</Badge>
							{#if syndication.accreditedOnly}
								<Badge variant="secondary">Accredited Only</Badge>
							{/if}
							<Badge variant="secondary">Hedera Token</Badge>
						</div>

						<!-- Actions -->
						<div class="flex gap-2 pt-2">
							<Button
								onclick={() => selectedSyndication = syndication}
								class="flex-1"
								disabled={remaining <= 0}
							>
								💰 Invest Now
							</Button>
							<Button
								variant="outline"
								class="flex-1"
								onclick={() => window.open(syndication.explorerUrl, '_blank')}
							>
								🔍 View on HashScan
							</Button>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{/if}

	<!-- Investment Modal -->
	{#if selectedSyndication}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<Card class="max-w-2xl w-full">
				<CardHeader>
					<div class="flex justify-between items-start">
						<div>
							<CardTitle class="text-2xl">Invest in Syndication</CardTitle>
							<CardDescription class="mt-2">
								{selectedSyndication.property?.name || 'Property'}
							</CardDescription>
						</div>
						<Button variant="ghost" size="sm" onclick={() => selectedSyndication = null}>
							✕
						</Button>
					</div>
				</CardHeader>

				<CardContent class="space-y-6">
					<!-- Investment Amount -->
					<div class="space-y-2">
						<label for="investAmount" class="text-sm font-medium">
							Investment Amount (USD)
						</label>
						<Input
							id="investAmount"
							type="number"
							bind:value={investmentAmount}
							min={parseFloat(selectedSyndication.minInvestmentUSD)}
							max={parseFloat(selectedSyndication.maxInvestmentUSD) || Infinity}
							step={1000}
							disabled={investing}
						/>
						<p class="text-xs text-muted-foreground">
							Min: {formatCurrency(selectedSyndication.minInvestmentUSD)}
							{#if selectedSyndication.maxInvestmentUSD}
								| Max: {formatCurrency(selectedSyndication.maxInvestmentUSD)}
							{/if}
						</p>
					</div>

					<!-- Hedera Wallet -->
					<div class="space-y-2">
						<label for="wallet" class="text-sm font-medium">
							Your Hedera Wallet Address
						</label>
						<Input
							id="wallet"
							type="text"
							bind:value={hederaWalletAddress}
							placeholder="0.0.123456"
							disabled={investing}
						/>
						<p class="text-xs text-muted-foreground">
							Don't have a wallet? Get <a href="https://www.hashpack.app/" target="_blank" class="text-blue-500 hover:underline">HashPack</a> (free)
						</p>
					</div>

					<!-- Ownership Preview -->
					{@const tokenAmount = Math.floor((investmentAmount / parseFloat(selectedSyndication.totalRaiseUSD)) * selectedSyndication.totalTokens)}
					{@const ownershipPct = ((investmentAmount / parseFloat(selectedSyndication.totalRaiseUSD)) * 100).toFixed(3)}

					<div class="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-2">
						<p class="font-semibold">You will receive:</p>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-sm text-muted-foreground">Tokens</p>
								<p class="text-xl font-bold font-mono">{tokenAmount.toLocaleString()}</p>
							</div>
							<div>
								<p class="text-sm text-muted-foreground">Ownership</p>
								<p class="text-xl font-bold">{ownershipPct}%</p>
							</div>
						</div>
					</div>

					{#if investmentSuccess}
						<Alert class="bg-green-50 dark:bg-green-950 border-green-200">
							<p class="text-green-800 dark:text-green-200">{investmentSuccess}</p>
						</Alert>
					{/if}

					{#if error}
						<Alert variant="destructive">
							<p>{error}</p>
						</Alert>
					{/if}

					<!-- Actions -->
					<div class="flex gap-3">
						<Button
							onclick={() => selectedSyndication = null}
							variant="outline"
							class="flex-1"
							disabled={investing}
						>
							Cancel
						</Button>
						<Button
							onclick={invest}
							class="flex-1"
							disabled={investing || !hederaWalletAddress || investmentAmount < parseFloat(selectedSyndication.minInvestmentUSD)}
						>
							{investing ? '🔄 Processing...' : `💎 Invest ${formatCurrency(investmentAmount)}`}
						</Button>
					</div>

					<p class="text-xs text-muted-foreground text-center">
						This is a demo. In production, payment processing and KYC/AML verification would occur before token transfer.
					</p>
				</CardContent>
			</Card>
		</div>
	{/if}
</div>
