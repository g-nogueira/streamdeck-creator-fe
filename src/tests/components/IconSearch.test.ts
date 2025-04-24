import { act, fireEvent, render, screen } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach } from "vitest";
import IconSearch from "../../components/icons/IconSearch.svelte";
import { setupIntersectionObserverMock } from "../utils/interceptionObserverHelper";
import { flushPromises } from "../utils/flushPromises";

beforeEach(() => setupIntersectionObserverMock({ observe: vi.fn() }));

describe("IconSearch", () => {
    const mockIcons = [
        { id: "mdi1", label: "MDI Icon 1", origin: "mdi" },
        { id: "mdi2", label: "MDI Icon 2", origin: "mdi" },
        { id: "homarr1", label: "Homarr Icon 1", origin: "homarr" },
        { id: "streamdeck1", label: "StreamDeck Icon 1", origin: "streamdeck" }
    ] as any[];

    it("calls onSearchIcons when the search input changes", async () => {
        const mockOnSearchIcons = vi.fn();
        
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

    it("displays icons grouped by origin", () => {
        render(IconSearch, {
            icons: mockIcons,
            onSearchIcons: vi.fn(),
            onLoadDefaultIcons: vi.fn(),
            onSetEmptyIcons: vi.fn(),
            onSelectIcon: vi.fn()
        });

        // Check group headers
        expect(screen.getByText("mdi Icons (2)")).toBeInTheDocument();
        expect(screen.getByText("homarr Icons (1)")).toBeInTheDocument();
        expect(screen.getByText("streamdeck Icons (1)")).toBeInTheDocument();

        // Check icons in each group
        expect(screen.getByText("MDI Icon 1")).toBeInTheDocument();
        expect(screen.getByText("MDI Icon 2")).toBeInTheDocument();
        expect(screen.getByText("Homarr Icon 1")).toBeInTheDocument();
        expect(screen.getByText("StreamDeck Icon 1")).toBeInTheDocument();
    });

    it("shows loading state during search", async () => {
        const mockOnSearchIcons = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
        
        render(IconSearch, {
            icons: [],
            onSearchIcons: mockOnSearchIcons,
            onLoadDefaultIcons: vi.fn(),
            onSetEmptyIcons: vi.fn(),
            onSelectIcon: vi.fn(),
            debounceTimeMs: 0
        });

        const searchInput = screen.getByTestId("search-field");
        await act(() => fireEvent.input(searchInput, { target: { value: "test" } }));

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("calls onLoadDefaultIcons when search term is empty", async () => {
        const mockOnLoadDefaultIcons = vi.fn();
        
        render(IconSearch, {
            icons: [],
            onSearchIcons: vi.fn(),
            onLoadDefaultIcons: mockOnLoadDefaultIcons,
            onSetEmptyIcons: vi.fn(),
            onSelectIcon: vi.fn(),
            debounceTimeMs: 0
        });

        const searchInput = screen.getByTestId("search-field");
        await act(() => fireEvent.input(searchInput, { target: { value: "" } }));
        await flushPromises();

        expect(mockOnLoadDefaultIcons).toHaveBeenCalled();
    });

    it("calls onSetEmptyIcons when search term is too short", async () => {
        const mockOnSetEmptyIcons = vi.fn();
        
        render(IconSearch, {
            icons: [],
            onSearchIcons: vi.fn(),
            onLoadDefaultIcons: vi.fn(),
            onSetEmptyIcons: mockOnSetEmptyIcons,
            onSelectIcon: vi.fn(),
            debounceTimeMs: 0
        });

        const searchInput = screen.getByTestId("search-field");
        await act(() => fireEvent.input(searchInput, { target: { value: "a" } }));
        await flushPromises();

        expect(mockOnSetEmptyIcons).toHaveBeenCalled();
    });
});
