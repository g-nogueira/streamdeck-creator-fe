<script>
	import TopBar from '../components/TopBar.svelte';
	import IconList from '../components/IconList.svelte';
	import IconCustomizer from '../components/IconCustomizer.svelte';
	import Footer from '../components/Footer.svelte';
	import '../app.css';
	import { startUserIconCollectionsSync } from '$lib/sync-manager';
	import Sidenav from '../components/Sidenav.svelte';

	startUserIconCollectionsSync();

	// Add dark mode class based on localStorage or system preference
	// if (typeof localStorage !== 'undefined') {
	// 	if (
	// 		localStorage.theme === 'dark' ||
	// 		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	// 	) {
	// 		document.documentElement.classList.add('dark');
	// 	} else {
	// 		document.documentElement.classList.remove('dark');
	// 	}
	// }
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>StreamDeck Buddy</title>
</svelte:head>
<div class="flex h-full">
	<Sidenav />
	<main class="flex h-screen w-screen flex-col overflow-hidden bg-gray-50 font-sans text-slate-600 antialiased dark:bg-neutral-800 dark:text-white" >
		<TopBar />
		<div class="flex h-full flex-1">
			<IconList classNames="w-3/4" />
			<IconCustomizer classNames="w-1/4" />
		</div>
		<Footer />
	</main>
</div>

<!-- <style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style> -->
