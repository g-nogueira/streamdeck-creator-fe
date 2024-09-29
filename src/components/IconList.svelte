<script lang="ts">
  import { onMount } from 'svelte';
  import { icons } from '../stores';
  import type { Icon } from '../stores';

  onMount(async () => {
    const response = await fetch('http://localhost:5199/icons');
    const data: Icon[] = await response.json();
    icons.set(data);
  });
</script>

<div class="icon-grid">
  {#each $icons as icon}
    <div class="icon-card">
      <img src={`http://localhost:5199/icons/${icon.id}`} alt={icon.label} />
      <p>{icon.label}</p>
    </div>
  {/each}
</div>

<style>
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  .icon-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .icon-card img {
    max-width: 100%;
    height: auto;
  }
  .icon-card p {
    margin-top: 10px;
    color: white;
  }
</style>