import { writable } from "svelte/store";
import { vi } from "vitest";
import type { UserIconCollection } from "../../models/UserIconCollection";

function createSelectedCollectionStore() {
	const { subscribe } = writable<UserIconCollection | null>(null);

	return {
		subscribe,
		selectDefault: vi.fn(),
		selectCollection: vi.fn(),
		addIconToSelectedCollection: vi.fn(),
	};
}

export const selectedCollection = createSelectedCollectionStore();
