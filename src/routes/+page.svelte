<script>
	import IconCustomizer from '../components/icons/IconCustomizer.svelte';
	import '../app.css';
	import Sidenav from '../components/sidenav/Sidenav.svelte';
	import IconPreview from '../components/icons/IconPreview.svelte';
	import Toolbar from '../components/toolbar/Toolbar.svelte';
	import ShortcutsBar from '../components/shortcuts/ShortcutsBar.svelte';
	
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
			<IconCustomizer />
			<IconPreview />
		</div>
		<!-- <Footer /> -->
	</main>
	<Toolbar />
</div>
<ShortcutsBar />

<style lang="postcss">
	:global(html) {
		height: 100%;
		overflow-y: hidden;
	}
	:global(body) {
		height: 100%;
		background-image: radial-gradient(at 70% 50%, rgba(39 56 95 / 0.5) 0px, transparent 75%),
			radial-gradient(at 50% 0%, rgba(255 3 238 / 0.15) 0px, transparent 75%),
			radial-gradient(at 100% 0%, rgba(255 3 238 / 0.15) 0px, transparent 50%);
	}
</style>
