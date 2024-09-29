<script lang="ts">
  import SearchBar from './SearchBar.svelte';

  let searchTerm = '';
</script>

<div class="top-bar">
  <SearchBar />
</div>

<style>
  .top-bar {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #333;
  }
  .logo {
    height: 40px;
    margin-right: 20px;
  }
  input[type="text"] {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 4px;
  }
  .search-button {
    background: none;
    border: none;
    color: white;
    margin-left: 10px;
  }
</style>