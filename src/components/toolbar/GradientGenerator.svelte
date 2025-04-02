<script lang="ts">
	import _ld from "lodash";
	import { ColorTranslator } from "colortranslator";
	import type { IconGradient } from "../../models/IconGradient";
	import DeleteIcon from "lucide-svelte/icons/trash";
	import type { GradientState, GradientStop } from "$lib/gradient";

	// Props
	export let gradient: GradientState | null = null; // Gradient data passed as a prop
	export let grandientCss: string | null = null; // CSS string for the gradient
	export let onAddGradientStop: (stop: GradientStop) => void; // Callback for adding a gradient stop
	export let onUpdateGradientStopPosition: (index: number, position: number) => void; // Callback for updating stop position
	export let onRemoveGradientStop: (index: number) => void; // Callback for removing a gradient stop
	export let onSetGradientType: (type: IconGradient["type"]) => void; // Callback for setting gradient type
	export let onSetLinearGradientDirection: (angle: string) => void; // Callback for setting gradient angle
	export let onRecalculateGradientCss: () => void; // Callback for recalculating gradient CSS

	let isDraggingGradientHandler = false;

	/**
	 * Function to get the color at a specific position in the gradient.
	 * @param position The position in the gradient (0 to 1).
	 */
	function getColorAtPosition(position: number): string {
		// Create a temporary canvas to render the gradient
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		canvas.width = 1; // Single pixel width
		canvas.height = 30; // Arbitrary height for gradient rendering

		// Create a linear gradient on the canvas
		const gradientCanvas = ctx!.createLinearGradient(0, 0, 0, canvas.height);

		// Add gradient stops from the provided gradient data
		(gradient?.stops || []).forEach(stop => {
			gradientCanvas.addColorStop(stop.pos, stop.color);
		});

		// Fill the canvas with the gradient
		ctx!.fillStyle = gradientCanvas;
		ctx!.fillRect(0, 0, 1, canvas.height);

		// Calculate the vertical position on the canvas based on the input position
		const y = (position / 100) * canvas.height;

		// Get the color data at the calculated position
		const imageData = ctx!.getImageData(0, y, 1, 1).data;

		// Return the color as an RGBA string
		return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, ${imageData[3] / 255})`;
	}

	/**
	 * Adds a new gradient stop at the clicked position on the gradient bar.
	 * @param event The mouse click event.
	 */
	function addStop(event: MouseEvent) {
		const bar = event.currentTarget as HTMLDivElement;
		const clickPosition = event.offsetX / bar.clientWidth; // Normalize position to 0-1 range

		// Get the color at the clicked position
		const colorAtClick = getColorAtPosition(clickPosition);
		const colorAtClickHex = ColorTranslator.toHEX(colorAtClick); // Convert to HEX format

		// Round the position to two decimal places
		const roundedPosition = Math.round(clickPosition * 100) / 100;

		// Trigger the callback to add the gradient stop
		onAddGradientStop({ pos: roundedPosition, color: colorAtClickHex });
		onRecalculateGradientCss();
	}

	/**
	 * Updates the position of a gradient stop while dragging.
	 * @param index The index of the stop being updated.
	 * @param event The mouse move event.
	 */
	function updateStopPosition(index: number, event: MouseEvent) {
		const bar = document.getElementById("gradientBar") as HTMLDivElement;
		const rect = bar.getBoundingClientRect();

		// Calculate the new position based on the mouse position
		const newPosition = Math.min(Math.max((event.clientX - rect.left) / bar.clientWidth, 0), 1);

		// Round the position to two decimal places
		const roundedPosition = Math.round(newPosition * 100) / 100;

		// Trigger the callback to update the stop position
		onUpdateGradientStopPosition(index, roundedPosition);
		onRecalculateGradientCss();
	}

	/**
	 * Removes a gradient stop by its index.
	 * @param index The index of the stop to remove.
	 */
	function removeStop(index: number) {
		onRemoveGradientStop(index);
		onRecalculateGradientCss();
	}

	/**
	 * Toggles the gradient type between linear and radial.
	 * @param type The new gradient type.
	 */
	function toggleGradientType(type: string) {
		if (type !== "linear" && type !== "radial") {
			throw new Error("Invalid gradient type");
		}
		onSetGradientType(type as IconGradient["type"]);
		onRecalculateGradientCss();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div data-testid="gradient-generator-component" class="flex flex-col gap-5">
	<div class="flex flex-row justify-between gap-10">
		<!-- Dropdown to select gradient type -->
		<select
			class="select-toolbar select bg-surface-800"
			onchange={(e: Event) => toggleGradientType((e.target as HTMLSelectElement).value)}
			data-testid="gradient-type-select">
			<option value="linear">Linear</option>
			<option value="radial">Radial</option>
		</select>

		<!-- Input for setting the gradient angle (only for linear gradients) -->
		{#if gradient?.type === "linear"}
			<input
				class="input-toolbar input bg-surface-800"
				type="text"
				placeholder="90deg"
				value={gradient.direction}
				oninput={(e: Event) => {
					const direction = (e.target as HTMLInputElement).value;
					onSetLinearGradientDirection(direction); // Trigger the callback to set the gradient direction
					onRecalculateGradientCss();
				}}
				data-testid="gradient-angle-input" />
		{/if}
	</div>

	<!-- Gradient bar for visualizing and interacting with gradient stops -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		id="gradientBar"
		class="relative h-10 w-full cursor-copy rounded-sm"
		data-testid="gradient-bar"
		onclick={event => {
			if (event.target !== event.currentTarget) return; // Prevent clicks on child elements
			addStop(event); // Add a new gradient stop
		}}
		style="background: {grandientCss || 'transparent'}">
		{#each gradient?.stops || [] as stop, index}
			<!-- Gradient stop handlers -->
			<div
				class="stop absolute -bottom-2 h-14 w-3 cursor-ew-resize rounded-md border border-white"
				style="left: {stop.pos * 100}%; background-color: {stop.color};"
				data-testid="gradient-stop-handler"
				onmousedown={_ => {
					if (isDraggingGradientHandler) return; // Prevent multiple drag listeners

					// Add event listeners for dragging the stop
					const updateStopPos = (e: MouseEvent) => {
						updateStopPosition(index, e);
					};
					const removeListeners = () => {
						window.removeEventListener("mousemove", updateStopPos);
						window.removeEventListener("mouseup", removeListeners);
						isDraggingGradientHandler = false;
					};

					isDraggingGradientHandler = true;
					window.addEventListener("mousemove", updateStopPos);
					window.addEventListener("mouseup", removeListeners);
				}}>
			</div>
		{/each}
	</div>

	<!-- Options for editing gradient stops -->
	<div class="flex flex-col gap-2">
		{#each gradient?.stops || [] as stop, index}
			<div class="inline-flex w-full items-center justify-start gap-3" data-testid="gradient-stop-options">
				<div class="inline-flex w-1/2 gap-3">
					<!-- Input for changing the stop color -->
					<input
						class="input-toolbar input"
						type="color"
						bind:value={stop.color}
						oninput={onRecalculateGradientCss}
						data-testid="stop-color-input" />
					<!-- Input for changing the stop position -->
					<input
						class="input-toolbar input"
						type="number"
						min="0"
						max="1"
						step=".01"
						bind:value={stop.pos}
						oninput={onRecalculateGradientCss}
						data-testid="stop-position-input" />
				</div>
				<!-- Button to remove the stop -->
				<button
					onclick={() => removeStop(index)}
					class="btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-warning-900"
					data-testid="delete-stop-button">
					<DeleteIcon size={20} />
				</button>
			</div>
		{/each}
	</div>
</div>
