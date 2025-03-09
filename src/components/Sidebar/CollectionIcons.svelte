<script lang="ts">
	import * as _selectedIcon from '../../models/CustomizableIcon';
	import RemoveFromCollectionIcon from "lucide-svelte/icons/x";
	import type { UserIcon } from '../../models/UserIcon';
	import type { UserIconCollection } from '../../models/UserIconCollection';
	import { customizedIcon } from '../../stores/icon-customizations.store';
	import {userIconCollections} from '../../stores/user-icon-collection.store';


	let { collection } : { collection : UserIconCollection} = $props()

	if (collection === null) {
		console.log('No collection selected.');
		throw new Error('No collection selected.');
	}

	function removeIcon(icon: UserIcon, collection: UserIconCollection) {
		userIconCollections.removeIcon(collection.id, icon.id);
	}

</script>

<div>
	<div class="h-auto w-full flex flex-row flex-wrap gap-3">
		{#each collection.icons as icon}
			<div class="relative icon-container">
				<button id="removeBtn" type="button" onclick={() => removeIcon(icon, collection)} aria-label={`Remove icon ${icon.label}`} class="hidden badge-icon absolute -right-0 -top-0 z-10 bg-error-900 hover:bg-error-950">
					<RemoveFromCollectionIcon size={20} />
				</button>
				<button type="button" class="h-fit w-24 flex flex-col items-center gap-3 p-2 rounded-md transition-all cursor-pointer" onclick={() => customizedIcon.selectUserIcon(icon)} aria-label={`Select icon ${icon.label}`} >
					<img src={icon.pngData} alt={icon.label} class="h-15 w-15" />
					<span class="w-full font-semibold text-sm truncate">{icon.label}</span>
				</button>
			</div>
		{/each}
	</div>
</div>
<style lang="postcss">
	.icon-container:hover #removeBtn {
		display: flex;
	}
</style>

