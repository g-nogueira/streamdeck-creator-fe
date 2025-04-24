import { GradientBuilder, type GradientState } from "$lib/gradient";
import type { Icon, IconOrigin } from "./Icon";

/**
 * Represents a user-created icon.
 */
export type UserIcon = {
	id: string;

	originalIconId: string;
	collectionId: string;

	label: string;
	labelVisible: boolean;
	labelColor: string;
	labelTypeface: string;
	labelSize: number;
	glyphColor: string;
	backgroundColor: string;

	iconScale: number;
	imgX: number;
	imgY: number;
	labelX: number;
	labelY: number;

	useGradient: boolean;
	gradient?: GradientState;

	/** Base64 encoded PNG representation of the user icon. This is what the user downloads */
	pngData: string;
	svgContent?: string;

	/** Base64 encoded thumbnail data */
	base64Thumbnail: string;

	/** For ex, 'image/svg+xml' */
	contentType: string;

	/** Origin of the icon */
	origin: IconOrigin;
};

export function createFromIcon(icon: Icon): UserIcon {
	return {
		id: "",
		originalIconId: icon.id,
		collectionId: "",
		label: icon.label,
		labelVisible: true,
		labelColor: "#000000",
		labelTypeface: "Arial",
		labelSize: 70,
		glyphColor: "#000000",
		backgroundColor: "#FFFFFF",
		iconScale: 1,
		imgX: 0,
		imgY: 0,
		labelX: 0,
		labelY: 0,
		useGradient: false,
		gradient: new GradientBuilder().linear().direction("90deg").addStop("#ea62e5", 0).addStop("#0000ff", 1).getState(),
		pngData: "",
		base64Thumbnail: "",
		origin: icon.origin,
		contentType: icon.contentType
	};
}

export function mkEmpty(): UserIcon {
	return {
		id: "",
		originalIconId: "",
		collectionId: "",
		label: "",
		labelVisible: false,
		labelColor: "#000000",
		labelTypeface: "Arial",
		labelSize: 70,
		glyphColor: "#000000",
		backgroundColor: "#FFFFFF",
		iconScale: 1,
		imgX: 0,
		imgY: 0,
		labelX: 0,
		labelY: 0,
		useGradient: false,
		gradient: undefined,
		pngData: "",
		base64Thumbnail: "",
		origin: "mdi",
		contentType: "image/svg+xml"
	};
}
