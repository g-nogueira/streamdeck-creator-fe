<script lang="ts">
  export let state;
</script>

<div class="m-16 min-w-[371px] min-h-[371px] max-w-[371px] max-h-[371px] flex justify-center">
	<div id="iconToCapture" class="relative w-full h-full">
		<div class="relative w-full h-full shadow-lg rounded-[45px]" style="background-color: {state.stylizedIcon.backgroundColor};">
			<!-- Icon -->
			<div class="flex-grow p-5 w-full max-h-[223px] flex justify-center" style="color: {state.stylizedIcon.glyphColor}; transform: scale({state.stylizedIcon.iconScale}) translate({state.stylizedIcon.imgX}px, {state.stylizedIcon.imgY}px);">
				{#if state.isSvg}
					{@html state.iconContent}
				{:else}
					<img src={state.iconContent} alt={state.stylizedIcon.label} class="w-full h-full"/>
				{/if}
			</div>
			<!-- Label -->
			{#if state.stylizedIcon.labelVisible}
				<div class="text-center px-2 text-6xl w-full truncate absolute" style="color: {state.stylizedIcon.labelColor}; font-family: {state.stylizedIcon.labelTypeface}; transform: translate({state.stylizedIcon.labelX}px, {state.stylizedIcon.labelY}px);">
					{state.stylizedIcon.label}
				</div>
			{/if}
			<div class="h-8 text-xl text-center opacity-0">&nbsp;</div>
		</div>
	</div>
</div>

<style>
</style>