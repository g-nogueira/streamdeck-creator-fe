<script lang="ts">
	import { serviceBaseUrl } from "../constants";
	import type { Icon } from "../models/Icon";

  export let icon: Icon;
  export let onClick: (icon: Icon) => void;

  // See how the options work here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0
  }

  const lazyLoad = (image: HTMLImageElement, src: string) => {
      const loaded = () => {
          image.classList.add('visible')                          // doesn't work in REPL
          // image.style.opacity = "1"                                 // REPL hack to apply loading animation
      }
      const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
              console.log('an image has loaded')                  // console log for REPL
              image.src = src                                     // replace placeholder src with the image src on observe
              if (image.complete) {                               // check if instantly loaded
                  loaded()        
              } else {
                  image.addEventListener('load', loaded)          // if the image isn't loaded yet, add an event listener
              }
          }
      }, options)
      observer.observe(image)                                     // intersection observer

      return {
          destroy() {
              image.removeEventListener('load', loaded)           // clean up the event listener
          }
      }
  }
</script>

<button type="button" class="h-20 w-20 flex flex-col items-center gap-3 p-1 hover:bg-gray-200 transition-all cursor-pointer" on:click={() => onClick(icon)} aria-label={`Icon ${icon.label}`}>
    {#if icon.origin === 'mdi'}
      <i class={`mdi mdi-24px mdi-${icon.label}`} title={icon.label}></i>
      <!-- <img use:lazyLoad={`/data/svg/${icon.id}.svg`} alt={icon.label} class="h-10 w-10" /> -->
      <span data-origin="mdi" class="w-full font-semibold text-sm truncate">{icon.label}</span>
    {:else if icon.origin === 'streamdeck'}
      <img use:lazyLoad={`${serviceBaseUrl}/icons/${icon.id}`} alt={icon.label} class="h-10 w-10" />
      <span data-origin="streamdeck" class="w-full font-semibold text-sm truncate">{icon.label}</span>
    {/if}
</button>