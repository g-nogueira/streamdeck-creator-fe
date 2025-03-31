import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import IconPreview from '../../src/components/icons/IconPreview.svelte';
import { mkEmpty, type CustomizableIcon } from '../../src/models/CustomizableIcon';
import { beforeEach } from 'node:test';

const iconCustomizationsStorePromise = vi.hoisted(() => import('../icon-customizations.store.mock'));

vi.mock('../stores/icon-customizations.store', async () => await iconCustomizationsStorePromise);

describe('Background Customization', async () => {
    const mockState = mkEmpty();
    const { customizedIcon } = await iconCustomizationsStorePromise;

    beforeEach(async () => {
        customizedIcon.mockSetSubscribeValue(mockState);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('applies background color correctly', () => {
        // Arrange
        const bgColorState = { ...mockState, styles: { ...mockState.styles, backgroundColor: '#FF0000' } };
        customizedIcon.mockSetSubscribeValue(bgColorState);

        // Act
        render(IconPreview);
        const iconContainer = screen.getByTestId("icon-background");

        // Assert
        expect(iconContainer.style.background).toBe("rgb(255, 0, 0)");
    });

    it('applies background gradient correctly', async () => {
        // Arrange
        const bgGradientState = { ...mockState } as CustomizableIcon;
        bgGradientState.styles.useGradient = true;
        bgGradientState.styles.gradient!.cssStyle = 'linear-gradient(to right, red, blue)';

        customizedIcon.mockSetSubscribeValue(bgGradientState);

        // Act
        render(IconPreview);
        const iconBackground = screen.getByTestId("icon-background");

        // Assert
        expect(iconBackground.attributes.getNamedItem('style')?.value).toBe("background: linear-gradient(to right, red, blue);");
    });
});

describe('Label Customization', async () => {
    const mockState = mkEmpty();
    const { customizedIcon } = await iconCustomizationsStorePromise;

    beforeEach(async () => {
        customizedIcon.mockSetSubscribeValue(mockState);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders label when labelVisible is true', () => {
        // Arrange
        const stateWithLabel = { ...mockState, styles: { ...mockState.styles, labelVisible: true, label: "Test Label" } } as CustomizableIcon;
        customizedIcon.mockSetSubscribeValue(stateWithLabel);

        // Act
        render(IconPreview);
        const label = screen.getByTestId("icon-label");

        // Assert
        expect(label).toBeVisible();
        expect(label.textContent).toBe(stateWithLabel.styles.label);
    });

    it('does not render label when labelVisible is false', () => {
        // Arrange
        const stateWithoutLabel = { ...mockState, styles: { ...mockState.styles, labelVisible: false } } as CustomizableIcon;
        customizedIcon.mockSetSubscribeValue(stateWithoutLabel);

        // Act
        render(IconPreview);
        const label = screen.queryByTestId("icon-label");

        // Assert
        expect(label).not.toBeInTheDocument();
    });

    it('applies label position correctly', () => {
        // Arrange
        const labelPositionState = { ...mockState, styles: { ...mockState.styles, labelX: 10, labelY: 20 } } as CustomizableIcon;
        customizedIcon.mockSetSubscribeValue(labelPositionState);

        // Act
        render(IconPreview);
        const label = screen.getByTestId("icon-label");

        // Assert
        expect(label.style.transform).toBe(`translate(${labelPositionState.styles.labelX}px, ${labelPositionState.styles.labelY}px)`);
    });

    it('applies label text correctly', () => {
        // Arrange
        const labelTextState = { ...mockState, styles: { ...mockState.styles, label: "Test Label" } };
        customizedIcon.mockSetSubscribeValue(labelTextState);

        // Act
        render(IconPreview);
        const label = screen.getByTestId("icon-label");

        // Assert
        expect(label.textContent).toBe("Test Label");
    });

    it('applies label color correctly', () => {
        // Arrange
        const labelColorState = { ...mockState, styles: { ...mockState.styles, labelColor: '#00FF00' } };
        customizedIcon.mockSetSubscribeValue(labelColorState);

        // Act
        render(IconPreview);
        const label = screen.getByTestId("icon-label");

        // Assert
        expect(label.style.color).toBe("rgb(0, 255, 0)");
    });

    it('applies label typeface correctly', () => {
        // Arrange
        const labelTypefaceState = { ...mockState, styles: { ...mockState.styles, labelTypeface: 'Arial' } };
        customizedIcon.mockSetSubscribeValue(labelTypefaceState);

        // Act
        render(IconPreview);
        const label = screen.getByTestId("icon-label");

        // Assert
        expect(label.style.fontFamily).toBe("Arial");
    });
});

describe('Icon Customization', async () => {
    const mockState = mkEmpty();
    const { customizedIcon } = await iconCustomizationsStorePromise;

    beforeEach(async () => {
        customizedIcon.mockSetSubscribeValue(mockState);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders SVG content when provided', () => {
        // Arrange
        const stateWithSvg = { ...mockState, svgContent: '<svg></svg>' };
        customizedIcon.mockSetSubscribeValue(stateWithSvg);

        // Act
        render(IconPreview);
        const iconWrapper = screen.getByTestId('icon-wrapper');

        // Assert
        expect(iconWrapper.querySelector('svg')).toBeVisible();
    });

    it('applies glyph color correctly', () => {
        // Arrange
        const glyphColorState = { ...mockState, svgContent: '<svg></svg>', styles: { ...mockState.styles, glyphColor: '#00FF00' } };
        customizedIcon.mockSetSubscribeValue(glyphColorState);

        // Act
        render(IconPreview);
        const iconWrapper = screen.getByTestId("icon-wrapper");

        // Assert
        expect(iconWrapper!.style.color).toBe("rgb(0, 255, 0)");
    });

    it('applies icon scale correctly', () => {
        // Arrange
        const iconScaleState = { ...mockState, styles: { ...mockState.styles, iconScale: 2 } };
        customizedIcon.mockSetSubscribeValue(iconScaleState);

        // Act
        render(IconPreview);
        const iconWrapper = screen.getByTestId("icon-wrapper");

        // Assert
        expect(iconWrapper.style.transform).toContain("scale(2)");
    });

    it('applies icon position correctly', () => {
        // Arrange
        const iconPositionState = { ...mockState, styles: { ...mockState.styles, imgX: 10, imgY: 20 } };
        customizedIcon.mockSetSubscribeValue(iconPositionState);

        // Act
        render(IconPreview);
        const iconWrapper = screen.getByTestId("icon-wrapper");

        // Assert
        expect(iconWrapper.style.transform).toContain(`translate(${iconPositionState.styles.imgX}px, ${iconPositionState.styles.imgY}px)`);
    });
});