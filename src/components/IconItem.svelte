<script lang="ts">
  import type { Icon } from '../stores';

  export let icon: Icon;
  export let onClick: (icon: Icon) => void;
</script>

<div class="flex col-span-1" on:click={() => onClick(icon)}>
  <div class="flex flex-col mx-auto h-40 w-40 border border-gray-300 hover:bg-gray-200 transition-all cursor-pointer">
    <div class="relative pt-4 h-24 w-24 mx-auto">
      <img src={`http://localhost:5199/icons/${icon.id}`} alt={icon.label} class="absolute inset-0 h-full w-full" />
    </div>
    <div class="flex w-full py-4 px-2 text-center">
      <span class="mx-auto font-semibold text-sm truncate">{icon.label}</span>
    </div>
  </div>
</div>
