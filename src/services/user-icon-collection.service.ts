import { UUID } from "$lib";
import { baseUrl } from "../constants";
import type { UserIconCollection } from "../models/UserIconCollection";
import type { UserIconCollectionDto } from "./dto/UserIconCollectionDto";
import * as _userIconCollecionDto from "./dto/UserIconCollectionDto";

const userCollectionEndpoint = `${baseUrl}/user-icon-collections`;

export class UserIconCollectionService {
	static async fetchById(userIconCollectionId: string): Promise<UserIconCollection> {
		try {
			if (userIconCollectionId === UUID.empty || userIconCollectionId === '') {
				throw new Error('User icon collection ID is empty');
			}

			const response = await fetch(`${userCollectionEndpoint}/${userIconCollectionId}`);

			if (!response.ok) {
				throw new Error('Failed to fetch UserIconCollection with id: ' + userIconCollectionId);
			}

			const userIconCollection: UserIconCollectionDto = await response.json();
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