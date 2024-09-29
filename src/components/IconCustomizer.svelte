<script lang="ts">
  import { selectedIcon, customizedIcons, type StylizedIcon } from '../stores';

  let glyphColor = '';
  let canvasColor = '';
  let labelColor = '';
  let labelText = '';
  let labelVisible = true;
  let typeface = '';
  let labelTypeface = '';
  let backgroundColor = '';

  function saveIcon() {
    customizedIcons.update((icons: StylizedIcon[]) => [
      ...icons,
      { ...$selectedIcon, glyphColor, canvasColor, labelColor, labelText, labelVisible, typeface, labelTypeface, backgroundColor } as StylizedIcon
    ]);
  }
</script>

<div class="customizer">
  {#if $selectedIcon}
    <img src={`http://localhost:5199/icons/${$selectedIcon.id}`} alt={$selectedIcon.label} />
    <input type="color" bind:value={glyphColor} placeholder="Glyph Color" />
    <input type="color" bind:value={canvasColor} placeholder="Canvas Color" />
    <input type="color" bind:value={labelColor} placeholder="Label Color" />
    <input type="text" bind:value={labelText} placeholder="Label Text" />
    <input type="checkbox" bind:checked={labelVisible} /> Label Visible
    <input type="text" bind:value={typeface} placeholder="Typeface" />
    <button on:click={saveIcon}>Save Icon</button>
  {/if}
</div>

<style>
  .customizer {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>