<script lang="ts">
  import { onMount } from 'svelte';
  import * as _selectedIcon from '../models/SelectedIcon';
	import IconItem from './IconItem.svelte';
	import { icons } from '../stores/icon.store';
	import { selectedIcon } from '../stores/selected-icon.store';
	import type { Icon } from '../models/Icon';

  export let classNames: string = '';

  onMount(async () => {
    const response = await fetch('http://localhost:5199/icons?page=1&pageSize=100');
    const data: Icon[] = await response.json();
    icons.set(data);
  });

  function useIcon (icon: Icon) {
    let newSelectedIcon = _selectedIcon.mkEmpty();

    newSelectedIcon.iconId = icon.id;
    newSelectedIcon.label = icon.label;

    selectedIcon.selectIcon(newSelectedIcon);
  }
</script>

<div class={`h-full w-full flex flex-row flex-wrap gap-8 flex-grow overflow-y-scroll p-8 ${classNames}`}>
    {#each $icons as icon}
      <IconItem icon={icon} onClick={useIcon} />
    {/each}
</div>