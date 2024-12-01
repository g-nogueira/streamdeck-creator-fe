<script lang="ts">
  import { onMount } from 'svelte';
  import * as _selectedIcon from '../models/SelectedIcon';
	import IconItem from './IconItem.svelte';
	import { icons } from '../stores/icon.store';

  onMount(async () => {
    icons.setDefault();
  });


</script>

<div class={`h-auto w-full flex flex-row flex-wrap gap-6`}>
    {#each $icons as icon}
      <IconItem icon={icon} />
    {/each}
</div>