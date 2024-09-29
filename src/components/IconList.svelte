<script lang="ts">
  import { onMount } from 'svelte';
  import { icons } from '../stores';
  import type { Icon } from '../stores';

  async function fetchIconDetails(icon: Icon): Promise<Icon> {
    const response = await fetch(`http://localhost:5199/icons/${icon.id}`);
    const blob = await response.blob();
    const fullPath = URL.createObjectURL(blob);
    return icon;
  }

  onMount(async () => {
    const response = await fetch('http://localhost:5199/icons');
    const data: Icon[] = await response.json();
    const detailedIcons = await Promise.all(data.map(fetchIconDetails));
    icons.set(detailedIcons);
  });
</script>

<div class="icon-list">
  {#each $icons as icon}
    <img src={`http://localhost:5199/icons/${icon.id}`} alt={icon.label} />
  {/each}
</div>

<style>
  .icon-list {
    flex: 2;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
</style>