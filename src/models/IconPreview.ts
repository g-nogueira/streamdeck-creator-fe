import { UUID } from "$lib";
import type { IconOrigin } from "./Icon";
import type { UserIcon } from "./UserIcon";
import type { IconGradient } from "./IconGradient";

/**
 * Represents an icon, either user-created or original, that has been selected for modification in the app.
 */
export type IconPreview = {
    iconId: string;
    userIconId: string;
    userIconCollectionId: string;

    styles: {
        glyphColor: string;
        backgroundColor: string;
        labelColor: string;
        label: string;
        labelVisible: boolean;
        labelTypeface: string;
        iconScale: number;
    
        imgX: number;
        imgY: number;
        labelX: number;
        labelY: number;
    
        pngData: string;
    
        useGradient: boolean;
        gradient: IconGradient | null;
    },

    /** For ex, 'image/svg+xml' */
    contentType: string;
    /** The SVG string content of the icon */
    svgContent?: string;
    /** The URL of the icon image */
    imageUrl?: string;

    iconOrigin: IconOrigin;
}

export type IconPreviewStyles = IconPreview['styles'];

export function mkEmpty(): IconPreview {
    return {
        iconId: UUID.empty,
        userIconId: UUID.empty,
        userIconCollectionId: UUID.empty,

        styles: {

            glyphColor: '#38bdf8', // sky-400
            backgroundColor: '#0284c7', // sky-600
            labelColor: '#ffffff', // white
            label: 'Label Text',
            labelVisible: true,
            labelTypeface: 'VT323',
            iconScale: 1, // Scale factor for resizing the icon
            imgX: 0,
            imgY: 0,
            labelX: 0,
            labelY: 0,

            useGradient: false,
            gradient: null,
            pngData: ""
        },
            
        contentType: 'image/svg+xml',
        iconOrigin: 'mdi',
    };
};
export function fromUserIcon(userIcon: UserIcon, collectionId: string): IconPreview {
    return {
        iconId: userIcon.originalIconId,
        userIconId: userIcon.id,
        userIconCollectionId: collectionId,

        styles: {
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
            useGradient: false,
            gradient: userIcon.gradient ? {
                stops: userIcon.gradient.stops,
                type: userIcon.gradient.type,
                angle: userIcon.gradient.angle,
                cssStyle: userIcon.gradient.cssStyle,
            } : null,
        },


        svgContent: userIcon.svgContent,

        contentType: userIcon.contentType,

        iconOrigin: userIcon.origin,
    };
}