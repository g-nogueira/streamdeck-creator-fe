import { describe, it, expect } from 'vitest';
import { fromUserIcon, mkEmpty, type CustomizableIcon } from './CustomizableIcon';
import type { UserIcon } from './UserIcon';
import type { IconGradient } from './IconGradient';

describe('SelectedIcon', () => {
    const userIcon: UserIcon = {
        id: 'user-icon-1',
        originalIconId: 'mdi-1',
        label: 'User Icon',
        labelVisible: true,
        labelColor: '#FF0000',
        labelTypeface: 'Arial',
        glyphColor: '#00FF00',
        backgroundColor: '#0000FF',
        iconScale: 1.5,
        imgX: 10,
        imgY: 20,
        labelX: 30,
        labelY: 40,
        pngData: 'data:image/png;base64,...',
        gradient: {
            stops: [{ color: '#FF0000', position: 0 }, { color: '#00FF00', position: 100 }],
            type: 'linear',
            angle: 45,
            cssStyle: 'linear-gradient(45deg, #FF0000 0%, #00FF00 100%)'
        },
        origin: 'mdi',
        useGradient: false,
        collectionId: '',
        contentType: ''
    };

    const collectionId = 'collection-1';

    it('converts UserIcon to IconPreview correctly', () => {
        // Arrange
        const expectedSelectedIcon: CustomizableIcon = {
            iconId: userIcon.originalIconId,
            userIconId: userIcon.id,
            userIconCollectionId: collectionId,
            styles: {
                glyphColor: userIcon.glyphColor,
                backgroundColor: userIcon.backgroundColor,
                labelColor: userIcon.labelColor,
                label: userIcon.label,
                labelVisible: userIcon.labelVisible,
                labelTypeface: userIcon.labelTypeface,
                iconScale: userIcon.iconScale,

                imgX: userIcon.imgX,
                imgY: userIcon.imgY,
                labelX: userIcon.labelX,
                labelY: userIcon.labelY,

                pngData: userIcon.pngData,

                useGradient: userIcon.useGradient,
                gradient: userIcon.gradient ? {
                    stops: userIcon.gradient.stops,
                    type: userIcon.gradient.type,
                    angle: userIcon.gradient.angle,
                    cssStyle: userIcon.gradient.cssStyle,
                } : null,
            },
            iconOrigin: userIcon.origin,
            contentType: userIcon.contentType,
        };

        // Act
        const selectedIcon = fromUserIcon(userIcon, collectionId);

        // Assert
        expect(selectedIcon).toEqual(expectedSelectedIcon);
    });

    it('handles UserIcon without gradient correctly', () => {
        // Arrange
        const userIconWithoutGradient: UserIcon = { ...userIcon, gradient: null };
        const expectedSelectedIcon: CustomizableIcon = {
            iconId: userIconWithoutGradient.originalIconId,
            userIconId: userIconWithoutGradient.id,
            userIconCollectionId: collectionId,
            styles: {
                useGradient: false,
                glyphColor: userIconWithoutGradient.glyphColor,
                backgroundColor: userIconWithoutGradient.backgroundColor,
                label: userIconWithoutGradient.label,
                labelVisible: userIconWithoutGradient.labelVisible,
                labelColor: userIconWithoutGradient.labelColor,
                labelTypeface: userIconWithoutGradient.labelTypeface,
                iconScale: userIconWithoutGradient.iconScale,
                imgX: userIconWithoutGradient.imgX,
                imgY: userIconWithoutGradient.imgY,
                labelX: userIconWithoutGradient.labelX,
                labelY: userIconWithoutGradient.labelY,
                pngData: userIconWithoutGradient.pngData,
                gradient: null,
            },
            iconOrigin: userIconWithoutGradient.origin,
            contentType: userIconWithoutGradient.contentType,
        };

        // Act
        const selectedIcon = fromUserIcon(userIconWithoutGradient, collectionId);

        // Assert
        expect(selectedIcon).toEqual(expectedSelectedIcon);
    });
});