import { describe, it, expect, vi, beforeEach } from "vitest";
import { HomarrIconService } from "../../services/homarr-icon.service";

describe("HomarrIconService", () => {
    const mockMetadata = [
        {
            id: "homarr-1",
            name: "App Icon 1",
            tags: ["app", "test"],
            path: "icons/app-icon-1.svg"
        },
        {
            id: "homarr-2",
            name: "App Icon 2",
            tags: ["app", "sample"],
            path: "icons/app-icon-2.svg"
        }
    ];

    beforeEach(() => {
        global.fetch = vi.fn();
    });

    it("fetches and transforms icon list correctly", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockMetadata)
        });

        const icons = await HomarrIconService.fetchList();

        expect(icons).toHaveLength(2);
        expect(icons[0]).toEqual({
            id: "homarr-1",
            label: "App Icon 1",
            keywords: ["app", "test"],
            origin: "homarr",
            contentType: "image/svg+xml"
        });
    });

    it("searches icons correctly", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockMetadata)
        });

        const icons = await HomarrIconService.search("test");

        expect(icons).toHaveLength(1);
        expect(icons[0].id).toBe("homarr-1");
    });

    it("fetches icon SVG content correctly", async () => {
        const mockSvgContent = "<svg>test</svg>";
        
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockMetadata)
            })
            .mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(mockSvgContent)
            });

        const [content, contentType] = await HomarrIconService.fetchIconWithContentType("homarr-1");

        expect(content).toBe(mockSvgContent);
        expect(contentType).toBe("image/svg+xml");
    });

    it("throws error when icon is not found", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockMetadata)
        });

        await expect(HomarrIconService.fetchIconWithContentType("non-existent")).rejects.toThrow("Homarr icon not found");
    });
});