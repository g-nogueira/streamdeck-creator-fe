<script lang="ts">
	import _ld from 'lodash';
	import { ColorTranslator } from 'colortranslator';
	import type { IconGradient } from '../../models/IconGradient';
	import DeleteIcon from 'lucide-svelte/icons/trash';
	import { customizedIcon } from '../../stores/icon-customizations.store';
	import * as _iconPreview from '../../models/CustomizableIcon';

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
		$customizedIcon?.styles.gradient?.stops?.forEach((stop) => {
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

		customizedIcon.addGradientStop({ position: clickPosition, color: colorAtClickHex });
	}

	// Update position of stop on drag
	function updateStopPosition(index: number, event: MouseEvent) {
		const bar = document.getElementById('gradientBar') as HTMLDivElement; // Get the bar element
		const rect = bar.getBoundingClientRect(); // Get the bounding rectangle of the bar
		const newPosition = Math.min(
			Math.max(((event.clientX - rect.left) / bar.clientWidth) * 100, 0),
			100
		);
		customizedIcon.updateGradientStopPosition(index, newPosition);
	}

	// Remove stop
	function removeStop(index: number) {
		customizedIcon.removeGradientStop(index);
	}

	// Toggle gradient type
	function toggleGradientType(type: string) {
		// Throw an error if the type is not 'linear' or 'radial'
		if (type !== 'linear' && type !== 'radial') {
			throw new Error('Invalid gradient type');
		}

		customizedIcon.setGradientType(type as IconGradient['type']);
	}
</script>

<div data-testid="gradient-generator-component" class="flex flex-col gap-5">
	<!-- Inputs for gradient type and angle -->
	<div class="flex flex-row justify-between gap-10">
		<select
			class="select-toolbar select bg-surface-800"
			onchange={(e: Event) => toggleGradientType((e.target as HTMLSelectElement).value)}
			data-testid="gradient-type-select"
		>
			<option value="linear">Linear</option>
			<option value="radial">Radial</option>
		</select>
		{#if $customizedIcon?.styles.gradient?.type === 'linear'}
			<input
				class="input-toolbar input bg-surface-800"
				type="number"
				placeholder="90°"
				value={$customizedIcon?.styles.gradient.angle}
				oninput={(e: Event) => {
					const angle = parseFloat((e.target as HTMLInputElement).value);
					if (!isNaN(angle)) {
						customizedIcon.setGradientAngle(angle);
					}
				}}
				data-testid="gradient-angle-input"
			/>
		{/if}
	</div>

	<!-- Gradient bar -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		id="gradientBar"
		class="relative h-10 w-full cursor-copy rounded-sm"
		data-testid="gradient-bar"
		onclick={(event) => {
			// Prevent adding a stop when dragging the handler
			if (event.target !== event.currentTarget) return;
			addStop(event);
		}}
		style="background: {$customizedIcon?.styles.gradient?.cssStyle}"
	>
		{#each $customizedIcon?.styles.gradient?.stops || [] as stop, index}
			<div
				class="stop absolute -bottom-2 h-14 w-3 cursor-ew-resize rounded-md border border-white"
				style="left: {stop.position}%; background-color: {stop.color};"
				data-testid="gradient-stop-handler"
				onmousedown={(_) => {
					if (isDraggingGradientHandler) return;

					const updateStopPos = (e: MouseEvent) => {
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
		{#each $customizedIcon?.styles.gradient?.stops || [] as stop, index}
			<div
				class="inline-flex w-full items-center justify-start gap-3"
				data-testid="gradient-stop-options"
			>
				<div class="inline-flex w-1/2 gap-3">
					<input
						class="input-toolbar input"
						type="color"
						value={stop.color}
						oninput={(_) => customizedIcon.recalculateGradientCss()}
						data-testid="stop-color-input"
					/>
					<input
						class="input-toolbar input"
						type="number"
						min="0"
						max="100"
						value={stop.position}
						oninput={(_) => customizedIcon.recalculateGradientCss()}
					/>
				</div>
				<button
					onclick={() => removeStop(index)}
					class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-warning-900"
					data-testid="delete-stop-button"
				>
					<DeleteIcon size={20} />
				</button>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
</style>
