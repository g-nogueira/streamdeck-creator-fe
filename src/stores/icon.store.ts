import { writable } from "svelte/store";
import type { Icon } from "../models/Icon";
import { IconService } from "../services/icon.service";

// export const icons = writable<Icon[]>([]);
function createIconStore() {
    const { subscribe, set, update } = writable<Icon[]>([]);

    IconService.fetchList().then(set);

    return {
        subscribe,
        addIcon: (icon: Icon) => update(icons => [...icons, icon]),
        updateIcon: (iconId: string, updatedIcon: Icon) => update(icons => {
            const iconIndex = icons.findIndex(icon => icon.id === updatedIcon.id);

            if (iconIndex === -1) throw new Error(`Icon with ID ${updatedIcon.id} not found in collection with ID ${iconId}`);

            icons[iconIndex] = updatedIcon;
            return icons;
        }),
        removeIcon: (id: string) => update(icons => icons.filter(icon => icon.id !== id)),
        upsertIcon: (icon: Icon) => update(icons => {
            const iconIndex = icons.findIndex(c => c.id === icon.id);

            if (iconIndex === -1) {
                icons.push(icon);
            } else {
                icons[iconIndex] = icon;
            }

            return icons;
        }),
        search: async (searchTerm: string) => {
            const icons = await IconService.search(searchTerm);
            set(icons);
        },
        setEmpty: () => set([]),
        loadDefault: () => IconService.fetchList().then(set),
        set
    };
}

export const icons = createIconStore();