<script lang="ts">
  import { selectedIcon, customizedIcons, type StylizedIcon } from '../stores';
  import { onMount } from 'svelte';

  export let classNames: string = '';

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

<div class={`bg-gray-800 p-4 text-white flex flex-col ${classNames}`}>
  {#if $selectedIcon}
    <div class="flex items-center border-b border-gray-700 h-12 relative">
      <input type="text" bind:value={labelText} placeholder="My Icon" class="flex-grow bg-transparent text-center p-2 border-none text-white" />
      <div class="w-12 text-center cursor-pointer absolute left-0 border-r border-gray-700" on:click={saveIcon}>Download</div>
      <div class="w-12 text-center cursor-pointer absolute right-0 border-l border-gray-700" on:click={saveIcon}>Add to Collection</div>
    </div>
    <div class="my-4 flex justify-center">
      <div class="relative w-36 h-36 flex flex-col items-center justify-center rounded-full shadow-lg" style="background-color: {useAdvancedColorUi ? advancedColor.canvas : canvasColor};" class:pt-4={labelVisible} class:pt-6={!labelVisible}>
        <div class="flex-grow p-5" style="color: {useAdvancedColorUi ? advancedColor.glyph : glyphColor};">
          {#if isSvg}
            {@html iconContent}
          {:else}
            <img src={iconContent} alt={labelText} style="color: {glyphColor}" />
          {/if}
        </div>
        {#if labelVisible}
          <div class="text-center uppercase text-xl mt-2" style="color: {useAdvancedColorUi ? advancedColor.label : labelColor}; font-family: {typeface};">
            {labelText}
          </div>
        {/if}
        <div class="h-8 text-xl text-center opacity-0">&nbsp;</div>
      </div>
    </div>
    <div class="border-t border-gray-700 pt-4">
      <div class="flex flex-col mb-4">
        <input type="text" bind:value={labelText} placeholder="Label Text" class="mb-2 p-2 border-none rounded w-full" />
        <select bind:value={typeface} class="mb-2 p-2 border-none rounded w-full">
          <option value="VT323">VT323</option>
          <option value="Geo">Geo</option>
        </select>
        <label class="flex items-center">
          <input type="checkbox" bind:checked={labelVisible} class="mr-2" /> Show Label
        </label>
      </div>
      <div class="flex flex-col">
        <label class="mb-2">
          Glyph Color: <input type="color" bind:value={glyphColor} class="ml-2" />
        </label>
        <label class="mb-2">
          Canvas Color: <input type="color" bind:value={canvasColor} class="ml-2" />
        </label>
        <label class="mb-2">
          Label Color: <input type="color" bind:value={labelColor} class="ml-2" />
        </label>
      </div>
    </div>
  {/if}
</div>