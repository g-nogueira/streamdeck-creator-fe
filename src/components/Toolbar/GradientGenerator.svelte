<script lang="ts">
	import _ld from 'lodash';
	import { ColorTranslator } from 'colortranslator';
	import type { UserIconGradient } from '../../models/UserIconGradient';
	import type { UIState } from '../../models/UIState';
	import DeleteIcon from 'lucide-svelte/icons/trash';
	import { uiState } from '../../stores/ui-state.store';

	export let state: UIState['styles'];

	let isDraggingGradientHandler = false;

	// Function to get the color at a specific position
	function getColorAtPosition(position: number): string {
		// Create a temporary canvas
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = 1; // Only need 1 pixel wide
		canvas.height = 30; // Height can match the height of the gradient bar

		// Create a linear gradient that fills the entire height of the canvas
		const gradient = ctx!.createLinearGradient(0, 0, 0, canvas.height);

		// Populate the gradient with your stops
		state.gradient?.stops.forEach((stop) => {
			gradient.addColorStop(stop.position / 100, stop.color);
		});

		// Fill the gradient onto the canvas
		ctx!.fillStyle = gradient;
		ctx!.fillRect(0, 0, 1, canvas.height); // Fill the 1xHeight rectangle

		// Get the color from the canvas at the specified position
		const y = (position / 100) * canvas.height; // Convert to canvas height
		const imageData = ctx!.getImageData(0, y, 1, 1).data;
		const color = `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, ${imageData[3] / 255})`;

		return color;
	}

	// Modify the addStop function to set the new stop's color
	function addStop(event: MouseEvent) {
		const bar = event.currentTarget as HTMLDivElement;
		const clickPosition = (event.offsetX / bar.clientWidth) * 100;

		// Get the color at the click position
		const colorAtClick = getColorAtPosition(clickPosition);

		// Convert the color to hex
		const colorAtClickHex = ColorTranslator.toHEX(colorAtClick);

		uiState.addGradientStop({ position: clickPosition, color: colorAtClickHex });
	}

	// Update position of stop on drag
	function updateStopPosition(index: number, event: MouseEvent) {
		const bar = document.getElementById('gradientBar') as HTMLDivElement; // Get the bar element
		const rect = bar.getBoundingClientRect(); // Get the bounding rectangle of the bar
		const newPosition = Math.min(
			Math.max(((event.clientX - rect.left) / bar.clientWidth) * 100, 0),
			100
		);

		uiState.updateGradientStopPosition(index, newPosition);
	}

	// Remove stop
	function removeStop(index: number) {
		uiState.removeGradientStop(index);
	}

	// Toggle gradient type
	function toggleGradientType(type: string) {
		// Throw an error if the type is not 'linear' or 'radial'
		if (type !== 'linear' && type !== 'radial') {
			throw new Error('Invalid gradient type');
		}

		uiState.setGradientType(type as UserIconGradient['type']);
	}
</script>

<div class="flex flex-col gap-5">
	<!-- Inputs for gradient type and angle -->
	<div class="flex flex-row justify-between gap-10">
		<select
			class="select-toolbar select bg-surface-800"
			on:change={(e: Event) => toggleGradientType((e.target as HTMLSelectElement).value)}
		>
			<option value="linear">Linear</option>
			<option value="radial">Radial</option>
		</select>
		{#if state.gradient?.type === 'linear'}
			<input
				class="input-toolbar input bg-surface-800"
				type="number"
				placeholder="90°"
				bind:value={state.gradient.angle}
			/>
		{/if}
	</div>

	<!-- Gradient bar -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		id="gradientBar"
		class="relative h-10 w-full cursor-copy rounded-sm"
		on:click={(event) => {
			// Prevent adding a stop when dragging the handler
			if (event.target !== event.currentTarget) return;

			addStop(event);
		}}
		style="background: {state.gradient?.cssStyle}"
	>
		{#each state.gradient?.stops || [] as stop, index}
			<div
				class="stop absolute -bottom-2 h-14 w-3 cursor-ew-resize rounded-md border border-white"
				style="left: {stop.position}%; background-color: {stop.color};"
				on:mousedown={(_) => {
					if (isDraggingGradientHandler) return;

					const updateStopPos = (e: MouseEvent) => {
						console.log('Moving handler for stop', index);
						updateStopPosition(index, e);
					};
					const removeListeners = () => {
						window.removeEventListener('mousemove', updateStopPos);
						window.removeEventListener('mouseup', removeListeners);
                        console.log('disableDrag');
                        isDraggingGradientHandler = false;
					};

					console.log('enableDrag');
					isDraggingGradientHandler = true;
					window.addEventListener('mousemove', updateStopPos);
					window.addEventListener('mouseup', removeListeners);
				}}
			></div>
		{/each}
	</div>

	<!-- Stops -->
	<div class="flex flex-col gap-2">
		{#each state.gradient?.stops || [] as stop, index}
			<div class="inline-flex w-full items-center justify-start gap-3">
				<div class="inline-flex w-1/2 gap-3">
					<input
						class="input-toolbar input"
						type="color"
						bind:value={stop.color}
						on:input={(_) => uiState.recalculateGradientCss()}
					/>
					<input
						class="input-toolbar input"
						type="number"
						min="0"
						max="100"
						bind:value={stop.position}
						on:input={(_) => uiState.recalculateGradientCss()}
					/>
				</div>
				<button
					on:click={() => removeStop(index)}
					class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-warning-900"
				>
					<DeleteIcon size={20} />
				</button>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
</style>
