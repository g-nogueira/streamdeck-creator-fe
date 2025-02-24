<script lang="ts">
	import { UUID } from '$lib';
	import { extensions as uiStateEx } from '../models/UIState';
	import * as _selectedIcon from '../models/SelectedIcon';
	import { IconService } from '../services/icon.service';
	import { selectedIcon } from '../stores/selected-icon.store';
	import { uiState } from '../stores/ui-state.store';
	import { UserIconIndexedDBService } from '../services/user-icon-indexeddb.service';
	import _ from 'lodash';

	$: if ($selectedIcon) {
		// Has userIconId and isn't empty uuid?
		// Then fetches the userIcon from the server and updates the state.styles
		if ($selectedIcon.userIconId && $selectedIcon.userIconId !== UUID.empty) {
			(async () => {
				try {
					const userIcon = await UserIconIndexedDBService.getById(
						$selectedIcon.userIconCollectionId,
						$selectedIcon.userIconId
					);
					const [iconContent, contentType] = await IconService.fetchIconWithContentType(
						userIcon.originalIconId,
						$selectedIcon.iconOrigin
					);

					_.flow(uiStateEx.stylesFromUserIcon, uiState.upsertStyles)(userIcon);

					if (isContentTypeSvg(contentType)) {
						uiState.selectSvgIcon(iconContent);
					} else {
						_.flow(IconService.mkIconUrl, uiState.selectImageIcon)(userIcon.originalIconId);
					}
				} catch (error: any) {
					throw new Error('Error fetching user icon', error);
				}
			})();
		}
		// Has iconId and userIconId is empty uuid?
		// Then keeps the state.styles as it is, so that the user can reuse the previous styles
		else if ($selectedIcon.iconId) {
			IconService.fetchIconWithContentType($selectedIcon.iconId, $selectedIcon.iconOrigin)
				.then(([iconContent, contentType]) => {
					if (isContentTypeSvg(contentType)) {
						uiState.selectSvgIcon(iconContent);
					} else {
						_.flow(IconService.mkIconUrl, uiState.selectImageIcon)($selectedIcon.iconId);
					}
				})
				.catch((error) => {
					throw new Error('Error fetching icon', error);
				});
		}
	}

	$: if ($uiState.styles.glyphColor) {
		uiState.setSvgFillColor($uiState.styles.glyphColor);
	}

	function isContentTypeSvg(contentType: string): boolean {
		return contentType === 'image/svg+xml';
	}

</script>