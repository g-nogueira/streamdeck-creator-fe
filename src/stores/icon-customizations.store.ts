import { writable } from "svelte/store";
import type { CustomizableIcon } from "../models/CustomizableIcon";
import type { Icon } from "../models/Icon";
import { type UserIcon } from "../models/UserIcon";
import * as _iconPreview from "../models/CustomizableIcon";
import _ from "lodash";
import { GradientBuilder } from "../lib/gradient/gradientBuilder";
import type { GradientState, GradientStop } from "$lib/gradient";
import { SVG } from '@svgdotjs/svg.js';
import { IconService } from "../services/icon.service";

let fromIcon = (icon: Icon) => {
	let iconPreview = _iconPreview.mkEmpty();

	iconPreview.iconId = icon.id;
	iconPreview.iconOrigin = icon.origin;
	iconPreview.contentType = icon.contentType;
	iconPreview.imageIconUrl = icon.url;

	return iconPreview;
};

let fromUserIcon = (userIcon: UserIcon) => {
	let iconPreview = _iconPreview.fromUserIcon(userIcon, userIcon.collectionId);

	return iconPreview;
};

/**
 * Updates the outer SVG fill attribute with the given color
 * @param color The fill color to apply
 */
const updateSvgFill =
	(color: string) =>
	(svgContent: string): string => {
		if (typeof window === "undefined") {
			console.error("Trying to use SVG parsing on the server side. Returning the SVG content as is.");
			return svgContent;
		}

		try {
			// Parse SVG with SVG.js
			const draw = SVG(svgContent);
			
			// Set fill on the root SVG
			draw.fill(color);

			const cleanedSvg = draw.svg();
			
			return cleanedSvg;
		} catch (error) {
			console.error("Error parsing SVG:", error);
			return svgContent; // Return original content if parsing fails
		}
	};

/**
 * Sets SVG size attributes to 'auto'
 * @param svg SVG content to modify
 */
const setSvgSizeAuto = (svgContent: string): string => {
	// Parse SVG with SVG.js
	const draw = SVG(svgContent);

	draw.width("auto");
	draw.height("auto");

	return draw.svg();
	
};

/**
 * Creates and manages the state for icon customization
 * Handles SVG modifications, gradient management, and style updates
 */
