<script lang="ts">
	import type { Snippet } from "svelte";

    let {text, children, ...divProps}: {text: string, children?: Snippet} = $props();

</script>

<div class="tooltip-handler" {...divProps}>
    {@render children?.()}
    <span class="tooltip preset-filled-surface-50-950 border-surface-100-950 border-[1px] rounded-md p-1">{text}</span>
</div>

<style lang="postcss">
	.tooltip {
		visibility: hidden;
		text-align: center;
		position: absolute;
		z-index: 1;
		bottom: 125%; /* Position the tooltip above the button */
		left: 50%;
		margin-left: -60px;
		opacity: 0;
		transition: opacity 0.3s;
	}

	.tooltip-handler:hover .tooltip {
		visibility: visible;
		opacity: 1;
	}
</style>