<script lang="ts">
  import { onMount } from 'svelte';
  import { icons, mkEmptySelectedIcon, selectIcon, type Icon } from '../stores';
	import IconItem from './IconItem.svelte';

  export let classNames: string = '';

  onMount(async () => {
    const response = await fetch('http://localhost:5199/icons?page=1&pageSize=100');
    const data: Icon[] = await response.json();
    icons.set(data);
  });

  function useIcon (icon: Icon) {
    let selectedIcon = mkEmptySelectedIcon();

    selectedIcon.iconId = icon.id;
    selectedIcon.label = icon.label;

    selectIcon(selectedIcon);
  }
</script>

<div class={`h-full w-full flex flex-row flex-wrap gap-8 flex-grow overflow-y-scroll ${classNames}`}>
    {#each $icons as icon}
      <IconItem icon={icon} onClick={useIcon} />
    {/each}
</div>