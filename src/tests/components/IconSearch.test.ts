import { act, fireEvent, render, screen } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach } from "vitest";
import IconSearch from "../../components/icons/IconSearch.svelte";
import { setupIntersectionObserverMock } from "../utils/interceptionObserverHelper";
import { flushPromises } from "../utils/flushPromises";

beforeEach(() => setupIntersectionObserverMock({ observe: vi.fn() }));

describe("IconSearch", () => {
    it("calls onSearchIcons when the search input changes", async () => {
        const mockOnSearchIcons = vi.fn();
        const mockIcons = [{ id: "icon1", label: "Icon 1", origin: "mdi" }] as any[];

        render(IconSearch, {
            icons: mockIcons,
            onSearchIcons: mockOnSearchIcons,
            onLoadDefaultIcons: vi.fn(),
            onSetEmptyIcons: vi.fn(),
            onSelectIcon: vi.fn(),
            debounceTimeMs: 0
        });

        const searchInput = screen.getByTestId("search-field");
        await act(() => fireEvent.input(searchInput, { target: { value: "test" } }));
        await flushPromises();


        expect(mockOnSearchIcons).toHaveBeenCalledWith("test");
    });

    it("calls onSelectIcon when an icon is clicked", async () => {
        const mockOnSelectIcon = vi.fn();
        const mockIcons = [{ id: "icon1", label: "Icon 1", origin: "mdi" }] as any[];

        render(IconSearch, {
            icons: mockIcons,
            onSearchIcons: vi.fn(),
            onLoadDefaultIcons: vi.fn(),
            onSetEmptyIcons: vi.fn(),
            onSelectIcon: mockOnSelectIcon
        });

        const iconButton = screen.getByTestId("icon-button");
        await fireEvent.click(iconButton);

        expect(mockOnSelectIcon).toHaveBeenCalledWith(mockIcons[0]);
    });
});