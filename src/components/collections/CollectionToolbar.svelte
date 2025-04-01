<script lang="ts">
	import DownloadIcon from "lucide-svelte/icons/download";
	import DeleteIcon from "lucide-svelte/icons/trash";
	import Tooltip from "../common/Tooltip.svelte";
	import type { UserIconCollection } from "../../models/UserIconCollection";

	export let collection: UserIconCollection; // Collection data passed as a prop
	export let onDownloadCollection: (collectionId: string) => void; // Callback for downloading a collection
	export let onDeleteCollection: (collectionId: string) => Promise<void>; // Callback for deleting a collection

	if (!collection) {
		console.error("No collection selected.");
		throw new Error("No collection selected.");
	}

	function handleDownload() {
		onDownloadCollection(collection.id);
	}

	async function handleDelete() {
		await onDeleteCollection(collection.id);
	}
</script>

<div class="mb-3 flex flex-row justify-between gap-3 rounded-md bg-surface-800">
	<button
		type="button"
		onclick={handleDownload}
		class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900"
		aria-label="Download Collection">
		<Tooltip text="Download Collection">
			<DownloadIcon size={20} />
		</Tooltip>
	</button>
	<button
		type="button"
		onclick={handleDelete}
		class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-warning-900"
		aria-label="Delete Collection">
		<Tooltip text="Delete Collection">
			<DeleteIcon size={20} />
		</Tooltip>
	</button>
</div>
