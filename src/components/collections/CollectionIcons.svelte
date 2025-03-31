<script lang="ts">
	import * as _selectedIcon from "../../models/CustomizableIcon";
	import RemoveFromCollectionIcon from "lucide-svelte/icons/x";
	import type { UserIcon } from "../../models/UserIcon";
	import type { UserIconCollection } from "../../models/UserIconCollection";
	import { customizedIcon } from "../../stores/icon-customizations.store";
	import { UserIconCollectionDBService } from "../../services/user-icon-collection-indexeddb.service";

	let { collection }: { collection: UserIconCollection } = $props();

	if (collection === null) {
		console.log("No collection selected.");
		throw new Error("No collection selected.");
	}

	function removeIcon(icon: UserIcon, collection: UserIconCollection) {
		UserIconCollectionDBService.removeIcon(collection.id, icon.id);
	}
</script>

<div>
	<div class="flex h-auto w-full flex-row flex-wrap gap-3">
		{#each collection.icons as icon}
			<div class="icon-container relative">
				<button
					id="removeBtn"
					type="button"
					onclick={() => removeIcon(icon, collection)}
					aria-label={`Remove icon ${icon.label}`}
					class="badge-icon absolute -right-0 -top-0 z-10 hidden bg-error-900 hover:bg-error-950">
					<RemoveFromCollectionIcon size={20} />
				</button>
				<button
					type="button"
					class="flex h-fit w-24 cursor-pointer flex-col items-center gap-3 rounded-md p-2 transition-all"
					onclick={() => customizedIcon.selectUserIcon(icon)}
					aria-label={`Select icon ${icon.label}`}>
					<img src={icon.base64Thumbnail} alt={icon.label} class="h-15 w-15" />
					<span class="w-full truncate text-sm font-semibold">{icon.label}</span>
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
