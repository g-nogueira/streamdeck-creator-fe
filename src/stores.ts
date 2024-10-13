import { UUID } from '$lib';
import { readable, writable } from 'svelte/store';

const baseUrl = 'http://localhost:5199';
const userCollectionEndpoint = `${baseUrl}/user-icon-collections`;
const iconsEndpoint = `${baseUrl}/icons`;

export interface Icon {
  id: string;
  label: string;
}

/// <summary>
///     An Icon with styles applied
/// </summary>
export interface UserIcon {
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

  /** Base64 encoded PNG data */
  pngData: string;
}

export interface SelectedIcon {
  iconId: string;
  userIconId: string;
  userIconCollectionId: string;

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
}

export function mkEmptySelectedIcon(): SelectedIcon {
  return {
    iconId: UUID.empty,
    userIconId: UUID.empty,
    userIconCollectionId: UUID.empty,

    label: '',
    labelVisible: false,
    labelColor: '',
    labelTypeface: '',
    glyphColor: '',
    backgroundColor: '',

    iconScale: 1,
    imgX: 0,
    imgY: 0,
    labelX: 0,
    labelY: 0,

    pngData: '',
  };
}

export function mkSelectedIconFromUserIcon(userIcon: UserIcon, collectionId: string): SelectedIcon {
  return {
    iconId: userIcon.originalIconId,
    userIconId: userIcon.id,
    userIconCollectionId: collectionId,

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
  };
}

// export interface StylizedIcon extends StylizedIcon {
//   pngData: string;
// }

export interface UserIconCollection {
  id: string;
  name: string;
  icons: UserIcon[];
}

export const icons = writable<Icon[]>([]);
export const selectedIcon = writable<SelectedIcon | null>(null);
export const selectedCollection = writable<UserIconCollection | null>(null);
export const collections = writable<UserIconCollection[]>([]);

export function selectIcon(icon: SelectedIcon) {
  selectedIcon.set(icon);
}

export function selectCollection(collection: UserIconCollection) {
  selectedCollection.set(collection);
}

export function addIconToCollection(icon: UserIcon) {
  selectedCollection.update((collection) => {
    if (!collection) {
      throw new Error('No collection selected');
    }

    collection.icons.push(icon);
    return collection;
  });
}

export function updateIconFromCollection(icon: UserIcon) {
  selectedCollection.update((collection) => {
    if (!collection) {
      throw new Error('No collection selected');
    }

    const index = collection.icons.findIndex((i) => i.id === icon.id);

    if (index === -1) {
      throw new Error('Icon not found in collection');
    }

    collection.icons[index] = icon;
    return collection;
  });
}

export function addIconToSelectedCollection(icon: UserIcon) {
  selectedCollection.update((collection) => {
    if (!collection) {
      throw new Error('No collection selected');
    }

    collection.icons.push(icon);
    return collection;
  });
}

export function updateIconFromSelectedCollection(icon: UserIcon) {
  selectedCollection.update((collection) => {
    if (!collection) {
      throw new Error('No collection selected');
    }

    const index = collection.icons.findIndex((i) => i.id === icon.id);

    if (index === -1) {
      throw new Error('Icon not found in collection');
    }

    collection.icons[index] = icon;
    return collection;
  });
}

export function upsertUserIconCollections(collection: UserIconCollection) {
  collections.update((collections) => [
    ...collections.filter(collection => collection.id !== collection.id),
    collection
  ]);
}

// Helper function to detect changes in collections
let previousCollections: UserIconCollection[] = [];

