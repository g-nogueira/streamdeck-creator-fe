<script lang="ts">
    import { customizedIcon } from "../stores/icon-customizations.store";
    import DOMPurify from 'dompurify';


	let backgroundStyle = "";

	$: if ($customizedIcon?.styles.useGradient && $customizedIcon?.styles.gradient) {
		backgroundStyle = `background: ${$customizedIcon?.styles.gradient.cssStyle};`;
	} else {
		backgroundStyle = `background: ${$customizedIcon?.styles.backgroundColor};`;
	}
</script>


<div class="m-16 min-w-[371px] min-h-[371px] max-w-[371px] max-h-[371px] flex justify-center">
    {#if $customizedIcon}
        <div id="iconToCapture" class="relative w-[371px] h-[371px]">
            <div class="relative w-full h-full shadow-lg rounded-[45px]" style="{backgroundStyle}" data-testid="icon-background">
                <!-- Icon -->
                <div data-testid="icon-wrapper" class="flex-grow p-5 w-full max-h-[223px] flex justify-center" style="color: {$customizedIcon?.styles.glyphColor}; transform: scale({$customizedIcon?.styles.iconScale}) translate({$customizedIcon?.styles.imgX}px, {$customizedIcon?.styles.imgY}px);">
                    {#if $customizedIcon.svgContent}
                        {@html DOMPurify.sanitize($customizedIcon.svgContent)}
                    {:else}
                        <img src={$customizedIcon.imageUrl} alt={$customizedIcon.styles.label} class="w-full h-full" data-testid="icon-image"/>
                    {/if}
                </div>
                <!-- Label -->
                {#if $customizedIcon.styles.labelVisible}
                    <div class="text-center px-2 text-6xl w-full truncate absolute" style="color: {$customizedIcon.styles.labelColor}; font-family: {$customizedIcon.styles.labelTypeface}; transform: translate({$customizedIcon.styles.labelX}px, {$customizedIcon.styles.labelY}px);" data-testid="icon-label">
                        {$customizedIcon.styles.label}
                    </div>
                {/if}
                <div class="h-8 text-xl text-center opacity-0">&nbsp;</div>
            </div>
        </div>
    {/if}
</div>

<style>
</style>