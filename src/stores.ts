import { writable } from 'svelte/store';

export interface Icon {
  id: string;
  label: string | null;
}

/// <summary>
///     An Icon with styles applied
/// </summary>
export interface StylizedIcon extends Icon {
  id: string;
  label: string | null;
  labelVisible: boolean;
  labelColor: string;
  labelTypeface: string;
  glyphColor: string;
  backgroundColor: string;
}

export const icons = writable<Icon[]>([]);
export const selectedIcon = writable<Icon | null>(null);
export const customizedIcons = writable<StylizedIcon[]>([]);