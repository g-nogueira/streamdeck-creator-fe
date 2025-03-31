import { get, writable } from "svelte/store";
import type { UserIconCollection } from "../models/UserIconCollection";
import type { UserIcon } from "../models/UserIcon";
import { userIconCollections } from "./user-icon-collection.store";
import _ from "lodash";
import { DEFAULT_COLLECTION_ID, UserIconCollectionDBService } from "../services/user-icon-collection-indexeddb.service";

function createSelectedCollectionStore() {
    const { subscribe, set, update } = writable<UserIconCollection | null>(null);

    return {
        subscribe,
        selectDefault: () => UserIconCollectionDBService.getById(DEFAULT_COLLECTION_ID).then(set),

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

            const updatedCollection = 
                await UserIconCollectionDBService
                    .addIcon(selectedCollection.id, icon)
                    .then(() => UserIconCollectionDBService.getById(selectedCollection.id))

            update(_ => updatedCollection);
        },
    };
}

export const selectedCollection = createSelectedCollectionStore();