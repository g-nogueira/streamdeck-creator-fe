<script lang="ts">
	import IconSettings from './Archived/IconSettings.svelte';
	import IconPreview from './IconPreview.svelte';

	import IconHeader from './IconHeader.svelte';
	import CollectionList from './Sidebar/CollectionList.svelte';
	import CollectionIcons from './Sidebar/CollectionIcons.svelte';
	import { ImageProcessing, UUID } from '$lib';
	import type { UserIcon } from '../models/UserIcon';
	import type { SelectedIcon } from '../models/SelectedIcon';
	import type { UIState } from '../models/UIState';
	import type { UserIconCollection } from '../models/UserIconCollection';
	import { userIconCollections } from '../stores/user-icon-collection.store';
	import * as _selectedIcon from '../models/SelectedIcon';
	import { IconService } from '../services/icon.service';
	import { UserIconCollectionService } from '../services/user-icon-collection.service';
	import { selectedIcon } from '../stores/selected-icon.store';
	import { selectedCollection } from '../stores/selected-collection.store';
	import { uiState } from '../stores/ui-state.store';

	export let classNames: string = '';

	$: if ($selectedIcon) {
		// Has userIconId and isn't empty uuid?
		// Then fetches the userIcon from the server and updates the state.styles
		if ($selectedIcon.userIconId && $selectedIcon.userIconId !== UUID.empty) {
			(async () => {
				try {
					let userIcon = await IconService.fetchUserIcon($selectedIcon.userIconCollectionId, $selectedIcon.userIconId)
					let [iconContent, contentType] = await IconService.fetchIconWithContentType(userIcon.originalIconId);
					
					$uiState.styles = mkStateStyles(userIcon);
					
					if (isContentTypeSvg(contentType)) {
						$uiState.svgContent = cleanSvgContent(iconContent);
					} else {
						$uiState.imageUrl = IconService.mkIconUrl(userIcon.originalIconId);
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
					$uiState.styles.pngData = '';
					$uiState.styles.label = $selectedIcon.label;

					if (isContentTypeSvg(contentType)) {
						$uiState.svgContent = cleanSvgContent(iconContent);
					} else {
						$uiState.svgContent = '';
						$uiState.imageUrl = IconService.mkIconUrl($selectedIcon.iconId);
					}
				}
			)
			.catch((error) => {
				throw new Error('Error fetching icon', error);
			});
		}
	}

	$: if ($uiState.svgContent) {
		$uiState.svgContent = injectColorIntoSvg($uiState.svgContent, $uiState.styles.glyphColor);
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
			useGradient: userIcon.useGradient,
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

		return injectColorIntoSvg(removeFillAttributes(svgContent), $uiState.styles.glyphColor);
	}

	// Save the customized icon
	async function addIconToCollection(
		selectedIcon: SelectedIcon,
		collection: UserIconCollection | null
	) {
		if (!collection) {
			console.error('No collection selected to save the icon');
			return;
		}

		const node = document.querySelector(`#iconToCapture`);

		if (!node) {
			throw new Error('No HTML element #iconToCapture found to save');
		}

		let iconPng = await ImageProcessing.NodeToBase64Png(node);

		$uiState.styles.pngData = iconPng;
		
		const userIcon = {
			id: UUID.empty,
			originalIconId: selectedIcon.iconId,
			glyphColor: $uiState.styles.glyphColor,
			backgroundColor: $uiState.styles.backgroundColor,
			labelColor: $uiState.styles.labelColor,
			label: $uiState.styles.label,
			labelVisible: $uiState.styles.labelVisible,
			labelTypeface: $uiState.styles.labelTypeface,
			iconScale: $uiState.styles.iconScale,
			imgX: $uiState.styles.imgX,
			imgY: $uiState.styles.imgY,
			labelX: $uiState.styles.labelX,
			labelY: $uiState.styles.labelY,
			pngData: $uiState.styles.pngData,
			useGradient: $uiState.styles.useGradient,
			gradient: $uiState.styles.gradient,
		} as UserIcon;

		selectedCollection.addIconToSelectedCollection(userIcon);
		userIconCollections.upsertCollection(collection);
	}

	// Download the customized icon as a PNG
	function downloadIcon() {
		const node = document.querySelector(`#iconToCapture`);

		if (!node) {
			throw new Error('No HTML element #iconToCapture found to save');
		}

		ImageProcessing.DownloadIcon(node, $uiState.styles.label);
	}

	function selectUserIcon(icon: UserIcon, collection: UserIconCollection | null) {
		if (collection === null) {
			throw new Error('No collection selected. An user icon must belong to a collection.');
		}

		let newSelectedIcon = _selectedIcon.fromUserIcon(icon, collection.id);
		selectedIcon.selectIcon(newSelectedIcon);
	}

	function donwloadUserCollection() {
		if ($selectedCollection === null) {
			throw new Error('No collection selected to download');
		}

		UserIconCollectionService.download($selectedCollection.id);
	}
</script>

<!-- <aside class={`flex flex-col w-[500px] border-l ${classNames}`}>
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
</aside> -->
