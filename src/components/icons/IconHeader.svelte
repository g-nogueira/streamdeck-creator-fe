<script lang="ts">
	export let labelText: string;
	export let onDownload: () => void;
	export let onSave: () => void;
</script>

<div class="flex h-12 items-center border-b border-gray-700">
	<button
		type="button"
		class="left-0 cursor-pointer border-r border-gray-700 text-center"
		on:click={onDownload}
		aria-label="Download">
		Download
	</button>
	<input
		type="text"
		bind:value={labelText}
		class="flex-grow border-b-2 border-gray-600 bg-transparent p-2 text-center text-lg text-white transition duration-200 focus:outline-none"
		aria-label="Icon Name" />
	<button
		type="button"
		class="right-0 w-12 cursor-pointer border-l border-gray-700 text-center"
		on:click={onSave}
		aria-label="Add to Collection">
		Add to Collection
	</button>
</div>

<style>
	input {
		color: rgba(255, 255, 255, 0.8); /* Slightly lighter */
	}
	input:focus {
		border-color: #3b82f6; /* Blue-500 */
		box-shadow: 0 0 5px rgba(59, 130, 247, 0.5); /* Soft blue shadow */
	}
</style>
