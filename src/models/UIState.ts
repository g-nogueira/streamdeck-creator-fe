import type { UserIcon } from "./UserIcon";
import type { UserIconGradient } from "./UserIconGradient";

export type UIState = {
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

    pngData: string;

    useGradient: boolean;
    gradient: UserIconGradient | null;
  },
  /** The SVG string content of the icon */
  svgContent: string;
  /** The URL of the icon image */
  imageUrl: string;
}

function stylesFromUserIcon(userIcon: UserIcon): UIState['styles'] {
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
    gradient: userIcon.gradient
      ? {
        stops: userIcon.gradient.stops,
        type: userIcon.gradient.type,
        angle: userIcon.gradient.angle,
        cssStyle: userIcon.gradient.cssStyle
      }
      : null
  };
}



export const extensions = {
  stylesFromUserIcon: stylesFromUserIcon
}