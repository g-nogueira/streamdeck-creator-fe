import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Toolbar from './Toolbar.svelte';
import _ from 'lodash';

const iconCustomizationsStorePromise = vi.hoisted(() => import('../../../tests/icon-customizations.store.mock'));

vi.mock('../../stores/icon-customizations.store', async () => await iconCustomizationsStorePromise);

describe('Toolbar State', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('updates label text correctly', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;

        render(Toolbar);
        const input = screen.getByPlaceholderText('Text');

        // Act
        await fireEvent.input(input, { target: { value: 'New Label' } });

        // Assert
        expect(customizedIcon.set).toHaveBeenCalledWith(expect.objectContaining({ styles: expect.objectContaining({ label: 'New Label' }) }));
    });

    it('selects solid fill', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        render(Toolbar);
        const gradientFillButton = screen.getByTestId('button-use-solid-fill');

        // Act
        await fireEvent.click(gradientFillButton);

        // Assert
        expect(customizedIcon.setUseGradient).toHaveBeenCalledWith(false);
    });

    it('slects gradient fill', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        render(Toolbar);
        const gradientFillButton = screen.getByTestId('button-use-gradient-fill');

        // Act
        await fireEvent.click(gradientFillButton);

        // Assert
        expect(customizedIcon.setUseGradient).toHaveBeenCalledWith(true);
    });


    it('updates background color correctly', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        render(Toolbar);
        const colorInput = screen.getByTestId("colorpicker-solid-fill-color");

        // Act
        await fireEvent.input(colorInput, { target: { value: '#FF0000' } });

        // Assert
        expect(customizedIcon.set).toHaveBeenCalledWith(expect.objectContaining({ styles: expect.objectContaining({ backgroundColor: '#ff0000' }) }));
    });

    it('updates icon position correctly', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        render(Toolbar);
        const xInput = screen.getByTestId('input-icon-pos-x');
        const yInput = screen.getByTestId('input-icon-pos-y');

        // Act
        await fireEvent.input(xInput, { target: { value: '10' } });
        await fireEvent.input(yInput, { target: { value: '20' } });

        // Assert
        expect(customizedIcon.set).toHaveBeenCalledWith(expect.objectContaining({ styles: expect.objectContaining({ imgX: 10, imgY: 20 }) }));
    });

    it('updates icon scale correctly', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        render(Toolbar);
        const scaleInput = screen.getByTestId('input-icon-scale');

        // Act
        await fireEvent.input(scaleInput, { target: { value: '1.5' } });

        // Assert
        expect(customizedIcon.set).toHaveBeenCalledWith(expect.objectContaining({ styles: expect.objectContaining({ iconScale: 1.5 }) }));
    });
});


describe('Toolbar UI', () => {
    it('renders gradient fill controls when gradient fill is selected', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        customizedIcon.mockSetSubscribeValue(_.merge(customizedIcon.mockGetSubscribeValue(), { styles: { useGradient: true } }));

        // Act
        render(Toolbar);

        // Assert
        expect(screen.getByTestId('gradient-generator-component')).toBeVisible();
    });

    it('renders solid fill controls when solid fill is selected', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        customizedIcon.mockSetSubscribeValue(_.merge(customizedIcon.mockGetSubscribeValue(), { styles: { useGradient: false } }));

        // Act
        render(Toolbar);

        // Assert
        expect(screen.getByTestId('solid-fill-controls')).toBeVisible();
    });

    it('renders the label text on the input', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        customizedIcon.mockSetSubscribeValue(_.merge(customizedIcon.mockGetSubscribeValue(), { styles: { label: 'Hello World' } }));

        // Act
        render(Toolbar);

        // Assert
        expect(screen.getByTestId('input-typography-label')).toHaveValue('Hello World');
    });

    it('renders text position inputs with correct values', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        customizedIcon.mockSetSubscribeValue(_.merge(customizedIcon.mockGetSubscribeValue(), { styles: { labelX: 50, labelY: 100 } }));

        // Act
        render(Toolbar);

        // Assert
        expect(screen.getByTestId('input-text-pos-x')).toHaveValue(50);
        expect(screen.getByTestId('input-text-pos-y')).toHaveValue(100);
    });

    it('renders text color inputs with correct values', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        customizedIcon.mockSetSubscribeValue(_.merge(customizedIcon.mockGetSubscribeValue(), { styles: { labelColor: '#00FF00' } }));

        // Act
        render(Toolbar);

        // Assert
        expect(screen.getByTestId('input-text-color-picker')).toHaveValue('#00ff00');
        expect(screen.getByTestId('input-text-color')).toHaveValue('#00FF00');
    });

    it('renders icon position inputs with correct values', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        customizedIcon.mockSetSubscribeValue(_.merge(customizedIcon.mockGetSubscribeValue(), { styles: { imgX: 30, imgY: 60 } }));

        // Act
        render(Toolbar);

        // Assert
        expect(screen.getByTestId('input-icon-pos-x')).toHaveValue(30);
        expect(screen.getByTestId('input-icon-pos-y')).toHaveValue(60);
    });

    it('renders icon scale input with correct value', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        customizedIcon.mockSetSubscribeValue(_.merge(customizedIcon.mockGetSubscribeValue(), { styles: { iconScale: 1.2 } }));

        // Act
        render(Toolbar);

        // Assert
        expect(screen.getByTestId('input-icon-scale')).toHaveValue(1.2);
    });

    it('renders icon color inputs with correct values', async () => {
        // Arrange
        const { customizedIcon } = await iconCustomizationsStorePromise;
        customizedIcon.mockSetSubscribeValue(_.merge(customizedIcon.mockGetSubscribeValue(), { styles: { glyphColor: '#0000FF' } }));

        // Act
        render(Toolbar);

        // Assert
        expect(screen.getByTestId('input-icon-color-picker')).toHaveValue('#0000ff');
        expect(screen.getByTestId('input-icon-color')).toHaveValue('#0000FF');
    });
});
