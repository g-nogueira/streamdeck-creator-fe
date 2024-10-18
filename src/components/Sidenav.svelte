<script lang="ts">
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	// Icons
	import IconCollection from 'lucide-svelte/icons/library';
	import Search from 'lucide-svelte/icons/search';
	import IconList from './IconList.svelte';
	import IconSearch from './IconSearch.svelte';

	let hrefExample = '#';
</script>

<div class="flex flex-row h-full">
    <div class="card border-surface-100-900 grid h-full w-[96px] grid-cols-[auto_1fr] border-[1px]">
        <!-- Component -->
        <Nav.Rail>
            {#snippet header()}
                <Nav.Tile id="0" label="Icons" href={hrefExample}>
                    <Search />
                </Nav.Tile>
                <Nav.Tile id="1" label="Collections" href={hrefExample}>
                    <IconCollection />
                </Nav.Tile>
            {/snippet}
        </Nav.Rail>
        <!-- Content -->
        <!-- <div class="flex items-center justify-center">
            <p class="opacity-20">(Content)</p>
        </div> -->
    </div>
    <div class="flex flex-col w-[375px] h-full p-3 gap-3 preset-filled-surface-50-950 border-surface-100-900 border-[1px]">
        <IconSearch/>
    </div>
</div>