<script lang="ts">
	import IconList from "./IconList.svelte";
	import { onMount } from "svelte";
	import { debounce } from "lodash-es";
	import type { Icon } from "../../models/Icon";
	import type { IconOrigin } from "../../models/Icon";
	import { Accordion } from "@skeletonlabs/skeleton-svelte";
	import ChevronDown from "lucide-svelte/icons/chevron-down";

	const { icons = [], onSearchIcons, onLoadDefaultIcons, onSetEmptyIcons, onSelectIcon, debounceTimeMs = 500 } = $props<{
		icons: Icon[];
		onSearchIcons: (searchTerm: string) => Promise<void>;
		onLoadDefaultIcons: () => void;
		onSetEmptyIcons: () => void;
		onSelectIcon: (icon: Icon) => void;
		debounceTimeMs?: number;
	}>();

	let searchTerm = $state("");
	let placeholder = $state("");
	let isLoading = $state(false);
	let error = $state("");
	let expandedGroups = $state<string[]>(["mdi", "homarr", "streamdeck"]);

	const placeholders = [
		"Search for icons...",
		"Try searching for 'dashboard'...",
		"Try searching for 'server'..."
	];

	// Group icons by their origin
	function groupIconsByOrigin(icons: Icon[]): Record<IconOrigin, Icon[]> {
		return icons.reduce((groups: Record<IconOrigin, Icon[]>, icon: Icon) => {
			const origin = icon.origin;
			if (!groups[origin]) {
				groups[origin] = [];
			}
			groups[origin].push(icon);
			return groups;
		}, {} as Record<IconOrigin, Icon[]>);
	}

	// Use the extracted function in $derived
	const groupedIcons = $derived(groupIconsByOrigin(icons));

	const performSearch = async (term: string) => {
		if (!term) {
			onLoadDefaultIcons();
			return;
		} else if (term.length <= 2) {
			onSetEmptyIcons();
			return;
		}

		try {
			await onSearchIcons(term);
		} catch (e: any) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	};

	const searchIcons = debounce(performSearch, debounceTimeMs);

	const handleSearchInput = () => {
		isLoading = true;
		error = "";
		searchIcons(searchTerm);
	};

	onMount(() => {
		placeholder = placeholders[0];
		setInterval(() => {
			const currentIndex = placeholders.findIndex(str => str === placeholder);
			placeholder = placeholders[currentIndex + 1] ?? placeholders[0];
		}, 3000);
	});
</script>

<div class="flex h-full flex-col gap-4">
	<input
		class="input"
		type="search"
		{placeholder}
		data-testid="search-field"
		bind:value={searchTerm}
		oninput={handleSearchInput} />

	{#if isLoading}
		<div>Loading...</div>
	{:else if error}
		<div class="alert alert-error" role="alert">
			{error}
		</div>
	{:else}
		<div class="flex flex-1 flex-col gap-4 overflow-y-auto">
			<Accordion value={expandedGroups} onValueChange={(e) => (expandedGroups = e.value)} multiple>
				{#each Object.entries(groupedIcons) as [origin, groupIcons] (origin)}
					{#if (groupIcons as Icon[]).length > 0}
						<Accordion.Item value={origin}>
							{#snippet lead()}<ChevronDown size={20} />{/snippet}
							{#snippet control()}<span class="capitalize">{origin} Icons ({(groupIcons as Icon[]).length})</span>{/snippet}
							{#snippet panel()}
								<div class="pt-2">
									<IconList icons={groupIcons as Icon[]} {onSelectIcon} />
								</div>
							{/snippet}
						</Accordion.Item>
					{/if}
				{/each}
			</Accordion>
		</div>
	{/if}
</div>

<style lang="postcss">
	:global(.accordion-item-lead) {
		@apply transition-transform;
	}
	:global(.accordion-item[data-state='open'] .accordion-item-lead) {
		@apply rotate-180;
	}
</style>
