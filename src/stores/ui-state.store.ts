import type { UIState } from "../models/UIState";
import { writable } from 'svelte/store';

let emptyState: UIState = {
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

        pngData: '',

        useGradient: false,
        gradient: null
    },

    /** The SVG string content of the icon */
    svgContent: '',
    /** The URL of the icon image */
    imageUrl: ''
};
export const state = writable(emptyState);