<script lang="ts">
	import { onMount } from "svelte";
	import { ErrorService } from "$lib/services/error.service";

	export let fallback: string | undefined = undefined;

	let error: Error | null = null;
	let errorService = ErrorService.getInstance();

	onMount(() => {
		if (error) {
			errorService.handleError(error);
		}
	});
</script>

{#if error}
    <div class="error-boundary" role="alert">
        {#if fallback}
            {fallback}
        {:else}
            <p class="error-title">Something went wrong</p>
            {#if import.meta.env.DEV && error != null}
                <pre class="error-details">{(error as Error).message}</pre>
            {/if}
        {/if}
    </div>
{:else}
    <slot />
{/if}

<style lang="postcss">
    .error-boundary {
        @apply p-4 m-4 rounded-md;
        background-color: theme('colors.error.100');
        border: 1px solid theme('colors.error.500');
        color: theme('colors.error.900');
    }

    .error-title {
        @apply text-lg font-semibold mb-2;
    }

    .error-details {
        @apply mt-2 p-2 rounded bg-error-50 text-sm font-mono;
        border: 1px solid theme('colors.error.200');
    }

    :global(.error-gradient) {
        @apply border-2 border-error-500 bg-error-100/50;
    }

    :global(.error-input) {
        @apply border-error-500 bg-error-50;
    }
</style>
