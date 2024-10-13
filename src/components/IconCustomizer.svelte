<script lang="ts">
	import {
		selectedIcon,
		selectedCollection,
		IconService,
		addIconToSelectedCollection,
		selectIcon,
		UserIconCollectionService

	} from '../stores';
	import IconSettings from './IconSettings.svelte';
	import IconPreview from './IconPreview.svelte';

	import IconHeader from './IconHeader.svelte';
	import CollectionList from './CollectionList.svelte';
	import CollectionIcons from './CollectionIcons.svelte';
	import { ImageProcessing, UUID } from '$lib';
	import type { UserIcon } from '../models/UserIcon';
	import type { SelectedIcon } from '../models/SelectedIcon';
	import type { UIState } from '../models/UIState';
	import type { UserIconCollection } from '../models/UserIconCollection';
	import { userIconCollections } from '../stores/UserIconCollection.Store';
	import * as _selectedIcon from '../models/SelectedIcon';

	export let classNames: string = '';

	let state: UIState = {
		styles: {
			glyphColor: '#38bdf8', // sky-400
			backgroundColor: '#0284c7', // sky-600
			labelColor: '#ffffff', // white
			label: 'Label Text',
			labelVisible: true,
			labelTypeface: 'VT323',
			iconScale: 1, // Scale factor for resizing the icon

			imgX: 0,
			imgY: 0,
			labelX: 0,
			labelY: 0,

			pngData: '',

			gradient: null
		},

		/** The SVG string content of the icon */
		svgContent: '',
		/** The URL of the icon image */
		imageUrl: ''
	};

	$: if ($selectedIcon) {
		// Has userIconId and isn't empty uuid?
		// Then fetches the userIcon from the server and updates the state.styles
		if ($selectedIcon.userIconId && $selectedIcon.userIconId !== UUID.empty) {
			(async () => {
				try {
					let userIcon = await IconService.fetchUserIcon($selectedIcon.userIconCollectionId, $selectedIcon.userIconId)
					let [iconContent, contentType] = await IconService.fetchIconWithContentType(userIcon.originalIconId);
					
					state.styles = mkStateStyles(userIcon);
					
					if (isContentTypeSvg(contentType)) {
						state.svgContent = cleanSvgContent(iconContent);
					} else {
						state.imageUrl = IconService.mkIconUrl(userIcon.originalIconId);
					}
				} catch (error: any) {
					throw new Error('Error fetching user icon', error);
				}
			})();
		}
		// Has iconId and userIconId is empty uuid?
		// Then keeps the state.styles as it is, so that the user can reuse the previous styles
		else if ($selectedIcon.iconId) {
			IconService.fetchIconWithContentType($selectedIcon.iconId).then(
				([iconContent, contentType]) => {
					state.styles.pngData = '';
					state.styles.label = $selectedIcon.label;

					if (isContentTypeSvg(contentType)) {
						state.svgContent = cleanSvgContent(iconContent);
					} else {
						state.svgContent = '';
						state.imageUrl = IconService.mkIconUrl($selectedIcon.iconId);
					}
				}
			)
			.catch((error) => {
				throw new Error('Error fetching icon', error);
			});
		}
	}

	$: if (state.svgContent) {
		state.svgContent = injectColorIntoSvg(state.svgContent, state.styles.glyphColor);
	}

	function mkStateStyles(userIcon: UserIcon) {
		return {
			glyphColor: userIcon.glyphColor,
			backgroundColor: userIcon.backgroundColor,
			labelColor: userIcon.labelColor,
			label: userIcon.label,
			labelVisible: userIcon.labelVisible,
			labelTypeface: userIcon.labelTypeface,
			iconScale: userIcon.iconScale,
			imgX: userIcon.imgX,
			imgY: userIcon.imgY,
			labelX: userIcon.labelX,
			labelY: userIcon.labelY,
			pngData: userIcon.pngData,
			gradient: userIcon.gradient ? {
				stops: userIcon.gradient.stops,
				type: userIcon.gradient.type,
				angle: userIcon.gradient.angle,
				cssStyle: userIcon.gradient.cssStyle
			} : null
		};
	}

	function isContentTypeSvg(contentType: string): boolean {
		return contentType === 'image/svg+xml';
	}

	/**
	 * Injects the color into the SVG content
	 * @param svgContent
	 * @param color
	 */
	function injectColorIntoSvg(svgContent: string, color: string): string {
		if (typeof window === 'undefined') {
			console.error('Trying to use DomParser on the server side. Returning the SVG content as is.');
            return svgContent;
		}
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgContent, 'image/svg+xml');
		const svgElement = doc.querySelector('svg');
		if (svgElement) {
			svgElement.setAttribute('fill', color);
		}
		return new XMLSerializer().serializeToString(doc);
	}

	/**
	 * Process SVG content by removing fill attributes and injecting color
	 * @param svgContent
	 */
	function cleanSvgContent(svgContent: string): string {
		// Remove fill attributes from SVG content
		const removeFillAttributes = (svgContent: string): string => {
			return svgContent.replace(/fill="(?!none")[^"]*"/g, '');
		};

		return injectColorIntoSvg(removeFillAttributes(svgContent), state.styles.glyphColor);
	}

	// Save the customized icon
	async function addIconToCollection(
		selectedIcon: SelectedIcon,
		selectedCollection: UserIconCollection | null
	) {
		if (!selectedCollection) {
			console.error('No collection selected to save the icon');
			return;
		}

		const node = document.querySelector(`#iconToCapture`);

		if (!node) {
			throw new Error('No HTML element #iconToCapture found to save');
		}

		let iconPng = await ImageProcessing.NodeToBase64Png(node);

		state.styles.pngData = iconPng;
		
		const userIcon = {
			id: UUID.empty,
			originalIconId: selectedIcon.iconId,
			glyphColor: state.styles.glyphColor,
			backgroundColor: state.styles.backgroundColor,
			labelColor: state.styles.labelColor,
			label: state.styles.label,
			labelVisible: state.styles.labelVisible,
			labelTypeface: state.styles.labelTypeface,
			iconScale: state.styles.iconScale,
			imgX: state.styles.imgX,
			imgY: state.styles.imgY,
			labelX: state.styles.labelX,
			labelY: state.styles.labelY,
			pngData: state.styles.pngData,
			gradient: state.styles.gradient,
		} as UserIcon;

		addIconToSelectedCollection(userIcon);
		userIconCollections.upsertCollection(selectedCollection);
	}

	// Download the customized icon as a PNG
	function downloadIcon() {
		const node = document.querySelector(`#iconToCapture`);

		if (!node) {
			throw new Error('No HTML element #iconToCapture found to save');
		}

		ImageProcessing.DownloadIcon(node, state.styles.label);
	}

	function selectUserIcon(icon: UserIcon, collection: UserIconCollection | null) {
		if (collection === null) {
			throw new Error('No collection selected. An user icon must belong to a collection.');
		}

		let selectedIcon = _selectedIcon.fromUserIcon(icon, collection.id);
		selectIcon(selectedIcon);
	}

	function donwloadUserCollection() {
		if ($selectedCollection === null) {
			throw new Error('No collection selected to download');
		}

		UserIconCollectionService.download($selectedCollection.id);
	}
</script>

<aside class={`flex flex-col w-[500px] border-l ${classNames}`}>
	{#if $selectedIcon}
		<IconHeader
			bind:labelText={state.styles.label}
			onDownload={downloadIcon}
			onSave={() => {
				addIconToCollection($selectedIcon, $selectedCollection);
			}}
		/>
		<IconPreview bind:state />
	<div class="overflow-y-scroll">
		<IconSettings bind:state />

		{#if $selectedCollection}
			<CollectionIcons onIconSelect={(icon) => selectUserIcon(icon, $selectedCollection)} onDownload={donwloadUserCollection}/>
		{:else}
			<CollectionList />
		{/if}
	</div>
	{/if}
</aside>
