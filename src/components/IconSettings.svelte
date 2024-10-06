<script lang="ts">
	export let state;
</script>

<div class="icon-settings">
	<!-- Resizing Slider -->
	<div class="setting-group">
		<label>Icon Scale:</label>
		<input type="range" list="scaleMarkers" min="0" max="3" step="0.1" bind:value={state.stylizedIcon.iconScale} class="slider" />
	</div>

	<datalist id="scaleMarkers">
		<option value="0"></option>
		<option value="0.5"></option>
		<option value="1"></option>
		<option value="1.5"></option>
		<option value="2"></option>
		<option value="2.5"></option>
		<option value="3"></option>
	</datalist>

	<!-- Color Pickers -->
	<div class="setting-group">
		<label>Glyph Color:</label>
		<input type="color" bind:value={state.stylizedIcon.glyphColor} class="color-picker" />
	</div>
	<div class="setting-group">
		<label>Canvas Color:</label>
		<input type="color" bind:value={state.stylizedIcon.backgroundColor} class="color-picker" />
	</div>
	<div class="setting-group">
		<label>Label Color:</label>
		<input type="color" bind:value={state.stylizedIcon.labelColor} class="color-picker" />
	</div>

	<!-- Positioning Sliders -->
	<div class="setting-group">
		<label>Image X Position:</label>
		<input type="range" list="posMarkers" min="-100" max="100" bind:value={state.stylizedIcon.imgX} class="slider" />
	</div>
	<div class="setting-group">
		<label>Image Y Position:</label>
		<input type="range" list="posMarkers" min="-100" max="100" bind:value={state.stylizedIcon.imgY} class="slider" />
	</div>
	<div class="setting-group">
		<label>Label X Position:</label>
		<input type="range" list="posMarkers" min="-100" max="100" bind:value={state.stylizedIcon.labelX} class="slider" />
	</div>
	<div class="setting-group">
		<label>Label Y Position:</label>
		<input type="range" list="posMarkers" min="-100" max="100" bind:value={state.stylizedIcon.labelY} class="slider" />
	</div>
</div>

<datalist id="posMarkers">
	<option value="-100"></option>
	<option value="-75"></option>
	<option value="-50"></option>
	<option value="-25"></option>
	<option value="0"></option>
	<option value="25"></option>
	<option value="50"></option>
	<option value="75"></option>
	<option value="100"></option>
</datalist>

<style>
    .icon-settings {
        padding: 20px;
        border-top: 1px solid #ccc;
    }

    .setting-group {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .setting-group label {
        font-weight: 500;
        flex-grow: 1;
    }

    .slider {
        width: 150px;
    }

    .color-picker {
        width: 50px;
        height: 30px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    input[type="range"] {
        height: 4px;
        border-radius: 5px;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        background: #38bdf8;
        border-radius: 50%;
        cursor: pointer;
    }
</style>
