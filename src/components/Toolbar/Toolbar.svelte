<script lang="ts">
    import GradientGenerator from "./GradientGenerator.svelte";
    import { uiState } from "../../stores/ui-state.store";
    import IconPaint from "lucide-svelte/icons/paint-bucket";
    import IconSprayCan from "lucide-svelte/icons/spray-can";
    import ToolbarSection from "./ToolbarSection.svelte";

    function toggleUseGradient(value: boolean) {
        uiState.update(s => {
            s.styles.useGradient = value;
            return s;
        });
    }

</script>

<div class="flex flex-col min-w-[375px] w-[375px] h-full p-3 gap-3 preset-filled-surface-50-950 border-surface-100-900 border-[1px]">
    <ToolbarSection title="Typography">
        <input bind:value={$uiState.styles.label} class="input input-toolbar bg-surface-800" type="text" placeholder="Text" />
        <select class="select select-toolbar bg-surface-800" placeholder="Typeface - Not Implemented">
            <option>Typeface - Not Implemented</option>
        </select>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Text Positioning">
        <div class="flex flex-row gap-4">
            <input bind:value={$uiState.styles.labelX} class="input input-toolbar bg-surface-800" type="number" placeholder="X" />
            <input bind:value={$uiState.styles.labelY} class="input input-toolbar bg-surface-800" type="number" placeholder="Y" />
        </div>
        <input class="input input-toolbar bg-surface-800" type="text" placeholder="Scale - Not Implemented" />
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Text Styling">
        <div class="grid grid-cols-[auto_1fr] gap-2">
            <input class="input input-toolbar" bind:value={$uiState.styles.labelColor} type="color" />
            <input class="input input-toolbar bg-surface-800" type="text" bind:value={$uiState.styles.labelColor} />
        </div>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Icon Positioning">
        <div class="flex flex-row gap-4">
            <input bind:value={$uiState.styles.imgX} class="input input-toolbar bg-surface-800" type="number" placeholder="X" />
            <input bind:value={$uiState.styles.imgY} class="input input-toolbar bg-surface-800" type="number" placeholder="Y" />
        </div>
        <input bind:value={$uiState.styles.iconScale} class="input input-toolbar bg-surface-800" type="number" placeholder="Scale" />
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Icon Styling">
        <div class="grid grid-cols-[auto_1fr] gap-2">
            <input class="input input-toolbar" bind:value={$uiState.styles.glyphColor} type="color" />
            <input class="input input-toolbar bg-surface-800" type="text" bind:value={$uiState.styles.glyphColor} />
        </div>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Fill">
        <div class="flex flex-row gap-3">
            <button type="button" on:click={() => toggleUseGradient(false)} class="{$uiState.styles.useGradient ? "" : "bg-secondary-950"} btn btn-sm btn-icon rounded-md w-auto p-2 h-auto">
                <IconPaint size={20}/>
            </button>
            <button type="button" on:click={() => toggleUseGradient(true)} class="{!$uiState.styles.useGradient ? "" : "bg-secondary-950"} btn btn-sm btn-icon rounded-md w-auto p-2 h-auto">
                <IconSprayCan size={20}/>
            </button>
        </div>
        {#if $uiState.styles.useGradient}
            <GradientGenerator bind:state={$uiState.styles}/>
        {:else}
            <div class="grid grid-cols-[auto_1fr] gap-2">
                <input class="input input-toolbar" bind:value={$uiState.styles.backgroundColor} type="color" />
                <input class="input input-toolbar bg-surface-800" type="text" bind:value={$uiState.styles.backgroundColor} />
            </div>
        {/if}
    </ToolbarSection>
</div>