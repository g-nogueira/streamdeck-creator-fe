import { render } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import IconCustomizer from "../../components/icons/IconCustomizer.svelte";

describe("IconCustomizer", () => {
    it("calls selectSvgIcon when an SVG user icon is provided", async () => {
        const mockSelectSvgIcon = vi.fn();
        const mockCustomizableIcon = {
            userIconId: "123",
            contentType: "image/svg+xml",
            svgContent: "<svg></svg>"
        } as any;

        render(IconCustomizer, {
            customizableIcon: mockCustomizableIcon,
            selectSvgIcon: mockSelectSvgIcon,
            selectImageIcon: vi.fn(),
            setSvgFillColor: vi.fn(),
            fetchIconWithContentType: vi.fn()
        });

        expect(mockSelectSvgIcon).toHaveBeenCalledWith("<svg></svg>");
    });
});