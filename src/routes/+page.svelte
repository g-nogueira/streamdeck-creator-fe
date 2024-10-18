<script>
	import TopBar from '../components/TopBar.svelte';
	import IconList from '../components/IconList.svelte';
	import IconCustomizer from '../components/IconCustomizer.svelte';
	import Footer from '../components/Footer.svelte';
	import '../app.css';
	import { startUserIconCollectionsSync } from '$lib/sync-manager';
	import Sidenav from '../components/Sidenav.svelte';
	import IconPreview from '../components/IconPreview.svelte';
	import { state } from '../stores/ui-state.store';

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
	<main class="flex h-screen w-screen flex-col overflow-hidden">
		<div class="flex h-full w-full items-center justify-center">
			<IconCustomizer classNames="w-1/4" />
			<IconPreview bind:state={$state} />
		</div>
		<Footer />
	</main>
</div>

<style lang="postcss">
	:global(html) {
		height: 100%;
	}
	:global(body) {
		height: 100%;
		background-image: 
			radial-gradient(at 70% 50%, rgba(39 56 95 / 0.5) 0px, transparent 75% ),
			radial-gradient(at 50% 0%, rgba(255 3 238 / 0.15) 0px, transparent 75% ),
			radial-gradient(at 100% 0%, rgba(255 3 238 / 0.15) 0px, transparent 50%);
	}
</style>
