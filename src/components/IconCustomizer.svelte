<script lang="ts">
  import { selectedIcon, customizedIcons, type StylizedIcon } from '../stores';
  import { onMount } from 'svelte';

  let glyphColor = 'sky-400';
  let canvasColor = 'sky-600';
  let labelColor = 'white';
  let labelText = 'Label Text';
  let labelVisible = true;
  let typeface = 'VT323';
  let useAdvancedColorUi = false;
  let isSvg = false;
  let iconContent = '';

  // Define and initialize advancedColor
  let advancedColor = {
    glyph: '',
    canvas: '',
    label: ''
  };

  $: if ($selectedIcon) {
    labelText = $selectedIcon.label;
    fetchIconContent($selectedIcon.id);
  }

  async function fetchIconContent(iconId: string) {
    const response = await fetch(`http://localhost:5199/icons/${iconId}`);
    const contentType = response.headers.get('Content-Type');
    if (contentType === 'image/svg+xml') {
      isSvg = true;
      let svgContent = await response.text();
      svgContent = removeFillAttributes(svgContent);
      svgContent = injectColorIntoSvg(svgContent, glyphColor);
      iconContent = svgContent;
    } else {
      isSvg = false;
      iconContent = `http://localhost:5199/icons/${iconId}`;
    }
  }

  function removeFillAttributes(svgContent: string): string {
    return svgContent.replace(/fill="[^"]*"/g, '');
  }

  function injectColorIntoSvg(svgContent: string, color: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    if (svgElement) {
      svgElement.setAttribute('fill', color);
    }
    return new XMLSerializer().serializeToString(doc);
  }

  $: if (isSvg) {
    iconContent = injectColorIntoSvg(removeFillAttributes(iconContent), glyphColor);
  }

  function saveIcon() {
    customizedIcons.update((icons: StylizedIcon[]) => [
      ...icons,
      { ...$selectedIcon, glyphColor, canvasColor, labelColor, labelText, labelVisible, labelTypeface: typeface, backgroundColor: canvasColor } as StylizedIcon
    ]);
  }
</script>

<div class="sidebar">
  {#if $selectedIcon}
    <div class="header">
      <input type="text" bind:value={labelText} placeholder="My Icon" class="label-input" />
      <div class="button download" on:click={saveIcon}>Download</div>
      <div class="button save" on:click={saveIcon}>Add to Collection</div>
    </div>
    <div class="icon-preview">
      <div class="canvas" style="background-color: {useAdvancedColorUi ? advancedColor.canvas : canvasColor};" class:pt-4={labelVisible} class:pt-6={!labelVisible}>
        <div class="glyph" style="color: {useAdvancedColorUi ? advancedColor.glyph : glyphColor};">
          {#if isSvg}
            {@html iconContent}
          {:else}
            <img src={iconContent} alt={labelText} style="color: {glyphColor}" />
          {/if}
        </div>
        {#if labelVisible}
          <div class="label" style="color: {useAdvancedColorUi ? advancedColor.label : labelColor}; font-family: {typeface};">
            {labelText}
          </div>
        {/if}
        <div class="spacer">&nbsp;</div>
      </div>
    </div>
    <div class="options">
      <div class="label-edit">
        <input type="text" bind:value={labelText} placeholder="Label Text" />
        <select bind:value={typeface}>
          <option value="VT323">VT323</option>
          <option value="Geo">Geo</option>
        </select>
        <label>
          <input type="checkbox" bind:checked={labelVisible} /> Show Label
        </label>
      </div>
      <div class="color-options">
        <label>
          Glyph Color: <input type="color" bind:value={glyphColor} />
        </label>
        <label>
          Canvas Color: <input type="color" bind:value={canvasColor} />
        </label>
        <label>
          Label Color: <input type="color" bind:value={labelColor} />
        </label>
      </div>
    </div>
  {/if}
</div>

<style>
  .sidebar {
    width: 25%;
    background-color: #333;
    padding: 16px;
    color: white;
    display: flex;
    flex-direction: column;
  }
  .header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #444;
    height: 50px;
    position: relative;
  }
  .label-input {
    flex-grow: 1;
    background: transparent;
    text-align: center;
    padding: 8px;
    border: none;
    color: white;
  }
  .button {
    width: 50px;
    text-align: center;
    cursor: pointer;
  }
  .download {
    position: absolute;
    left: 0;
    border-right: 1px solid #444;
  }
  .save {
    position: absolute;
    right: 0;
    border-left: 1px solid #444;
  }
  .icon-preview {
    margin: 16px 0;
    display: flex;
    justify-content: center;
  }
  .canvas {
    position: relative;
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 45px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  .glyph {
    flex-grow: 1;
    padding: 20px;
  }
  .label {
    text-align: center;
    text-transform: uppercase;
    font-size: 1.5rem;
    margin-top: 8px;
  }
  .spacer {
    height: 32px;
    font-size: 1.5rem;
    text-align: center;
    opacity: 0;
  }
  .options {
    border-top: 1px solid #444;
    padding-top: 16px;
  }
  .label-edit {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }
  .label-edit input,
  .label-edit select {
    margin-bottom: 8px;
    padding: 8px;
    border: none;
    border-radius: 4px;
    width: 100%;
  }
  .color-options {
    display: flex;
    flex-direction: column;
  }
  .color-options label {
    margin-bottom: 8px;
  }
  .display-none {
    display: none;
  }
</style>