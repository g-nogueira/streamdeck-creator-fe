<script lang="ts">
	import type { Icon } from "../models/Icon";

  export let icon: Icon;
  export let onClick: (icon: Icon) => void;
</script>

<button type="button" class="h-32 w-32 flex flex-col justiIconer items-center gap-3 p-4 border border-gray-300 hover:bg-gray-200 transition-all cursor-pointer" on:click={() => onClick(icon)} aria-label={`Icon ${icon.label}`}>
    <img src={`http://localhost:5199/icons/${icon.id}`} alt={icon.label} class="h-16 w-16" />
    <span class="w-full font-semibold text-sm truncate">{icon.label}</span>
</button>