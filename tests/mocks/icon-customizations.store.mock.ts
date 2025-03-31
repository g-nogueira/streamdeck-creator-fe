import { get, writable } from "svelte/store";
import { vi } from "vitest";
import { mkEmpty, type CustomizableIcon } from "../../src/models/CustomizableIcon";

function createIconPreviewStore() {
    const { subscribe, set } = writable<CustomizableIcon>(mkEmpty());

    return {
        subscribe,
        set: vi.fn(),
        update: vi.fn(),
        selectSvgIcon: vi.fn(),
        selectImageIcon: vi.fn(),
        setIconTitle: vi.fn(),
        upsertStyles: vi.fn(),
        setSvgFillColor: vi.fn(),
        setUseGradient: vi.fn(),
        upsertGradient: vi.fn(),
        addGradientStop: vi.fn(),
        updateGradientStopPosition: vi.fn(),
        updateGradientStopColor: vi.fn(),
        setGradientType: vi.fn(),
        recalculateGradientCss: vi.fn(),
        removeGradientStop: vi.fn(),
        mockGetSubscribeValue: () => get({subscribe}),
        mockSetSubscribeValue: (value: CustomizableIcon): void => set(value)
    };
}

export const customizedIcon = createIconPreviewStore();