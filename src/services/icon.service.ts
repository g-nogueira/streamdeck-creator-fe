import _ from "lodash";
import { iconsEndpoint } from "../lib/constants";
import type { Icon, IconOrigin } from "../models/Icon";
import * as _userIconDto from "./dto/UserIconDto";
import { MdiIconService } from "./mdi-icon.service";
import { StreamDeckIconService } from "./streamdeck-icon.service";
import { HomarrIconService } from "./homarr-icon.service";
import { USE_STREAM_DECK_ICONS } from "$lib/feature-flags";

export class IconService {
	static async fetchList(): Promise<Icon[]> {
		try {
			let streamDeckIcons = USE_STREAM_DECK_ICONS() ? await StreamDeckIconService.fetchList() : [];
			let mdiIcons = MdiIconService.fetchList();
			let homarrIcons = await HomarrIconService.fetchList();

			return [...streamDeckIcons, ...mdiIcons, ...homarrIcons];
		} catch (error) {
			console.error("Error fetching icons:", error);
			throw error;
		}
	}

	static async search(searchTerm: string): Promise<Icon[]> {
		try {
			let streamDeckIcons = USE_STREAM_DECK_ICONS() ? await StreamDeckIconService.search(searchTerm) : [];
			let mdiIcons = MdiIconService.search(searchTerm);
			let homarrIcons = await HomarrIconService.search(searchTerm);

			return [...streamDeckIcons, ...mdiIcons, ...homarrIcons];
		} catch (error) {
			console.error("Error searching icons:", error);
			throw error;
		}
	}

	static async fetchSvgIcon(iconId: string, iconOrigin: IconOrigin): Promise<string> {
		try {
			if (iconOrigin === "mdi") {
				const svgPromise = _.flow(_.toUpper, MdiIconService.fetchSvgIcon)(iconId);
				return svgPromise;
			}
			if (iconOrigin === "homarr") {
				return HomarrIconService.fetchSvgIcon(iconId);
			}
			return USE_STREAM_DECK_ICONS()
				? await StreamDeckIconService.fetchIconWithContentType(iconId)
				: Promise.reject("Stream Deck icons are disabled");
		} catch (error) {
			console.error("Error fetching icon:", error);
			throw error;
		}
	}

	static mkIconUrl(iconId: string, iconOrigin: IconOrigin): Promise<string> {
		try {
			if (iconId === "") {
				throw new Error("Icon ID is empty");
			}

			switch (iconOrigin) {
				case "homarr":
					return HomarrIconService.mkIconUrl(iconId);
				default:
					return Promise.reject("Icon origin not supported");
			}
		} catch (error) {
			console.error("Error creating icon URL:", error);
			throw error;
		}
	}
}
