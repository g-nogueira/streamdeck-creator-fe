<script lang="ts">
	export let state;
	export let onDownload: () => void;
	export let onSave: () => void;
</script>

<div class="flex items-center border-b border-gray-700 h-12 relative">
	<input type="text" bind:value={state.labelText} placeholder="My Icon" class="flex-grow bg-transparent text-center p-2 border-none text-white" />
	<div class="w-12 text-center cursor-pointer absolute left-0 border-r border-gray-700" on:click={onDownload()}>Download</div>
	<div class="w-12 text-center cursor-pointer absolute right-0 border-l border-gray-700" on:click={onSave()}>Add to Collection</div>
</div>

<style>

</style>