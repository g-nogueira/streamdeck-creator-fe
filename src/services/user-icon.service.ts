import { UUID } from "$lib";
import { userCollectionEndpoint } from "../constants";
import type { UserIcon } from "../models/UserIcon";
import type { UserIconCollectionDto } from "./dto/UserIconCollectionDto";
import * as _userIconDto from "./dto/UserIconDto";

export class UserIconService {
    static async getById(userIconCollectionId: string, userIconId: string): Promise<UserIcon> {
        try {
            if (userIconId === UUID.empty || userIconId === '') {
                throw new Error('User icon ID is empty');
            }

            // Fetch the user icon collection
            const response = await fetch(`${userCollectionEndpoint}/${userIconCollectionId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch UserIconCollection with id: ' + userIconCollectionId);
            }

            const userIcon: UserIconCollectionDto = await response.json();
            const userIconDto = userIcon.icons.find((icon) => icon.id === userIconId);

            if (!userIconDto) {
                throw new Error('Failed to find UserIcon with id: ' + userIconId);
            }

            return _userIconDto.toUserIcon(userIconDto);
        } catch (error) {
            console.error('Error fetching user icon:', error);
            throw error;
        }
    }
}