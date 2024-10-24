<script lang="ts">
  import { onMount } from 'svelte';
  import * as _selectedIcon from '../models/SelectedIcon';
	import IconItem from './IconItem.svelte';
	import { icons } from '../stores/icon.store';
	import { selectedIcon } from '../stores/selected-icon.store';
	import type { Icon } from '../models/Icon';
	import { serviceBaseUrl } from '../constants';

  export let classNames: string = '';

  onMount(async () => {
    icons.setDefault();
  });

  function useIcon (icon: Icon) {
    let newSelectedIcon = _selectedIcon.mkEmpty();

    newSelectedIcon.iconId = icon.id;
    newSelectedIcon.label = icon.label;

    selectedIcon.selectIcon(newSelectedIcon);
  }
</script>

<div class={`h-auto w-full flex flex-row flex-wrap gap-6 ${classNames}`}>
    {#each $icons as icon}
      <IconItem icon={icon} onClick={useIcon} />
    {/each}
</div>