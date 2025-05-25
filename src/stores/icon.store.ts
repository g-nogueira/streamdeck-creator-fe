import { writable } from "svelte/store";
import type { Icon } from "../models/Icon";
import { IconService } from "../services/icon.service";

/**
 * Creates a store for managing the global list of available icons
 * Handles fetching, searching, and CRUD operations for icons
 */
function createIconStore() {
	const { subscribe, set, update } = writable<Icon[]>([]);

	// Initial load of icons
	IconService.fetchList().then(set);

	return {
		subscribe,
		/**
		 * Adds a new icon to the store
		 * @param icon Icon to add
		 */
		addIcon: (icon: Icon) => update(icons => [...icons, icon]),

		/**
		 * Updates an existing icon in the store
		 * @param iconId ID of the icon to update
		 * @param updatedIcon Updated icon data
		 * @throws {Error} If icon is not found
		 */
		updateIcon: (iconId: string, updatedIcon: Icon) =>
			update(icons => {
				const iconIndex = icons.findIndex(icon => icon.id === updatedIcon.id);

				if (iconIndex === -1)
					throw new Error(`Icon with ID ${updatedIcon.id} not found in collection with ID ${iconId}`);

				icons[iconIndex] = updatedIcon;
				return icons;
			}),

		/**
		 * Removes an icon from the store
		 * @param id ID of the icon to remove
		 */
		removeIcon: (id: string) => update(icons => icons.filter(icon => icon.id !== id)),

		/**
		 * Updates an existing icon or adds a new one if it doesn't exist
		 * @param icon Icon to upsert
		 */
		upsertIcon: (icon: Icon) =>
			update(icons => {
				const iconIndex = icons.findIndex(c => c.id === icon.id);

				if (iconIndex === -1) {
					icons.push(icon);
				} else {
					icons[iconIndex] = icon;
				}

				return icons;
			}),

		/**
		 * Searches for icons based on a search term
		 * @param searchTerm Term to search for
		 */
		search: async (searchTerm: string) => {
			const icons = await IconService.search(searchTerm);
			set(icons);
		},

		/**
		 * Clears all icons from the store
		 */
		setEmpty: () => set([]),

		/**
		 * Reloads the default icon list
		 */
		loadDefault: () => IconService.fetchList().then(set),
		
		set
	};
}

export const icons = createIconStore();
