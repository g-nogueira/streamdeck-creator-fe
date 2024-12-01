import { render, fireEvent, screen, act } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import GradientGenerator from './GradientGenerator.svelte';
import { uiState } from '../../stores/ui-state.store';
import { mkEmpty, type UIState } from '../../models/UIState';
import type { UserIconGradient } from '../../models/UserIconGradient';

describe('GradientGenerator', () => {
	let mockGetContext: Mock;

	const mockState: UIState['styles'] = {
		...mkEmpty().styles,
		gradient: {
			type: 'linear',
			angle: 90,
			cssStyle: 'linear-gradient(to right, #ff0000, #0000ff)',
			stops: [
				{ position: 0, color: '#ff0000' },
				{ position: 100, color: '#0000ff' }
			]
		}
	};

	beforeEach(() => {
		vi.spyOn(uiState, 'recalculateGradientCss')
		vi.spyOn(uiState, 'addGradientStop')
		vi.spyOn(uiState, 'removeGradientStop')
		vi.spyOn(uiState, 'updateGradientStopPosition')
		vi.spyOn(uiState, 'setGradientType')
	});

	// Mock the canvas context used on getColorAtPosition
	beforeEach(() => {
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
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('adds a gradient stop on click', async () => {
		// Arrange
		render(GradientGenerator, { state: mockState });
		const gradientBar = screen.getByTestId('gradient-bar');

		// Act
		await fireEvent.click(gradientBar);

		// Assert
		expect(uiState.addGradientStop).toHaveBeenCalled();
	});

	it('removes a gradient stop on button click', async () => {
		// Arrange
		render(GradientGenerator, { state: mockState });
		const deleteButton = screen.getAllByTestId('delete-stop-button')[0];

		// Act
		await act(() => fireEvent.click(deleteButton));

		// Assert
		expect(uiState.removeGradientStop).toHaveBeenCalled();
	});

	it('updates gradient stop position on drag', async () => {
		// Arrange
		render(GradientGenerator, { state: mockState });
		const stopHandler = screen.getAllByTestId('gradient-stop-handler')[0];

		// Act
		await fireEvent.mouseDown(stopHandler);
		await fireEvent.mouseMove(document, { clientX: 50 });
		await fireEvent.mouseUp(document);

		// Assert
		expect(uiState.updateGradientStopPosition).toHaveBeenCalled();
	});

	it('updates gradient stop color on color change', async () => {
		// Arrange
		render(GradientGenerator, { state: mockState });
		const colorInput = screen.getAllByTestId('stop-color-input')[0];

		// Act
		fireEvent.input(colorInput, { target: { value: '#00ff00' } });

		// Assert
		expect(uiState.recalculateGradientCss).toHaveBeenCalled();
	});

	it('toggles gradient type on select change', async () => {
		// Arrange
		render(GradientGenerator, { state: mockState });
		const select = screen.getByTestId('gradient-type-select');

		// Act
		await fireEvent.change(select, { target: { value: 'radial' } });

		// Assert
		expect(uiState.setGradientType).toHaveBeenCalledWith('radial');
	});

	it('shows linear gradient options when linear type is selected', async () => {
		// Arrange
		const stateWithRadialGradient = { ...mockState, gradient: { ...mockState.gradient, type: 'linear' } as UserIconGradient };
		render(GradientGenerator, { state: stateWithRadialGradient });

		// Assert
		expect(screen.getByTestId('gradient-angle-input')).toBeVisible();
	});

	it('hides linear gradient options when radial type is selected', async () => {
		// Arrange
		const stateWithRadialGradient = { ...mockState, gradient: { ...mockState.gradient, type: 'radial' } as UserIconGradient };
		render(GradientGenerator, { state: stateWithRadialGradient });

		// Assert
		expect(screen.queryByTestId('gradient-angle-input')).not.toBeInTheDocument();
	});

	it('remove stop fields when the stops in the state are removed', async () => { 
		// Arrange
		const stateWithStops = { ...mockState, gradient: { ...mockState.gradient, stops: [{ position: 0, color: '#ff0000' }] } as UserIconGradient };
		const stateWithNoStops = { ...mockState, gradient: { ...mockState.gradient, stops: [] } as UserIconGradient };
		const comp = render(GradientGenerator, { state: stateWithStops });

		const initialStops = screen.getAllByTestId('gradient-stop-options');
		const initialHandlers = screen.getAllByTestId('gradient-stop-handler');

		// Act
		await act(() => comp.rerender({ state: stateWithNoStops }));
		
		// Assert
		expect(initialStops.length).toBe(1);
		expect(screen.queryAllByTestId('gradient-stop-options').length).toBe(0);

		expect(initialHandlers.length).toBe(1);
		expect(screen.queryAllByTestId('gradient-stop-handler').length).toBe(0);
	});
});