import { describe, it, expect } from 'vitest';
import { extensions, type UIState } from './UIState';
import type { UserIcon } from './UserIcon';
import type { UserIconGradient } from './UserIconGradient';

describe('UIState', () => {
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
    useGradient: true,
    gradient: {
      stops: [{ color: '#FF0000', position: 0 }, { color: '#00FF00', position: 100 }],
      type: 'linear',
      angle: 45,
      cssStyle: 'linear-gradient(45deg, #FF0000 0%, #00FF00 100%)'
    },
    origin: 'mdi'
  };

  it('converts UserIcon to UIState styles correctly', () => {
    // Arrange
    const expectedStyles: UIState['styles'] = {
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
        cssStyle: userIcon.gradient.cssStyle
      } : null
    };

    // Act
    const styles = extensions.stylesFromUserIcon(userIcon);

    // Assert
    expect(styles).toEqual(expectedStyles);
  });

  it('handles UserIcon without gradient correctly', () => {
    // Arrange
    const userIconWithoutGradient: UserIcon = { ...userIcon, gradient: null, useGradient: false };
    const expectedStyles: UIState['styles'] = {
      glyphColor: userIconWithoutGradient.glyphColor,
      backgroundColor: userIconWithoutGradient.backgroundColor,
      labelColor: userIconWithoutGradient.labelColor,
      label: userIconWithoutGradient.label,
      labelVisible: userIconWithoutGradient.labelVisible,
      labelTypeface: userIconWithoutGradient.labelTypeface,
      iconScale: userIconWithoutGradient.iconScale,
      imgX: userIconWithoutGradient.imgX,
      imgY: userIconWithoutGradient.imgY,
      labelX: userIconWithoutGradient.labelX,
      labelY: userIconWithoutGradient.labelY,
      pngData: userIconWithoutGradient.pngData,
      useGradient: userIconWithoutGradient.useGradient,
      gradient: null
    };

    // Act
    const styles = extensions.stylesFromUserIcon(userIconWithoutGradient);

    // Assert
    expect(styles).toEqual(expectedStyles);
  });
});