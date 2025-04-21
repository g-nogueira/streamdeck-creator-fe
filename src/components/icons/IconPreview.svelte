<script lang="ts">
	import DOMPurify from "dompurify";
	import type { CustomizableIcon } from "../../models/CustomizableIcon";

	export let customizableIcon: CustomizableIcon | null;

	let backgroundStyle = "";

	$: if (customizableIcon?.styles.useGradient && customizableIcon?.styles.gradient) {
		backgroundStyle = `background: ${customizableIcon.styles.gradientCss};`;
	} else {
		backgroundStyle = `background: ${customizableIcon?.styles.backgroundColor};`;
	}

	$: fontFamily = customizableIcon?.styles.labelTypeface?.trim() || "VT323";
</script>

<div class="m-16 flex max-h-[371px] min-h-[371px] max-w-[371px] min-w-[371px] justify-center">
	{#if customizableIcon}
		<div id="iconToCapture" class="relative h-[371px] w-[371px]">
			<div
				class="relative h-full w-full rounded-[45px] shadow-lg"
				style={backgroundStyle}
				data-testid="icon-background">
				<!-- Icon -->
				<div
					data-testid="icon-wrapper"
					class="flex max-h-[223px] w-full flex-grow justify-center p-5"
					style="color: {customizableIcon.styles.glyphColor}; transform: scale({customizableIcon.styles
						.iconScale}) translate({customizableIcon.styles.imgX}px, {customizableIcon.styles.imgY}px);">
					{#if customizableIcon.svgContent}
						{@html DOMPurify.sanitize(customizableIcon.svgContent)}
					{/if}
				</div>
				<!-- Label -->
				{#if customizableIcon.styles.labelVisible}
					<div
						class="absolute w-full truncate px-2 text-center text-6xl"
						style="color: {customizableIcon.styles
							.labelColor}; font-family: {fontFamily}; transform: translate({customizableIcon.styles
							.labelX}px, {customizableIcon.styles.labelY}px);"
						data-testid="icon-label">
						{customizableIcon.styles.label}
					</div>
				{/if}
				<div class="h-8 text-center text-xl opacity-0">&nbsp;</div>
			</div>
		</div>
	{/if}
</div>

<style>
</style>
