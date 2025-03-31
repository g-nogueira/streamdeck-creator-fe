<script lang="ts">
    import _ld from "lodash";
    import { ColorTranslator } from "colortranslator";
    import type { IconGradient, GradientStop } from "../../models/IconGradient";
    import DeleteIcon from "lucide-svelte/icons/trash";

    // Props
    export let gradient: IconGradient | null = null; // Gradient data passed as a prop
    export let onAddGradientStop: (stop: GradientStop) => void; // Callback for adding a gradient stop
    export let onUpdateGradientStopPosition: (index: number, position: number) => void; // Callback for updating stop position
    export let onRemoveGradientStop: (index: number) => void; // Callback for removing a gradient stop
    export let onSetGradientType: (type: IconGradient["type"]) => void; // Callback for setting gradient type
    export let onSetGradientAngle: (angle: number) => void; // Callback for setting gradient angle
    export let onRecalculateGradientCss: () => void; // Callback for recalculating gradient CSS

    let isDraggingGradientHandler = false;

    // Function to get the color at a specific position
    function getColorAtPosition(position: number): string {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 1;
        canvas.height = 30;

        const gradientCanvas = ctx!.createLinearGradient(0, 0, 0, canvas.height);

        (gradient?.stops || []).forEach(stop => {
            gradientCanvas.addColorStop(stop.position / 100, stop.color);
        });

        ctx!.fillStyle = gradientCanvas;
        ctx!.fillRect(0, 0, 1, canvas.height);

        const y = (position / 100) * canvas.height;
        const imageData = ctx!.getImageData(0, y, 1, 1).data;
        return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, ${imageData[3] / 255})`;
    }

    function addStop(event: MouseEvent) {
        const bar = event.currentTarget as HTMLDivElement;
        const clickPosition = (event.offsetX / bar.clientWidth) * 100;

        const colorAtClick = getColorAtPosition(clickPosition);
        const colorAtClickHex = ColorTranslator.toHEX(colorAtClick);

        onAddGradientStop({ position: clickPosition, color: colorAtClickHex });
    }

    function updateStopPosition(index: number, event: MouseEvent) {
        const bar = document.getElementById("gradientBar") as HTMLDivElement;
        const rect = bar.getBoundingClientRect();
        const newPosition = Math.min(Math.max(((event.clientX - rect.left) / bar.clientWidth) * 100, 0), 100);
        onUpdateGradientStopPosition(index, newPosition);
    }

    function removeStop(index: number) {
        onRemoveGradientStop(index);
    }

    function toggleGradientType(type: string) {
        if (type !== "linear" && type !== "radial") {
            throw new Error("Invalid gradient type");
        }
        onSetGradientType(type as IconGradient["type"]);
    }
</script>

<div data-testid="gradient-generator-component" class="flex flex-col gap-5">
    <div class="flex flex-row justify-between gap-10">
        <select
            class="select-toolbar select bg-surface-800"
            onchange={(e: Event) => toggleGradientType((e.target as HTMLSelectElement).value)}
            data-testid="gradient-type-select">
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
        </select>
        {#if gradient?.type === "linear"}
            <input
                class="input-toolbar input bg-surface-800"
                type="number"
                placeholder="90°"
                value={gradient.angle}
                oninput={(e: Event) => {
                    const angle = parseFloat((e.target as HTMLInputElement).value);
                    if (!isNaN(angle)) {
                        onSetGradientAngle(angle);
                    }
                }}
                data-testid="gradient-angle-input" />
        {/if}
    </div>

    <div
        id="gradientBar"
        class="relative h-10 w-full cursor-copy rounded-sm"
        data-testid="gradient-bar"
        onclick={event => {
            if (event.target !== event.currentTarget) return;
            addStop(event);
        }}
        style="background: {gradient?.cssStyle || 'transparent'}">
        {#each gradient?.stops || [] as stop, index}
            <div
                class="stop absolute -bottom-2 h-14 w-3 cursor-ew-resize rounded-md border border-white"
                style="left: {stop.position}%; background-color: {stop.color};"
                data-testid="gradient-stop-handler"
                onmousedown={_ => {
                    if (isDraggingGradientHandler) return;

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

    <div class="flex flex-col gap-2">
        {#each gradient?.stops || [] as stop, index}
            <div class="inline-flex w-full items-center justify-start gap-3" data-testid="gradient-stop-options">
                <div class="inline-flex w-1/2 gap-3">
                    <input
                        class="input-toolbar input"
                        type="color"
                        bind:value={stop.color}
                        oninput={onRecalculateGradientCss}
                        data-testid="stop-color-input" />
                    <input
                        class="input-toolbar input"
                        type="number"
                        min="0"
                        max="100"
                        bind:value={stop.position}
                        oninput={onRecalculateGradientCss} />
                </div>
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
