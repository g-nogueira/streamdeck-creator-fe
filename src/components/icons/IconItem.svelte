<script lang="ts">
	import { serviceBaseUrl } from "../../lib/constants";
	import type { Icon } from "../../models/Icon";

	export let icon: Icon; // Icon data passed as a prop
	export let onSelectIcon: (icon: Icon) => void; // Callback function to handle icon selection

	// Intersection Observer options
	let options = {
		root: null,
		rootMargin: "0px",
		threshold: 0
	};

	function lazyLoad(image: HTMLImageElement, src: string) {
		const loaded = () => {
			image.classList.add("visible");
		};
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {
				image.src = src;
				if (image.complete) {
					loaded();
				} else {
					image.addEventListener("load", loaded);
				}
			}
		}, options);
		observer.observe(image);

		return {
			destroy() {
				image.removeEventListener("load", loaded);
			}
		};
	}
</script>

<button
	type="button"
	class="flex h-20 w-20 cursor-pointer flex-col items-center gap-3 p-1 transition-all hover:bg-gray-200"
	on:click={() => onSelectIcon(icon)}
	aria-label={`Icon ${icon.label}`}
	data-testid="icon-button">
	{#if icon.origin === "mdi"}
		<i class={`mdi mdi-24px mdi-${icon.label}`} title={icon.label} data-testid="mdi-icon"></i>
		<span data-origin="mdi" class="w-full truncate text-sm font-semibold" data-testid="mdi-label">{icon.label}</span>
	{:else if icon.origin === "streamdeck"}
		<img
			use:lazyLoad={`${serviceBaseUrl}/icons/${icon.id}`}
			alt={icon.label}
			class="h-10 w-10"
			data-testid="streamdeck-icon-img" />
		<span data-origin="streamdeck" class="w-full truncate text-sm font-semibold" data-testid="streamdeck-label">
			{icon.label}
		</span>
	{/if}
</button>
