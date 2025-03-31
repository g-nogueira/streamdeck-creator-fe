import { render, fireEvent, screen, act } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import GradientGenerator from '../../src/components/toolbar/GradientGenerator.svelte';
import type { IconGradient } from '../../src/models/IconGradient';
import { mkEmpty, type CustomizableIcon } from "../../src/models/CustomizableIcon";

const iconCustomizationsStorePromise = vi.hoisted(() => import('../mocks/icon-customizations.store.mock'));

vi.mock('../../stores/icon-customizations.store', async () => await iconCustomizationsStorePromise);

describe('GradientGenerator', async () => {
	let mockGetContext: Mock;

	const mockState = mkEmpty();
	const { customizedIcon } = await iconCustomizationsStorePromise;

	// Mock the canvas context used on getColorAtPosition
	beforeEach(async () => {
		mockGetContext = vi.fn().mockReturnValue({
			fillRect: vi.fn(),
			createLinearGradient: vi.fn().mockReturnValue({
				addColorStop: vi.fn(),
			}),
			getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
		});

		Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
			value: mockGetContext,
		});

		customizedIcon.mockSetSubscribeValue(mockState);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('adds a gradient stop on click', async () => {
		// Arrange
		render(GradientGenerator);
		const gradientBar = screen.getByTestId('gradient-bar');

		// Act
		await fireEvent.click(gradientBar);

		// Assert
		expect(customizedIcon.addGradientStop).toHaveBeenCalled();
	});

	it('removes a gradient stop on button click', async () => {
		// Arrange
		render(GradientGenerator);
		const deleteButton = screen.getAllByTestId('delete-stop-button')[0];

		// Act
		await act(() => fireEvent.click(deleteButton));

		// Assert
		expect(customizedIcon.removeGradientStop).toHaveBeenCalled();
	});

	it('updates gradient stop position on drag', async () => {
		// Arrange
		render(GradientGenerator);
		const stopHandler = screen.getAllByTestId('gradient-stop-handler')[0];

		// Act
		await fireEvent.mouseDown(stopHandler);
		await fireEvent.mouseMove(document, { clientX: 50 });
		await fireEvent.mouseUp(document);

		// Assert
		expect(customizedIcon.updateGradientStopPosition).toHaveBeenCalled();
	});

	it('updates gradient stop color on color change', async () => {
		// Arrange
		render(GradientGenerator);
		const colorInput = screen.getAllByTestId('stop-color-input')[0];

		// Act
		fireEvent.input(colorInput, { target: { value: '#00ff00' } });

		// Assert
		expect(customizedIcon.recalculateGradientCss).toHaveBeenCalled();
	});

	it('toggles gradient type on select change', async () => {
		// Arrange
		render(GradientGenerator);
		const select = screen.getByTestId('gradient-type-select');

		// Act
		await fireEvent.change(select, { target: { value: 'radial' } });

		// Assert
		expect(customizedIcon.setGradientType).toHaveBeenCalledWith('radial');
	});

	it('shows linear gradient options when linear type is selected', async () => {
		// Arrange
		const stateWithRadialGradient = { ...mockState, styles: { gradient: { ...mockState.styles.gradient, type: 'linear' } as IconGradient } } as CustomizableIcon;
		customizedIcon.mockSetSubscribeValue(stateWithRadialGradient);
		render(GradientGenerator);

		// Assert
		expect(screen.getByTestId('gradient-angle-input')).toBeVisible();
	});

	it('hides linear gradient options when radial type is selected', async () => {
		// Arrange
		const stateWithRadialGradient = { ...mockState, styles: { gradient: { ...mockState.styles.gradient, type: 'radial' } as IconGradient } } as CustomizableIcon;
		customizedIcon.mockSetSubscribeValue(stateWithRadialGradient);
		render(GradientGenerator);

		// Assert
		expect(screen.queryByTestId('gradient-angle-input')).not.toBeInTheDocument();
	});

	it('remove stop fields when the stops in the state are removed', async () => {
		// Arrange
		const stateWithStops = { ...mockState, styles: { gradient: { ...mockState.styles.gradient, stops: [{ position: 0, color: '#ff0000' }] } as IconGradient } } as CustomizableIcon;
		const stateWithNoStops = { ...mockState, styles: { gradient: { ...mockState.styles.gradient, stops: [] } as IconGradient } } as CustomizableIcon;
		customizedIcon.mockSetSubscribeValue(stateWithStops);
		const comp = render(GradientGenerator);

		const initialStops = screen.getAllByTestId('gradient-stop-options');
		const initialHandlers = screen.getAllByTestId('gradient-stop-handler');

		// Act
		customizedIcon.mockSetSubscribeValue(stateWithNoStops);
		await act(() => comp.rerender({}));

		// Assert
		expect(initialStops.length).toBe(1);
		expect(screen.queryAllByTestId('gradient-stop-options').length).toBe(0);

		expect(initialHandlers.length).toBe(1);
		expect(screen.queryAllByTestId('gradient-stop-handler').length).toBe(0);
	});
});