collections.subscribe(async (newCollections) => {
  const updatedCollection = newCollections.find((newCollection, index) => {
    return JSON.stringify(newCollection) !== JSON.stringify(previousCollections[index]);
  });

  if (updatedCollection) {
    try {

      if (updatedCollection.id === UUID.empty) {
        console.log('No collection id provided, skipping update.');
        return;
      }

      const response = await fetch(`${userCollectionEndpoint}/${updatedCollection.id}`, {
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

/////////////////////// UI State ///////////////////////
export interface UIState {
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
  },
  /** The SVG string content of the icon */
  svgContent: string;
  /** The URL of the icon image */
  imageUrl: string;
}

/////////////////////// Endpoints and Dtos ///////////////////////
interface UserIconDto {
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
}

function toUserIcon(userIconDto: UserIconDto): UserIcon {
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
    pngData: userIconDto.pngData
  };
}

function fromUserIcon(userIcon: UserIcon): UserIconDto {
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
    pngData: userIcon.pngData
  };
}

interface UserIconCollectionDto {
  id: string;
  name: string;
  icons: UserIconDto[];
}

function toUserIconCollection(userIconCollectionDto: UserIconCollectionDto): UserIconCollection {
  return {
    id: userIconCollectionDto.id,
    name: userIconCollectionDto.name,
    icons: userIconCollectionDto.icons.map(toUserIcon)
  };
}

function fromUserIconCollection(userIconCollection: UserIconCollection): UserIconCollectionDto {
  return {
    id: userIconCollection.id,
    name: userIconCollection.name,
    icons: userIconCollection.icons.map(fromUserIcon)
  };
}

export class IconService {
  static async fetchUserIcon(userIconCollectionId: string, userIconId: string): Promise<UserIcon> {
    try {
      if (userIconId === UUID.empty || userIconId === '') {
        throw new Error('User icon ID is empty');
      }

      const response = await fetch(`${userCollectionEndpoint}/${userIconCollectionId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch UserIconCollection with id: ' + userIconCollectionId);
      }

      const userIcon: UserIconCollectionDto = await response.json();
      const userIconDto = userIcon.icons.find((icon) => icon.id === userIconId);

      if (!userIconDto) {
        throw new Error('Failed to find UserIcon with id: ' + userIconId);
      }

      return toUserIcon(userIconDto);
    } catch (error) {
      console.error('Error fetching user icon:', error);
      throw error;
    }
  }

  static async fetchIconWithContentType(iconId: string): Promise<[string, string]> {
    try {
      if (iconId === UUID.empty || iconId === '') {
        throw new Error('Icon ID is empty');
      }

      const response = await fetch(`http://localhost:5199/icons/${iconId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch Icon with id: ' + iconId);
      }

      const contentType = response.headers.get('Content-Type');
      const iconContent: string = await response.text();

      if (!contentType) {
        throw new Error('Failed to get content type.');
      }

      return [iconContent, contentType];
    } catch (error) {
      console.error('Error fetching icon:', error);
      throw error;
    }
  }

  static mkIconUrl(iconId: string): string {
    return `http://localhost:5199/icons/${iconId}`;
  }
}

export class UserIconCollectionService {
  static async fetchById(userIconCollectionId: string): Promise<UserIconCollection> {
    try {
      if (userIconCollectionId === UUID.empty || userIconCollectionId === '') {
        throw new Error('User icon collection ID is empty');
      }

      const response = await fetch(`${userCollectionEndpoint}/${userIconCollectionId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch UserIconCollection with id: ' + userIconCollectionId);
      }

      const userIconCollection: UserIconCollectionDto = await response.json();
      return toUserIconCollection(userIconCollection);
    } catch (error) {
      console.error('Error fetching user icon collection:', error);
      throw error;
    }
  }

  static async fetchList(): Promise<UserIconCollection[]> {
    try {
      const response = await fetch(`${userCollectionEndpoint}`);

      if (!response.ok) {
        throw new Error('Failed to fetch UserIconCollections');
      }

      const userIconCollections: UserIconCollectionDto[] = await response.json();
      return userIconCollections.map(toUserIconCollection);
    } catch (error) {
      console.error('Error fetching user icon collections:', error);
      throw error;
    }
  }

  static async create(userIconCollection: UserIconCollection): Promise<string> {
    try {
      const response = await fetch(`${userCollectionEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fromUserIconCollection(userIconCollection)),
      });

      if (!response.ok) {
        throw new Error('Failed to create UserIconCollection');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user icon collection:', error);
      throw error;
    }
  }

  static async download(userIconCollectionId: string): Promise<void> {
    try {
      const response = await fetch(`${userCollectionEndpoint}/${userIconCollectionId}/download`);

      if (!response.ok) {
        throw new Error('Failed to download UserIconCollection with id: ' + userIconCollectionId);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user-icon-collection.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading user icon collection:', error);
      throw error;
    }
  }
}