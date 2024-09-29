<script>
	import IconList from '../components/IconList.svelte';
	import IconCustomizer from '../components/IconCustomizer.svelte';
	import SearchBar from '../components/SearchBar.svelte';
</script>

<main>
	<SearchBar />
	<div class="container">
		<IconList />
		<IconCustomizer />
	</div>
</main>

<style>
    .container {
        display: flex;
    }
</style>