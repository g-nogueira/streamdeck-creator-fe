import { render, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import CollectionToolbar from "../../components/collections/CollectionToolbar.svelte";

describe("CollectionToolbar", () => {
	it("calls onDownloadCollection when the download button is clicked", async () => {
		const mockOnDownloadCollection = vi.fn();
		const mockCollection = { id: "collection-id", name: "My Collection", icons: [] };

		const { getByLabelText } = render(CollectionToolbar, {
			collection: mockCollection,
			onDownloadCollection: mockOnDownloadCollection,
			onDeleteCollection: vi.fn()
		});

		const downloadButton = getByLabelText("Download Collection");
		await fireEvent.click(downloadButton);

		expect(mockOnDownloadCollection).toHaveBeenCalledWith(mockCollection.id);
	});

	it("calls onDeleteCollection when the delete button is clicked", async () => {
		const mockOnDeleteCollection = vi.fn();
		const mockCollection = { id: "collection-id", name: "My Collection", icons: [] };

		const { getByLabelText } = render(CollectionToolbar, {
			collection: mockCollection,
			onDownloadCollection: vi.fn(),
			onDeleteCollection: mockOnDeleteCollection
		});

		const deleteButton = getByLabelText("Delete Collection");
		await fireEvent.click(deleteButton);

		expect(mockOnDeleteCollection).toHaveBeenCalledWith(mockCollection.id);
	});
});
