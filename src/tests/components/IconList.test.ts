import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import IconList from '../../components/icons/IconList.svelte';
import * as _icon from '../../models/Icon';

const iconsPromise = vi.hoisted(() => import('../mocks/icon.store.mock'));


// Mock the stores
vi.mock('../stores/icon.store', async () => {
    return await iconsPromise;
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('IconList Component', () => {
    it('correctly renders the list of icons in the store', async () => {
        const { icons } = await iconsPromise;
        icons.mockSetSubscribeValue(new Array(50).fill({..._icon.mkEmpty(), }));
        render(IconList);
        
        expect(screen.getAllByTestId('icon-button').length).toEqual(50);
    });
});