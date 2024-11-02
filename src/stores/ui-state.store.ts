import _ from "lodash";
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

/**
 * Injects the color into the SVG content
 * @param svgContent
 * @param color
 */
function injectColorIntoSvg(svgContent: string, color: string): string {
    if (typeof window === 'undefined') {
        console.error('Trying to use DomParser on the server side. Returning the SVG content as is.');
        return svgContent;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    if (svgElement) {
        svgElement.setAttribute('fill', color);
    }
    return new XMLSerializer().serializeToString(doc);
}


/**
 * Process SVG content by removing fill attributes and injecting color
 * @param svgContent
 */
// function cleanSvgContent(svgContent: string): string {
//     // Remove fill attributes from SVG content
//     const removeFillAttributes = (svgContent: string): string => {
//         return svgContent.replace(/fill="(?!none")[^"]*"/g, '');
//     };

//     return injectColorIntoSvg(removeFillAttributes(svgContent), $uiState.styles.glyphColor);
// }

/**
 * Update the ourter SVG fill attribute with the given color
 * @param svgContent
 * @param color
 */
const updateSvgFill = (color: string) => (svgContent: string,): string => {
    if (typeof window === 'undefined') {
        console.error('Trying to use DomParser on the server side. Returning the SVG content as is.');
        return svgContent;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelectorAll('svg');

    _.forEach(svgElement, (element) => {
        element.setAttribute('fill', color);
    });

    return new XMLSerializer().serializeToString(doc);
}

const removeSvgSizeAttributes = (svgContent: string): string => {
    return svgContent.replace(/(width|height)="[^"]*"/g, '');
}

function createUIState() {
    const { subscribe, set, update } = writable(emptyState);

    let stateObj = {
        subscribe,
        set: (value: UIState) => {
            set(value);
        },
        update: (fn: (value: UIState) => UIState) => {
            update(fn);
        },

        selectSvgIcon: (svg: string) => update(state => {
            const cleanedSvg = _.flow(updateSvgFill(state.styles.glyphColor), removeSvgSizeAttributes)(svg);

            state.svgContent = cleanedSvg;
            state.imageUrl = '';
            state.styles.pngData = '';

            return state;
        }),

        selectImageIcon: (url: string) => update(state => {
            state.imageUrl = url;
            state.svgContent = '';

            return state;
        }),

        setIconTitle: (title: string) => update(state => {
            state.styles.label = title;
            return state;
        }),

        upsertStyles: (styles: Partial<UIState['styles']>) => update(state => {
            state.styles = { ...state.styles, ...styles };
            return state;
        }),

        setSvgFillColor: (color: string) => update(state => {
            state.svgContent = updateSvgFill(color)(state.svgContent);
            return state;
        }),

        setUseGradient: (value: boolean) => update(state => {
            state.styles.useGradient = value;
            return state;
        }),

        reset: () => set(emptyState)
    };

    return stateObj;
}

export const uiState = createUIState();