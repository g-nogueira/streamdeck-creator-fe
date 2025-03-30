<script lang="ts">
  import { onMount } from 'svelte';
  import * as _selectedIcon from '../models/CustomizableIcon';
	import IconItem from './IconItem.svelte';
	import { icons } from '../stores/icon.store';

  onMount(async () => {
    icons.loadDefault();
  });


</script>

<div class={`h-auto w-full flex flex-row flex-wrap gap-6`}>
    {#each $icons as icon}
      <IconItem icon={icon} />
    {/each}
</div>