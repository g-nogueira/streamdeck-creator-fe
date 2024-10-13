<script lang="ts">
	import { onMount } from 'svelte';
	import { selectCollection, selectedCollection, UserIconCollectionService } from '../stores';
	import  { userIconCollection } from '../models/UserIconCollection';
	import { userIconCollections } from '../stores/UserIconCollection.Store';

	export let classNames: string = '';

	onMount(async () => {
		const collectionsResponse = await UserIconCollectionService.fetchList();

		// Create new collection if there are no collections
		if (collectionsResponse.length === 0) {
			let newCollection = userIconCollection.mkEmpty();
		
			newCollection.id = await UserIconCollectionService.create(newCollection);
		
			userIconCollections.upsertCollection(newCollection);
			selectCollection(newCollection);
			return;
		}

		// Select the first collectiCollections only one
		if (collectionsResponse.length === 1) {
			selectCollection(collectionsResponse[0]);
		}

		userIconCollections.set(collectionsResponse);
	});

</script>

<div class="h-full flex-grow w-0 flex flex-col">
	<div class={`py-8 px-4 grid grid-cols-4 gap-y-8 ${classNames}`}>
		<!-- Vertical list of collections -->
		{#each $userIconCollections as collection}
		<button type="button" class="flex items-center border-b border-gray-700 h-12" on:click={() => selectCollection(collection)} aria-label="Select collection {collection.name}">
			{collection.name}
		</button>
		{/each}
	</div>
</div>
