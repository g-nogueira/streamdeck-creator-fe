import { getWeight } from "$lib/utils/mdi-search";
import mdiIcons from "../assets/icons.min.json"; // Assuming you have a JSON file with MDI icons
import type { MdiIcon } from "../models/MdiIcon";
import * as _mdiIcon from "../models/MdiIcon";
import type { Icon } from "../models/Icon";

const filters = { flavour: "light", outline: "both" } as { flavour: "default" | "light"; outline: "both" | "outline" };
const searchReplaceRegex = new RegExp("-", "g");

export class MdiIconService {
	/**
	 * Fetches a list of MDI icons.
	 * @returns An array of Icon objects.
	 */
	static fetchList(): Icon[] {
		const frozenIcons = Object.freeze(mdiIcons.icons) as { default: MdiIcon[]; light: MdiIcon[] };
		// Returns only the first 100 icons
		const icons = frozenIcons.light.slice(0, 100);

		return icons.map(_mdiIcon.toIcon);
	}

	static async fetchSvgIcon(iconId: string): Promise<string> {
		try {
			const icon = await fetch(`/data/svg/${iconId}.svg`).then(res => res.text());

			if (!icon) {
				throw new Error("Icon not found");
			}

			return icon;
		} catch (error) {
			console.error("Error fetching icon:", error);
			throw error;
		}
	}

	/**
	 * Searches for MDI icons based on the specified search term.
	 * @param searchTerm The search term to use.
	 * @returns An array of UserIcon objects.
	 * @see https://github.com/Pictogrammers/Browser-Icon-Picker/blob/f1094bde006d29bc180b016abb4fcfd86555ab42/src/App.vue#L372
	 */
	static search(searchTerm: string): Icon[] {
		const frozenIcons = Object.freeze(mdiIcons.icons) as { default: MdiIcon[]; light: MdiIcon[] };
		// Sanitize search val
		const searchVal = searchTerm.replace(searchReplaceRegex, " ").trim().toLowerCase();

		let icons = [...frozenIcons.default, ...frozenIcons.light];

		// Exclude non-matching filters
		// if (filters.outline !== 'both') {
		//     icons = icons.filter(icon => icon.family === 'light' || icon.name.includes('outline'));
		// }

		if (searchVal.length > 0) {
			const searchValWords = searchVal.split(" ");

			// Build weighted result list
			const results = icons
				.map(icon => ({
					weight: getWeight(icon, searchVal, searchValWords),
					icon
				}))
				// Filter-out non-matching results
				.filter(icon => icon.weight > 0) as Array<{ weight: number; icon: MdiIcon }>;

			// Sort by weight & name
			results.sort((r1, r2) => {
				if (r1.weight < r2.weight) {
					return 1;
				}
				if (r1.weight > r2.weight) {
					return -1;
				}
				return r1.icon.name.localeCompare(r2.icon.name);
			});

			icons = results.map(r => r.icon);
		}

		// Chunk (by rows of 6)
		return icons.map(_mdiIcon.toIcon);
	}
}
