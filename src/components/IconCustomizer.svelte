<script lang="ts">
  import { customizedIcons, selectedIcon, type StylizedIcon } from '../stores';
  import domtoimage from 'dom-to-image-more';

  export let classNames: string = '';

  let glyphColor = '#38bdf8';  // sky-400
  let canvasColor = '#0284c7'; // sky-600
  let labelColor = '#ffffff';  // white
  let labelText = 'Label Text';
  let labelVisible = true;
  let typeface = 'VT323';
  let useAdvancedColorUi = false;
  let isSvg = false;
  let iconContent = '';
  let scale = 1;  // Added scale factor

  let advancedColor = {
    glyph: '',
    canvas: '',
    label: ''
  };

  let imgX = 0;
  let imgY = 0;
  let labelX = 0;
  let labelY = 0;

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

  function parseSvg(svgContent: string): SVGElement | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    return doc.querySelector('svg');
  }

  function replaceSizeWithViewBox(svgContent: string): string {
    const svgElement = parseSvg(svgContent);
    if (!svgElement) {
      console.log('No SVG element found. Skipping size replacement');
      return svgContent;
    }

    let bbox = { x: Infinity, y: Infinity, width: 0, height: 0 };

    Array.from(svgElement.children).forEach(node => {
      if (node instanceof SVGGraphicsElement) {
        const nodeBbox = node.getBBox();
        bbox = {
          x: Math.min(bbox.x, nodeBbox.x),
          y: Math.min(bbox.y, nodeBbox.y),
          width: Math.max(bbox.x + bbox.width, nodeBbox.x + nodeBbox.width) - bbox.x,
          height: Math.max(bbox.y + bbox.height, nodeBbox.y + nodeBbox.height) - bbox.y,
        };
      }
    });

    const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
    svgElement.setAttribute('viewBox', viewBox);

    return new XMLSerializer().serializeToString(svgElement);
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
    iconContent = replaceSizeWithViewBox(injectColorIntoSvg(removeFillAttributes(iconContent), glyphColor));
  }

  function saveIcon() {
    customizedIcons.update((icons: StylizedIcon[]) => [
      ...icons,
      { ...$selectedIcon, glyphColor, canvasColor, labelColor, labelText, labelVisible, labelTypeface: typeface, backgroundColor: canvasColor } as StylizedIcon
    ]);
  }

  function downloadIcon() {
    const node = document.querySelector(`#iconToCapture`);
    if (!node) {
      console.error('No icon found to download');
      return;
    }

    domtoimage.toPng(node, { copyDefaultStyles: false })
      .then((dataUrl: string) => {
        let img = new Image();
        img.src = dataUrl;
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${labelText}.png`;
        a.click();
      })
      .catch((err: string) => console.error('Error downloading icon:', err));
  }
</script>

<aside class={`flex flex-col w-500px border-l ${classNames}`}>
  {#if $selectedIcon}
    <div class="flex items-center border-b border-gray-700 h-12 relative">
      <input type="text" bind:value={labelText} placeholder="My Icon" class="flex-grow bg-transparent text-center p-2 border-none text-white" />
      <div class="w-12 text-center cursor-pointer absolute left-0 border-r border-gray-700" on:click={downloadIcon}>Download</div>
      <div class="w-12 text-center cursor-pointer absolute right-0 border-l border-gray-700" on:click={saveIcon}>Add to Collection</div>
    </div>
    <div class="m-16 w-[371px] h-[371px] flex justify-center">
      <div id="iconToCapture" class="relative w-full h-full">
        <div class="relative w-full h-full shadow-lg rounded-[45px]" style="background-color: {useAdvancedColorUi ? advancedColor.canvas : canvasColor};">
          <!-- Icon -->
          <div class="flex-grow p-5 w-full h-full max-h-[223px] flex justify-center" style="color: {useAdvancedColorUi ? advancedColor.glyph : glyphColor}; transform: scale({scale}) translate({imgX}px, {imgY}px);">
            {#if isSvg}
              {@html iconContent}
            {:else}
              <img src={iconContent} alt={labelText} class="w-full h-full"/>
            {/if}
          </div>
          <!-- Label -->
          {#if labelVisible}
            <div class="text-center px-2 text-6xl w-full truncate absolute" style="color: {useAdvancedColorUi ? advancedColor.label : labelColor}; font-family: {typeface}; transform: translate({labelX}px, {labelY}px);">
              {labelText}
            </div>
          {/if}
          <div class="h-8 text-xl text-center opacity-0">&nbsp;</div>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-700 pt-4">
      <!-- Resizing Slider -->
      <label class="mb-2">
        Icon Scale: <input type="range" min="0.5" max="3" step="0.1" bind:value={scale} class="ml-2" />
      </label>
      <!-- Color Pickers -->
      <label class="mb-2">
        Glyph Color: <input type="color" bind:value={glyphColor} class="ml-2" />
      </label>
      <label class="mb-2">
        Canvas Color: <input type="color" bind:value={canvasColor} class="ml-2" />
      </label>
      <label class="mb-2">
        Label Color: <input type="color" bind:value={labelColor} class="ml-2" />
      </label>
      <!-- Positioning -->
      <div class="flex flex-col">
        <label class="mb-2">
          Image X Position: <input type="range" min="-100" max="100" bind:value={imgX} class="ml-2" />
        </label>
        <label class="mb-2">
          Image Y Position: <input type="range" min="-100" max="100" bind:value={imgY} class="ml-2" />
        </label>
        <label class="mb-2">
          Label X Position: <input type="range" min="-100" max="100" bind:value={labelX} class="ml-2" />
        </label>
        <label class="mb-2">
          Label Y Position: <input type="range" min="-100" max="100" bind:value={labelY} class="ml-2" />
        </label>
      </div>
    </div>
  {/if}
</aside>

<style>
  .w-500px {
    width: 500px;
  }
</style>
