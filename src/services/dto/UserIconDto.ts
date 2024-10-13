import type { UserIcon } from "../../models/UserIcon";
import type { UserIconGradientDto } from "./UserIconGradientDto";

export interface UserIconDto {
  id: string;
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
  pngData: string;
  useGradient: boolean;
  gradient: UserIconGradientDto | null;
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
    gradient: userIconDto.gradient ? {
      stops: userIconDto.gradient.stops,
      type: userIconDto.gradient.type,
      angle: userIconDto.gradient.angle,
      cssStyle: userIconDto.gradient.cssStyle,
    } : null,
        
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
    useGradient: userIcon.useGradient,
    gradient: userIcon.gradient ? {
      stops: userIcon.gradient.stops,
      type: userIcon.gradient.type,
      angle: userIcon.gradient.angle,
      cssStyle: userIcon.gradient.cssStyle,
    } : null,
  };
}