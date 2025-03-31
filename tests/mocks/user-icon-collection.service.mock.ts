import { vi } from 'vitest';

const mockIconCollection = (id: string, name: string, icons: { id: string, name: string, origin: string }[]) => ({
    id,
    name,
    icons,
});

const mockIcons = [
    { id: 'icon1', name: 'Icon 1', origin: 'mdi' },
    { id: 'icon2', name: 'Icon 2', origin: 'mdi' },
];

export class UserIconCollectionService {
    static update = vi.fn().mockResolvedValue(mockIconCollection('1', 'Updated Collection 1', mockIcons));
    static delete = vi.fn().mockResolvedValue(true);
    static addUserIcon = vi.fn().mockResolvedValue('icon1');
    static fetchById = vi.fn().mockResolvedValue(mockIconCollection('1', 'Collection 1', mockIcons));
    static fetchList = vi.fn().mockResolvedValue([
        mockIconCollection('1', 'Collection 1', mockIcons),
        mockIconCollection('2', 'Collection 2', [
            { id: 'icon3', name: 'Icon 3', origin: 'mdi' },
            { id: 'icon4', name: 'Icon 4', origin: 'mdi' },
        ]),
    ]);
    static create = vi.fn().mockResolvedValue('3');
    static download = vi.fn().mockResolvedValue(undefined);
}