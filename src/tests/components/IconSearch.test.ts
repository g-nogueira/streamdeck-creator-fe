import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import IconList from "../../components/icons/IconList.svelte";

describe("IconList", () => {
    it("renders the list of icons", () => {
        const mockIcons = [
            { id: "icon1", label: "Icon 1", origin: "mdi" },
            { id: "icon2", label: "Icon 2", origin: "streamdeck" }
        ] as any[];
        const mockOnSelectIcon = vi.fn();

        render(IconList, {
            icons: mockIcons,
            onSelectIcon: mockOnSelectIcon
        });

        expect(screen.getAllByTestId("icon-button").length).toBe(2);
    });

    it("calls onSelectIcon when an icon is clicked", async () => {
        const mockIcons = [{ id: "icon1", label: "Icon 1", origin: "mdi" }] as any[];
        const mockOnSelectIcon = vi.fn();

        const { getByTestId } = render(IconList, {
            icons: mockIcons,
            onSelectIcon: mockOnSelectIcon
        });

        const button = getByTestId("icon-button");
        await fireEvent.click(button);

        expect(mockOnSelectIcon).toHaveBeenCalledWith(mockIcons[0]);
    });
});