<script lang="ts">
	import { onMount } from "svelte";
	import * as _selectedIcon from "../../models/CustomizableIcon";
	import IconItem from "./IconItem.svelte";
	import { icons } from "../../stores/icon.store";
	import { customizedIcon } from "../../stores/icon-customizations.store";
	import type { Icon } from "../../models/Icon";

	onMount(async () => {
		icons.loadDefault();
	});

	const handleSelectIcon = (icon: Icon) => {
		customizedIcon.selectIcon(icon);
	};
</script>

<div class={`flex h-auto w-full flex-row flex-wrap gap-6`}>
	{#each $icons as icon}
		<IconItem {icon} onSelectIcon={handleSelectIcon} />
	{/each}
</div>
