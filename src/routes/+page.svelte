<script>
  import TopBar from '../components/TopBar.svelte';
  import IconList from '../components/IconList.svelte';
  import IconCustomizer from '../components/IconCustomizer.svelte';
  import Footer from '../components/Footer.svelte';
  import "../app.css";
	import { startUserIconCollectionsSync } from '$lib/sync-manager';

  startUserIconCollectionsSync();

  // Add dark mode class based on localStorage or system preference
  if (typeof localStorage !== 'undefined') {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>My Svelte App</title>
</svelte:head>

<main class="h-screen w-screen flex flex-col font-sans antialiased bg-gray-50 dark:bg-neutral-800 text-slate-600 dark:text-white overflow-hidden">
  <TopBar />
  <div class="flex flex-1 h-full">
    <IconList classNames="w-3/4" />
    <IconCustomizer classNames="w-1/4" />
  </div>
  <Footer />
</main>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>