<script lang="ts">
	import type { Icon } from "../../models/Icon";

	export let icon: Icon;
	export let onSelectIcon: (icon: Icon) => void;
</script>

<button
	type="button"
	class="hover:bg-surface-hover flex h-20 w-20 flex-col items-center justify-center gap-1 rounded p-1 transition-colors"
	on:click={() => onSelectIcon(icon)}
	aria-label={`Icon ${icon.label}`}
	data-testid="icon-button">
	{#if icon.origin === "mdi"}
		<i class={`mdi mdi-24px mdi-${icon.label}`} title={icon.label} data-testid="mdi-icon"></i>
		<span data-origin="mdi" class="w-full truncate text-center text-xs font-semibold" data-testid="mdi-label">
			{icon.label}
		</span>
	{:else if icon.origin === "streamdeck" || icon.origin === "homarr"}
		<img
			alt={icon.label}
			loading="lazy"
			class="h-8 w-8 opacity-0 transition-opacity"
			class:opacity-100={true}
			data-testid={`${icon.origin}-icon-img`}
			src={icon.url} />
		<span
			data-origin={icon.origin}
			class="w-full truncate text-center text-xs font-semibold"
			data-testid={`${icon.origin}-label`}>
			{icon.label}
		</span>
	{/if}
</button>
