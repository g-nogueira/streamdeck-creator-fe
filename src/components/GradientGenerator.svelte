<script lang="ts">
    import { writable } from 'svelte/store';
    import { ColorTranslator } from 'colortranslator';
	import type { GradientStop, UserIconGradient } from '../models/UserIconGradient';
	import type { UIState } from '../models/UIState';

    export let state: UIState;
    
    let stops = writable<GradientStop[]>([
        { position: 0, color: '#fc466b' },
        { position: 100, color: '#3f5efb' }
    ]);

    let gradientType = writable<'linear' | 'radial'>('linear'); // 'linear' or 'radial'
    let angle = writable<number>(90); // default angle for linear gradient
    
    stops.subscribe(value => {
        state.styles.gradient = state.styles.gradient || mkDefaultGradinet();
        state.styles.gradient.stops = value;
        state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
    });
    gradientType.subscribe(value => {
        state.styles.gradient = state.styles.gradient || mkDefaultGradinet();
        state.styles.gradient.type = value;
        state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
    });
    angle.subscribe(value => {
        state.styles.gradient = state.styles.gradient || mkDefaultGradinet();
        state.styles.gradient.angle = value;
        state.styles.gradient.cssStyle = mkCssStyle(state.styles.gradient);
    });

    $: if (state.styles.gradient?.stops && state.styles.gradient?.stops !== $stops) {
        stops.set(state.styles.gradient.stops);
    }

    $: if (state.styles.gradient?.type && state.styles.gradient.type !== $gradientType) {
        gradientType.set(state.styles.gradient.type);
    }

    $: if (state.styles.gradient?.angle && state.styles.gradient.angle !== $angle) {
        angle.set(state.styles.gradient.angle);
    }

    function mkDefaultGradinet(): UserIconGradient {
        return {
            stops: [
                { position: 0, color: '#fc466b' },
                { position: 100, color: '#3f5efb' }
            ],
            type: 'linear',
            angle: 90,
            cssStyle: 'linear-gradient(90deg, #fc466b 0%, #3f5efb 100%)'
        };
    }

    function mkCssStyle({ stops, type, angle }: UserIconGradient): string {
        return type === 'linear' ? `linear-gradient(${angle}deg, ${stops.map(s => `${s.color} ${s.position}%`).join(', ')})` : 'radial-gradient(circle, ' + stops.map(s => `${s.color} ${s.position}%`).join(', ') + ')';
    }

    // Function to get the color at a specific position
    function getColorAtPosition(position: number): string {
        // Create a temporary canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        canvas.width = 1;  // Only need 1 pixel wide
        canvas.height = 30; // Height can match the height of the gradient bar
        
        // Create a linear gradient that fills the entire height of the canvas
        const gradient = ctx!.createLinearGradient(0, 0, 0, canvas.height);
        
        // Populate the gradient with your stops
        $stops.forEach(stop => {
            gradient.addColorStop(stop.position / 100, stop.color);
        });
        
        // Fill the gradient onto the canvas
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, 1, canvas.height); // Fill the 1xHeight rectangle
    
        // Get the color from the canvas at the specified position
        const y = position / 100 * canvas.height; // Convert to canvas height
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
        
        stops.update(s => [
            ...s,
            { position: clickPosition, color: colorAtClickHex }
        ].sort((a, b) => a.position - b.position));
    }

    // Update position of stop on drag
    function updatePosition(index: number, event: MouseEvent) {
        const bar = document.getElementById("gradientBar") as HTMLDivElement; // Get the bar element
        const rect = bar.getBoundingClientRect(); // Get the bounding rectangle of the bar
        const newPosition = Math.min(Math.max(((event.clientX - rect.left) / bar.clientWidth) * 100, 0), 100); // Corrected parenthesis
        stops.update(s => {
            s[index].position = newPosition;
            return s.sort((a, b) => a.position - b.position);
        });
    }

    // Remove stop
    function removeStop(index: number) {
        stops.update(s => s.filter((_, i) => i !== index));
    }

    // Toggle gradient type
    function toggleGradientType(type: 'linear' | 'radial') {
        gradientType.set(type);
    }
</script>

<style>
    .gradient-generator {
        margin: 20px;
        background-color: #1e1e1e;
        padding: 20px;
        border-radius: 8px;
        color: #ffffff;
    }

    .gradient-bar {
        width: 100%;
        height: 30px;
        position: relative;
        background: linear-gradient(90deg, #45fc8b 0%, #212a54 100%);
        cursor: copy;
        border-radius: 4px;
        margin: 10px 0;
    }

    .stop {
        position: absolute;
        top: 0; /* Aligns the stops to the top of the bar */
        width: 10px; /* Width of the vertical line */
        height: 30px; /* Height of the gradient bar */
        cursor: pointer;
        border: 2px solid #ffffff;
        cursor: ew-resize;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;
    }

    input[type="color"] {
        margin-right: 10px;
    }

    .angle-input {
        width: 50px;
        text-align: center;
    }
</style>

<div class="gradient-generator">
    <div class="controls">
        <div>
            <label>
                <input class="bg-transparent" type="radio" name="gradientType" value="linear" checked on:change={() => toggleGradientType('linear')} /> Linear
            </label>
            <label>
                <input class="bg-transparent" type="radio" name="gradientType" value="radial" on:change={() => toggleGradientType('radial')} /> Radial
            </label>
        </div>
        {#if $gradientType === 'linear'}
            <label>
                Angle:
                <input class="bg-transparent angle-input" type="number" bind:value={$angle} min="0" max="360" />°
            </label>
        {/if}
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        id="gradientBar"
        class="gradient-bar" 
        on:click={event => {
            if (event.target !== event.currentTarget) return;
            addStop(event);
        }}
        style="background: {mkCssStyle({stops: $stops, type: $gradientType, angle: $angle, cssStyle: '' })}"
    >
        {#each $stops as stop, index}
            <div
                class="stop"
                style="left: {stop.position}%; background-color: {stop.color};"
                on:mousedown={event => {
                    const moveHandler = (e: MouseEvent) => {
                        updatePosition(index, e);
                    };
                    const upHandler = () => {
                        window.removeEventListener('mousemove', moveHandler);
                        window.removeEventListener('mouseup', upHandler);
                    };
                    window.addEventListener('mousemove', moveHandler);
                    window.addEventListener('mouseup', upHandler);
                }}
            ></div>
        {/each}
    </div>

    <div>
        {#each $stops as stop, index}
            <div>
                <input class="bg-transparent" type="color" bind:value={stop.color}>
                <input class="bg-transparent" type="number" min="0" max="100" bind:value={stop.position} />
                <button on:click={() => removeStop(index)}>Remove</button>
            </div>
        {/each}
    </div>
</div>
