<script lang="ts">
  import { customizedIcons, selectedIcon, type StylizedIcon } from '../stores';
  import IconSettings from './IconSettings.svelte';
  import IconPreview from './IconPreview.svelte';
  import domtoimage from 'dom-to-image-more';
  import IconHeader from './IconHeader.svelte';

  export let classNames: string = '';

  let state = {
    // State variables
    glyphColor: '#38bdf8',  // sky-400
    backgroundColor: '#0284c7', // sky-600
    labelColor: '#ffffff', // white
    labelText: 'Label Text',
    labelVisible: true,
    labelTypeface: 'VT323',
    useAdvancedColorUi: true,
    isSvg: false,
    iconContent: '',
    scale: 1,  // Scale factor for resizing the icon

    advancedColor: {
      glyph: '',
      canvas: '',
      label: ''
    },

    imgX: 0,
    imgY: 0,
    labelX: 0,
    labelY: 0
  }

  // Fetch icon content when selected icon changes
  $: if ($selectedIcon) {
    state.labelText = $selectedIcon.label;
    fetchIconContent($selectedIcon.id);
  }

  $: if (state.isSvg) {
    state.iconContent = injectColorIntoSvg(removeFillAttributes(state.iconContent), state.glyphColor);
  }

  // Fetch icon content from the server
  async function fetchIconContent(iconId: string) {
    const response = await fetch(`http://localhost:5199/icons/${iconId}`);
    const contentType = response.headers.get('Content-Type');
    if (contentType === 'image/svg+xml') {
      state.isSvg = true;
      let svgContent = await response.text();
      state.iconContent = processSvgContent(svgContent);
    } else {
      state.isSvg = false;
      state.iconContent = `http://localhost:5199/icons/${iconId}`;
    }
  }

  // Process SVG content by removing fill attributes and injecting color
  function processSvgContent(svgContent: string): string {
    svgContent = removeFillAttributes(svgContent);
    return injectColorIntoSvg(svgContent, state.glyphColor);
  }

  // Remove fill attributes from SVG content
  function removeFillAttributes(svgContent: string): string {
    return svgContent.replace(/fill="[^"]*"/g, '');
  }

  // Inject color into SVG content
  function injectColorIntoSvg(svgContent: string, color: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    if (svgElement) {
      svgElement.setAttribute('fill', color);
    }
    return new XMLSerializer().serializeToString(doc);
  }

  // Save the customized icon
  function saveIcon() {
    customizedIcons.update((icons: StylizedIcon[]) => [
      ...icons,
      { ...$selectedIcon, ...state } as StylizedIcon
    ]);
  }

  // Download the customized icon as a PNG
  function downloadIcon() {
    const node = document.querySelector(`#iconToCapture`);
    if (!node) {
      console.error('No icon found to download');
      return;
    }

    domtoimage.toPng(node, { copyDefaultStyles: false })
      .then((dataUrl: string) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${state.labelText}.png`;
        a.click();
      })
      .catch((err: string) => console.error('Error downloading icon:', err));
  }
</script>

<aside class={`flex flex-col w-[500px] border-l ${classNames}`}>
  {#if $selectedIcon}
    <IconHeader bind:state onDownload={downloadIcon} onSave={saveIcon} />
    <IconPreview bind:state />
    <IconSettings bind:state />
  {/if}
</aside>

<style>
</style>