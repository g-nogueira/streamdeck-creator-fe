import { render, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import CollectionIcons from "../../components/collections/CollectionIcons.svelte";

describe("CollectionIcons", () => {
	it("calls onRemoveIcon when the remove button is clicked", async () => {
		const mockOnRemoveIcon = vi.fn();
		const mockCollection = {
			id: "collection-id",
			icons: [{ id: "icon1", label: "Icon 1", base64Thumbnail: "data:image/png;base64,..." }]
		} as any;

		const { getByLabelText } = render(CollectionIcons, {
			collection: mockCollection,
			onRemoveIcon: mockOnRemoveIcon,
			onSelectUserIcon: vi.fn()
		});

		const removeButton = getByLabelText("Remove icon Icon 1");
		await fireEvent.click(removeButton);

		expect(mockOnRemoveIcon).toHaveBeenCalledWith(mockCollection.icons[0], mockCollection);
	});

	it("calls onSelectUserIcon when an icon is clicked", async () => {
		const mockOnSelectUserIcon = vi.fn();
		const mockCollection = {
			id: "collection-id",
			icons: [{ id: "icon1", label: "Icon 1", base64Thumbnail: "data:image/png;base64,..." }]
		} as any;

		const { getByLabelText } = render(CollectionIcons, {
			collection: mockCollection,
			onRemoveIcon: vi.fn(),
			onSelectUserIcon: mockOnSelectUserIcon
		});

		const selectButton = getByLabelText("Select icon Icon 1");
		await fireEvent.click(selectButton);

		expect(mockOnSelectUserIcon).toHaveBeenCalledWith(mockCollection.icons[0]);
	});
});
