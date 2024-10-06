<script lang="ts">
  import { collections, selectedIcon, selectedCollection, type StylizedIconDto, icons, type CollectionDto, type IconDto, selectStylizedIcon } from '../stores';
  import IconSettings from './IconSettings.svelte';
  import IconPreview from './IconPreview.svelte';
  import domtoimage from 'dom-to-image-more';
  import IconHeader from './IconHeader.svelte';
  import CollectionList from './CollectionList.svelte';
	import CollectionIcons from './CollectionIcons.svelte';
	import { mkEmptyUuid } from '$lib';

  export let classNames: string = '';

  let state = {

    stylizedIcon: {
      id:  mkEmptyUuid(),
      originalIconId: mkEmptyUuid(),
      glyphColor: '#38bdf8',  // sky-400
      backgroundColor: '#0284c7', // sky-600
      labelColor: '#ffffff', // white
      label: 'Label Text',
      labelVisible: true,
      labelTypeface: 'VT323',
      iconScale: 1,  // Scale factor for resizing the icon

      imgX: 0,
      imgY: 0,
      labelX: 0,
      labelY: 0,

      pngData: '',

      isStylizedIconDto: true,
    } as StylizedIconDto,

    isSvg: false,
    useAdvancedColorUi: true,
    iconContent: '',
  }

  // Check if object is a StylizedIconDto
  function isStylizedIconDto(obj: any): obj is StylizedIconDto {
    return obj && obj.isStylizedIconDto;
  }

  // Check if object is a IconDto
  function isIconDto(obj: any): obj is IconDto {
    return obj && obj.isIconDto;
  }

  // Fetch icon content when selected icon changes
  $: if ($selectedIcon && isStylizedIconDto($selectedIcon)) {
    state.stylizedIcon = $selectedIcon;
    fetchSelectedIcon($selectedIcon.originalIconId);
  } else if ($selectedIcon && isIconDto($selectedIcon)) {
    state.stylizedIcon.label = $selectedIcon.label;
    state.stylizedIcon.originalIconId = $selectedIcon.id;
    fetchSelectedIcon($selectedIcon.id);
  }

  $: if (state.isSvg) {
    state.iconContent = injectColorIntoSvg(removeFillAttributes(state.iconContent), state.stylizedIcon.glyphColor);
  }

  // Fetch icon content from the server
  async function fetchSelectedIcon(iconId: string) {
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
    return injectColorIntoSvg(removeFillAttributes(svgContent), state.stylizedIcon.glyphColor);
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
  async function addIconToCollection() {
    if (!$selectedCollection) {
      console.error('No collection selected to save the icon');
      return;
    }

    let iconPng = await mkPngAsync();

    state.stylizedIcon.pngData = iconPng;

    selectedCollection.update((collection: CollectionDto | null) => {
      if (collection) {
        state.stylizedIcon.id = mkEmptyUuid();
        collection.icons = [...collection.icons, state.stylizedIcon];
      }
      return collection; 
    });

    collections.update((collections: CollectionDto[]) => [
      ...collections.filter(collection => collection.id !== $selectedCollection?.id),
      $selectedCollection
    ]);
  }

  async function updateIconFromCollection() {
    if (!$selectedCollection) {
      console.error('No collection selected to save the icon');
      return;
    }

    let iconPng = await mkPngAsync();

    state.stylizedIcon.pngData = iconPng;

    selectedCollection.update((collection: CollectionDto | null) => {
      if (collection) {
        collection.icons = [...collection.icons.filter(icon => icon.id !== state.stylizedIcon.id), state.stylizedIcon];
      }
      return collection; 
    });

    collections.update((collections: CollectionDto[]) => [
      ...collections.filter(collection => collection.id !== $selectedCollection?.id),
      $selectedCollection
    ]);
  }

  function mkPngAsync() : Promise<string> {
    const node = document.querySelector(`#iconToCapture`);
    if (!node) {
      console.error('No icon found to download');
      return Promise.reject('No icon found to download');
    }

    return new Promise ((resolve, reject) => {
      domtoimage.toPng(node, { copyDefaultStyles: false })
        .then((dataUrl: string) => {
          resolve(dataUrl);
        })
        .catch((err: string) => {
          console.error('Error downloading icon:', err);
          reject(err);
        });
    });
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
        a.download = `${state.stylizedIcon.label}.png`;
        a.click();
      })
      .catch((err: string) => console.error('Error downloading icon:', err));
  }
</script>

<aside class={`flex flex-col w-[500px] border-l ${classNames}`}>
  {#if $selectedIcon}
    <IconHeader bind:labelText={state.stylizedIcon.label} onDownload={downloadIcon} onSave={addIconToCollection} />
    <IconPreview bind:state />
    <IconSettings bind:state />

    {#if $selectedCollection}
    <CollectionIcons onIconSelect={selectStylizedIcon} />
    {:else}
    <CollectionList/>
    {/if}

  {/if}
</aside>