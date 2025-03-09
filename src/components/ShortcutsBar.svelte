<script lang="ts">
    import DownloadIcon from "lucide-svelte/icons/download";
    import AddToCollection from "lucide-svelte/icons/save";
	import { customizedIcon } from "../stores/icon-customizations.store";
	import { selectedCollection } from "../stores/selected-collection.store";
	import { toUserIcon, type CustomizableIcon } from "../models/CustomizableIcon";
	import type { UserIconCollection } from "../models/UserIconCollection";
	import { ImageProcessing } from "$lib";
	import Tooltip from "./Tooltip.svelte";

	function downloadIcon() {
		const node = document.querySelector(`#iconToCapture`);

		if (!node) {
			throw new Error('No HTML element #iconToCapture found to save');
		}

		if (!$customizedIcon?.styles.label) {
			throw new Error('No label found to save');
		}

		ImageProcessing.DownloadIcon(node, $customizedIcon?.styles.label);
	}

	// Save the customized icon
	async function addIconToCollection(customizableIcon: CustomizableIcon, collection: UserIconCollection | null) {

		if (!collection) {
			console.error('No collection selected to save the icon');
			return;
		}

		const node = document.querySelector(`#iconToCapture`);

		if (!node) {
			throw new Error('No HTML element #iconToCapture found to save');
		}

		let iconPng = await ImageProcessing.NodeToBase64Png(node);

        customizedIcon.updatePngData(iconPng);
		
		const userIcon = toUserIcon(customizableIcon);

		selectedCollection.addIconToSelectedCollection(userIcon);
	}
</script>

<div class="sticky bottom-3 left-2/4 w-fit bg-surface-800 rounded-md">
    {#if $customizedIcon}
        <button on:click={() => downloadIcon()} class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900">
            <Tooltip text="Download Icon">
                <DownloadIcon/>
            </Tooltip>
        </button>
        <button on:click={() => addIconToCollection($customizedIcon, $selectedCollection)} class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900">
            <Tooltip text="Add to Collection">
                <AddToCollection/>
            </Tooltip>
        </button>
    {/if}
</div>