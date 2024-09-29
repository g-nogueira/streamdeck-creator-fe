<script lang="ts">
  import { onMount } from 'svelte';
  import { icons, selectedIcon } from '../stores';
  import type { Icon } from '../stores';

  export let classNames: string = '';

  function selectIcon(icon: Icon) {
    selectedIcon.set(icon);
  }

  onMount(async () => {
    const response = await fetch('http://localhost:5199/icons?page=1&pageSize=20');
    const data: Icon[] = await response.json();
    icons.set(data);
  });
</script>

<div class={`py-8 px-4 grid grid-cols-4 gap-y-8 ${classNames}`}>
  {#each $icons as icon}
    <div class="flex col-span-1" on:click={() => selectIcon(icon)}>
      <div class="flex flex-col mx-auto h-40 w-40 border border-gray-300 hover:bg-gray-200 transition-all cursor-pointer">
        <div class="relative pt-4 h-24 w-24 mx-auto">
          <img src={`http://localhost:5199/icons/${icon.id}`} alt={icon.label} class="absolute inset-0 h-full w-full" />
        </div>
        <div class="flex w-full py-4 px-2 text-center">
          <span class="mx-auto font-semibold text-sm truncate">{icon.label}</span>
        </div>
      </div>
    </div>
  {/each}
</div>