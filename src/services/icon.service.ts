import { UUID } from "$lib";
import { iconsEndpoint, userCollectionEndpoint } from "../constants";
import type { UserIcon } from "../models/UserIcon";
import type { UserIconCollectionDto } from "./dto/UserIconCollectionDto";
import * as _userIconDto from "./dto/UserIconDto";

export class IconService {
    static async searchIcons(searchTerm: string): Promise<UserIcon[]> {
        try {
            const response = await fetch(`${iconsEndpoint}/search?searchTerm=${encodeURIComponent(searchTerm)}`);

            if (!response.ok) {
                throw new Error('Failed to search icons with term: ' + searchTerm);
            }

            const icons: UserIcon[] = await response.json();
            return icons;
        } catch (error) {
            console.error('Error searching icons:', error);
            throw error;
        }
    }

    static async fetchUserIcon(userIconCollectionId: string, userIconId: string): Promise<UserIcon> {
      try {
        if (userIconId === UUID.empty || userIconId === '') {
          throw new Error('User icon ID is empty');
        }
  
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
  
    static async fetchIconWithContentType(iconId: string): Promise<[string, string]> {
      try {
        if (iconId === UUID.empty || iconId === '') {
          throw new Error('Icon ID is empty');
        }
  
        const response = await fetch(`${iconsEndpoint}/${iconId}`);
  
        if (!response.ok) {
          throw new Error('Failed to fetch Icon with id: ' + iconId);
        }
  
        const contentType = response.headers.get('Content-Type');
        const iconContent: string = await response.text();
  
        if (!contentType) {
          throw new Error('Failed to get content type.');
        }
  
        return [iconContent, contentType];
      } catch (error) {
        console.error('Error fetching icon:', error);
        throw error;
      }
    }
  
    static mkIconUrl(iconId: string): string {
      return `${iconsEndpoint}/${iconId}`;
    }
  }