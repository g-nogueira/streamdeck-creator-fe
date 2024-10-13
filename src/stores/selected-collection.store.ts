import { writable } from "svelte/store";
import type { UserIconCollection } from "../models/UserIconCollection";
import type { UserIcon } from "../models/UserIcon";

function createSelectedCollectionStore() {
    const { subscribe, set, update } = writable<UserIconCollection | null>(null);

    return {
        subscribe,
        selectCollection: (collection: UserIconCollection) => set(collection),
        addIconToCollection: (icon: UserIcon) => {
            update((collection) => {
                if (!collection) {
                    throw new Error('No collection selected');
                }

                collection.icons.push(icon);
                return collection;
            });
        },
        updateIconFromCollection: (icon: UserIcon) => {
            update((collection) => {
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
        },
        addIconToSelectedCollection: (icon: UserIcon) => {
            update((collection) => {
                if (!collection) {
                    throw new Error('No collection selected');
                }

                collection.icons.push(icon);
                return collection;
            });
        },
        updateIconFromSelectedCollection: (icon: UserIcon) => {
            update((collection) => {
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
    };
}

export const selectedCollection = createSelectedCollectionStore();