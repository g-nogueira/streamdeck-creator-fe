import { get, writable } from "svelte/store";
import type { UserIconCollection } from "../models/UserIconCollection";
import type { UserIcon } from "../models/UserIcon";
import { userIconCollections } from "./user-icon-collection.store";

function createSelectedCollectionStore() {
    const { subscribe, set, update } = writable<UserIconCollection | null>(null);

    return {
        subscribe,
        selectCollection: (collectionId: string) => {
            const collection = get(userIconCollections).find(c => c.id === collectionId);

            if (!collection) {
                throw new Error(`Collection with ID ${collectionId} not found`);
            }

            set(collection);
        },
        addIconToSelectedCollection: async (icon: UserIcon) => {

            let selectedCollection = get({subscribe});

            if (!selectedCollection) {
                throw new Error('No collection selected');
            }

            await userIconCollections.addIcon(selectedCollection.id, icon);

            const collectionFromCollections = get(userIconCollections).find(c => c.id === selectedCollection.id);

            if (!collectionFromCollections) {
                throw new Error('Selected collection not found in collections');
            }

            update(_ => collectionFromCollections);
        },
    };
}

export const selectedCollection = createSelectedCollectionStore();