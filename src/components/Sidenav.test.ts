import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi } from 'vitest';
import Sidenav from './Sidenav.svelte';

// Mocks import { DEFAULT_COLLECTION_ID, UserIconCollectionDBService } from "../services/user-icon-collection-indexeddb.service";
vi.mock('../services/user-icon-collection.service', async () => await import('../../tests/user-icon-collection.service.mock'));
vi.mock('../services/user-icon-collection-indexeddb.service', async () => {
    return {
        UserIconCollectionDBService: {
            fetchList: vi.fn().mockResolvedValue([]),
            create: vi.fn().mockResolvedValue('new-collection-id'),
            addUserIcon: vi.fn().mockResolvedValue('new-icon-id'),
            getList: vi.fn().mockResolvedValue([]),
            getById: vi.fn().mockResolvedValue({
                id: 'default-collection-id',
                name: 'Default Collection',
                icons: [],
            }),
            subscribe: vi.fn().mockReturnValue({
                unsubscribe: vi.fn(),
            })
        },
        DEFAULT_COLLECTION_ID: 'default-collection-id',
    }
});

describe('Sidenav', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('displays IconSearch component by default', () => {
        // Arrange & Act
        render(Sidenav);
        const iconSearch = screen.getByTestId('search-field');

        // Assert
        expect(iconSearch).toBeVisible();
    });

    it('displays all available tiles', () => {
        // Arrange & Act
        render(Sidenav);
        const tiles = screen.queryAllByTestId('nav-tile');

        // Assert
        expect(tiles.length).toBe(2);
        expect(tiles[0]).toBeVisible();
        expect(tiles[0]).toHaveTextContent('Icons');
        expect(tiles[1]).toBeVisible();
        expect(tiles[1]).toHaveTextContent('Collections');
    });

    it('switches to CollectionList component when collections tile is clicked', async () => {
        // Arrange
        render(Sidenav);
        const collectionsTile = screen.queryAllByTestId('nav-tile')[1];

        // Act
        await fireEvent.click(collectionsTile);

        // Assert
        expect(screen.getByTestId('accordion')).toBeVisible();
    });

    it('switches back to IconSearch component when icons tile is clicked', async () => {
        // Arrange
        render(Sidenav);
        const collectionsTile = screen.getByText('Collections');

        // Act
        await fireEvent.click(collectionsTile);
        const iconsTile = screen.getByText('Icons');
        await fireEvent.click(iconsTile);

        // Assert
        expect(screen.getByTestId('search-field')).toBeVisible();
    });
});