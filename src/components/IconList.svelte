<script lang="ts">
  import { onMount } from 'svelte';
  import { icons, selectIcon } from '../stores';
  import type { IconDto } from '../stores';
  import IconItem from './IconItem.svelte';

  export let classNames: string = '';

  onMount(async () => {
    const response = await fetch('http://localhost:5199/icons?page=1&pageSize=100');
    const data: IconDto[] = await response.json();
    icons.set(data);
  });
</script>

<div class={`h-full w-full flex flex-row flex-wrap gap-8 flex-grow overflow-y-scroll ${classNames}`}>
    {#each $icons as icon}
      <IconItem icon={icon} onClick={selectIcon} />
    {/each}
</div>