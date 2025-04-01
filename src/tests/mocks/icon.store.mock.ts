import { get, writable } from "svelte/store";
import { vi } from "vitest";
import type { Icon } from "../../models/Icon";

function createIconStore() {
	const { subscribe, set } = writable<Icon[]>([]);

	return {
		subscribe,
		addIcon: vi.fn(),
		updateIcon: vi.fn(),
		removeIcon: vi.fn(),
		upsertIcon: vi.fn(),
		search: vi.fn(),
		setEmpty: vi.fn(),
		set: vi.fn(),
		loadDefault: vi.fn(),
		mockGetSubscribeValue: () => get({ subscribe }),
		mockSetSubscribeValue: (value: Icon[]): void => set(value)
	};
}

export const icons = createIconStore();
