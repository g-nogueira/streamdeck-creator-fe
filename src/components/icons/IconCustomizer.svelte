<script lang="ts">
	import { empty } from "$lib/utils/uuid";
	import _ from "lodash";
	import type { CustomizableIcon } from "../../models/CustomizableIcon";
	import { IconService } from "../../services/icon.service";
	import type { IconOrigin } from "../../models/Icon";

	export let customizableIcon: CustomizableIcon | null = null;
	export let selectSvgIcon: (svg: string) => void;
	export let selectImageIcon: (url: string) => void;
	export let setSvgFillColor: (color: string) => void;
	export let fetchIconWithContentType: (iconId: string, origin: IconOrigin) => Promise<[string, string]>;

	let previousIconId: string | null = null;

	$: if (customizableIcon?.userIconId && customizableIcon.userIconId !== empty) {
		// Has userIconId and isn't empty uuid?
		if (isContentTypeSvg(customizableIcon.contentType) && customizableIcon.svgContent) {
			selectSvgIcon(customizableIcon.svgContent);
		} else {
			throw new Error("User icon is not an SVG. Only SVGs are supported for now.");
		}
	}

	$: if (customizableIcon?.iconId && (!customizableIcon.userIconId || customizableIcon.userIconId === empty)) {
		// Has iconId and userIconId is empty uuid?
		// Then keeps the state.styles as it is, so that the user can reuse the previous styles
		if (previousIconId !== customizableIcon.iconId) {
			fetchIconWithContentType(customizableIcon.iconId, customizableIcon.iconOrigin)
				.then(([iconContent, contentType]) => {
					if (isContentTypeSvg(contentType)) {
						selectSvgIcon(iconContent);
					} else {
						/** @deprecated A way to handle png icons will be implemented */
						_.flow(IconService.mkIconUrl, selectImageIcon)(customizableIcon.iconId);
					}
				})
				.catch(error => {
					throw new Error("Error fetching icon", error);
				})
				.finally(() => {
					previousIconId = customizableIcon.iconId;
				});
		}
	}

	$: if (customizableIcon?.styles?.glyphColor && customizableIcon.svgContent) {
		setSvgFillColor(customizableIcon.styles.glyphColor);
	}

	function isContentTypeSvg(contentType: string): boolean {
		return contentType === "image/svg+xml";
	}
</script>
