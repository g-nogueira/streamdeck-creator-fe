import * as UUID from "$lib/utils/uuid";
import type { IconOrigin } from "./Icon";
import type { UserIcon } from "./UserIcon";
import { type GradientState, GradientBuilder } from "$lib/gradient";

/**
 * Represents an icon, either user-created or original, that has been selected for modification in the app.
 */
export type CustomizableIcon = {
	iconId: string;
	userIconId: string;
	userIconCollectionId: string;

	styles: {
		glyphColor: string;
		backgroundColor: string;
		labelColor: string;
		label: string;
		labelVisible: boolean;
		labelTypeface: string;
		iconScale: number;

		imgX: number;
		imgY: number;
		labelX: number;
		labelY: number;

		useGradient: boolean;
		gradient?: GradientState;
		gradientCss?: string;
	};

	/** For ex, 'image/svg+xml' */
	contentType: string;
	/** The SVG string content of the icon */
	svgContent?: string;

	iconOrigin: IconOrigin;
};

export type CustomizableIconStyles = CustomizableIcon["styles"];

export function mkEmpty(): CustomizableIcon {
	return {
		iconId: UUID.empty,
		userIconId: UUID.empty,
		userIconCollectionId: UUID.empty,

		styles: {
			glyphColor: "#38bdf8", // sky-400
			backgroundColor: "#0284c7", // sky-600
			labelColor: "#ffffff", // white
			label: "Label Text",
			labelVisible: true,
			labelTypeface: "VT323",
			iconScale: 1, // Scale factor for resizing the icon
			imgX: 0,
			imgY: 0,
			labelX: 0,
			labelY: 0,

			useGradient: false,
			gradient:
				new GradientBuilder()
					.linear()
					.direction("90deg")
					.addStop("#ea62e5", 0)
					.addStop("#0000ff", 1)
					.getState()
		},

		contentType: "image/svg+xml",
		iconOrigin: "mdi"
	};
}
export function fromUserIcon(userIcon: UserIcon, collectionId: string): CustomizableIcon {
	return {
		iconId: userIcon
			.originalIconId,
		userIconId: userIcon.id,
		userIconCollectionId: collectionId,

		styles: {
			label: userIcon.label,
			labelVisible: userIcon.labelVisible,
			labelColor: userIcon.labelColor,
			labelTypeface: userIcon.labelTypeface,
			glyphColor: userIcon.glyphColor,
			backgroundColor: userIcon.backgroundColor,

			iconScale: userIcon.iconScale,
			imgX: userIcon.imgX,
			imgY: userIcon.imgY,
			labelX: userIcon.labelX,
			labelY: userIcon.labelY,
			useGradient: userIcon.useGradient,
			gradient: userIcon.gradient ? new GradientBuilder(userIcon.gradient).getState() : undefined
		},

		svgContent: userIcon.svgContent,

		contentType: userIcon.contentType,

		iconOrigin: userIcon.origin
	};
}

export function toUserIcon(customizableIcon: CustomizableIcon, base64Thumbnail: string, pngData: string): UserIcon {
	return {
		id: customizableIcon.userIconId || UUID.empty,
		collectionId: customizableIcon.userIconCollectionId || UUID.empty,
		contentType: customizableIcon.contentType,
		originalIconId: customizableIcon.iconId,
		glyphColor: customizableIcon.styles.glyphColor,
		backgroundColor: customizableIcon.styles.backgroundColor,
		labelColor: customizableIcon.styles.labelColor,
		label: customizableIcon.styles.label,
		labelVisible: customizableIcon.styles.labelVisible,
		labelTypeface: customizableIcon.styles.labelTypeface,
		iconScale: customizableIcon.styles.iconScale,
		imgX: customizableIcon.styles.imgX,
		imgY: customizableIcon.styles.imgY,
		labelX: customizableIcon.styles.labelX,
		labelY: customizableIcon.styles.labelY,
		pngData: pngData,
		base64Thumbnail: base64Thumbnail,
		useGradient: customizableIcon.styles.useGradient,
		gradient: customizableIcon.styles.gradient,
		origin: customizableIcon.iconOrigin
	};
}
