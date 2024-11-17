<script lang="ts">
	import type { UIState } from "../models/UIState";

	export let state: UIState;
	let backgroundStyle = "";

	$: if (state.styles.useGradient && state.styles.gradient) {
		backgroundStyle = `background: ${state.styles.gradient.cssStyle};`;
	} else {
		backgroundStyle = `background: ${state.styles.backgroundColor};`;
	}
</script>

<div class="m-16 min-w-[371px] min-h-[371px] max-w-[371px] max-h-[371px] flex justify-center">
    <div id="iconToCapture" class="relative w-[371px] h-[371px]">
        <div class="relative w-full h-full shadow-lg rounded-[45px]" style="{backgroundStyle}" data-testid="icon-background">
            <!-- Icon -->
            <div data-testid="icon-wrapper" class="flex-grow p-5 w-full max-h-[223px] flex justify-center" style="color: {state.styles.glyphColor}; transform: scale({state.styles.iconScale}) translate({state.styles.imgX}px, {state.styles.imgY}px);">
                {#if state.svgContent}
                    {@html state.svgContent}
                {:else}
                    <img src={state.imageUrl} alt={state.styles.label} class="w-full h-full" data-testid="icon-image"/>
                {/if}
            </div>
            <!-- Label -->
            {#if state.styles.labelVisible}
                <div class="text-center px-2 text-6xl w-full truncate absolute" style="color: {state.styles.labelColor}; font-family: {state.styles.labelTypeface}; transform: translate({state.styles.labelX}px, {state.styles.labelY}px);" data-testid="icon-label">
                    {state.styles.label}
                </div>
            {/if}
            <div class="h-8 text-xl text-center opacity-0">&nbsp;</div>
        </div>
    </div>
</div>

<style>
</style>