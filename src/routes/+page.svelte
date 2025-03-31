<script lang="ts">
	import IconCustomizer from "../components/icons/IconCustomizer.svelte";
	import "../app.css";
	import Sidenav from "../components/sidenav/Sidenav.svelte";
	import IconPreview from "../components/icons/IconPreview.svelte";
	import Toolbar from "../components/Toolbar/Toolbar.svelte";
	import { IconService } from "../services/icon.service";
	import { toUserIcon, type CustomizableIcon } from "../models/CustomizableIcon";
	import { customizedIcon } from "../stores/icon-customizations.store";
	import _ from "lodash";
	import { selectedCollection } from "../stores/selected-collection.store";
	import ShortcutsBar from "../components/shortcuts/ShortcutsBar.svelte";

	const selectSvgIcon = customizedIcon.selectSvgIcon;
	const selectImageIcon = customizedIcon.selectImageIcon;
	const setSvgFillColor = customizedIcon.setSvgFillColor;
	const fetchIconWithContentType = IconService.fetchIconWithContentType;

	const handleAddIconToCollection = async (icon: CustomizableIcon, png: string, thumbnail: string) => {
		_.flow(toUserIcon, selectedCollection.addIconToSelectedCollection)(icon, thumbnail, png);
	};
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>StreamDeck Buddy</title>
</svelte:head>

<div class="flex h-full">
	<Sidenav />
	<main class="flex h-screen w-screen flex-col overflow-hidden">
		<div class="flex h-full w-full items-center justify-center">
			<IconCustomizer
				customizableIcon={$customizedIcon}
				{selectSvgIcon}
				{selectImageIcon}
				{setSvgFillColor}
				{fetchIconWithContentType} />
			<IconPreview customizableIcon={$customizedIcon} />
		</div>
		<!-- <Footer /> -->
	</main>
	<Toolbar />
</div>
<ShortcutsBar customizableIcon={$customizedIcon} onAddIconToCollection={handleAddIconToCollection} />

<style lang="postcss">
	:global(html) {
		height: 100%;
		overflow-y: hidden;
	}
	:global(body) {
		height: 100%;
		background-image: radial-gradient(at 70% 50%, rgba(39 56 95 / 0.5) 0px, transparent 75%),
			radial-gradient(at 50% 0%, rgba(255 3 238 / 0.15) 0px, transparent 75%),
			radial-gradient(at 100% 0%, rgba(255 3 238 / 0.15) 0px, transparent 50%);
	}
</style>
