import type { Icon, IconOrigin } from "./Icon";
import type { IconGradient } from "./IconGradient";

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
  glyphColor: string;
  backgroundColor: string;

  iconScale: number;
  imgX: number;
  imgY: number;
  labelX: number;
  labelY: number;

  useGradient: boolean;
  gradient: IconGradient | null;

  /** Base64 encoded PNG data */
  pngData: string;
  svgContent?: string;

  /** For ex, 'image/svg+xml' */
  contentType: string;

  /** Origin of the icon */
  origin: IconOrigin;
}

export function createFromIcon(icon: Icon): UserIcon {
  return {
    id: '',
    originalIconId: icon.id,
    collectionId: '',
    label: icon.label,
    labelVisible: true,
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
    origin: icon.origin,
    contentType: icon.contentType
  };
}

export function mkEmpty(): UserIcon {
  return {
    id: '',
    originalIconId: '',
    collectionId: '',
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
    origin: 'mdi',
    contentType: 'image/svg+xml'
  };
}