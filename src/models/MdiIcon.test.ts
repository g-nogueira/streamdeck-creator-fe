import { describe, it, expect } from 'vitest';
import { toUserIcon, toIcon, type MdiIcon } from './MdiIcon';
import { mkEmpty as mkEmptyUserIcon } from './UserIcon';
import type { UserIcon } from './UserIcon';
import type { Icon } from './Icon';

describe('MdiIcon', () => {
    const mdiIcon: MdiIcon = {
        id: 'mdi-1',
        name: 'mdi-icon',
        author: 'mdi-author',
        codepoint: 'e001',
        keywords1: 'mdi keyword1',
        keywords2: 'mdi keyword2',
        version: '1.0',
        family: 'default',
    };

    it('converts MdiIcon to UserIcon correctly', () => {
        // Arrange
        const expectedUserIcon: UserIcon = {
            id: '',
            labelVisible: false,
            labelColor: '#000000',
            labelTypeface: 'Arial',
            glyphColor: '#000000',
            backgroundColor: '#FFFFFF',
            iconScale: 1,
            imgX: 0,
            imgY: 0,
            labelX: 0,
            labelY: 0,
            useGradient: false,
            gradient: null,
            pngData: '',
            originalIconId: mdiIcon.id,
            label: mdiIcon.name,
            origin: 'mdi',
            collectionId: '',
            contentType: 'image/svg+xml'
        };

        // Act
        const userIcon = toUserIcon(mdiIcon);

        // Assert
        expect(userIcon).toEqual(expectedUserIcon);
    });

    it('converts MdiIcon to Icon correctly', () => {
        // Arrange
        const expectedIcon: Icon = {
            id: mdiIcon.id,
            label: mdiIcon.name,
            keywords: ['mdi', 'keyword1', 'mdi', 'keyword2'],
            origin: 'mdi',
            contentType: "image/svg+xml"
        };

        // Act
        const icon = toIcon(mdiIcon);

        // Assert
        expect(icon).toEqual(expectedIcon);
    });
});