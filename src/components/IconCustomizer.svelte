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
    <input type="text" bind:value={labelText} placeholder="Label Text" />
    <select bind:value={typeface}>
      <option value="Arial">Arial</option>
      <option value="Helvetica">Helvetica</option>
      <!-- Add more typefaces as needed -->
    </select>
    <div class="color-options">
      <label>
        <input type="radio" bind:group={glyphColor} value="Stone 600" /> Stone 600
      </label>
      <label>
        <input type="radio" bind:group={glyphColor} value="Stone 800" /> Stone 800
      </label>
      <label>
        <input type="radio" bind:group={glyphColor} value="White" /> White
      </label>
    </div>
    <button on:click={saveIcon}>Save Icon</button>
  {/if}
  <div class="theme-section">
    <p>My Super StreamDeck Theme</p>
    <div class="theme-options">
      <button class="theme-button pink"></button>
      <button class="theme-button purple"></button>
    </div>
  </div>
</div>

<style>
  .customizer {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: #444;
    color: white;
  }
  .color-options label {
    display: block;
    margin: 5px 0;
  }
  .theme-section {
    margin-top: 20px;
  }
  .theme-options {
    display: flex;
    gap: 10px;
  }
  .theme-button {
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 4px;
  }
  .theme-button.pink {
    background-color: pink;
  }
  .theme-button.purple {
    background-color: purple;
  }
</style>