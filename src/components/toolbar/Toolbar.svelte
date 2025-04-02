<script lang="ts">
	import GradientGenerator from "./GradientGenerator.svelte";
	import { customizedIcon } from "../../stores/icon-customizations.store";
	import IconPaint from "lucide-svelte/icons/paint-bucket";
	import IconSprayCan from "lucide-svelte/icons/spray-can";
	import ToolbarSection from "./ToolbarSection.svelte";
	import Tooltip from "../common/Tooltip.svelte";
	import type { GradientState, GradientStop } from "$lib/gradient";

	const handleAddGradientStop = (stop: GradientStop) => {
		customizedIcon.addGradientStop(stop);
	};

	const handleUpdateGradientStopPosition = (index: number, position: number) => {
		customizedIcon.updateGradientStopPosition(index, position);
	};

	const handleRemoveGradientStop = (index: number) => {
		customizedIcon.removeGradientStop(index);
	};

	const handleSetGradientType = (type: GradientState["type"]) => {
		customizedIcon.setGradientType(type);
	};

	const handleSetLinearGradientDirection = (direction: string) => {
		customizedIcon.setLinearGradientDirection(direction);
	};

	const handleRecalculateGradientCss = () => {
		customizedIcon.recalculateGradientCss();
	};
</script>

<div
	class="flex h-full w-[375px] min-w-[375px] flex-col gap-3 border-[1px] p-3 border-surface-100-900 preset-filled-surface-50-950">
	{#if $customizedIcon}
		<ToolbarSection title="Typography">
			<input
				data-testid="input-typography-label"
				bind:value={$customizedIcon.styles.label}
				class="input-toolbar input bg-surface-800"
				type="text"
				placeholder="Text" />
			<select
				data-testid="select-typography-typeface"
				class="select-toolbar select bg-surface-800"
				placeholder="Typeface - Not Implemented">
				<option>Typeface - Not Implemented</option>
			</select>
		</ToolbarSection>
		<hr class="hr" />
		<ToolbarSection title="Text Positioning">
			<div class="flex flex-row gap-4">
				<input
					data-testid="input-text-pos-x"
					bind:value={$customizedIcon.styles.labelX}
					class="input-toolbar input bg-surface-800"
					type="number"
					placeholder="X" />
				<input
					data-testid="input-text-pos-y"
					bind:value={$customizedIcon.styles.labelY}
					class="input-toolbar input bg-surface-800"
					type="number"
					placeholder="Y" />
			</div>
			<input
				data-testid="input-text-scale"
				class="input-toolbar input bg-surface-800"
				type="text"
				placeholder="Scale - Not Implemented" />
		</ToolbarSection>
		<hr class="hr" />
		<ToolbarSection title="Text Styling">
			<div class="grid grid-cols-[auto_1fr] gap-2">
				<input
					data-testid="input-text-color-picker"
					class="input-toolbar input"
					bind:value={$customizedIcon.styles.labelColor}
					type="color" />
				<input
					data-testid="input-text-color"
					class="input-toolbar input bg-surface-800"
					type="text"
					bind:value={$customizedIcon.styles.labelColor} />
			</div>
		</ToolbarSection>
		<hr class="hr" />
		<ToolbarSection title="Icon Positioning">
			<div class="flex flex-row gap-4">
				<input
					data-testid="input-icon-pos-x"
					bind:value={$customizedIcon.styles.imgX}
					class="input-toolbar input bg-surface-800"
					type="number"
					placeholder="X" />
				<input
					data-testid="input-icon-pos-y"
					bind:value={$customizedIcon.styles.imgY}
					class="input-toolbar input bg-surface-800"
					type="number"
					placeholder="Y" />
			</div>
			<input
				data-testid="input-icon-scale"
				bind:value={$customizedIcon.styles.iconScale}
				class="input-toolbar input bg-surface-800"
				type="number"
				placeholder="Scale"
				step=".1" />
		</ToolbarSection>
		<hr class="hr" />
		<ToolbarSection title="Icon Styling">
			<div class="grid grid-cols-[auto_1fr] gap-2">
				<input
					data-testid="input-icon-color-picker"
					class="input-toolbar input"
					bind:value={$customizedIcon.styles.glyphColor}
					type="color" />
				<input
					data-testid="input-icon-color"
					class="input-toolbar input bg-surface-800"
					type="text"
					bind:value={$customizedIcon.styles.glyphColor} />
			</div>
		</ToolbarSection>
		<hr class="hr" />
		<ToolbarSection title="Fill">
			<div class="flex flex-row gap-3">
				<button
					data-testid="button-use-solid-fill"
					type="button"
					on:click={() => (customizedIcon.setUseGradient(false), handleRecalculateGradientCss())}
					class="{$customizedIcon.styles.useGradient
						? ''
						: 'bg-secondary-950'} btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900">
					<Tooltip text="Solid Fill">
						<IconPaint size={20} />
					</Tooltip>
				</button>
				<button
					data-testid="button-use-gradient-fill"
					type="button"
					on:click={() => (customizedIcon.setUseGradient(true), handleRecalculateGradientCss())}
					class="{!$customizedIcon.styles.useGradient
						? ''
						: 'bg-secondary-950'} btn btn-icon btn-sm h-auto w-auto rounded-md p-2 hover:bg-secondary-900">
					<Tooltip text="Gradient Fill">
						<IconSprayCan size={20} />
					</Tooltip>
				</button>
			</div>
			{#if $customizedIcon.styles.useGradient}
				<GradientGenerator
					gradient={$customizedIcon.styles.gradient}
					gradientCss={$customizedIcon.styles.gradientCss}
					onAddGradientStop={handleAddGradientStop}
					onUpdateGradientStopPosition={handleUpdateGradientStopPosition}
					onRemoveGradientStop={handleRemoveGradientStop}
					onSetGradientType={handleSetGradientType}
					onSetLinearGradientDirection={handleSetLinearGradientDirection}
					onRecalculateGradientCss={handleRecalculateGradientCss} />
			{:else}
				<div data-testid="solid-fill-controls" class="grid grid-cols-[auto_1fr] gap-2">
					<input
						data-testid="colorpicker-solid-fill-color"
						class="input-toolbar input"
						bind:value={$customizedIcon.styles.backgroundColor}
						type="color" />
					<input
						data-testid="input-solid-fill-color"
						class="input-toolbar input bg-surface-800"
						type="text"
						bind:value={$customizedIcon.styles.backgroundColor} />
				</div>
			{/if}
		</ToolbarSection>
	{/if}
</div>
