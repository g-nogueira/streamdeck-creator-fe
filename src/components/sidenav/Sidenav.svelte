<script lang="ts">
	import { Nav } from "@skeletonlabs/skeleton-svelte";
	import IconCollection from "lucide-svelte/icons/library";
	import Search from "lucide-svelte/icons/search";
	import IconSearch from "../icons/IconSearch.svelte";
	import CollectionList from "../collections/CollectionList.svelte";
	import { icons } from "../../stores/icon.store";
	import { customizedIcon } from "../../stores/icon-customizations.store";
	import type { Icon } from "../../models/Icon";

	let selectedTile = $state("icons");

	const handleSearchIcons = async (searchTerm: string) => {
		await icons.search(searchTerm);
	};

	const handleLoadDefaultIcons = () => {
		icons.loadDefault();
	};

	const handleSetEmptyIcons = () => {
		icons.setEmpty();
	};

	const handleSelectIcon = (icon: Icon) => {
		customizedIcon.selectIcon(icon);
	};
</script>

<div class="flex h-full flex-row">
	<div class="card grid h-full w-[96px] grid-cols-[auto_1fr] border-[1px] border-surface-100-900">
		<!-- Component -->
		<Nav.Rail bind:value={selectedTile}>
			{#snippet header()}
				<Nav.Tile id="icons" label="Icons" href="#" data-testid="nav-tile">
					<Search />
				</Nav.Tile>
				<Nav.Tile id="collections" label="Collections" href="#">
					<IconCollection />
				</Nav.Tile>
			{/snippet}
		</Nav.Rail>
		<!-- Content -->
		<!-- <div class="flex items-center justify-center">
            <p class="opacity-20">(Content)</p>
        </div> -->
	</div>
	<div
		class="flex h-full w-[375px] flex-col gap-3 border-[1px] p-3 border-surface-100-900 preset-filled-surface-50-950">
		{#if selectedTile === "icons"}
			<IconSearch
				icons={$icons}
				onSearchIcons={handleSearchIcons}
				onLoadDefaultIcons={handleLoadDefaultIcons}
				onSetEmptyIcons={handleSetEmptyIcons}
				onSelectIcon={handleSelectIcon} />
		{/if}
		{#if selectedTile === "collections"}
			<CollectionList />
		{/if}
	</div>
</div>
