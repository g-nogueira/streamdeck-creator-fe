<script lang="ts">
  import { icons } from '../stores';
  import type { Icon } from '../stores';
  let searchTerm = '';

  async function searchIcons() {
    const response = await fetch(`http://localhost:5199/icons/search?searchTerm=${searchTerm}`);
    const data: Icon[] = await response.json();
    icons.set(data);
  }
</script>

<div class="search-bar">
  <input type="text" bind:value={searchTerm} placeholder="Search icons..." />
  <button on:click={searchIcons}>Search</button>
</div>

<style>
  .search-bar {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
</style>