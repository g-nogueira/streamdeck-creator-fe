import { UUID } from '$lib';
import { readable, writable } from 'svelte/store';
import type { UserIcon } from './models/UserIcon';
import type { UserIconCollection } from './models/UserIconCollection';
import { userIconCollections } from './stores/UserIconCollection.Store';
import type { SelectedIcon } from './models/SelectedIcon';
import { userCollectionEndpoint } from './constants';

export interface Icon {
  id: string;
  label: string;
}

export const icons = writable<Icon[]>([]);
export const selectedIcon = writable<SelectedIcon | null>(null);
export const selectedCollection = writable<UserIconCollection | null>(null);
// export const collections = writable<UserIconCollection[]>([]);

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

// Helper function to detect changes in collections
let previousCollections: UserIconCollection[] = [];

// Subscribe to changes in the collections store
userIconCollections.subscribe(async (newCollections) => {
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