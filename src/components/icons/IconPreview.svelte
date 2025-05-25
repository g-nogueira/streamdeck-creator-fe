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

<div class="m-16 flex max-h-[371px] min-h-[371px] min-w-[371px] max-w-[371px] justify-center">
	{#if customizableIcon}
		<div id="iconToCapture" class="relative h-[371px] w-[371px]">
			<div
				class="relative h-full w-full rounded-[45px] shadow-lg"
				style={backgroundStyle}
				data-testid="icon-background">
				<!-- Icon -->
				<div
				data-testid="icon-wrapper"
				class="h-[223px] w-full p-5 flex" style="color: {customizableIcon.styles.glyphColor}; transform: scale({customizableIcon.styles.iconScale}) translate({customizableIcon.styles.imgX}px, {customizableIcon.styles.imgY}px);">
					{#if customizableIcon.contentType === "image/svg+xml" && customizableIcon.svgContent && customizableIcon.iconOrigin !== "homarr"}
						{@html customizableIcon.svgContent}
					{:else if customizableIcon.iconOrigin === "homarr"}
						<img src={customizableIcon.imageIconUrl} alt="icon preview" class="h-full m-auto max-h-full" style="width: 100%;height: auto;object-fit: contain;" />
					{/if}
				</div>
				<!-- Label -->
				{#if customizableIcon.styles.labelVisible}
					<div
						class="absolute w-full truncate px-2 text-center"
						style="color: {customizableIcon.styles.labelColor}; font-family: {fontFamily}; font-size: {customizableIcon.styles.labelSize}px; transform: translate({customizableIcon.styles.labelX}px, {customizableIcon.styles.labelY}px);"
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
