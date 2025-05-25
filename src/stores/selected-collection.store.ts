import { get, writable } from "svelte/store";
import type { UserIconCollection } from "../models/UserIconCollection";
import type { UserIcon } from "../models/UserIcon";
import { userIconCollections } from "./user-icon-collection.store";
import _ from "lodash";
import { DEFAULT_COLLECTION_ID, UserIconCollectionDBService } from "../services/user-icon-collection-indexeddb.service";

/**
 * Creates a store for managing the currently selected icon collection
 * Provides methods for selecting collections and managing icons within them
 */
function createSelectedCollectionStore() {
	const { subscribe, set, update } = writable<UserIconCollection | null>(null);

	return {
		subscribe,

		/**
		 * Selects the default collection as the active collection
		 */
		selectDefault: () => UserIconCollectionDBService.getById(DEFAULT_COLLECTION_ID).then(set),

		/**
		 * Selects a specific collection as the active collection
		 * @param collectionId ID of the collection to select
		 * @throws {Error} If collection is not found
		 */
		selectCollection: (collectionId: string) => {
			const collection = get(userIconCollections).find(c => c.id === collectionId);

			if (!collection) {
				throw new Error(`Collection with ID ${collectionId} not found`);
			}

			set(collection);
		},

		/**
		 * Adds an icon to the currently selected collection
		 * @param icon Icon to add to the collection
		 * @throws {Error} If no collection is selected
		 */
		addIconToSelectedCollection: async (icon: UserIcon) => {
			let selectedCollection = get({ subscribe });

			if (!selectedCollection) {
				throw new Error("No collection selected");
			}

			const updatedCollection = await UserIconCollectionDBService.addIcon(selectedCollection.id, icon).then(() =>
				UserIconCollectionDBService.getById(selectedCollection.id)
			);

			update(_ => updatedCollection);
		}
	};
}

export const selectedCollection = createSelectedCollectionStore();
