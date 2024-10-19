<script lang="ts">
	import * as _selectedIcon from '../../models/SelectedIcon';
	import type { UserIcon } from '../../models/UserIcon';
	import type { UserIconCollection } from '../../models/UserIconCollection';
	import { selectedIcon } from '../../stores/selected-icon.store';

	let { collection } : { collection : UserIconCollection} = $props()

	if (collection === null) {
		console.log('No collection selected.');
		throw new Error('No collection selected.');
	}

	function selectUserIcon(icon: UserIcon, collection: UserIconCollection | null) {
		if (collection === null) {
			throw new Error('No collection selected. An user icon must belong to a collection.');
		}

		let newSelectedIcon = _selectedIcon.fromUserIcon(icon, collection.id);
		selectedIcon.selectIcon(newSelectedIcon);
	}

</script>

<div>
	<div class="h-auto w-full flex flex-row flex-wrap gap-3">
		{#each collection.icons as icon}
			<button type="button" class="h-fit w-24 flex flex-col items-center gap-3 p-2 hover:bg-surface-800 rounded-md transition-all cursor-pointer" onclick={() => selectUserIcon(icon, collection)} aria-label={`Select icon ${icon.label}`} >
				<img src={icon.pngData} alt={icon.label} class="h-15 w-15" />
				<span class="w-full font-semibold text-sm truncate">{icon.label}</span>
			</button>
		{/each}
	</div>
</div>