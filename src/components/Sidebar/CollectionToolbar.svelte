<script lang="ts">
	import * as _userIconCollection from '../../models/UserIconCollection';
	import { UserIconCollectionService } from '../../services/user-icon-collection.service';
	import { selectedCollection } from '../../stores/selected-collection.store';
	import * as _selectedIcon from '../../models/SelectedIcon';
	import DownloadIcon from 'lucide-svelte/icons/download';
	import DeleteIcon from 'lucide-svelte/icons/trash';
	import Tooltip from '../Tooltip.svelte';

	function donwloadUserCollection() {
		if ($selectedCollection === null) {
			throw new Error('No collection selected to download');
		}

		UserIconCollectionService.download($selectedCollection.id);
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
		onclick={() => alert('Not Implemented.')}
		class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-warning-900"
		aria-label="Delete Collection"
	>
		<Tooltip text="Delete Collection">
			<DeleteIcon size={20} />
		</Tooltip>
	</button>
</div>
