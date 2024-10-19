<script lang="ts">
    import DownloadIcon from "lucide-svelte/icons/download";
    import AddToCollection from "lucide-svelte/icons/save";
	import { selectedIcon } from "../stores/selected-icon.store";
	import { selectedCollection } from "../stores/selected-collection.store";
	import type { SelectedIcon } from "../models/SelectedIcon";
	import type { UserIconCollection } from "../models/UserIconCollection";
	import { ImageProcessing, UUID } from "$lib";
    import { uiState } from '../stores/ui-state.store';
	import type { UserIcon } from "../models/UserIcon";
	import { userIconCollections } from "../stores/user-icon-collection.store";
	import Tooltip from "./Tooltip.svelte";

	function downloadIcon() {
		const node = document.querySelector(`#iconToCapture`);

		if (!node) {
			throw new Error('No HTML element #iconToCapture found to save');
		}

		ImageProcessing.DownloadIcon(node, $uiState.styles.label);
	}

	// Save the customized icon
	async function addIconToCollection(selectedIcon: SelectedIcon, collection: UserIconCollection | null) {

		if (!collection) {
			console.error('No collection selected to save the icon');
			return;
		}

		const node = document.querySelector(`#iconToCapture`);

		if (!node) {
			throw new Error('No HTML element #iconToCapture found to save');
		}

		let iconPng = await ImageProcessing.NodeToBase64Png(node);

        uiState.update(s => {
            s.styles.pngData = iconPng;
            return s;
        });
		
		const userIcon = {
			id: UUID.empty,
			originalIconId: selectedIcon.iconId,
			glyphColor: $uiState.styles.glyphColor,
			backgroundColor: $uiState.styles.backgroundColor,
			labelColor: $uiState.styles.labelColor,
			label: $uiState.styles.label,
			labelVisible: $uiState.styles.labelVisible,
			labelTypeface: $uiState.styles.labelTypeface,
			iconScale: $uiState.styles.iconScale,
			imgX: $uiState.styles.imgX,
			imgY: $uiState.styles.imgY,
			labelX: $uiState.styles.labelX,
			labelY: $uiState.styles.labelY,
			pngData: $uiState.styles.pngData,
			useGradient: $uiState.styles.useGradient,
			gradient: $uiState.styles.gradient,
		} as UserIcon;

		selectedCollection.addIconToSelectedCollection(userIcon);
		userIconCollections.upsertCollection(collection);
	}
</script>

<div class="sticky bottom-3 left-2/4 w-fit bg-surface-800 rounded-md">
    {#if $selectedIcon}
        <button on:click={() => downloadIcon()} class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900">
            <Tooltip text="Download Icon">
                <DownloadIcon/>
            </Tooltip>
        </button>
        <button on:click={() => addIconToCollection($selectedIcon, $selectedCollection)} class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900">
            <Tooltip text="Add to Collection">
                <AddToCollection/>
            </Tooltip>
        </button>
    {/if}
</div>