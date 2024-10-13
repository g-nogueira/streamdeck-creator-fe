import { UUID } from "$lib";
import { userCollectionEndpoint } from "../constants";
import type { UserIconCollection } from "../models/UserIconCollection";
import { userIconCollections } from "../stores/user-icon-collection.store";

// Helper function to detect changes in collections
let previousCollections: UserIconCollection[] = [];

// Subscribe to changes in the collections store
export const startUserIconCollectionsSync = () =>
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

                await fetch(`${userCollectionEndpoint}/${updatedCollection.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedCollection),
                });

            } catch (error) {
                console.error('Error updating collection:', error);
            }
        }

        // Update the previous collections for the next comparison
        previousCollections = JSON.parse(JSON.stringify(newCollections));
    });