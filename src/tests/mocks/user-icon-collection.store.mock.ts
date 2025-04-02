import { writable } from "svelte/store";
import type { UserIconCollection } from "../../models/UserIconCollection";
import { vi } from "vitest";

function createCollectionsStore() {
	const { subscribe, set } = writable<UserIconCollection[]>([]);

	return {
		subscribe,
		set: vi.fn()
	};
}

export const userIconCollections = createCollectionsStore();
