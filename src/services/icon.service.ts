import { UUID } from "$lib";
import { iconsEndpoint, userCollectionEndpoint } from "../constants";
import type { Icon } from "../models/Icon";
import type { UserIcon } from "../models/UserIcon";
import type { UserIconCollectionDto } from "./dto/UserIconCollectionDto";
import * as _userIconDto from "./dto/UserIconDto";
import { MdiIconService } from "./mdi-icon.service";
import { StreamDeckIconService } from "./streamdeck-icon.service";

export class IconService {
    static async fetchList(): Promise<Icon[]> {
        try {
            let streamDeckIcons = await StreamDeckIconService.fetchList();
            let mdiIcons = MdiIconService.fetchList();
    
            return [...streamDeckIcons, ...mdiIcons];
        } catch (error) {
            console.error('Error fetching icons:', error);
            throw error;
        }
    }

    static async search(searchTerm: string): Promise<Icon[]> {
        try {
            let streamDeckIcons = await StreamDeckIconService.search(searchTerm);
            let mdiIcons = MdiIconService.search(searchTerm);

            return [...streamDeckIcons, ...mdiIcons];
        } catch (error) {
            console.error('Error searching icons:', error);
            throw error;
        }
    }

    static async fetchIconWithContentType(iconId: string): Promise<[string, string]> {
      try {
        return await StreamDeckIconService.fetchIconWithContentType(iconId);
      } catch (error) {
        console.error('Error fetching icon:', error);
        throw error;
      }
    }
  
    static mkIconUrl(iconId: string): string {
      return `${iconsEndpoint}/${iconId}`;
    }
  }