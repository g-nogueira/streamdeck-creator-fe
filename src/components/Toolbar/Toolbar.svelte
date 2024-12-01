<script lang="ts">
    import GradientGenerator from "./GradientGenerator.svelte";
    import { uiState } from "../../stores/ui-state.store";
    import IconPaint from "lucide-svelte/icons/paint-bucket";
    import IconSprayCan from "lucide-svelte/icons/spray-can";
    import ToolbarSection from "./ToolbarSection.svelte";
    import Tooltip from "../Tooltip.svelte";
</script>

<div class="flex flex-col min-w-[375px] w-[375px] h-full p-3 gap-3 preset-filled-surface-50-950 border-surface-100-900 border-[1px]">
    <ToolbarSection title="Typography">
        <input data-testid="input-typography-label" bind:value={$uiState.styles.label} class="input input-toolbar bg-surface-800" type="text" placeholder="Text" />
        <select data-testid="select-typography-typeface" class="select select-toolbar bg-surface-800" placeholder="Typeface - Not Implemented">
            <option>Typeface - Not Implemented</option>
        </select>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Text Positioning">
        <div class="flex flex-row gap-4">
            <input data-testid="input-text-pos-x" bind:value={$uiState.styles.labelX} class="input input-toolbar bg-surface-800" type="number" placeholder="X" />
            <input data-testid="input-text-pos-y" bind:value={$uiState.styles.labelY} class="input input-toolbar bg-surface-800" type="number" placeholder="Y" />
        </div>
        <input data-testid="input-text-scale" class="input input-toolbar bg-surface-800" type="text" placeholder="Scale - Not Implemented" />
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Text Styling">
        <div class="grid grid-cols-[auto_1fr] gap-2">
            <input data-testid="input-text-color-picker" class="input input-toolbar" bind:value={$uiState.styles.labelColor} type="color" />
            <input data-testid="input-text-color" class="input input-toolbar bg-surface-800" type="text" bind:value={$uiState.styles.labelColor} />
        </div>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Icon Positioning">
        <div class="flex flex-row gap-4">
            <input data-testid="input-icon-pos-x" bind:value={$uiState.styles.imgX} class="input input-toolbar bg-surface-800" type="number" placeholder="X" />
            <input data-testid="input-icon-pos-y" bind:value={$uiState.styles.imgY} class="input input-toolbar bg-surface-800" type="number" placeholder="Y" />
        </div>
        <input data-testid="input-icon-scale" bind:value={$uiState.styles.iconScale} class="input input-toolbar bg-surface-800" type="number" placeholder="Scale" step=".1"/>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Icon Styling">
        <div class="grid grid-cols-[auto_1fr] gap-2">
            <input data-testid="input-icon-color-picker" class="input input-toolbar" bind:value={$uiState.styles.glyphColor} type="color" />
            <input data-testid="input-icon-color" class="input input-toolbar bg-surface-800" type="text" bind:value={$uiState.styles.glyphColor} />
        </div>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Fill">
        <div class="flex flex-row gap-3">
            <button data-testid="button-use-solid-fill" type="button" on:click={() => uiState.setUseGradient(false)} class="{$uiState.styles.useGradient ? "" : "bg-secondary-950"} btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900">
                <Tooltip text="Solid Fill">
                    <IconPaint size={20}/>
                </Tooltip>
            </button>
            <button data-testid="button-use-gradient-fill" type="button" on:click={() => uiState.setUseGradient(true)} class="{!$uiState.styles.useGradient ? "" : "bg-secondary-950"} btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900">
                <Tooltip text="Gradient Fill">
                    <IconSprayCan size={20}/>
                </Tooltip>
            </button>
        </div>
        {#if $uiState.styles.useGradient}
            <GradientGenerator bind:state={$uiState.styles}/>
        {:else}
            <div data-testid="solid-fill-controls" class="grid grid-cols-[auto_1fr] gap-2">
                <input data-testid="colorpicker-solid-fill-color" class="input input-toolbar" bind:value={$uiState.styles.backgroundColor} type="color" />
                <input data-testid="input-solid-fill-color" class="input input-toolbar bg-surface-800" type="text" bind:value={$uiState.styles.backgroundColor} />
            </div>
        {/if}
    </ToolbarSection>
</div>