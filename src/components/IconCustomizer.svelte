<script lang="ts">
	import { UUID } from '$lib';
	import * as _selectedIcon from '../models/CustomizableIcon';
	import { IconService } from '../services/icon.service';
	import { customizedIcon } from '../stores/icon-customizations.store';
	import _ from 'lodash';

	$: if ($customizedIcon?.userIconId && $customizedIcon.userIconId !== UUID.empty) {
		// Has userIconId and isn't empty uuid?
		if (isContentTypeSvg($customizedIcon.contentType) && $customizedIcon.svgContent) {
			customizedIcon.selectSvgIcon($customizedIcon.svgContent);
		} else {
			// _.flow(IconService.mkIconUrl, customizedIcon.selectImageIcon)($customizedIcon.originalIconId);
			throw new Error('User icon is not an SVG. Only SVGs are supported for now.');
		}
	}

	$: if ($customizedIcon?.iconId && (!$customizedIcon.userIconId || $customizedIcon.userIconId === UUID.empty)) {
		// Has iconId and userIconId is empty uuid?
		// Then keeps the state.styles as it is, so that the user can reuse the previous styles
		IconService.fetchIconWithContentType($customizedIcon.iconId, $customizedIcon.iconOrigin)
			.then(([iconContent, contentType]) => {
				if (isContentTypeSvg(contentType)) {
					customizedIcon.selectSvgIcon(iconContent);
				} else {
					_.flow(IconService.mkIconUrl, customizedIcon.selectImageIcon)($customizedIcon.iconId);
				}
			})
			.catch((error) => {
				throw new Error('Error fetching icon', error);
			});
	}

	$: if ($customizedIcon?.styles?.glyphColor) {
		customizedIcon.setSvgFillColor($customizedIcon.styles.glyphColor);
	}

	function isContentTypeSvg(contentType: string): boolean {
		return contentType === 'image/svg+xml';
	}
</script>
