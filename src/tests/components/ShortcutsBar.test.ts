import { render, fireEvent, screen } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ShortcutsBar from "../../components/shortcuts/ShortcutsBar.svelte";

const mockDomUtils = vi.hoisted(() => {
    return {
        downloadIcon: vi.fn(() => Promise.resolve()),
        nodeToBase64Png: vi.fn(() => Promise.resolve("mock-png-data"))
    };
});

vi.mock("../../lib/utils/dom", () => mockDomUtils);

describe("ShortcutsBar", () => {
    beforeEach(() => {
        // Add a mock #iconToCapture element to the DOM
        const mockIconElement = document.createElement("div");
        mockIconElement.id = "iconToCapture";
        document.body.appendChild(mockIconElement);
    });

    afterEach(() => {
        // Clean up the mock #iconToCapture element after each test
        const mockIconElement = document.getElementById("iconToCapture");
        if (mockIconElement) {
            mockIconElement.remove();
        }
    });

    it("calls downloadIcon when the download button is clicked", async () => {
        const mockCustomizableIcon = {
            styles: { label: "Test Icon" }
        } as any;
        const mockOnAddIconToCollection = vi.fn();

        render(ShortcutsBar, {
            customizableIcon: mockCustomizableIcon,
            onAddIconToCollection: mockOnAddIconToCollection
        });

        const downloadButton = screen.getByTestId("download-btn");
        await fireEvent.click(downloadButton);

        expect(mockDomUtils.downloadIcon).toHaveBeenCalledWith(
            expect.any(HTMLElement),
            "Test Icon"
        );
    });

    it("calls onAddIconToCollection when the add button is clicked", async () => {
        const mockCustomizableIcon = {
            styles: { label: "Test Icon" }
        } as any;
        const mockOnAddIconToCollection = vi.fn();

        render(ShortcutsBar, {
            customizableIcon: mockCustomizableIcon,
            onAddIconToCollection: mockOnAddIconToCollection
        });

        const addButton = screen.getByTestId("add-to-collection-btn");
        await fireEvent.click(addButton);

        expect(mockOnAddIconToCollection).toHaveBeenCalledWith(
            mockCustomizableIcon,
            "mock-png-data",
            "mock-png-data" // Thumbnail is the same as PNG in this case
        );
    });
});