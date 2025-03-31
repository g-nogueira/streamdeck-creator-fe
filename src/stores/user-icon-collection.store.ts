import { writable } from "svelte/store";
import type { UserIconCollection } from "../models/UserIconCollection";
import * as _userIconCollection from "../models/UserIconCollection";
import { UserIconCollectionDBService } from "../services/user-icon-collection-indexeddb.service"; // Import the service
import { selectedCollection } from "./selected-collection.store";

function createCollectionsStore() {
	const { subscribe, set } = writable<UserIconCollection[]>([]);

	UserIconCollectionDBService.getList().then(set).then(selectedCollection.selectDefault);
	// Subscribe to changes in the IndexedDB service
	const unsubscribe = UserIconCollectionDBService.subscribe(set);

	return {
		subscribe,
		set
	};
}

export const userIconCollections = createCollectionsStore();
