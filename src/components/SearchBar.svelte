<script lang="ts">
  import { onMount } from 'svelte';
  import { icons, type UserIcon } from '../stores';
  import { debounce } from 'lodash-es';

  let searchTerm = '';
  let placeholder = '';
  let placeholders = ['icon1', 'icon2', 'icon3']; // Example placeholders
  let isLoading = false;
  let error = '';

  const searchIcons = debounce(async () => {
    if (!searchTerm || searchTerm.length <= 2) {
      icons.set([]); // Clear icons if search term is empty or too short
      return;
    }
    isLoading = true;
    error = '';
    try {
      const response = await fetch(`http://localhost:5199/icons/search?searchTerm=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data: UserIcon[] = await response.json();
      icons.set(data);
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }, 500); // Debounce for 500ms

  onMount(() => {
    placeholder = placeholders[0];
    setInterval(() => {
      const currentIndex = placeholders.findIndex((str) => str === placeholder);
      placeholder = placeholders[currentIndex + 1] ?? placeholders[0];
    }, 3000);
  });
</script>

<div class="h-full flex-grow w-0 flex flex-col">
  <div class="flex items-center border-b border-theme h-[50px]">
    <div class="flex items-center h-[50px] w-[50px] p-3 text-neutral-300 dark:text-neutral-500 mx-auto">
      <i class="fas fa-search"></i>
    </div>
    <input type="text"
           bind:value={searchTerm}
           placeholder={`Search for "${placeholder}" or something else...`}
           class="no-focus bg-transparent w-full pr-2 py-1"
           on:input={() => searchIcons()} />

    <button class="right-0 inset-y-0 w-[50px] flex items-center px-2" on:click={() => { searchTerm = ''; searchIcons(); }}>
      <div class="inset-button-theme w-4 mx-auto">
        <i class="fas fa-times-circle"></i>
      </div>
    </button>
  </div>

  {#if isLoading}
    <div class="loading-indicator">Loading...</div>
  {/if}

  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  <div class="relative h-0 flex-grow overflow-scroll">
    <div class="absolute inset-0 pt-8 px-4 grid grid-cols-4 gap-y-8 overflow-hidden" class:hidden={!searchTerm}>
      {#each $icons as icon}
        <div class="flex col-span-1">
          <div class="flex flex-col mx-auto h-40 w-40 pt-4 border border-theme-light">
            <div class="h-20 w-20 mx-auto text-shimmer">
              <i class="fas fa-cube"></i>
            </div>
            <div class="flex py-4 px-2 text-center">
              <div class="mx-auto bg-shimmer">
                <span class="opacity-0">placeholder</span>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .loading-indicator {
    text-align: center;
    padding: 10px;
  }
  .error-message {
    color: red;
    text-align: center;
    padding: 10px;
  }
</style>