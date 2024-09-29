<script lang="ts">
  import { selectedIcon, customizedIcons, type StylizedIcon } from '../stores';

  let glyphColor = 'white';
  let canvasColor = 'gray';
  let labelColor = 'white';
  let labelText = 'Label Text';
  let labelVisible = true;
  let typeface = '';
  let labelTypeface = '';
  let backgroundColor = '';

  $: if ($selectedIcon) {
    labelText = $selectedIcon.label;
  }

  function saveIcon() {
    customizedIcons.update((icons: StylizedIcon[]) => [
      ...icons,
      { ...$selectedIcon, glyphColor, canvasColor, labelColor, labelText, labelVisible, typeface, labelTypeface, backgroundColor } as StylizedIcon
    ]);
  }
</script>

<div class="sidebar">
  {#if $selectedIcon}
    <div class="icon-preview">
      <img src={`http://localhost:5199/icons/${$selectedIcon.id}`} alt={$selectedIcon.label} />
    </div>
    <div class="label-edit">
      <input type="text" bind:value={labelText} placeholder="Label Text" />
      <select bind:value={typeface}>
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <!-- Add more typefaces as needed -->
      </select>
      <label>
        <input type="checkbox" bind:checked={labelVisible} /> Show Label
      </label>
    </div>
    <div class="color-options">
      <label>
        Icon Color: <input type="color" bind:value={glyphColor} />
      </label>
      <label>
        Background Color: <input type="color" bind:value={canvasColor} />
      </label>
      <label>
        Label Color: <input type="color" bind:value={labelColor} />
      </label>
    </div>
    <button on:click={saveIcon}>Add to Collection</button>
  {/if}
  <div class="collections-section">
    <p>My Super StreamDeck Theme</p>
    <div class="theme-options">
      <!-- Add collection icons here -->
    </div>
  </div>
  <div class="top-right-buttons">
    <button class="download-button">Download</button>
    <button class="add-button">Add</button>
  </div>
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
  .icon-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #444;
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }
  .label-edit {
    margin-top: 16px;
  }
  .label-edit input,
  .label-edit select {
    width: 100%;
    margin-bottom: 8px;
    padding: 8px;
    border: none;
    border-radius: 4px;
  }
  .label-edit label {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
  .color-options {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
  }
  .color-options label {
    margin-bottom: 8px;
  }
  .collections-section {
    margin-top: 24px;
  }
  .theme-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .top-right-buttons {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    gap: 8px;
  }
  .top-right-buttons button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }
  .top-right-buttons button:hover {
    border: 1px solid white;
  }
</style>