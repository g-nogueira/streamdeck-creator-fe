import { mkEmptyUuid } from '$lib';
import { readable, writable } from 'svelte/store';

export interface IconDto {
  id: string;
  label: string;

  isIconDto: boolean;
}

/// <summary>
///     An Icon with styles applied
/// </summary>
export interface StylizedIconDto {
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

  pngData: string;

  isStylizedIconDto: boolean;
}

export interface StylizedIcon extends StylizedIconDto {
  pngData: string;
}

export interface CollectionDto {
  id: string;
  name: string;
  icons: StylizedIconDto[];
}

export const icons = writable<IconDto[]>([]);
export const selectedIcon = writable<IconDto | StylizedIconDto | null>(null);
export const selectedCollection = writable<CollectionDto | null>(null);
export const collections = writable<CollectionDto[]>([]);

export function selectIcon(icon: IconDto) {
  icon.isIconDto = true;
  selectedIcon.set(icon);
}

export function selectStylizedIcon(icon: StylizedIconDto) {
  icon.isStylizedIconDto = true;
  selectedIcon.set(icon);
}

// Helper function to detect changes in collections
let previousCollections: CollectionDto[] = [];

collections.subscribe(async (newCollections) => {
  const updatedCollection = newCollections.find((newCollection, index) => {
    return JSON.stringify(newCollection) !== JSON.stringify(previousCollections[index]);
  });

  if (updatedCollection) {
    try {

      if (updatedCollection.id === mkEmptyUuid()) {
        console.log('No collection id provided, skipping update.');
        return;
      }

      const response = await fetch(`http://localhost:5199/collections/${updatedCollection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCollection),
      });

      if (!response.ok) {
        throw new Error('Failed to update collection');
      }

      if (response.status === 200) {
        console.log('Collection updated successfully');
        return;
      }

    } catch (error) {
      console.error('Error updating collection:', error);
    }
  }

  // Update the previous collections for the next comparison
  previousCollections = JSON.parse(JSON.stringify(newCollections));
});