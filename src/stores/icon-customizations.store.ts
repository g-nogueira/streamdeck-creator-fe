import { writable } from "svelte/store";
import type { CustomizableIcon } from "../models/CustomizableIcon";
import type { Icon } from "../models/Icon";
import { type UserIcon } from "../models/UserIcon";
import * as _iconPreview from "../models/CustomizableIcon";
import _ from "lodash";
import { GradientBuilder } from "../lib/gradient/gradientBuilder";
import type { GradientState, GradientStop } from "$lib/gradient";

let fromIcon = (icon: Icon) => {
	let iconPreview = _iconPreview.mkEmpty();

	iconPreview.iconId = icon.id;
	iconPreview.iconOrigin = icon.origin;

	return iconPreview;
};

let fromUserIcon = (userIcon: UserIcon) => {
	let iconPreview = _iconPreview.fromUserIcon(userIcon, userIcon.collectionId);

	return iconPreview;
};

/**
 * Update the outer SVG fill attribute with the given color
 * @param svgContent
 * @param color
 */
const updateSvgFill =
	(color: string) =>
	(svgContent: string): string => {
		if (typeof window === "undefined") {
			console.error("Trying to use DomParser on the server side. Returning the SVG content as is.");
			return svgContent;
		}
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgContent, "image/svg+xml");
		const svgElement = doc.querySelectorAll("svg");

		_.forEach(svgElement, element => {
			element.setAttribute("fill", color);
		});

		return new XMLSerializer().serializeToString(doc);
	};

const removeSvgSizeAttributes = (svgContent: string): string => {
	return svgContent.replace(/(width|height)="[^"]*"/g, "");
};

function createIconCustomizationsStore() {
	const { subscribe, set, update } = writable<CustomizableIcon | null>(null);
	const verboseMode = true;

	return {
		subscribe,
		selectIcon: (icon: Icon) => set(fromIcon(icon)),
		selectUserIcon: (userIcon: UserIcon) => set(fromUserIcon(userIcon)),
		clear: () => set(null),

		selectSvgIcon: (svg: string) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Setting SVG icon");

				const cleanedSvg = _.flow(updateSvgFill(state.styles.glyphColor), removeSvgSizeAttributes)(svg);

				state.svgContent = cleanedSvg;

				return state;
			}),

		/** @deprecated A way to handle image icons will be implemented */
		selectImageIcon: (url: string) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Setting image icon");

				state.svgContent = "";

				return state;
			}),

		setIconTitle: (title: string) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Setting icon title");

				state.styles.label = title;
				return state;
			}),

		upsertStyles: (styles: Partial<CustomizableIcon["styles"]>) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Upserting styles");

				state.styles = { ...state.styles, ...styles };
				return state;
			}),

		setSvgFillColor: (color: string) =>
			update(state => {
				if (!state) return state;

				verboseMode && console.log("Setting SVG fill color");

				state.svgContent = updateSvgFill(color)(state.svgContent!);
				return state;
			}),

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
		}
	};
}

export const customizedIcon = createIconCustomizationsStore();
