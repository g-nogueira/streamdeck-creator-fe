<script lang="ts">
	import { serviceBaseUrl } from "../constants";
	import type { Icon } from "../models/Icon";

  export let icon: Icon;
  export let onClick: (icon: Icon) => void;
</script>

<button type="button" class="h-20 w-20 flex flex-col items-center gap-3 p-1 hover:bg-gray-200 transition-all cursor-pointer" on:click={() => onClick(icon)} aria-label={`Icon ${icon.label}`}>
    <img src={`${serviceBaseUrl}/icons/${icon.id}`} alt={icon.label} class="h-10 w-10" />
    <span class="w-full font-semibold text-sm truncate">{icon.label}</span>
</button>