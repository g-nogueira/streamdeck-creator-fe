<script lang="ts">
	import { onMount } from 'svelte';
	import { collections, selectedCollection } from '../stores';
	import type { CollectionDto } from '../stores';
	import { mkEmptyUuid } from '$lib';

	export let classNames: string = '';


	function selectCollection(collection: CollectionDto) {
		selectedCollection.set(collection);
	}

	async function createCollection() {
		const newCollection = {
			id: mkEmptyUuid(),
			name: 'New Collection',
			icons: [],
		} as CollectionDto;

		const response = await fetch(`http://localhost:5199/collections`, {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify(newCollection),
		});

		if (!response.ok) {
			console.error('Failed to create collection');
			throw new Error('Failed to create collection');
		}

		newCollection.id = await response.json();

		collections.update((collections) => {
			collections.push(newCollection);
			return collections;
		});

		selectedCollection.set(newCollection);
	}

	onMount(async () => {
		const response = await fetch('http://localhost:5199/collections');
		const data: CollectionDto[] = await response.json();

		// Create new collection if there are no collections
		if (data.length === 0) {
			createCollection();
			return;
		}

		// Select the first collection if there is only one
		if (data.length === 1) {
			selectedCollection.set(data[0]);
		}

		collections.set(data);
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
