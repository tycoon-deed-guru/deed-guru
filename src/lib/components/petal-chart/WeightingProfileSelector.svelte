<script lang="ts">
	import { Select } from 'bits-ui';
	import { Check, ChevronDown, Sliders } from 'lucide-svelte';
	import type { PetalCategory } from '$lib/types/petal-chart.types';
	import { PETAL_LABELS } from '$lib/types/petal-chart.types';
	import { WEIGHTING_PROFILES, type WeightingProfile } from '$lib/types/scoring.types';

	interface Props {
		selectedProfile?: string;
		customWeights?: Record<PetalCategory, number>;
		onProfileChange?: (profile: WeightingProfile) => void;
		onCustomWeightsChange?: (weights: Record<PetalCategory, number>) => void;
		showCustomEditor?: boolean;
	}

	let {
		selectedProfile = 'equal',
		customWeights = $bindable(),
		onProfileChange,
		onCustomWeightsChange,
		showCustomEditor = false
	}: Props = $props();

	let isCustomMode = $state(selectedProfile === 'custom');
	let localWeights = $state<Record<PetalCategory, number>>(
		customWeights ?? WEIGHTING_PROFILES.find((p) => p.id === 'equal')!.weights
	);

	const currentProfile = $derived(WEIGHTING_PROFILES.find((p) => p.id === selectedProfile));

	function handleProfileSelect(profileId: string) {
		const profile = WEIGHTING_PROFILES.find((p) => p.id === profileId);
		if (profile) {
			selectedProfile = profileId;
			isCustomMode = profileId === 'custom';
			if (!isCustomMode) {
				localWeights = { ...profile.weights };
			}
			onProfileChange?.(profile);
		}
	}

	function handleWeightChange(category: PetalCategory, value: number) {
		const newWeights = { ...localWeights, [category]: value / 100 };
		// Normalize weights to sum to 1
		const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
		if (total > 0) {
			for (const key of Object.keys(newWeights)) {
				newWeights[key as PetalCategory] = newWeights[key as PetalCategory] / total;
			}
		}
		localWeights = newWeights;
		customWeights = newWeights;
		onCustomWeightsChange?.(newWeights);
	}

	function formatPercent(value: number): string {
		return `${Math.round(value * 100)}%`;
	}
</script>

<div class="weighting-profile-selector">
	<div class="selector-header">
		<Sliders class="h-4 w-4 text-muted-foreground" />
		<span class="text-sm font-medium">Weighting Profile</span>
	</div>

	<Select.Root type="single" value={selectedProfile} onValueChange={handleProfileSelect}>
		<Select.Trigger
			class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
		>
			<span>{currentProfile?.name ?? 'Select profile'}</span>
			<ChevronDown class="h-4 w-4 opacity-50" />
		</Select.Trigger>
		<Select.Content
			class="z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
		>
			{#each WEIGHTING_PROFILES as profile}
				<Select.Item
					value={profile.id}
					class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
				>
					{#if selectedProfile === profile.id}
						<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
							<Check class="h-4 w-4" />
						</span>
					{/if}
					<div class="flex flex-col">
						<span class="font-medium">{profile.name}</span>
						<span class="text-xs text-muted-foreground">{profile.description}</span>
					</div>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	{#if currentProfile && !isCustomMode}
		<div class="weights-preview">
			<div class="weights-grid">
				{#each Object.entries(currentProfile.weights) as [category, weight]}
					<div class="weight-item">
						<span class="weight-label">{PETAL_LABELS[category as PetalCategory]}</span>
						<span class="weight-value">{formatPercent(weight)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if isCustomMode && showCustomEditor}
		<div class="custom-weights-editor">
			<p class="text-xs text-muted-foreground mb-3">
				Adjust weights for each petal. Values will auto-normalize to 100%.
			</p>
			<div class="sliders-grid">
				{#each Object.entries(localWeights) as [category, weight]}
					<div class="slider-row">
						<label for={category} class="slider-label">
							{PETAL_LABELS[category as PetalCategory]}
						</label>
						<input
							type="range"
							id={category}
							min="0"
							max="40"
							value={Math.round(weight * 100)}
							oninput={(e) =>
								handleWeightChange(category as PetalCategory, Number(e.currentTarget.value))}
							class="slider"
						/>
						<span class="slider-value">{formatPercent(weight)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.weighting-profile-selector {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.selector-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.weights-preview {
		padding: 0.75rem;
		background: var(--muted);
		border-radius: 0.5rem;
	}

	.weights-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}

	.weight-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.75rem;
	}

	.weight-label {
		color: var(--muted-foreground);
	}

	.weight-value {
		font-weight: 600;
		color: var(--foreground);
	}

	.custom-weights-editor {
		padding: 0.75rem;
		background: var(--muted);
		border-radius: 0.5rem;
	}

	.sliders-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.slider-row {
		display: grid;
		grid-template-columns: 100px 1fr 45px;
		align-items: center;
		gap: 0.5rem;
	}

	.slider-label {
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}

	.slider {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: var(--border);
		appearance: none;
		cursor: pointer;
	}

	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--primary);
		cursor: pointer;
	}

	.slider-value {
		font-size: 0.75rem;
		font-weight: 600;
		text-align: right;
	}
</style>
