<script lang="ts">
	import { customizedIcon } from "../../stores/icon-customizations.store";
	import DOMPurify from "dompurify";

	let backgroundStyle = "";

	$: if ($customizedIcon?.styles.useGradient && $customizedIcon?.styles.gradient) {
		backgroundStyle = `background: ${$customizedIcon?.styles.gradient.cssStyle};`;
	} else {
		backgroundStyle = `background: ${$customizedIcon?.styles.backgroundColor};`;
	}
</script>

<div class="m-16 flex max-h-[371px] min-h-[371px] min-w-[371px] max-w-[371px] justify-center">
	{#if $customizedIcon}
		<div id="iconToCapture" class="relative h-[371px] w-[371px]">
			<div
				class="relative h-full w-full rounded-[45px] shadow-lg"
				style={backgroundStyle}
				data-testid="icon-background">
				<!-- Icon -->
				<div
					data-testid="icon-wrapper"
					class="flex max-h-[223px] w-full flex-grow justify-center p-5"
					style="color: {$customizedIcon?.styles.glyphColor}; transform: scale({$customizedIcon?.styles
						.iconScale}) translate({$customizedIcon?.styles.imgX}px, {$customizedIcon?.styles.imgY}px);">
					{#if $customizedIcon.svgContent}
						{@html DOMPurify.sanitize($customizedIcon.svgContent)}
					{/if}
				</div>
				<!-- Label -->
				{#if $customizedIcon.styles.labelVisible}
					<div
						class="absolute w-full truncate px-2 text-center text-6xl"
						style="color: {$customizedIcon.styles.labelColor}; font-family: {$customizedIcon.styles
							.labelTypeface}; transform: translate({$customizedIcon.styles.labelX}px, {$customizedIcon.styles
							.labelY}px);"
						data-testid="icon-label">
						{$customizedIcon.styles.label}
					</div>
				{/if}
				<div class="h-8 text-center text-xl opacity-0">&nbsp;</div>
			</div>
		</div>
	{/if}
</div>

<style>
</style>
