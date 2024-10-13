import { UUID } from '$lib';
import { readable, writable } from 'svelte/store';
import type { UserIcon } from './models/UserIcon';
import type { UserIconCollection } from './models/UserIconCollection';
import { userIconCollections } from './stores/user-icon-collection.store';
import type { SelectedIcon } from './models/SelectedIcon';
import { userCollectionEndpoint } from './constants';

export interface Icon {
  id: string;
  label: string;
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