<script lang="ts">
    import { writable } from 'svelte/store';

    interface Stop {
        position: number; // 0 to 100
        color: string;    // hex or rgba
    }

    let stops = writable<Stop[]>([
        { position: 0, color: '#fc466b' },
        { position: 100, color: '#3f5efb' }
    ]);

    let gradientType = 'linear'; // 'linear' or 'radial'
    let angle = 90; // default angle for linear gradient

    // Add a new stop on gradient click
    function addStop(event: MouseEvent) {
        const bar = event.currentTarget as HTMLDivElement;
        const clickPosition = (event.offsetX / bar.clientWidth) * 100;
        stops.update(s => [...s, { position: clickPosition, color: '#ffffff' }].sort((a, b) => a.position - b.position));
        return false; // Return false to reset flag
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
    function toggleGradientType(type: string) {
        gradientType = type;
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
        background: linear-gradient(to right, #fc466b, #3f5efb);
        cursor: pointer;
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
        {#if gradientType === 'linear'}
            <label>
                Angle:
                <input class="bg-transparent angle-input" type="number" bind:value={angle} min="0" max="360" />°
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
        style="background: {gradientType === 'linear' ? `linear-gradient(${angle}deg, ${$stops.map(s => `${s.color} ${s.position}%`).join(', ')})` : 'radial-gradient(circle, ' + $stops.map(s => `${s.color} ${s.position}%`).join(', ') + ')' }"
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
                <input class="bg-transparent" type="number" min="0" max="100" bind:value={stop.position} on:input={(e) => updatePosition(index, e.target.value)} />
                <button on:click={() => removeStop(index)}>Remove</button>
            </div>
        {/each}
    </div>
</div>
