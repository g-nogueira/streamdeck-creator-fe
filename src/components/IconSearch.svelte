<script lang="ts">
	import IconList from './IconList.svelte';
	import { onMount } from 'svelte';
	import { debounce } from 'lodash-es';
	import { icons } from '../stores/icon.store';
	import { IconService } from '../services/icon.service';

	let searchTerm = '';
	let placeholder = '';
	let placeholders = ['icon1', 'icon2', 'icon3']; // Example placeholders
	let isLoading = false;
	let error = '';

	const searchIcons = debounce(async () => {
		if (!searchTerm || searchTerm.length <= 2) {
			icons.set([]); // Clear icons if search term is empty or too short
			return;
		}
		isLoading = true;
		error = '';
		try {
			const response = await IconService.searchIcons(searchTerm);
			icons.set(response);
		} catch (e: any) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}, 500); // Debounce for 500ms

	onMount(() => {
		placeholder = placeholders[0];
		setInterval(() => {
			const currentIndex = placeholders.findIndex((str) => str === placeholder);
			placeholder = placeholders[currentIndex + 1] ?? placeholders[0];
		}, 3000);
	});
</script>

<input class="input" type="search" placeholder="Search..." bind:value={searchTerm} on:input={() => searchIcons()}/>
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
	<IconList />
</div>
