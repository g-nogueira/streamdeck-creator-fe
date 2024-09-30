import { writable } from 'svelte/store';

export interface IconDto {
  id: string;
  label: string;
}

/// <summary>
///     An Icon with styles applied
/// </summary>
export interface StylizedIconDto extends IconDto {
  id: string;
  label: string;
  labelVisible: boolean;
  labelColor: string;
  labelTypeface: string;
  glyphColor: string;
  backgroundColor: string;
}

export const icons = writable<Icon[]>([]);
export const selectedIcon = writable<Icon | null>(null);
export const customizedIcons = writable<StylizedIcon[]>([]);