function createIconCustomizationsStore() {
	const { subscribe, set, update } = writable<CustomizableIcon | null>(null);
	const verboseMode = true;

	function selectSvgIcon(svg: string) {
		return update(state => {
			if (!state) return state;

			verboseMode && console.log("Setting SVG icon");

			let cleanedSvg;

			switch (state.iconOrigin) {
				case "homarr":
					// We have more success when we don't modify the SVG for Homarr icons.
					cleanedSvg = svg;
					break;
				default:
					cleanedSvg = _.flow(() => svg, updateSvgFill(state.styles.glyphColor), setSvgSizeAuto)();
					break;
			}
					
			state.svgContent = cleanedSvg;

			return state;
		});
	}

	function selectImageIcon(url: string) {
		return update(state => {
			if (!state) return state;

			verboseMode && console.log("Setting image icon");

			state.svgContent = undefined;
			state.imageIconUrl = url;

			return state;
		});
	}

	function setSvgFillColor(color: string) {
		return update(state => {
			if (!state) return state;

			verboseMode && console.log("Setting SVG fill color");

			if (!state.svgContent)
				throw new Error("SVG content is not defined");

			state.svgContent = updateSvgFill(color)(state.svgContent!);
			return state;
		});
	}

	return {
		subscribe,
		
		/**
		 * Selects an icon for customization
		 * @param icon The icon to customize
		 */
		selectIcon: (icon: Icon) => {
			verboseMode && console.log("Selecting icon");

			if (!icon) {
				throw new Error("Icon is undefined");
			}

			let customizableIcon = fromIcon(icon);

			if (icon.contentType === "image/svg+xml") {
				IconService.fetchSvgIcon(customizableIcon.iconId, customizableIcon.iconOrigin)
				.then(selectSvgIcon)
				.catch(error => {
					throw new Error("Error fetching icon", error);
				});

			}
			if (icon.contentType === "image/png") {
				// Set the SVG content to the icon content
				IconService.mkIconUrl(customizableIcon.iconId, customizableIcon.iconOrigin)
				.then(selectImageIcon)
				.catch(error => {
					throw new Error("Error fetching icon", error);
				});
			}

			set(customizableIcon);

		},
		/**
		 * Selects a user icon for customization
		 * @param userIcon The user icon to customize
		 */
		selectUserIcon: (userIcon: UserIcon) => set(fromUserIcon(userIcon)),
		
		/**
		 * Clears the current icon selection
		 */
		clear: () => set(null),

		/**
		 * Updates the icon's SVG content
		 * @param svg The new SVG content
		 */
		selectSvgIcon,

		/**
		 * Updates the icon's image URL
		 * @param url The new image URL
		 */
		selectImageIcon,

		/**
		 * Sets the icon's display title
		 * @param title The new title
		 */
		setIconTitle: (title: string) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Setting icon title");

				state.styles.label = title;
				return state;
			}),

		/**
		 * Updates multiple style properties at once
		 * @param styles Partial style object to merge
		 */
		upsertStyles: (styles: Partial<CustomizableIcon["styles"]>) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Upserting styles");

				state.styles = { ...state.styles, ...styles };
				return state;
			}),

		/**
		 * Updates the SVG fill color
		 * @param color The new fill color
		 */
		setSvgFillColor,

		/**
		 * Toggles gradient usage
		 * @param value Whether to use gradient
		 */
		setUseGradient: (value: boolean) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Setting use gradient");

				state.styles.useGradient = value;
				return state;
			}),

		addGradientStop: (stop: GradientStop) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Adding gradient stop");

				const builder = (state.styles.gradient && new GradientBuilder(state.styles.gradient)) || new GradientBuilder();
				const updatedGradient = builder.addStop(stop.color, stop.pos).getState();

				state.styles.gradient = updatedGradient;

				return state;
			}),

		updateGradientStopPosition: (index: number, position: GradientStop["pos"]) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Updating gradient stop position");

				if (state.styles.gradient === undefined) {
					throw new Error("Gradient is not defined");
				}

				const builder = (state.styles.gradient && new GradientBuilder(state.styles.gradient)) || new GradientBuilder();
				const stops = [...builder.getStops()];
				stops[index].pos = position;

				const updatedGradient = builder.withStops(stops).getState();

				state.styles.gradient = updatedGradient;

				return state;
			}),

		updateGradientStopColor: (index: number, color: GradientStop["color"]) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Updating gradient stop color");

				if (state.styles.gradient === undefined) {
					throw new Error("Gradient is not defined");
				}

				const builder = (state.styles.gradient && new GradientBuilder(state.styles.gradient)) || new GradientBuilder();
				const stops = [...builder.getStops()];
				stops[index].color = color;

				const updatedGradient = builder.withStops(stops).getState();

				state.styles.gradient = updatedGradient;

				return state;
			}),

		removeGradientStop: (index: number) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Removing gradient stop");

				if (state.styles.gradient === undefined) {
					throw new Error("Gradient is not defined");
				}

				const builder = (state.styles.gradient && new GradientBuilder(state.styles.gradient)) || new GradientBuilder();
				const stops = [...builder.getStops()];

				stops.splice(index, 1);

				const updatedGradient = builder.withStops(stops).getState();

				state.styles.gradient = updatedGradient;

				return state;
			}),

		setGradientType: (type: GradientState["type"]) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Setting gradient type");

				const builder = (state.styles.gradient && new GradientBuilder(state.styles.gradient)) || new GradientBuilder();
				const updatedGradient = type === "linear" ? builder.linear() : builder.radial();

				state.styles.gradient = updatedGradient.getState();
				return state;
			}),

		setLinearGradientDirection: (direction: GradientState["direction"]) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Setting gradient angle");

				const builder = (state.styles.gradient && new GradientBuilder(state.styles.gradient)) || new GradientBuilder();
				const updatedGradient = builder.direction(direction).getState();

				state.styles.gradient = updatedGradient;

				return state;
			}),

		recalculateGradientCss: () =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Recalculating gradient css");

				const builder = (state.styles.gradient && new GradientBuilder(state.styles.gradient)) || new GradientBuilder();
				const updatedGradient = builder.getCss();

				state.styles.gradientCss = updatedGradient;

				return state;
			}),

		reset: () => {
			verboseMode && console.log("Resetting store");
			set(_iconPreview.mkEmpty());
		},

		/**
		 * Function reserved for Svelte native calls
		 */
		set: (value: CustomizableIcon) => {
			verboseMode && console.log("Setting store value");

			set(value);

			if (value?.styles?.glyphColor && value.svgContent) {
				setSvgFillColor(value.styles.glyphColor);
			}

		}
	};
}

export const customizedIcon = createIconCustomizationsStore();
