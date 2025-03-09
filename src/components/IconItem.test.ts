import { render, fireEvent, screen, getByTestId } from '@testing-library/svelte';
import { describe, it, expect, vi, test, beforeEach } from 'vitest';
import { customizedIcon } from '../stores/icon-customizations.store';
import * as _icon from '../models/Icon';
import * as _iconPreview from '../models/IconPreview';

import IconItem from '../components/IconItem.svelte';
import type { Icon } from '../models/Icon';

// Mock the stores
vi.mock('../stores/icon-customizations.store', () => ({
    customizedIcon: {
        selectIcon: vi.fn(),
    },
}));

/**
 * Utility function that mocks the `IntersectionObserver` API. Necessary for components that rely
 * on it, otherwise the tests will crash. Recommended to execute inside `beforeEach`.
 * @param intersectionObserverMock - Parameter that is sent to the `Object.defineProperty`
 * overwrite method. `jest.fn()` mock functions can be passed here if the goal is to not only
 * mock the intersection observer, but its methods.
 * 
 * Code from https://stackoverflow.com/a/58651649/7851973
 */
export function setupIntersectionObserverMock({
    root = null,
    rootMargin = '',
    thresholds = [],
    disconnect = () => null,
    observe = () => null,
    takeRecords = () => [],
    unobserve = () => null,
} = {}): void {
    class MockIntersectionObserver implements IntersectionObserver {
        readonly root: Element | null = root;
        readonly rootMargin: string = rootMargin;
        readonly thresholds: ReadonlyArray<number> = thresholds;
        disconnect: () => void = disconnect;
        observe: (target: Element) => void = observe;
        takeRecords: () => IntersectionObserverEntry[] = takeRecords;
        unobserve: (target: Element) => void = unobserve;
    }

    Object.defineProperty(
        window,
        'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: MockIntersectionObserver
    }
    );

    Object.defineProperty(
        global,
        'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: MockIntersectionObserver
    }
    );
}

beforeEach(() => setupIntersectionObserverMock({ observe: vi.fn() }));

describe('IconItem Component', () => {
    
    const mockIcon = { ..._icon.mkEmpty(), label: "test-icon" } as Icon;
    const getIconButton = () => screen.getByTestId('icon-button');

    it('renders a clickable icon', () => {
        const mdiIcon = { ...mockIcon, origin: 'mdi' } as Icon;
        render(IconItem, { icon: mdiIcon });

        const button = getIconButton();
        const iconName = screen.getByText(mdiIcon.label);

        expect(button).toBeVisible();
        expect(button).toBeEnabled();
        expect(iconName).toBeVisible();
    });

    it('calls selectIcon on icon click', async () => {
        const mdiIcon = { ...mockIcon, id: '1', origin: 'mdi' } as Icon;
        render(IconItem, { icon: mdiIcon });

        const button = getIconButton();

        await fireEvent.click(button);
        expect(customizedIcon.selectIcon).toHaveBeenCalledWith(mdiIcon);
    });

    // it('lazy loads image for streamdeck origin', async () => {
    //     const streamdeckIcon = { ...mockIcon, id: '1', origin: 'streamdeck' } as Icon;
    //     setupIntersectionObserverMock({observe: vi.fn(), takeRecords: () => [{ isIntersecting: true } as never]})
    //     render(IconItem, { icon: streamdeckIcon });
    //     const img = screen.getByTestId("streamdeck-icon-img");

    //     // Simulate intersection
    //     // const observerInstance = IntersectionObserver.mock.instances[0];
    //     // const callback = observerInstance.observe.mock.calls[0][0];
    //     // callback([{ isIntersecting: true }]);

    //     // Verify image source and class
    //     expect(img).toHaveAttribute('src', `${serviceBaseUrl}/icons/${mockIcon.id}`);
    //     await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the next tick
    //     expect(img).toHaveClass('visible');
    //   });
});

describe('IconItem Component - MDI Icon', () => {
    const mockIcon = { ..._icon.mkEmpty(), label: "test-icon", origin: "mdi" } as Icon;
    const getIconButton = () => screen.getByTestId('icon-button');

    it('renders a valid icon glyph', () => {
        const mdiIcon = { ...mockIcon, origin: 'mdi' } as Icon;
        render(IconItem, { icon: mdiIcon });

        const button = getIconButton();
        const iconName = screen.getByText(mdiIcon.label);
        const iconGlyph = screen.getByTestId('mdi-icon');

        // Check if everything is visible
        expect(button).toBeVisible();
        expect(iconName).toBeVisible();
        expect(iconGlyph).toBeVisible();
        // Check if the icon has the correct classes
        expect(iconGlyph).toHaveClass('mdi');
        expect(iconGlyph).toHaveClass(`mdi-${mockIcon.label}`);
    });

    it('DOES NOT render a streamdeck icon', () => {
        const mdiIcon = { ...mockIcon, origin: 'mdi' } as Icon;
        render(IconItem, { icon: mdiIcon });

        const button = getIconButton();
        const iconName = screen.queryByTestId("streamdeck-label");
        const iconGlyph = screen.queryByTestId("streamdeck-icon-img");

        expect(button).toBeVisible();
        expect(iconName).toBeNull();
        expect(iconGlyph).toBeNull();
    });
});