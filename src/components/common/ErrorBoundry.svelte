<script lang="ts">
	import { ErrorService } from "$lib/services/error.service";
	import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte';

	let errorService = ErrorService.getInstance();

	// Toast helper
	const toaster = createToaster();

	// Catch global errors
	window.onerror = (message, source, lineno, colno, error) => {
		const errorMessage = `Global Error at ${source}:${lineno}:${colno}`;
		errorService.handleError(error || new Error(String(message)), errorMessage);
		toaster.error({title: errorMessage});
	};

	// Catch unhandled promise rejections
	window.addEventListener("unhandledrejection", event => {
		const errorMessage = "Unhandled Promise Rejection";
		errorService.handleError(event.reason || new Error(errorMessage), errorMessage);
		toaster.error({title: errorMessage});
	});
</script>

<Toaster {toaster}></Toaster>

<style lang="postcss">
	/* global.css or inside a <style> */
	:global(.toast-glow) {
		box-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
		border: 1px solid #38bdf8;
	}
</style>
