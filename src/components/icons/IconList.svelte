<script lang="ts">
	import IconItem from "./IconItem.svelte";
	import type { Icon } from "../../models/Icon";

	export let icons: Icon[] = []; // List of icons passed as a prop
	export let onSelectIcon: (icon: Icon) => void; // Callback function to handle icon selection
</script>

<div class="flex h-auto w-full flex-row flex-wrap gap-6">
	{#each icons as icon}
		<IconItem {icon} {onSelectIcon} />
	{/each}
</div>
