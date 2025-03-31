import * as UUID from "$lib/utils/uuid";
import { userCollectionEndpoint } from "../constants";
import type { UserIcon } from "../models/UserIcon";
import type { UserIconCollection } from "../models/UserIconCollection";
import type { UserIconCollectionDto } from "./dto/UserIconCollectionDto";
import * as _userIconCollecionDto from "./dto/UserIconCollectionDto";

export class UserIconCollectionService {
	static async update(userIconCollection: UserIconCollection): Promise<UserIconCollection> {
		try {
			const response = await fetch(`${userCollectionEndpoint}/${userIconCollection.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(_userIconCollecionDto.fromUserIconCollection(userIconCollection)),
			});

			if (!response.ok) {
				throw new Error('Failed to update UserIconCollection with id: ' + userIconCollection.id);
			}

			return _userIconCollecionDto.toUserIconCollection(await response.json());
		} catch (error) {
			console.error('Error updating user icon collection:', error);
			throw error;
		}
	}

	static async delete(userIconCollectionId: string): Promise<void> {
		try {
			if (userIconCollectionId === UUID.empty || userIconCollectionId === '') {
				throw new Error('User icon collection ID is empty');
			}

			const response = await fetch(`${userCollectionEndpoint}/${userIconCollectionId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete UserIconCollection with id: ' + userIconCollectionId);
			}
		} catch (error) {
			console.error('Error deleting user icon collection:', error);
			throw error;
		}
	}

	/**
	 * Adds a user icon to a collection
	 * @param icon 
	 * @param userIconCollectionId 
	 * @returns The ID of the added icon
	 */
	static async addUserIcon(icon: UserIcon, userIconCollectionId: string): Promise<string> {
		try {
			if (userIconCollectionId === UUID.empty || userIconCollectionId === '') {
				throw new Error('User icon collection ID is empty');
			}

			const response = await fetch(`${userCollectionEndpoint}/${userIconCollectionId}/icons`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(icon),
			});

			if (!response.ok) {
				throw new Error('Failed to add UserIcon to UserIconCollection with id: ' + userIconCollectionId);
			}

			return await response.json() as string;
		} catch (error) {
			console.error('Error adding user icon to collection:', error);
			throw error;
		}
	}

	static async fetchById(userIconCollectionId: string): Promise<UserIconCollection> {
		try {
			if (userIconCollectionId === UUID.empty || userIconCollectionId === '') {
				throw new Error('User icon collection ID is empty');
			}

			const response = await fetch(`${userCollectionEndpoint}/${userIconCollectionId}`);

			if (!response.ok) {
				throw new Error('Failed to fetch UserIconCollection with id: ' + userIconCollectionId);
			}

			const userIconCollection = await response.json() as UserIconCollectionDto;
			return _userIconCollecionDto.toUserIconCollection(userIconCollection);
		} catch (error) {
			console.error('Error fetching user icon collection:', error);
			throw error;
		}
	}

	static async fetchList(): Promise<UserIconCollection[]> {
		try {
			const response = await fetch(`${userCollectionEndpoint}`);

			if (!response.ok) {
				throw new Error('Failed to fetch UserIconCollections');
			}

			const userIconCollections: UserIconCollectionDto[] = await response.json();
			return userIconCollections.map(_userIconCollecionDto.toUserIconCollection);
		} catch (error) {
			console.error('Error fetching user icon collections:', error);
			throw error;
		}
	}

	static async create(userIconCollection: UserIconCollection): Promise<string> {
		try {
			const response = await fetch(`${userCollectionEndpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(_userIconCollecionDto.fromUserIconCollection(userIconCollection)),
			});

			if (!response.ok) {
				throw new Error('Failed to create UserIconCollection');
			}

			return await response.json();
		} catch (error) {
			console.error('Error creating user icon collection:', error);
			throw error;
		}
	}

	static async download(userIconCollectionId: string): Promise<void> {
		try {
			const response = await fetch(`${userCollectionEndpoint}/${userIconCollectionId}/download`);

			if (!response.ok) {
				throw new Error('Failed to download UserIconCollection with id: ' + userIconCollectionId);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'user-icon-collection.zip';
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading user icon collection:', error);
			throw error;
		}
	}
}