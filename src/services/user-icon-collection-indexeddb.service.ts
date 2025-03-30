import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import JSZip from 'jszip';
import { UUID } from "$lib";
import { v4 as uuidv4 } from 'uuid';
import type { UserIcon } from "../models/UserIcon";
import type { UserIconCollection } from "../models/UserIconCollection";
import * as _userIconCollectionDto from "./dto/UserIconCollectionDto";
import type { UserIconCollectionDB } from './interfaces/UserIconCollectionDB';
import * as _userIconDto from "./dto/UserIconDto";

const DB_NAME = 'UserIconCollectionDB';
const DB_VERSION = 1;
const COLLECTIONS_STORE = 'userIconCollections';

class UserIconCollectionIndexedDBService {
    private static instance: UserIconCollectionIndexedDBService;
    private db: Promise<IDBPDatabase<UserIconCollectionDB>>;

    private constructor() {
        const that = this;

        this.db = openDB<UserIconCollectionDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                db.createObjectStore(COLLECTIONS_STORE, { keyPath: 'id' });
                that.initializeWithDefaultIfEmpty(db);
            },
        });
    }

    public static getInstance(): UserIconCollectionIndexedDBService {
        if (!UserIconCollectionIndexedDBService.instance) {
            UserIconCollectionIndexedDBService.instance = new UserIconCollectionIndexedDBService();
        }
        return UserIconCollectionIndexedDBService.instance;
    }

    private async getDB() {
        return this.db;
    }

    private async initializeWithDefaultIfEmpty(db: IDBPDatabase<UserIconCollectionDB>): Promise<void> {
        try {
            // Check if the database is empty
            const count = await db.count(COLLECTIONS_STORE);
            
            if (count > 0) return;

            const initialCollection: UserIconCollection = {
                id: "2f9c5e71-a249-4c01-b472-29757d9d69d8",
                name: 'Default Collection',
                icons: [],
            };

            await db.add(COLLECTIONS_STORE, _userIconCollectionDto.fromUserIconCollection(initialCollection));
        } catch (error) {
            console.error('Error initializing IndexedDB:', error);
            throw error;
        }
    }

    async update(userIconCollection: UserIconCollection): Promise<UserIconCollection> {
        try {
            const db = await this.getDB();

            if (userIconCollection.id === UUID.empty || userIconCollection.id === '') {
                throw new Error('User icon collection ID is empty');
            }

            await db.put(COLLECTIONS_STORE, _userIconCollectionDto.fromUserIconCollection(userIconCollection));
            return userIconCollection;
        } catch (error) {
            console.error('Error updating user icon collection in IndexedDB:', error);
            throw error;
        }
    }

    async delete(userIconCollectionId: string): Promise<void> {
        try {
            if (userIconCollectionId === UUID.empty || userIconCollectionId === '') {
                throw new Error('User icon collection ID is empty');
            }

            const db = await this.getDB();
            await db.delete(COLLECTIONS_STORE, userIconCollectionId);
            await this.initializeWithDefaultIfEmpty(db);

        } catch (error) {
            console.error('Error deleting user icon collection from IndexedDB:', error);
            throw error;
        }
    }

    async addUserIcon(icon: UserIcon, userIconCollectionId: string): Promise<string> {
        try {
            const db = await this.getDB();

            // Invalid Collection Guid?
            if (userIconCollectionId === UUID.empty || userIconCollectionId === '') {
                throw new Error('User icon collection ID is empty');
            }

            // Empty Icon Guid?
            if (icon.id === UUID.empty || icon.id === '') {
                icon.id = uuidv4();
            }

            // Collection exists?
            const collection = await db.get(COLLECTIONS_STORE, userIconCollectionId);
            if (!collection) {
                throw new Error('User icon collection not found');
            }

            // Already exists?
            const existingIcon = await this.tryGetIconById(userIconCollectionId, icon.id);
            if (existingIcon[0] === true) {
                throw new Error('User icon with this ID already exists in the collection');
            }

            collection.icons.push(_userIconDto.fromUserIcon(icon));
            await db.put(COLLECTIONS_STORE, collection);
            return icon.id;
        } catch (error) {
            console.error('Error adding user icon to collection in IndexedDB:', error);
            throw error;
        }
    }

    async fetchById(userIconCollectionId: string): Promise<UserIconCollection> {
        try {
            const db = await this.getDB();
            const collection = await db.get(COLLECTIONS_STORE, userIconCollectionId);
            if (!collection) {
                throw new Error('User icon collection not found');
            }
            return _userIconCollectionDto.toUserIconCollection(collection);
        } catch (error) {
            console.error('Error fetching user icon collection from IndexedDB:', error);
            throw error;
        }
    }

    async fetchList(): Promise<UserIconCollection[]> {
        try {
            const db = await this.getDB();            
            await this.initializeWithDefaultIfEmpty(db);

            const collections = await db.getAll(COLLECTIONS_STORE);

            return collections.map(_userIconCollectionDto.toUserIconCollection);
        } catch (error) {
            console.error('Error fetching user icon collections from IndexedDB:', error);
            throw error;
        }
    }

    async create(userIconCollection: UserIconCollection): Promise<string> {
        try {
            const db = await this.getDB();

            // Invalid Guid?
            if (userIconCollection.id === UUID.empty || userIconCollection.id === '')
                userIconCollection.id = uuidv4();

            // Already exists?
            const existingCollection = await db.get(COLLECTIONS_STORE, userIconCollection.id);
            if (existingCollection) {
                throw new Error('User icon collection with this ID already exists');
            }

            await db.add(COLLECTIONS_STORE, _userIconCollectionDto.fromUserIconCollection(userIconCollection));
            return userIconCollection.id;
        } catch (error) {
            console.error('Error creating user icon collection in IndexedDB:', error);
            throw error;
        }
    }

    async download(userIconCollectionId: string): Promise<void> {
        try {
            const db = await this.getDB();
            const collection = await db.get(COLLECTIONS_STORE, userIconCollectionId);
            if (!collection) {
                throw new Error('User icon collection not found');
            }

            const zip = new JSZip();
            const folder = zip.folder(collection.name);

            for (const icon of collection.icons) {
                const response = await fetch(icon.pngData);
                if (!response.ok) {
                    throw new Error(`Failed to fetch icon with id: ${icon.id}`);
                }
                const blob = await response.blob();
                folder!.file(`${icon.label}.png`, blob);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const url = window.URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${collection.name}.zip`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading user icon collection from IndexedDB:', error);
            throw error;
        }
    }

    async getIconById(userIconCollectionId: string, userIconId: string): Promise<UserIcon> {
        try {
            if (userIconId === UUID.empty || userIconId === '') {
                throw new Error('User icon ID is empty');
            }

            const db = await this.getDB();
            const collection = await db.get(COLLECTIONS_STORE, userIconCollectionId);
            if (!collection) {
                throw new Error('User icon collection not found');
            }

            const userIconDto = collection.icons.find((icon) => icon.id === userIconId);
            if (!userIconDto) {
                throw new Error('Failed to find UserIcon with id: ' + userIconId);
            }

            return _userIconDto.toUserIcon(userIconDto);
        } catch (error) {
            console.error('Error fetching user icon from IndexedDB:', error);
            throw error;
        }
    }

    async tryGetIconById(userIconCollectionId: string, userIconId: string): Promise<[boolean, UserIcon | null]> {
        try {
            let icon = await this.getIconById(userIconCollectionId, userIconId);

            return [true, icon];
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'User icon collection not found' || error.message === 'Failed to find UserIcon with id: ' + userIconId) {
                    return [false, null];
                }
            }
            console.error('Error fetching user icon from IndexedDB:', error);
            throw error;
        }
    }
}

export const UserIconCollectionDBService = UserIconCollectionIndexedDBService.getInstance();