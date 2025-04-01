<script lang="ts">
	import IconList from "./IconList.svelte";
	import { onMount } from "svelte";
	import { debounce } from "lodash-es";
	import type { Icon } from "../../models/Icon";

	export let icons: Icon[] = [];
	/**
	 * Function called to search for icons.
	 * @param searchTerm The term to search for.
	 */
	export let onSearchIcons: (searchTerm: string) => Promise<void>;
	/**
	 * Function called to load the default set of icons.
	 * Called when the search term is empty.
	 */
	export let onLoadDefaultIcons: () => void;
	/**
	 * Function called to set the icons to an empty state.
	 * Called when the search term does not match any icons.
	 */
	export let onSetEmptyIcons: () => void;
	export let onSelectIcon: (icon: Icon) => void;
	export let debounceTimeMs = 500;

	let searchTerm = "";
	let placeholder = "";
	let placeholders = ["icon1", "icon2", "icon3"]; // Example placeholders
	let isLoading = false;
	let error = "";

	const searchIcons = debounce(async () => {
		if (!searchTerm) {
			onLoadDefaultIcons();
			return;
		} else if (searchTerm.length <= 2) {
			onSetEmptyIcons();
			return;
		}

		isLoading = true;
		error = "";
		try {
			await onSearchIcons(searchTerm);
		} catch (e: any) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}, debounceTimeMs);

	onMount(() => {
		placeholder = placeholders[0];
		setInterval(() => {
			const currentIndex = placeholders.findIndex(str => str === placeholder);
			placeholder = placeholders[currentIndex + 1] ?? placeholders[0];
		}, 3000);
	});
</script>

<input
	class="input"
	type="search"
	placeholder="Search..."
	data-testid="search-field"
	bind:value={searchTerm}
	on:input={() => searchIcons()} />
<select class="select" placeholder="Collection...">
	<option value="1">Option 1</option>
	<option value="2">Option 2</option>
	<option value="3">Option 3</option>
	<option value="4">Option 4</option>
	<option value="5">Option 5</option>
</select>

{#if isLoading}
	<div class="loading-indicator">Loading...</div>
{/if}

{#if error}
	<div class="error-message">{error}</div>
{/if}

<div class="h-full overflow-y-scroll">
	<IconList {icons} {onSelectIcon} />
</div>
