<script lang="ts">
	import { selectedCollection, type UserIcon } from '../stores';

	export let onIconSelect: (icon: UserIcon) => void;

	if ($selectedCollection === null) {
		console.log('No collection selected.');
		throw new Error('No collStylizedIcon.');
	}
</script>

<div>
	<div class="text-center text-white text-lg font-semibold p-4">{$selectedCollection.name}</div>
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