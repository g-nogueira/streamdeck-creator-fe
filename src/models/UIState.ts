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