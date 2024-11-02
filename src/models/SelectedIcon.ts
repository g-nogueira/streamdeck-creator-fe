import { UUID } from "$lib";
import type { IconOrigin } from "./Icon";
import type { UserIcon } from "./UserIcon";
import type { UserIconGradient } from "./UserIconGradient";

/**
 * Represents an icon, either user-created or original, that has been selected for modification in the app.
 */
export type SelectedIcon = {
    iconId: string;
    userIconId: string;
    userIconCollectionId: string;

    label: string;
    labelVisible: boolean;
    labelColor: string;
    labelTypeface: string;
    glyphColor: string;
    backgroundColor: string;

    iconScale: number;
    imgX: number;
    imgY: number;
    labelX: number;
    labelY: number;

    gradient: UserIconGradient | null;

    pngData: string;

    iconOrigin: IconOrigin;
}

export function mkEmpty(): SelectedIcon {
    return {
        iconId: UUID.empty,
        userIconId: UUID.empty,
        userIconCollectionId: UUID.empty,

        label: '',
        labelVisible: false,
        labelColor: '',
        labelTypeface: '',
        glyphColor: '',
        backgroundColor: '',

        iconScale: 1,
        imgX: 0,
        imgY: 0,
        labelX: 0,
        labelY: 0,

        pngData: '',

        gradient: null,

        iconOrigin: 'mdi',
    };
};
export function fromUserIcon(userIcon: UserIcon, collectionId: string): SelectedIcon {
    return {
        iconId: userIcon.originalIconId,
        userIconId: userIcon.id,
        userIconCollectionId: collectionId,

        label: userIcon.label,
        labelVisible: userIcon.labelVisible,
        labelColor: userIcon.labelColor,
        labelTypeface: userIcon.labelTypeface,
        glyphColor: userIcon.glyphColor,
        backgroundColor: userIcon.backgroundColor,

        iconScale: userIcon.iconScale,
        imgX: userIcon.imgX,
        imgY: userIcon.imgY,
        labelX: userIcon.labelX,
        labelY: userIcon.labelY,

        pngData: userIcon.pngData,

        gradient: userIcon.gradient ? {
            stops: userIcon.gradient.stops,
            type: userIcon.gradient.type,
            angle: userIcon.gradient.angle,
            cssStyle: userIcon.gradient.cssStyle,
        } : null,

        iconOrigin: userIcon.origin,
    };
}