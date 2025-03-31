import * as UUID from "$lib/utils/uuid";
import { iconsEndpoint } from "../constants";
import type { Icon } from "../models/Icon";
import type { UserIcon } from "../models/UserIcon";
import * as _userIconDto from "./dto/UserIconDto";
import * as _iconDto from "./dto/IconDto";

export class StreamDeckIconService {
    // const response = await fetch(`${serviceBaseUrl}/icons?page=1&pageSize=100`);
          // const data: Icon[] = await response.json();
          // icons.set(data);
    static async fetchList(): Promise<Icon[]> {
        try {
            const response = await fetch(`${iconsEndpoint}?page=1&pageSize=100`);

            if (!response.ok) {
                throw new Error('Failed to fetch icons');
            }

            const icons: Icon[] = await response.json();
            return icons.map(_iconDto.toIcon);
        } catch (error) {
            console.error('Error fetching icons:', error);
            throw error;
        }
    }


    static async search(searchTerm: string): Promise<Icon[]> {
        try {
            const response = await fetch(`${iconsEndpoint}/search?searchTerm=${encodeURIComponent(searchTerm)}`);

            if (!response.ok) {
                throw new Error('Failed to search icons with term: ' + searchTerm);
            }

            const icons: Icon[] = await response.json();
            return icons.map(_iconDto.toIcon);
        } catch (error) {
            console.error('Error searching icons:', error);
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
  }