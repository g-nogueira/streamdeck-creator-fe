<script lang="ts">
	import RemoveFromCollectionIcon from "lucide-svelte/icons/x";
	import type { UserIcon } from "../../models/UserIcon";
	import type { UserIconCollection } from "../../models/UserIconCollection";

	// Props
	export let collection: UserIconCollection;
	export let onRemoveIcon: (icon: UserIcon, collection: UserIconCollection) => void;
	export let onSelectUserIcon: (icon: UserIcon) => void;

	if (!collection) {
		console.error("No collection selected.");
		throw new Error("No collection selected.");
	}
</script>

<div>
	<div class="flex h-auto w-full flex-row flex-wrap gap-3">
		{#each collection.icons as icon}
			<div class="icon-container relative">
				<button
					id="removeBtn"
					type="button"
					onclick={() => onRemoveIcon(icon, collection)}
					aria-label={`Remove icon ${icon.label}`}
					class="badge-icon absolute -right-0 -top-0 z-10 hidden bg-error-900 hover:bg-error-950">
					<RemoveFromCollectionIcon size={20} />
				</button>
				<button
					type="button"
					class="flex h-fit w-24 cursor-pointer flex-col items-center gap-3 rounded-md p-2 transition-all"
					onclick={() => onSelectUserIcon(icon)}
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
