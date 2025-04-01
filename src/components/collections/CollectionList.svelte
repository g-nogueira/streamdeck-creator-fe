<script lang="ts">
	import { onMount } from "svelte";
	import * as _userIconCollection from "../../models/UserIconCollection";
	import { userIconCollections } from "../../stores/user-icon-collection.store";
	import { selectedCollection } from "../../stores/selected-collection.store";
	import { Accordion } from "@skeletonlabs/skeleton-svelte";
	import LibraryIcon from "lucide-svelte/icons/library";
	import CollectionIcons from "./CollectionIcons.svelte";
	import CollectionToolbar from "./CollectionToolbar.svelte";
	import { UserIconCollectionDBService } from "../../services/user-icon-collection-indexeddb.service";
	import { customizedIcon } from "../../stores/icon-customizations.store";
	import type { UserIcon } from "../../models/UserIcon";

	let selectedCollectionId = $state<string[]>([]);

	onMount(async () => {
		// Select the first collection if there is only one
		if ($userIconCollections.length === 1) {
			selectedCollection.selectCollection($userIconCollections[0].id);
		}

		// Expand the accordion item if there's a selected collection
		if ($selectedCollection) {
			selectedCollectionId = [$selectedCollection.id];
		}
	});

	/**
	 * Selects a collection by its id
	 * @param id
	 */
	function selectCollectionById(id: string) {
		const collections = $userIconCollections;
		const collection = collections.find(c => c.id === id);

		if (!collection) {
			throw new Error(`Collection with id ${id} not found`);
		}

		selectedCollection.selectCollection(collection.id);
	}

	let lastSelectedCollectionId: string = "";

	// Watch for changes in the selected collection
	$effect(() => {
		if (!selectedCollectionId[0]) return;
		if (lastSelectedCollectionId === selectedCollectionId[0]) return;

		$inspect("selectedAccordionItem:", selectedCollectionId);
		selectCollectionById(selectedCollectionId[0]);
		lastSelectedCollectionId = selectedCollectionId[0];
	});

	$effect(() => {
		if (!$selectedCollection) return;

		selectedCollectionId = [$selectedCollection.id];
	});

	function handleRemoveIcon(icon: UserIcon, collection: _userIconCollection.UserIconCollection) {
		UserIconCollectionDBService.removeIcon(collection.id, icon.id);
	}

	function handleSelectUserIcon(icon: UserIcon) {
		customizedIcon.selectUserIcon(icon);
	}

	function handleDownloadCollection(collectionId: string) {
		UserIconCollectionDBService.download(collectionId);
	}

	async function handleDeleteCollection(collectionId: string) {
		await UserIconCollectionDBService.remove(collectionId);
		const collections = $userIconCollections;
		if (collections.length > 0) {
			selectedCollection.selectCollection(collections[0].id);
		}
	}
</script>

<Accordion bind:value={selectedCollectionId} collapsible>
	{#each $userIconCollections as collection}
		<Accordion.Item value={collection.id}>
			<!-- Control -->
			{#snippet lead()}<LibraryIcon size={24} />{/snippet}
			{#snippet control()}{collection.name}{/snippet}
			<!-- Panel -->
			{#snippet panel()}
				<CollectionToolbar
					{collection}
					onDownloadCollection={handleDownloadCollection}
					onDeleteCollection={handleDeleteCollection} />
				<CollectionIcons {collection} onRemoveIcon={handleRemoveIcon} onSelectUserIcon={handleSelectUserIcon} />
			{/snippet}
		</Accordion.Item>
		<hr class="hr" />
	{/each}
</Accordion>
