import type { UserIconGradient } from "./UserIconGradient";

/**
 * Represents a user-created icon.
 */
export type UserIcon = {
    id: string;
  
    originalIconId: string;
  
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
  
    gradient: UserIconGradient | null;
  
    /** Base64 encoded PNG data */
    pngData: string;
  }