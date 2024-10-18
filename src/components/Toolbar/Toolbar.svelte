<script lang="ts">
    import GradientGenerator from "./GradientGenerator.svelte";
    import { state } from "../../stores/ui-state.store";
    import IconPaint from "lucide-svelte/icons/paint-bucket";
    import IconSprayCan from "lucide-svelte/icons/spray-can";
    import ToolbarSection from "./ToolbarSection.svelte";

    function toggleUseGradient(value: boolean) {
        state.update(s => {
            s.styles.useGradient = value;
            return s;
        });
    }

</script>

<div class="flex flex-col min-w-[375px] w-[375px] h-full p-3 gap-3 preset-filled-surface-50-950 border-surface-100-900 border-[1px]">
    <ToolbarSection title="Typography">
        <input class="input bg-surface-800" type="text" placeholder="Text" />
        <select class="select bg-surface-800" placeholder="Typeface - Not Implemented">
            <option>Typeface - Not Implemented</option>
        </select>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Text Positioning">
        <div class="flex flex-row gap-4">
            <input bind:value={$state.styles.labelX} class="input bg-surface-800" type="text" placeholder="X" />
            <input bind:value={$state.styles.labelY} class="input bg-surface-800" type="text" placeholder="Y" />
        </div>
        <input class="input bg-surface-800" type="text" placeholder="Scale - Not Implemented" />
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Text Styling">
        <div class="grid grid-cols-[auto_1fr] gap-2">
            <input class="input" bind:value={$state.styles.labelColor} type="color" />
            <input class="input bg-surface-800" type="text" bind:value={$state.styles.labelColor} />
        </div>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Icon Positioning">
        <div class="flex flex-row gap-4">
            <input bind:value={$state.styles.imgX} class="input bg-surface-800" type="number" placeholder="X" />
            <input bind:value={$state.styles.imgY} class="input bg-surface-800" type="number" placeholder="Y" />
        </div>
        <input bind:value={$state.styles.iconScale} class="input bg-surface-800" type="text" placeholder="Scale" />
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Icon Styling">
        <div class="grid grid-cols-[auto_1fr] gap-2">
            <input class="input" bind:value={$state.styles.glyphColor} type="color" />
            <input class="input bg-surface-800" type="text" bind:value={$state.styles.glyphColor} />
        </div>
    </ToolbarSection>
    <hr class="hr" />
    <ToolbarSection title="Fill">
        <div class="flex flex-row gap-3">
            <button type="button" on:click={() => toggleUseGradient(false)} class="{$state.styles.useGradient ? "" : "bg-secondary-950"} btn btn-sm btn-icon rounded-md w-auto p-2 h-auto">
                <IconPaint size={20}/>
            </button>
            <button type="button" on:click={() => toggleUseGradient(true)} class="{!$state.styles.useGradient ? "" : "bg-secondary-950"} btn btn-sm btn-icon rounded-md w-auto p-2 h-auto">
                <IconSprayCan size={20}/>
            </button>
        </div>
        {#if $state.styles.useGradient}
            <GradientGenerator bind:state={$state.styles}/>
        {:else}
            <div class="grid grid-cols-[auto_1fr] gap-2">
                <input class="input" bind:value={$state.styles.backgroundColor} type="color" />
                <input class="input bg-surface-800" type="text" bind:value={$state.styles.backgroundColor} />
            </div>
        {/if}
    </ToolbarSection>
</div>

<style lang="postcss">
    input, select, .input[type='color'] {
        height: calc(1.75rem * var(--space-scale-factor));
    }
    .input[type='color'] {
        width: calc(1.75rem * var(--space-scale-factor));
    }

    select {
        padding-top: 0.1rem;
        padding-bottom: 0.1rem;
    }

    .btn-icon {
        width: auto;

        /* border-radius: var(); */
    }
</style>
