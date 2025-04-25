<script lang="ts">
	import { serviceBaseUrl } from "../../lib/constants";
	import { HOMARR_API_URL } from "../../services/homarr-icon.service";
	import type { Icon } from "../../models/Icon";

	export let icon: Icon;
	export let onSelectIcon: (icon: Icon) => void;

	$: iconUrl = icon.origin === "homarr" 
		? `${HOMARR_API_URL}/${icon.contentType === "image/svg+xml" ? "svg" : "png"}/${icon.id}.${icon.contentType === "image/svg+xml" ? "svg" : "png"}`
		: icon.origin === "streamdeck" 
			? `${serviceBaseUrl}/icons/${icon.id}`
			: "";

	// Always set src on mount, fallback to eager if not in viewport
	function setSrc(image: HTMLImageElement, src: string) {
		if (image && src) {
			image.src = src;
		}
	}

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
				observer.disconnect(); // Disconnect after loading to save memory
			}
		}, {
			rootMargin: "50px", // Start loading when image is 50px away from viewport
			threshold: 0.01
		});

		observer.observe(image);

		// Fallback: set src directly if not set after short delay
		setTimeout(() => {
			if (!image.src) setSrc(image, src);
		}, 200);

		return {
			destroy() {
				image.removeEventListener("load", loaded);
				observer.disconnect();
			}
		};
	}
</script>

<button
	type="button"
	class="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded p-1 transition-colors hover:bg-surface-hover"
	on:click={() => onSelectIcon(icon)}
	aria-label={`Icon ${icon.label}`}
	data-testid="icon-button">
	{#if icon.origin === "mdi"}
		<i class={`mdi mdi-24px mdi-${icon.label}`} title={icon.label} data-testid="mdi-icon"></i>
		<span data-origin="mdi" class="w-full truncate text-xs font-semibold text-center" data-testid="mdi-label">{icon.label}</span>
	{:else if icon.origin === "streamdeck" || icon.origin === "homarr"}
		<img
			alt={icon.label}
			loading="lazy"
			class="h-8 w-8 opacity-0 transition-opacity"
			class:opacity-100={true}
			data-testid={`${icon.origin}-icon-img`}
			src={iconUrl}
		/>
		<span data-origin={icon.origin} class="w-full truncate text-xs font-semibold text-center" data-testid={`${icon.origin}-label`}>
			{icon.label}
		</span>
	{/if}
</button>
