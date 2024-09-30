<script lang="ts">
  import { onMount } from 'svelte';
  import { icons, selectedIcon } from '../stores';
  import type { IconDto } from '../stores';
  import IconItem from './IconItem.svelte';

  export let classNames: string = '';

  function selectIcon(icon: IconDto) {
    selectedIcon.set(icon);
  }

  onMount(async () => {
    const response = await fetch('http://localhost:5199/icons?page=1&pageSize=20');
    const data: IconDto[] = await response.json();
    icons.set(data);
  });
</script>

<div class="h-full flex-grow w-0 flex flex-col">
  <div class={`py-8 px-4 grid grid-cols-4 gap-y-8 ${classNames}`}>
    {#each $icons as icon}
      <IconItem icon={icon} onClick={selectIcon} />
    {/each}
  </div>
</div>