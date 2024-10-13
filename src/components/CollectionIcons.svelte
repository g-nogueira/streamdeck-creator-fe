<script lang="ts">
	import { selectedCollection, type UserIcon } from '../stores';

	export let onIconSelect: (icon: UserIcon) => void;
	export let onDownload: () => void;

	if ($selectedCollection === null) {
		console.log('No collection selected.');
		throw new Error('No collStylizedIcon.');
	}
</script>

<div class="flex items-center border-b border-gray-700 h-12 mb-1">
	<input
		type="text"
		readonly
		bind:value={$selectedCollection.name}
		class="flex-grow bg-transparent text-center p-2 border-gray-600 text-white text-lg focus:outline-none transition duration-200"
		aria-label="Icon Name"
	/>
	<button type="button" class="w-12 text-center cursor-pointer right-0 border-l border-gray-700" on:click={onDownload} aria-label="Add to Collection">Download</button>
</div>

<div>
	<div class="flex flex-wrap">
		{#each $selectedCollection.icons as icon}
			<button type="button" class="flex col-span-1 h-40 w-40" on:click={() => onIconSelect(icon)} aria-label={`Select icon ${icon.label}`} >
				<div class="flex flex-col items-center mx-auto transition-all cursor-pointer hover:scale-110">
					<img src={icon.pngData} alt={icon.label} class="h-28 w-28" />
					<div class="flex w-full py-4 px-2 text-center">
						<span class="mx-auto font-semibold text-sm truncate">{icon.label}</span>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>