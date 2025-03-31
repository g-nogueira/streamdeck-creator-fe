<script lang="ts">
	import DownloadIcon from "lucide-svelte/icons/download";
	import AddToCollection from "lucide-svelte/icons/save";
	import { type CustomizableIcon } from "../../models/CustomizableIcon";
	import * as ImageProcessing from "$lib/utils/dom";
	import Tooltip from "../common/Tooltip.svelte";
	import _ from "lodash";

	// Props
	/**
	 * The customizable icon object that contains the icon's properties and styles.
	 */
	export let customizableIcon: CustomizableIcon | null = null;
	/**
	 * Callback function to handle adding an icon to a collection.
	 * @param icon - The customizable icon to be added.
	 * @param png - The PNG representation of the icon.
	 * @param thumbnail - The thumbnail representation of the icon.
	 */
	export let onAddIconToCollection: (icon: CustomizableIcon, png: string, thumbnail: string) => void; // Callback for adding an icon to a collection

	function downloadIcon() {
		const node = document.querySelector(`#iconToCapture`);

		if (!customizableIcon?.styles.label) {
			throw new Error("No label found to save");
		}

		ImageProcessing.downloadIcon(node!, customizableIcon.styles.label);
	}

	// Save the customized icon
	async function addIconToCollection() {
		const node = document.querySelector(`#iconToCapture`);

		if (!node) {
			throw new Error("No HTML element #iconToCapture found to save");
		}

		let iconPng = await ImageProcessing.nodeToBase64Png(node);
		let iconThumbnail = iconPng;

		onAddIconToCollection(customizableIcon!, iconPng, iconThumbnail);
	}
</script>

<div class="sticky bottom-3 left-2/4 w-fit rounded-md bg-surface-800">
	{#if customizableIcon}
		<button on:click={downloadIcon} class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900" data-testid="download-btn">
			<Tooltip text="Download Icon">
				<DownloadIcon />
			</Tooltip>
		</button>
		<button
			on:click={addIconToCollection}
			class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900"
			data-testid="add-to-collection-btn">
			<Tooltip text="Add to Collection">
				<AddToCollection />
			</Tooltip>
		</button>
	{/if}
</div>
