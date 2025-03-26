import { get, writable } from "svelte/store";
import type { UserIconCollection } from "../models/UserIconCollection";
import type { UserIcon } from "../models/UserIcon";
import * as _userIconCollection from "../models/UserIconCollection";
import { UserIconCollectionDBService } from "../services/user-icon-collection-indexeddb.service"; // Import the service
import { UUID } from "$lib";
import { selectedCollection } from "./selected-collection.store";

function createCollectionsStore() {
    
    const { subscribe, set, update } = writable<UserIconCollection[]>([]);
    
    UserIconCollectionDBService.fetchList().then(set);

    /**
     * Add a new collection to the store
     * @param newCollection The new collection to add
     * @returns The new collection with its ID
     */
    async function addCollection(newCollection: UserIconCollection) {
        newCollection.id = await UserIconCollectionDBService.create(newCollection);

        update(collections => [...collections, newCollection]);

        return newCollection;
    }

    /**
     * Get a collection by ID or throw an error if not found
     * @param collectionId 
     * @returns 
     */
    function getCollectionOrThrow(collectionId: string) {
        const collection = get({subscribe}).find(c => c.id === collectionId);

        if (!collection) {
            throw new Error(`Collection with ID ${collectionId} not found`);
        }

        return collection;
    }


    return {
        subscribe,
        mkEmpty: () => _userIconCollection.mkEmpty(),
        addIcon: async (collectionId: string, icon: UserIcon) => {

            if (icon.id === UUID.empty) {
                icon.id = await UserIconCollectionDBService.addUserIcon(icon, collectionId);
            }

            update(collections => {
                let collection = collections.find(c => c.id === collectionId);

                if (!collection) throw new Error(`Collection with ID ${collectionId} not found`);

                collection.icons.push(icon);

                return collections;
            });

        },
        removeIcon: async (collectionId: string, iconId: string) => {

            let collection = null

            update(collections => {
                collection = collections.find(c => c.id === collectionId);

                if (!collection) throw new Error(`Collection with ID ${collectionId} not found`);

                collection.icons = collection.icons.filter(icon => icon.id !== iconId);
                return collections;
            });

            if (!collection) throw new Error(`Collection with ID ${collectionId} not found`);

            await UserIconCollectionDBService.update(collection);
        },
        updateIcon: async (collectionId: string, updatedIcon: UserIcon) => {

            let collection = null

            update(collections => {
                collection = collections.find(c => c.id === collectionId);

                if (!collection) throw new Error(`Collection with ID ${collectionId} not found`);

                const iconIndex = collection.icons.findIndex(icon => icon.id === updatedIcon.id);

                if (iconIndex === -1) throw new Error(`Icon with ID ${updatedIcon.id} not found in collection with ID ${collectionId}`);

                collection.icons[iconIndex] = updatedIcon;
                return collections;
            });

            if (!collection) throw new Error(`Collection with ID ${collectionId} not found`);

            await UserIconCollectionDBService.update(collection);
        },
        add: (newCollection: UserIconCollection) => addCollection(newCollection),
        addAndSelectCollection: async (newCollection: UserIconCollection) => {
            const collectition = await addCollection(newCollection);

            selectedCollection.selectCollection(collectition.id);
        },
        update: async (updatedCollection: UserIconCollection) => {

            if (updatedCollection.id === UUID.empty) throw new Error('Collection ID cannot be empty');

            update(collections => {
                const collectionIndex = collections.findIndex(c => c.id === updatedCollection.id);

                if (collectionIndex === -1) throw new Error(`Collection with ID ${updatedCollection.id} not found`);

                collections[collectionIndex] = updatedCollection;
                return collections;
            });

            const collection = getCollectionOrThrow(updatedCollection.id);

            await UserIconCollectionDBService.update(collection);
        },
        removeCollection: async (collectionId: string) => {
            // If the collection is the only one, create a new empty collection
            let shouldCreateNewCollection = get({subscribe}).length === 1;

            if (shouldCreateNewCollection) {
                const newCollection = _userIconCollection.mkEmpty();
                newCollection.id = await UserIconCollectionDBService.create(newCollection);
                
                update(collections => [...collections.filter(c => c.id !== collectionId), newCollection]);
            } else {
                update(collections => collections.filter(c => c.id !== collectionId));
            }
            
            await UserIconCollectionDBService.delete(collectionId);
        },
        set
    };
}

export const userIconCollections = createCollectionsStore();
