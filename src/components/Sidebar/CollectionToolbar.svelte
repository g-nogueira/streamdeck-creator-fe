<script lang="ts">
	import * as _userIconCollection from '../../models/UserIconCollection';
	import { UserIconCollectionIndexedDBService } from '../../services/user-icon-collection-indexeddb.service';
	import * as _selectedIcon from '../../models/SelectedIcon';
	import DownloadIcon from 'lucide-svelte/icons/download';
	import DeleteIcon from 'lucide-svelte/icons/trash';
	import Tooltip from '../Tooltip.svelte';
	import type { UserIconCollection } from '../../models/UserIconCollection';
	import { userIconCollections } from '../../stores/user-icon-collection.store';
	import { selectedCollection } from '../../stores/selected-collection.store';

	let { collection } : { collection : UserIconCollection} = $props()

	if (collection === null) {
		console.log('No collection selected.');
		throw new Error('No collection selected.');
	}

	function donwloadUserCollection() {
		if (collection === null) {
			throw new Error('No collection selected to download');
		}

		UserIconCollectionIndexedDBService.download(collection.id);
	}

	async function deleteUserCollection() {
		if (collection === null) {
			throw new Error('No collection selected to delete');
		}
		await userIconCollections.removeCollection(collection.id);
		selectedCollection.selectCollection($userIconCollections[0].id);
	}
</script>

<div class="mb-3 flex flex-row justify-between gap-3 rounded-md bg-surface-800">
	<button
		type="button"
		onclick={() => donwloadUserCollection()}
		class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900"
		aria-label="Download Collection"
	>
		<Tooltip text="Download Collection">
			<DownloadIcon size={20} />
		</Tooltip>
	</button>
	<button
		type="button"
		onclick={() => deleteUserCollection()}
		class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-warning-900"
		aria-label="Delete Collection"
	>
		<Tooltip text="Delete Collection">
			<DeleteIcon size={20} />
		</Tooltip>
	</button>
</div>
