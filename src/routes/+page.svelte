<script>
	import IconCustomizer from '../components/IconCustomizer.svelte';
	import '../app.css';
	import Sidenav from '../components/Sidenav.svelte';
	import IconPreview from '../components/IconPreview.svelte';
	import { uiState } from '../stores/ui-state.store';
	import Toolbar from '../components/Toolbar/Toolbar.svelte';
	import ShortcutsBar from '../components/ShortcutsBar.svelte';

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
			<IconPreview bind:state={$uiState} />
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
