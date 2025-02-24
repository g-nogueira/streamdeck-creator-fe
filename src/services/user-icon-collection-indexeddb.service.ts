import { openDB, type DBSchema } from 'idb';
import JSZip from 'jszip';
import { UUID } from "$lib";
import type { UserIcon } from "../models/UserIcon";
import type { UserIconCollection } from "../models/UserIconCollection";
import * as _userIconCollectionDto from "./dto/UserIconCollectionDto";
import type { UserIconCollectionDB } from './interfaces/UserIconCollectionDB';
import * as _userIconDto from "./dto/UserIconDto";

const DB_NAME = 'UserIconCollectionDB';
const DB_VERSION = 1;
const COLLECTIONS_STORE = 'userIconCollections';

export class UserIconCollectionIndexedDBService {
    private static async getDB() {
        return openDB<UserIconCollectionDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                db.createObjectStore(COLLECTIONS_STORE, { keyPath: 'id' });
            },
        });
    }

    static async update(userIconCollection: UserIconCollection): Promise<UserIconCollection> {
        try {
            const db = await this.getDB();
            await db.put(COLLECTIONS_STORE, _userIconCollectionDto.fromUserIconCollection(userIconCollection));
            return userIconCollection;
        } catch (error) {
            console.error('Error updating user icon collection in IndexedDB:', error);
            throw error;
        }
    }

    static async delete(userIconCollectionId: string): Promise<void> {
        try {
            if (userIconCollectionId === UUID.empty || userIconCollectionId === '') {
                throw new Error('User icon collection ID is empty');
            }

            const db = await this.getDB();
            await db.delete(COLLECTIONS_STORE, userIconCollectionId);
        } catch (error) {
            console.error('Error deleting user icon collection from IndexedDB:', error);
            throw error;
        }
    }

    static async addUserIcon(icon: UserIcon, userIconCollectionId: string): Promise<string> {
        try {
            const db = await this.getDB();
            const collection = await db.get(COLLECTIONS_STORE, userIconCollectionId);
            if (!collection) {
                throw new Error('User icon collection not found');
            }

            collection.icons.push(_userIconDto.fromUserIcon(icon));
            await db.put(COLLECTIONS_STORE, collection);
            return icon.id;
        } catch (error) {
            console.error('Error adding user icon to collection in IndexedDB:', error);
            throw error;
        }
    }

    static async fetchById(userIconCollectionId: string): Promise<UserIconCollection> {
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

    static async fetchList(): Promise<UserIconCollection[]> {
        try {
            const db = await this.getDB();
            const collections = await db.getAll(COLLECTIONS_STORE);
            return collections.map(_userIconCollectionDto.toUserIconCollection);
        } catch (error) {
            console.error('Error fetching user icon collections from IndexedDB:', error);
            throw error;
        }
    }

    static async create(userIconCollection: UserIconCollection): Promise<string> {
        try {
            const db = await this.getDB();
            await db.add(COLLECTIONS_STORE, _userIconCollectionDto.fromUserIconCollection(userIconCollection));
            return userIconCollection.id;
        } catch (error) {
            console.error('Error creating user icon collection in IndexedDB:', error);
            throw error;
        }
    }

    static async download(userIconCollectionId: string): Promise<void> {
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

    static async getById(userIconCollectionId: string, userIconId: string): Promise<UserIcon> {
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
}