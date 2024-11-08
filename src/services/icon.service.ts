import _ from "lodash";
import { iconsEndpoint } from "../constants";
import type { Icon, IconOrigin } from "../models/Icon";
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

    static async fetchIconWithContentType(iconId: string, iconOrigin: IconOrigin): Promise<[string, string]> {
      // File names are case sensitive. Not sure if I'm able to change the behavior, so I'm just going to uppercase the iconId
      try {
        if (iconOrigin === 'mdi') {
          const svgPromise = _.flow(_.toUpper, MdiIconService.fetchSvgData)(iconId);

          return [await svgPromise, 'image/svg+xml'];
        }
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