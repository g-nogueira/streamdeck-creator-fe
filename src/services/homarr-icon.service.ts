import type { Icon } from "../models/Icon";
import * as _iconDto from "./dto/IconDto";

// Using jsDelivr CDN as recommended in the docs
export const HOMARR_API_URL = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons";
export const HOMARR_METADATA_URL = "https://raw.githubusercontent.com/homarr-labs/dashboard-icons/main";

interface HomarrIconMetadata {
    [key: string]: {
        base: "svg" | "png";
        aliases: string[];
        categories: string[];
        update: {
            timestamp: string;
            author: {
                id: number;
                name?: string;
                login?: string;
            }
        };
        colors?: {
            dark?: string;
            light?: string;
        };
    }
}

export class HomarrIconService {
    private static async fetchIconMetadata(): Promise<HomarrIconMetadata> {
        // We still use the raw GitHub URL for metadata since it's more frequently updated
        const response = await fetch(`${HOMARR_METADATA_URL}/metadata.json`);
        if (!response.ok) {
            throw new Error("Failed to fetch Homarr icons metadata");
        }
        return response.json();
    }

    private static getIconPath(iconName: string, metadata: HomarrIconMetadata): string {
        const iconInfo = metadata[iconName];
        if (!iconInfo) {
            throw new Error(`Icon not found: ${iconName}`);
        }
        return `${iconInfo.base}/${iconName}.${iconInfo.base}`;
    }

    static async fetchList(): Promise<Icon[]> {
        try {
            const metadata = await this.fetchIconMetadata();
            return Object.entries(metadata).map(([name, info]) => ({
                id: name,
                label: name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                keywords: [...info.aliases, ...info.categories],
                origin: "homarr",
                contentType: info.base === "svg" ? "image/svg+xml" : "image/png"
            }));
        } catch (error) {
            console.error("Error fetching Homarr icons:", error);
            throw error;
        }
    }

    static async search(searchTerm: string): Promise<Icon[]> {
        try {
            const metadata = await this.fetchIconMetadata();
            const normalizedSearch = searchTerm.toLowerCase();
            
            return Object.entries(metadata)
                .filter(([name, info]) => 
                    name.toLowerCase().includes(normalizedSearch) ||
                    info.aliases.some(alias => alias.toLowerCase().includes(normalizedSearch))
                    // || info.categories.some(category => category.toLowerCase().includes(normalizedSearch))
                )
                .map(([name, info]) => ({
                    id: name,
                    label: name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                    keywords: [...info.aliases, ...info.categories],
                    origin: "homarr",
                    contentType: info.base === "svg" ? "image/svg+xml" : "image/png"
                }));
        } catch (error) {
            console.error("Error searching Homarr icons:", error);
            throw error;
        }
    }

    static async fetchIconWithContentType(iconId: string): Promise<[string, string]> {
        try {
            const metadata = await this.fetchIconMetadata();
            const iconInfo = metadata[iconId];
            if (!iconInfo) {
                throw new Error(`Homarr icon not found: ${iconId}`);
            }

            const iconPath = this.getIconPath(iconId, metadata);
            const response = await fetch(`${HOMARR_API_URL}/${iconPath}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch Homarr icon: ${iconId}`);
            }

            const content = await response.text();
            return [content, iconInfo.base === "svg" ? "image/svg+xml" : "image/png"];
        } catch (error) {
            console.error("Error fetching Homarr icon:", error);
            throw error;
        }
    }
}