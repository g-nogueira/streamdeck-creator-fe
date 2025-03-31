import { render, fireEvent, screen } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as _icon from "../../models/Icon";
import * as _iconPreview from "../../models/CustomizableIcon";

import IconItem from "../../components/icons/IconItem.svelte";
import type { Icon } from "../../models/Icon";
import { setupIntersectionObserverMock } from "../utils/interceptionObserverHelper";

// Mock the stores
vi.mock("../stores/icon-customizations.store", () => ({
	customizedIcon: {
		selectIcon: vi.fn()
	}
}));

beforeEach(() => setupIntersectionObserverMock({ observe: vi.fn() }));

describe("IconItem Component", () => {
	const mockIcon = { ..._icon.mkEmpty(), label: "test-icon" } as Icon;
	const mockOnSelectIcon = vi.fn();
	const getIconButton = () => screen.getByTestId("icon-button");

	it("renders a clickable icon", () => {
		const mdiIcon = { ...mockIcon, origin: "mdi" } as Icon;
		render(IconItem, { icon: mdiIcon, onSelectIcon: mockOnSelectIcon });

		const button = getIconButton();
		const iconName = screen.getByText(mdiIcon.label);

		expect(button).toBeVisible();
		expect(button).toBeEnabled();
		expect(iconName).toBeVisible();
	});

	it("calls selectIcon on icon click", async () => {
		const mdiIcon = { ...mockIcon, id: "1", origin: "mdi" } as Icon;
		const mockOnSelectIcon = vi.fn();
		render(IconItem, { icon: mdiIcon, onSelectIcon: mockOnSelectIcon });

		const button = getIconButton();

		await fireEvent.click(button);
		expect(mockOnSelectIcon).toHaveBeenCalledWith(mdiIcon);
	});

	// it('lazy loads image for streamdeck origin', async () => {
	//     const streamdeckIcon = { ...mockIcon, id: '1', origin: 'streamdeck' } as Icon;
	//     setupIntersectionObserverMock({observe: vi.fn(), takeRecords: () => [{ isIntersecting: true } as never]})
	//     render(IconItem, { icon: streamdeckIcon });
	//     const img = screen.getByTestId("streamdeck-icon-img");

	//     // Simulate intersection
	//     // const observerInstance = IntersectionObserver.mock.instances[0];
	//     // const callback = observerInstance.observe.mock.calls[0][0];
	//     // callback([{ isIntersecting: true }]);

	//     // Verify image source and class
	//     expect(img).toHaveAttribute('src', `${serviceBaseUrl}/icons/${mockIcon.id}`);
	//     await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the next tick
	//     expect(img).toHaveClass('visible');
	//   });
});

describe("IconItem Component - MDI Icon", () => {
	const baseMockIcon = { ..._icon.mkEmpty(), label: "test-icon", origin: "mdi" } as Icon;
	const getIconButton = () => screen.getByTestId("icon-button");

	it("renders a valid icon glyph", () => {
		const mockIcon = { ...baseMockIcon, origin: "mdi" } as Icon;
		const mockOnSelectIcon = vi.fn();
		render(IconItem, { icon: baseMockIcon, onSelectIcon: mockOnSelectIcon });

		const button = getIconButton();
		const iconName = screen.getByText(mockIcon.label);
		const iconGlyph = screen.getByTestId("mdi-icon");

		// Check if everything is visible
		expect(button).toBeVisible();
		expect(iconName).toBeVisible();
		expect(iconGlyph).toBeVisible();
		// Check if the icon has the correct classes
		expect(iconGlyph).toHaveClass("mdi");
		expect(iconGlyph).toHaveClass(`mdi-${baseMockIcon.label}`);
	});

	it("DOES NOT render a streamdeck icon", () => {
		const mockIcon = { ...baseMockIcon, origin: "mdi" } as Icon;
		const mockOnSelectIcon = vi.fn();
		render(IconItem, { icon: mockIcon, onSelectIcon: mockOnSelectIcon });

		const button = getIconButton();
		const iconName = screen.queryByTestId("streamdeck-label");
		const iconGlyph = screen.queryByTestId("streamdeck-icon-img");

		expect(button).toBeVisible();
		expect(iconName).toBeNull();
		expect(iconGlyph).toBeNull();
	});

	it("calls onSelectIcon when the button is clicked", async () => {
		const mockOnSelectIcon = vi.fn();
		const mockIcon = { ...baseMockIcon, origin: "mdi" } as Icon;

		const { getByTestId } = render(IconItem, {
			icon: mockIcon,
			onSelectIcon: mockOnSelectIcon
		});

		const button = getByTestId("icon-button");
		await fireEvent.click(button);

		expect(mockOnSelectIcon).toHaveBeenCalledWith(mockIcon);
	});
});
