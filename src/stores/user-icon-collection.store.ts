import { writable } from "svelte/store";
import type { UserIconCollection } from "../models/UserIconCollection";
import * as _userIconCollection from "../models/UserIconCollection";
import { UserIconCollectionDBService } from "../services/user-icon-collection-indexeddb.service"; // Import the service
import { selectedCollection } from "./selected-collection.store";

/**
 * Creates a store for managing user icon collections
 * Initializes with data from IndexedDB and maintains sync with it
 */
function createCollectionsStore() {
	const { subscribe, set } = writable<UserIconCollection[]>([]);

	// Initial load and setup default collection
	UserIconCollectionDBService.getList().then(set).then(selectedCollection.selectDefault);
	
	// Subscribe to IndexedDB changes to keep store in sync
	const unsubscribe = UserIconCollectionDBService.subscribe(set);

	return {
		subscribe,
		set
	};
}

export const userIconCollections = createCollectionsStore();
