import type { UserIcon } from "../../models/UserIcon";
import type { IconOriginDto } from "./IconDto";
import type { UserIconGradientDto } from "./UserIconGradientDto";
import * as _userIconGradientDto from "./UserIconGradientDto";

export interface UserIconDto {
	id: string;
	collectionId: string;
	iconId: string;
	label: string;
	labelVisible: boolean;
	labelColor: string;
	labelTypeface: string;
	glyphColor: string;
	backgroundColor: string;
	iconScale: number;
	imgX: number;
	imgY: number;
	labelX: number;
	labelY: number;
	// Base64 encoded PNG representation of the user icon. This is what the user downloads
	pngData: string;
	base64Thumbnail: string;
	useGradient: boolean;
	gradient?: UserIconGradientDto | null;
	origin: IconOriginDto;
	contentType: string;
}

export function toUserIcon(userIconDto: UserIconDto): UserIcon {
	return {
		id: userIconDto.id,
		originalIconId: userIconDto.iconId,
		label: userIconDto.label,
		labelVisible: userIconDto.labelVisible,
		labelColor: userIconDto.labelColor,
		labelTypeface: userIconDto.labelTypeface,
		glyphColor: userIconDto.glyphColor,
		backgroundColor: userIconDto.backgroundColor,
		iconScale: userIconDto.iconScale,
		imgX: userIconDto.imgX,
		imgY: userIconDto.imgY,
		labelX: userIconDto.labelX,
		labelY: userIconDto.labelY,
		pngData: userIconDto.pngData,
		useGradient: userIconDto.useGradient,
		base64Thumbnail: userIconDto.base64Thumbnail,
		gradient: userIconDto.gradient ? _userIconGradientDto.toDomain(userIconDto.gradient) : undefined,
		origin: userIconDto.origin,
		collectionId: userIconDto.collectionId,
		contentType: userIconDto.contentType
	};
}

export function fromUserIcon(userIcon: UserIcon): UserIconDto {
	return {
		id: userIcon.id,
		iconId: userIcon.originalIconId,
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
		pngData: userIcon.pngData,
		base64Thumbnail: userIcon.base64Thumbnail,
		useGradient: userIcon.useGradient,
		gradient: userIcon.gradient ? _userIconGradientDto.fromDomain(userIcon.gradient) : null,
		origin: userIcon.origin,
		collectionId: userIcon.collectionId,
		contentType: userIcon.contentType
	};
}
