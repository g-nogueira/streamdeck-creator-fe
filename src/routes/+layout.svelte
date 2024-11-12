<script>
	import { startUnleash } from '$lib/feature-flags';
	import '../app.css';
</script>


{#await startUnleash()} 
	<p>Loading...</p> 
{:then}
	<slot></slot>
{:catch error}
	<p>{error.message}</p>
{/await}
