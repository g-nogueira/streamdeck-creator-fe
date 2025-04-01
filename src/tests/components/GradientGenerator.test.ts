import { render, fireEvent, screen, act } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import GradientGenerator from "../../components/toolbar/GradientGenerator.svelte";
import type { IconGradient, GradientStop } from "../../models/IconGradient";

describe("GradientGenerator", () => {
	let mockOnAddGradientStop: ReturnType<typeof vi.fn>;
	let mockOnUpdateGradientStopPosition: ReturnType<typeof vi.fn>;
	let mockOnRemoveGradientStop: ReturnType<typeof vi.fn>;
	let mockOnSetGradientType: ReturnType<typeof vi.fn>;
	let mockOnSetGradientAngle: ReturnType<typeof vi.fn>;
	let mockOnRecalculateGradientCss: ReturnType<typeof vi.fn>;

	let mockGetContext: Mock;

	const mockGradient: IconGradient = {
		type: "linear",
		angle: 90,
		stops: [
			{ position: 0, color: "#ff0000" },
			{ position: 100, color: "#0000ff" }
		],
		cssStyle: "linear-gradient(to right, #ff0000, #0000ff)"
	};

	beforeEach(() => {
		// Mock callback functions
		mockOnAddGradientStop = vi.fn();
		mockOnUpdateGradientStopPosition = vi.fn();
		mockOnRemoveGradientStop = vi.fn();
		mockOnSetGradientType = vi.fn();
		mockOnSetGradientAngle = vi.fn();
		mockOnRecalculateGradientCss = vi.fn();
	});

	// Mock the canvas context used on getColorAtPosition
	beforeEach(async () => {
		mockGetContext = vi.fn().mockReturnValue({
			fillRect: vi.fn(),
			createLinearGradient: vi.fn().mockReturnValue({
				addColorStop: vi.fn()
			}),
			getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) })
		});

		Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
			value: mockGetContext
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("adds a gradient stop on click", async () => {
		// Arrange
		render(GradientGenerator, {
			gradient: mockGradient,
			onAddGradientStop: mockOnAddGradientStop,
			onUpdateGradientStopPosition: mockOnUpdateGradientStopPosition,
			onRemoveGradientStop: mockOnRemoveGradientStop,
			onSetGradientType: mockOnSetGradientType,
			onSetGradientAngle: mockOnSetGradientAngle,
			onRecalculateGradientCss: mockOnRecalculateGradientCss
		});
		const gradientBar = screen.getByTestId("gradient-bar");

		// Act
		await act(() => fireEvent.click(gradientBar));

		// Assert
		expect(mockOnAddGradientStop).toHaveBeenCalled();
	});

	it("removes a gradient stop on button click", async () => {
		// Arrange
		render(GradientGenerator, {
			gradient: mockGradient,
			onAddGradientStop: mockOnAddGradientStop,
			onUpdateGradientStopPosition: mockOnUpdateGradientStopPosition,
			onRemoveGradientStop: mockOnRemoveGradientStop,
			onSetGradientType: mockOnSetGradientType,
			onSetGradientAngle: mockOnSetGradientAngle,
			onRecalculateGradientCss: mockOnRecalculateGradientCss
		});
		const deleteButton = screen.getAllByTestId("delete-stop-button")[0];

		// Act
		await fireEvent.click(deleteButton);

		// Assert
		expect(mockOnRemoveGradientStop).toHaveBeenCalledWith(0);
	});

	it("updates gradient stop position on drag", async () => {
		// Arrange
		render(GradientGenerator, {
			gradient: mockGradient,
			onAddGradientStop: mockOnAddGradientStop,
			onUpdateGradientStopPosition: mockOnUpdateGradientStopPosition,
			onRemoveGradientStop: mockOnRemoveGradientStop,
			onSetGradientType: mockOnSetGradientType,
			onSetGradientAngle: mockOnSetGradientAngle,
			onRecalculateGradientCss: mockOnRecalculateGradientCss
		});
		const stopHandler = screen.getAllByTestId("gradient-stop-handler")[0];

		// Act
		await fireEvent.mouseDown(stopHandler);
		await fireEvent.mouseMove(document, { clientX: 50 });
		await fireEvent.mouseUp(document);

		// Assert
		expect(mockOnUpdateGradientStopPosition).toHaveBeenCalled();
	});

	it("updates gradient stop color on color change", async () => {
		// Arrange
		render(GradientGenerator, {
			gradient: mockGradient,
			onAddGradientStop: mockOnAddGradientStop,
			onUpdateGradientStopPosition: mockOnUpdateGradientStopPosition,
			onRemoveGradientStop: mockOnRemoveGradientStop,
			onSetGradientType: mockOnSetGradientType,
			onSetGradientAngle: mockOnSetGradientAngle,
			onRecalculateGradientCss: mockOnRecalculateGradientCss
		});
		const colorInput = screen.getAllByTestId("stop-color-input")[0];

		// Act
		await fireEvent.input(colorInput, { target: { value: "#00ff00" } });

		// Assert
		expect(mockOnRecalculateGradientCss).toHaveBeenCalled();
	});

	it("toggles gradient type on select change", async () => {
		// Arrange
		render(GradientGenerator, {
			gradient: mockGradient,
			onAddGradientStop: mockOnAddGradientStop,
			onUpdateGradientStopPosition: mockOnUpdateGradientStopPosition,
			onRemoveGradientStop: mockOnRemoveGradientStop,
			onSetGradientType: mockOnSetGradientType,
			onSetGradientAngle: mockOnSetGradientAngle,
			onRecalculateGradientCss: mockOnRecalculateGradientCss
		});
		const select = screen.getByTestId("gradient-type-select");

		// Act
		await fireEvent.change(select, { target: { value: "radial" } });

		// Assert
		expect(mockOnSetGradientType).toHaveBeenCalledWith("radial");
	});

	it("shows linear gradient options when linear type is selected", async () => {
		// Arrange
		const linearGradient = { ...mockGradient, type: "linear" } as IconGradient;
		render(GradientGenerator, {
			gradient: linearGradient,
			onAddGradientStop: mockOnAddGradientStop,
			onUpdateGradientStopPosition: mockOnUpdateGradientStopPosition,
			onRemoveGradientStop: mockOnRemoveGradientStop,
			onSetGradientType: mockOnSetGradientType,
			onSetGradientAngle: mockOnSetGradientAngle,
			onRecalculateGradientCss: mockOnRecalculateGradientCss
		});

		// Assert
		expect(screen.getByTestId("gradient-angle-input")).toBeVisible();
	});

	it("hides linear gradient options when radial type is selected", async () => {
		// Arrange
		const radialGradient = { ...mockGradient, type: "radial" } as IconGradient;
		render(GradientGenerator, {
			gradient: radialGradient,
			onAddGradientStop: mockOnAddGradientStop,
			onUpdateGradientStopPosition: mockOnUpdateGradientStopPosition,
			onRemoveGradientStop: mockOnRemoveGradientStop,
			onSetGradientType: mockOnSetGradientType,
			onSetGradientAngle: mockOnSetGradientAngle,
			onRecalculateGradientCss: mockOnRecalculateGradientCss
		});

		// Assert
		expect(screen.queryByTestId("gradient-angle-input")).not.toBeInTheDocument();
	});
});
