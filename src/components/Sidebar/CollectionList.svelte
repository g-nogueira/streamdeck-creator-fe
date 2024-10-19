<script lang="ts">
	import { onMount } from 'svelte';
	import * as _userIconCollection from '../../models/UserIconCollection';
	import { userIconCollections } from '../../stores/user-icon-collection.store';
	import { UserIconCollectionService } from '../../services/user-icon-collection.service';
	import { selectedCollection } from '../../stores/selected-collection.store';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import * as _selectedIcon from '../../models/SelectedIcon';
	import LibraryIcon from 'lucide-svelte/icons/library';
	import CollectionIcons from './CollectionIcons.svelte';
	import CollectionToolbar from './CollectionToolbar.svelte';

	let selectedAccordionItem = $state<string[]>([]);

	onMount(async () => {
		const collectionsResponse = await UserIconCollectionService.fetchList();

		// Create new collection if there are no collections
		if (collectionsResponse.length === 0) {
			let newCollection = _userIconCollection.mkEmpty();

			newCollection.id = await UserIconCollectionService.create(newCollection);

			userIconCollections.upsertCollection(newCollection);
			selectedCollection.selectCollection(newCollection);
			return;
		}

		// Select the first collection if there is only one
		if (collectionsResponse.length === 1) {
			selectedCollection.selectCollection(collectionsResponse[0]);
		}

		userIconCollections.set(collectionsResponse);

		// Expand the accordion item if there's a selected collection
		if ($selectedCollection?.id) {
			selectedAccordionItem = [$selectedCollection.id];
		}
	});

	/**
	 * Selects a collection by its id
	 * @param id
	 */
	function selectCollectionById(id: string) {
		const collections = $userIconCollections;
		const collection = collections.find((c) => c.id === id);

		if (!collection) {
			throw new Error(`Collection with id ${id} not found`);
		}

		selectedCollection.selectCollection(collection);
	}

	$effect(() => {
		if (!selectedAccordionItem || selectedAccordionItem?.length === 0) {
			return;
		}

		selectCollectionById(selectedAccordionItem[0]);
	});
</script>

<Accordion bind:value={selectedAccordionItem} collapsible>
	{#each $userIconCollections as collection}
		<Accordion.Item value={collection.id}>
			<!-- Control -->
			{#snippet lead()}<LibraryIcon size={24} />{/snippet}
			{#snippet control()}{collection.name}{/snippet}
			<!-- Panel -->
			{#snippet panel()}
				<CollectionToolbar />
				<CollectionIcons {collection} />
			{/snippet}
		</Accordion.Item>
		<hr class="hr" />
	{/each}
</Accordion>
