<script lang="ts">
	import { default as IconItem } from "./IconItem.svelte";
	import type { Icon } from "../../models/Icon";
	import { onMount } from "svelte";

	export let icons: Icon[] = [];
	export let onSelectIcon: (icon: Icon) => void;

	const CHUNK_SIZE = 50;
	let visibleIcons: Icon[] = [];
	let currentChunk = 0;
	let loadMoreTrigger: HTMLDivElement;

	function loadNextChunk() {
		const start = currentChunk * CHUNK_SIZE;
		const end = start + CHUNK_SIZE;
		visibleIcons = [...visibleIcons, ...icons.slice(start, end)];
		currentChunk++;
	}

	$: {
		// Reset when icons array changes
		visibleIcons = [];
		currentChunk = 0;
		if (icons.length > 0) {
			loadNextChunk();
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && currentChunk * CHUNK_SIZE < icons.length) {
				loadNextChunk();
			}
		}, {
			rootMargin: '100px'
		});

		if (loadMoreTrigger) {
			observer.observe(loadMoreTrigger);
		}

		return () => observer.disconnect();
	});
</script>

<div class="flex flex-wrap gap-2">
	{#each visibleIcons as icon (icon.id)}
		<IconItem {icon} {onSelectIcon} />
	{/each}
</div>
<div bind:this={loadMoreTrigger} class="h-1"></div>

<style>
</style>
