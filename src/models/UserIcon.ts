import type { IconOrigin } from "./Icon";
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

  useGradient: boolean;
  gradient: UserIconGradient | null;

  /** Base64 encoded PNG data */
  pngData: string;

  /** Origin of the icon */
  origin: IconOrigin;
}

export function mkEmpty(): UserIcon {
  return {
    id: '',
    originalIconId: '',
    label: '',
    labelVisible: false,
    labelColor: '#000000',
    labelTypeface: 'Arial',
    glyphColor: '#000000',
    backgroundColor: '#FFFFFF',
    iconScale: 1,
    imgX: 0,
    imgY: 0,
    labelX: 0,
    labelY: 0,
    useGradient: false,
    gradient: null,
    pngData: '',
    origin: 'mdi'
  };
}