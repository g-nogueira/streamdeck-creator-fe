<script lang="ts">
    import { startUnleash } from "$lib/feature-flags";
    import { ErrorService } from '$lib/services/error.service';
    import ErrorBoundary from '../components/common/ErrorBoundary.svelte';
    import "../app.css";

    const errorService = ErrorService.getInstance();

    function handleError(error: Error) {
        errorService.handleError(error, 'Layout');
    }
</script>

<ErrorBoundary>
    {#await startUnleash()}
        <p>Loading...</p>
    {:then}
        <slot />
    {:catch error}
        {handleError(error)}
        <p>Failed to initialize application</p>
    {/await}
</ErrorBoundary>
