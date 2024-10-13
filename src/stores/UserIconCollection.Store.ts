import { writable } from "svelte/store";
import type { UserIconCollection, userIconCollection } from "../models/UserIconCollection";
import type { UserIcon } from "../models/UserIcon";

// export const collections = writable<UserIconCollection[]>([]);

function createCollectionsStore() {
    const { subscribe, set, update } = writable<UserIconCollection[]>([]);

    return {
        subscribe,
        addIcon: (collectionId: string, icon: UserIcon) => update(collections => {
            const collection = collections.find(c => c.id === collectionId);

            if (!collection) throw new Error(`Collection with ID ${collectionId} not found`);

            collection.icons.push(icon);

            return collections;
        }),
        removeIcon: (collectionId: string, iconId: string) => update(collections => {
            const collection = collections.find(c => c.id === collectionId);

            if (!collection) throw new Error(`Collection with ID ${collectionId} not found`);

            collection.icons = collection.icons.filter(icon => icon.id !== iconId);
            return collections;
        }),
        updateIcon: (collectionId: string, updatedIcon: UserIcon) => update(collections => {
            const collection = collections.find(c => c.id === collectionId);

            if (!collection) throw new Error(`Collection with ID ${collectionId} not found`);

            const iconIndex = collection.icons.findIndex(icon => icon.id === updatedIcon.id);

            if (iconIndex === -1) throw new Error(`Icon with ID ${updatedIcon.id} not found in collection with ID ${collectionId}`);

            collection.icons[iconIndex] = updatedIcon;
            return collections;
        }),
        addCollection: (newCollection: UserIconCollection) => update(collections => {
            collections.push(newCollection);
            return collections;
        }),
        updateCollection: (updatedCollection: UserIconCollection) => update(collections => {
            const collectionIndex = collections.findIndex(c => c.id === updatedCollection.id);

            if (collectionIndex === -1) throw new Error(`Collection with ID ${updatedCollection.id} not found`);

            collections[collectionIndex] = updatedCollection;
            return collections;
        }),
        removeCollection: (collectionId: string) => update(collections => {
            return collections.filter(c => c.id !== collectionId);
        }),
        upsertCollection: (collection: UserIconCollection) => update(collections => {
            const collectionIndex = collections.findIndex(c => c.id === collection.id);

            if (collectionIndex === -1) {
                collections.push(collection);
            } else {
                collections[collectionIndex] = collection;
            }

            return collections;
        }),
        set
    };
}

export const userIconCollections = createCollectionsStore();
