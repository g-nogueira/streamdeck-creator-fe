<script lang="ts">
	export let labelText: string;
	export let onDownload: () => void;
	export let onSave: () => void;

</script>

<div class="flex items-center border-b border-gray-700 h-12">
	<div class="text-center cursor-pointer left-0 border-r border-gray-700" on:click={onDownload}>Download</div>
	<input
		type="text"
		bind:value={labelText}
		class="flex-grow bg-transparent text-center p-2 border-b-2 border-gray-600 text-white text-lg focus:outline-none transition duration-200"
		aria-label="Icon Name"
	/>
	<div class="w-12 text-center cursor-pointer right-0 border-l border-gray-700" on:click={onSave}>Add to Collection</div>
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
