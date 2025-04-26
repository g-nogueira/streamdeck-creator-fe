import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { HomarrIconService, HOMARR_API_URL, HOMARR_METADATA_URL } from "../../services/homarr-icon.service";

describe("HomarrIconService", () => {
    const mockMetadata = {
        "app-icon-1": {
            base: "svg" as const,
            aliases: ["app", "icon", "test"],
            categories: ["app", "test"],
            update: {
                timestamp: "2025-04-26T12:00:00Z",
                author: {
                    id: 1,
                    name: "Test Author",
                    login: "testauthor"
                }
            },
            colors: {
                dark: "#000000",
                light: "#FFFFFF"
            }
        },
        "app-icon-2": {
            base: "png" as const,
            aliases: ["app", "sample"],
            categories: ["app", "test"],
            update: {
                timestamp: "2025-04-26T12:00:00Z",
                author: {
                    id: 2,
                    login: "testauthor2"
                }
            }
        }
    };

    beforeEach(() => {
        global.fetch = vi.fn();
    });

    it("fetches and transforms icon list correctly", async () => {
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockMetadata)
        });

        const icons = await HomarrIconService.fetchList();

        expect(icons).toHaveLength(2);
        expect(icons[0]).toEqual({
            id: "app-icon-1",
            label: "App Icon 1",
            keywords: ["app", "icon", "test", "app", "test"],
            origin: "homarr",
            contentType: "image/svg+xml"
        });
        expect(icons[1]).toEqual({
            id: "app-icon-2",
            label: "App Icon 2",
            keywords: ["app", "sample", "app", "test"],
            origin: "homarr",
            contentType: "image/png"
        });
    });

    it("searches icons by name correctly", async () => {
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockMetadata)
        });

        const icons = await HomarrIconService.search("icon");
        expect(icons).toHaveLength(2);
        expect(icons.map(i => i.id)).toEqual(["app-icon-1", "app-icon-2"]);
    });

    it("searches icons by alias correctly", async () => {
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockMetadata)
        });

        const icons = await HomarrIconService.search("sample");
        expect(icons).toHaveLength(1);
        expect(icons[0].id).toBe("app-icon-2");
    });

    it("fetches SVG icon content correctly", async () => {
        const mockSvgContent = "<svg>test</svg>";
        
        (global.fetch as Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockMetadata)
            })
            .mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockSvgContent)
            });

        const content = await HomarrIconService.fetchSvgIcon("app-icon-1");
        expect(content).toBe(mockSvgContent);
    });

    it("throws error when icon is not found", async () => {
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockMetadata)
        });

        await expect(HomarrIconService.fetchSvgIcon("non-existent"))
            .rejects.toThrow("Homarr icon not found: non-existent");
    });

    it("handles network failure when fetching metadata", async () => {
        (global.fetch as Mock).mockRejectedValueOnce(new Error("Network error"));

        await expect(HomarrIconService.fetchList())
            .rejects.toThrow("Error fetching Homarr icons");
    });

    it("handles non-OK response when fetching metadata", async () => {
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: "Not Found"
        });

        await expect(HomarrIconService.fetchList())
            .rejects.toThrow("Failed to fetch Homarr icons metadata");
    });

    it("handles malformed metadata response", async () => {
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ invalid: "data" })
        });

        await expect(HomarrIconService.fetchList())
            .rejects.toThrow();
    });

    it("constructs correct icon URLs", async () => {
        (global.fetch as Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockMetadata)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockMetadata)
            });

        const url = await HomarrIconService.mkIconUrl("app-icon-1");
        expect(url).toBe(`${HOMARR_API_URL}/svg/app-icon-1.svg`);

        const pngUrl = await HomarrIconService.mkIconUrl("app-icon-2");
        expect(pngUrl).toBe(`${HOMARR_API_URL}/png/app-icon-2.png`);
    });
});