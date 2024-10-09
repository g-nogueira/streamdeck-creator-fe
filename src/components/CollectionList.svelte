<script lang="ts">
	import { onMount } from 'svelte';
	import { collections, selectCollection, selectedCollection, upsertUserIconCollections, UserIconCollectionService, type UserIconCollection } from '../stores';
	import { UUID } from '$lib';

	export let classNames: string = '';


	async function createCollection() {
		const newCollection = {
			id: UUID.empty,
			name: 'New Collection',
			icons: [],
		} as UserIconCollection;

		newCollection.id = await UserIconCollectionService.create(newCollection);

		upsertUserIconCollections(newCollection);
		selectCollection(newCollection);
	}

	onMount(async () => {
		const collectionsResponse = await UserIconCollectionService.fetchList();

		// Create new collection if there are no collections
		if (collectionsResponse.length === 0) {
			createCollection();
			return;
		}

		// Select the first collectiCollections only one
		if (collectionsResponse.length === 1) {
			selectCollection(collectionsResponse[0]);
		}

		collections.set(collectionsResponse);
	});

</script>

<div class="h-full flex-grow w-0 flex flex-col">
	<div class={`py-8 px-4 grid grid-cols-4 gap-y-8 ${classNames}`}>
		<!-- Vertical list of collections -->
		{#each $collections as collection}
		<button type="button" class="flex items-center border-b border-gray-700 h-12" on:click={() => selectCollection(collection)} aria-label="Select collection {collection.name}">
			{collection.name}
		</button>
		{/each}
	</div>
</div>
