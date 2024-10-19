<script lang="ts">
	import { UUID } from '$lib';
	import type { UserIcon } from '../models/UserIcon';
	import * as _selectedIcon from '../models/SelectedIcon';
	import { IconService } from '../services/icon.service';
	import { selectedIcon } from '../stores/selected-icon.store';
	import { uiState } from '../stores/ui-state.store';

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
</script>