<script lang="ts">
	export let state;

	const updateColor = (key: string, value: string) => {
		console.log(key, value);
		state[key] = value;
	};
</script>

<div class="border-t border-gray-700 pt-4">
	<!-- Resizing Slider -->
	<label class="mb-2">
		Icon Scale: <input type="range" min="0.5" max="3" step="0.1" bind:value={state.scale} class="ml-2" />
	</label>
	<!-- Color Pickers -->
	<label class="mb-2">
		Glyph Color: <input type="color" bind:value={state.glyphColor} class="ml-2" on:change={(e) => updateColor('glyphColor', e.target?.value)} />
	</label>
	<label class="mb-2">
		Canvas Color: <input type="color" bind:value={state.backgroundColor} class="ml-2" on:change={(e) => updateColor('canvasColor', e.target?.value)} />
	</label>
	<label class="mb-2">
		Label Color: <input type="color" bind:value={state.labelColor} class="ml-2" on:change={(e) => updateColor('labelColor', e.target?.value)} />
	</label>
	<!-- Positioning -->
	<div class="flex flex-col">
		<label class="mb-2">
			Image X Position: <input type="range" min="-100" max="100" bind:value={state.imgX} class="ml-2" />
		</label>
		<label class="mb-2">
			Image Y Position: <input type="range" min="-100" max="100" bind:value={state.imgY} class="ml-2" />
		</label>
		<label class="mb-2">
			Label X Position: <input type="range" min="-100" max="100" bind:value={state.labelX} class="ml-2" />
		</label>
		<label class="mb-2">
			Label Y Position: <input type="range" min="-100" max="100" bind:value={state.labelY} class="ml-2" />
		</label>
	</div>
</div>

<style>

</style>
