<script lang="ts">
  export let state;
</script>

<div class="m-16 w-[371px] h-[371px] flex justify-center">
	<div id="iconToCapture" class="relative w-full h-full">
		<div class="relative w-full h-full shadow-lg rounded-[45px]" style="background-color: {state.backgroundColor};">
			<!-- Icon -->
			<div class="flex-grow p-5 w-full h-full max-h-[223px] flex justify-center" style="color: {state.glyphColor}; transform: scale({state.scale}) translate({state.imgX}px, {state.imgY}px);">
				{#if state.isSvg}
					{@html state.iconContent}
				{:else}
					<img src={state.iconContent} alt={state.labelText} class="w-full h-full"/>
				{/if}
			</div>
			<!-- Label -->
			{#if state.labelVisible}
				<div class="text-center px-2 text-6xl w-full truncate absolute" style="color: {state.labelColor}; font-family: {state.labelTypeface}; transform: translate({state.labelX}px, {state.labelY}px);">
					{state.labelText}
				</div>
			{/if}
			<div class="h-8 text-xl text-center opacity-0">&nbsp;</div>
		</div>
	</div>
</div>

<style>
</style>