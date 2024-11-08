import { writable } from "svelte/store";
import type { SelectedIcon } from "../models/SelectedIcon";
import type { IconOrigin } from "../models/Icon";

function createSelectedIconStore() {
    const { subscribe, set, update } = writable<SelectedIcon | null>(null);

    return {
        subscribe,
        selectIcon: (icon: SelectedIcon) => set(icon),
        clear: () => set(null)
    };
}

export const selectedIcon = createSelectedIconStore();