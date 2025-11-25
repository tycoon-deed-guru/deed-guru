<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Alert } from '$lib/components/ui/alert';
	import type { Property } from '$lib/types';

	interface Props {
		property: Property;
		onClose: () => void;
		onSuccess?: (syndicationId: string) => void;
	}

	let { property, onClose, onSuccess }: Props = $props();

	let totalRaiseUSD = $state<number>(10_000_000);
	let minInvestmentUSD = $state<number>(50_000);
	let maxInvestmentUSD = $state<number>(500_000);
	let targetCloseDate = $state<string>('');
	let regulationType = $state<string>('reg_d');
	let accreditedOnly = $state<boolean>(true);

	let creating = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);

	// Calculate token economics
	const tokenSymbol = $derived(generateTokenSymbol(property.name));
	const totalTokens = $derived(Math.floor(totalRaiseUSD * 1000)); // $1 = 1000 tokens
	const pricePerToken = $derived((totalRaiseUSD / totalTokens).toFixed(4));
	const minTokens = $derived(Math.floor((minInvestmentUSD / totalRaiseUSD) * totalTokens));
	const minOwnership = $derived(((minInvestmentUSD / totalRaiseUSD) * 100).toFixed(3));

	function generateTokenSymbol(name: string): string {
		const words = name.split(' ').filter(w => w.length > 2).slice(0, 3);
		const initials = words.map(w => w[0].toUpperCase()).join('');
		return `${initials}deed.guru`.slice(0, 8);
	}

	async function createSyndication() {
		creating = true;
		error = null;
		success = null;

		try {
			const response = await fetch('/api/syndicate/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					propertyId: property.id,
					totalRaiseUSD,
					minInvestmentUSD,
					maxInvestmentUSD: maxInvestmentUSD > 0 ? maxInvestmentUSD : null,
					targetCloseDate: targetCloseDate || null,
					regulationType,
					accreditedOnly
				})
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.message || 'Failed to create syndication');
			}

			const data = await response.json();
			success = `Syndication created! Token ID: ${data.hedera.tokenId}`;

			if (onSuccess) {
				onSuccess(data.syndication.id);
			}

			// Close modal after 2 seconds
			setTimeout(() => {
				onClose();
			}, 2000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create syndication';
			console.error('Syndication error:', err);
		} finally {
			creating = false;
		}
	}
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
	<Card class="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
		<CardHeader>
			<div class="flex justify-between items-start">
				<div>
					<CardTitle class="text-2xl">Tokenize & Syndicate Deal</CardTitle>
					<CardDescription class="mt-2">
						Create fractional ownership tokens on Hedera Hashgraph
					</CardDescription>
				</div>
				<Button variant="ghost" size="sm" onclick={onClose}>✕</Button>
			</div>
		</CardHeader>

		<CardContent class="space-y-6">
			<!-- Property Summary -->
			<div class="bg-muted/50 rounded-lg p-4">
				<h3 class="font-semibold text-lg mb-2">{property.name}</h3>
				<div class="grid grid-cols-2 gap-2 text-sm">
					<div>
						<span class="text-muted-foreground">deed.guru Score:</span>
						<span class="ml-2 font-bold">{property.totalScore}/100</span>
					</div>
					<div>
						<span class="text-muted-foreground">Grade:</span>
						<Badge class="ml-2">{property.grade}</Badge>
					</div>
				</div>
			</div>

			<!-- Syndication Terms -->
			<div class="space-y-4">
				<h3 class="font-semibold">Syndication Terms</h3>

				<div class="space-y-2">
					<Label for="totalRaise">Total Capital Raise (USD)</Label>
					<Input
						id="totalRaise"
						type="number"
						bind:value={totalRaiseUSD}
						min={100000}
						step={100000}
						disabled={creating}
					/>
					<p class="text-xs text-muted-foreground">
						Target amount to raise from investors
					</p>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="minInvestment">Minimum Investment (USD)</Label>
						<Input
							id="minInvestment"
							type="number"
							bind:value={minInvestmentUSD}
							min={1000}
							step={1000}
							disabled={creating}
						/>
					</div>

					<div class="space-y-2">
						<Label for="maxInvestment">Maximum Investment (USD, Optional)</Label>
						<Input
							id="maxInvestment"
							type="number"
							bind:value={maxInvestmentUSD}
							min={0}
							step={10000}
							disabled={creating}
						/>
					</div>
				</div>

				<div class="space-y-2">
					<Label for="targetDate">Target Close Date (Optional)</Label>
					<Input
						id="targetDate"
						type="date"
						bind:value={targetCloseDate}
						disabled={creating}
					/>
				</div>

				<div class="space-y-2">
					<Label for="regulation">Regulation Type</Label>
					<select
						id="regulation"
						bind:value={regulationType}
						disabled={creating}
						class="w-full rounded-md border border-input bg-background px-3 py-2"
					>
						<option value="reg_d">Reg D (Accredited Only)</option>
						<option value="reg_a">Reg A+ (Open to All)</option>
						<option value="reg_s">Reg S (International)</option>
					</select>
				</div>

				<div class="flex items-center gap-2">
					<input
						type="checkbox"
						id="accredited"
						bind:checked={accreditedOnly}
						disabled={creating}
						class="rounded border-gray-300"
					/>
					<Label for="accredited" class="cursor-pointer">
						Accredited Investors Only
					</Label>
				</div>
			</div>

			<!-- Token Economics Preview -->
			<div class="space-y-4 border-t pt-4">
				<h3 class="font-semibold">Token Economics (Hedera)</h3>

				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
					<div>
						<p class="text-muted-foreground">Token Symbol</p>
						<p class="font-mono font-bold text-lg">{tokenSymbol}</p>
					</div>
					<div>
						<p class="text-muted-foreground">Total Tokens</p>
						<p class="font-bold text-lg">{totalTokens.toLocaleString()}</p>
					</div>
					<div>
						<p class="text-muted-foreground">Price per Token</p>
						<p class="font-bold text-lg">${pricePerToken}</p>
					</div>
					<div>
						<p class="text-muted-foreground">Min. Ownership</p>
						<p class="font-bold text-lg">{minOwnership}%</p>
					</div>
				</div>

				<div class="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-2">
					<p class="text-sm font-semibold flex items-center gap-2">
						<span>ℹ️</span>
						<span>How Tokenization Works</span>
					</p>
					<ul class="text-xs space-y-1 text-muted-foreground ml-6">
						<li>• Tokens created on Hedera Hashgraph (enterprise-grade, carbon-negative)</li>
						<li>• Each token = fractional ownership in this property</li>
						<li>• Transaction fees: ~$0.0001 (vs $50+ on Ethereum)</li>
						<li>• Instant liquidity via secondary trading (future feature)</li>
						<li>• Compliance-ready (KYC/AML, Reg D/A+ supported)</li>
					</ul>
				</div>
			</div>

			<!-- Error/Success Messages -->
			{#if error}
				<Alert variant="destructive">
					<p>{error}</p>
				</Alert>
			{/if}

			{#if success}
				<Alert class="bg-green-50 dark:bg-green-950 border-green-200">
					<p class="text-green-800 dark:text-green-200">{success}</p>
				</Alert>
			{/if}

			<!-- Actions -->
			<div class="flex gap-3 pt-4">
				<Button onclick={onClose} variant="outline" class="flex-1" disabled={creating}>
					Cancel
				</Button>
				<Button onclick={createSyndication} class="flex-1" disabled={creating}>
					{creating ? '🔄 Creating on Hedera...' : '🚀 Create Syndication'}
				</Button>
			</div>

			<p class="text-xs text-muted-foreground text-center">
				By creating this syndication, you agree to comply with SEC regulations and Hedera network terms.
			</p>
		</CardContent>
	</Card>
</div>
